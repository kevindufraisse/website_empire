import { NextRequest, NextResponse } from 'next/server'
import { promises as dns } from 'node:dns'
import { supabaseAdmin } from '@/lib/supabase'
import { createOrUpdateContact, addTagToContact, ensureTagByName, ValidationError } from '@/lib/systemeio'

export const runtime = 'nodejs'

/** Tag Systeme.io `empire_home_gate`, créé le 15 septembre 2026. Même schéma
 *  que `community_slack` : env d'abord, id connu ensuite, création par nom en
 *  dernier recours (compte Systeme.io différent). */
const HOME_GATE_TAG_ID = 2179856
const HOME_GATE_TAG_NAME = 'empire_home_gate'

/**
 * Porte email de la home : vérifie l'adresse pour de vrai avant de dévoiler
 * la formule. Pas d'envoi de code (le site n'a pas d'expéditeur mail) : on
 * contrôle la syntaxe, les domaines jetables, les fautes de frappe courantes
 * et l'existence d'un serveur mail (MX) sur le domaine. Ensuite on enregistre
 * (Supabase `leads` + contact Systeme.io tagué) sans bloquer si l'un des deux
 * est indisponible - perdre un prospect sur une panne à nous serait pire.
 * Systeme.io fait en plus une vérification de la boîte (422 « L'adresse email
 * n'existe pas ») : kevin@gmail.com est refusé, kevin@outlook.com accepté.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const DISPOSABLE_DOMAINS = new Set([
  'yopmail.com', 'yopmail.fr', 'jetable.org', 'mailinator.com', 'guerrillamail.com',
  'guerrillamail.net', 'trashmail.com', 'trashmail.fr', 'tempmail.com', 'temp-mail.org',
  '10minutemail.com', '10minutemail.net', 'throwawaymail.com', 'getnada.com', 'dispostable.com',
  'maildrop.cc', 'mohmal.com', 'sharklasers.com', 'spam4.me', 'mailnesia.com', 'tempr.email',
  'fakeinbox.com', 'mytemp.email', 'emailondeck.com', 'burnermail.io', 'minutemail.com',
  'mail-temp.com', 'tmpmail.net', 'tmpmail.org', 'inboxkitten.com', 'moakt.com',
])

/** Domaines très fréquents : une faute d'une lettre donne une suggestion. */
const POPULAR_DOMAINS = [
  'gmail.com', 'hotmail.com', 'hotmail.fr', 'outlook.com', 'outlook.fr', 'yahoo.com',
  'yahoo.fr', 'icloud.com', 'live.fr', 'live.com', 'orange.fr', 'free.fr', 'sfr.fr',
  'wanadoo.fr', 'laposte.net', 'protonmail.com', 'proton.me', 'me.com', 'msn.com', 'bbox.fr',
]

function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (!m) return n
  if (!n) return m
  const prev = new Array<number>(n + 1)
  for (let j = 0; j <= n; j++) prev[j] = j
  for (let i = 1; i <= m; i++) {
    let diag = prev[0]
    prev[0] = i
    for (let j = 1; j <= n; j++) {
      const tmp = prev[j]
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1))
      diag = tmp
    }
  }
  return prev[n]
}

function suggestDomain(domain: string): string | null {
  if (POPULAR_DOMAINS.includes(domain)) return null
  let best: { d: string; dist: number } | null = null
  for (const d of POPULAR_DOMAINS) {
    const dist = levenshtein(domain, d)
    if (dist > 0 && dist <= 2 && (!best || dist < best.dist)) best = { d, dist }
  }
  // Une distance de 2 sur un domaine court (ex: "sfr.fr" vs "free.fr") n'est
  // pas une faute de frappe : on n'ose que si le domaine ressemble vraiment.
  if (best && best.dist === 2 && domain.length < 8) return null
  return best?.d ?? null
}

async function hasMailServer(domain: string): Promise<boolean | null> {
  // `null` = on n'a pas pu trancher (DNS lent ou indisponible) : on laisse passer.
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500))
  const lookup = (async () => {
    try {
      const mx = await dns.resolveMx(domain)
      if (mx.length > 0) return true
    } catch (err) {
      const code = (err as NodeJS.ErrnoException)?.code
      // Pas de MX mais le domaine existe : certains reçoivent sur le A record.
      if (code === 'ENODATA' || code === 'ENOTFOUND') {
        try {
          const a = await dns.resolve4(domain)
          return a.length > 0
        } catch {
          return false
        }
      }
      return null
    }
    return false
  })()
  return Promise.race([lookup, timeout])
}

type Verdict =
  | { ok: true; email: string }
  | { ok: false; reason: 'syntax' | 'disposable' | 'no_mail_server' | 'typo'; suggestion?: string }

/**
 * `force` = le visiteur a confirmé que son domaine, proche d'un domaine
 * connu (« hotmial.fr »), est bien le sien : on ne re-propose pas la correction.
 */
async function verifyEmail(raw: string, force: boolean): Promise<Verdict> {
  const email = raw.trim().toLowerCase()
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) return { ok: false, reason: 'syntax' }
  const domain = email.slice(email.lastIndexOf('@') + 1)
  if (!domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) return { ok: false, reason: 'syntax' }
  if (DISPOSABLE_DOMAINS.has(domain)) return { ok: false, reason: 'disposable' }

  const suggestedDomain = suggestDomain(domain)
  const suggestion = suggestedDomain ? email.replace(/@.*$/, `@${suggestedDomain}`) : undefined
  const mx = await hasMailServer(domain)
  if (mx === false) {
    return { ok: false, reason: 'no_mail_server', ...(suggestion ? { suggestion } : {}) }
  }
  // Le domaine reçoit du mail mais ressemble à une lettre près à gmail/hotmail…
  // (les domaines de typo-squat ont souvent un MX) : on demande confirmation.
  if (suggestion && !force) {
    return { ok: false, reason: 'typo', suggestion }
  }
  return { ok: true, email }
}

async function saveLead(email: string, lang: 'fr' | 'en'): Promise<void> {
  const tasks: Promise<unknown>[] = []

  tasks.push(
    (async () => {
      try {
        const { error } = await supabaseAdmin.from('leads').insert({ email, source: 'home-gate' })
        if (error) console.error('[home-gate] supabase leads', error.message)
      } catch (err) {
        // Client non configuré (env absente) : on ne masque pas une erreur Systeme.io derrière.
        console.error('[home-gate] supabase leads', (err as Error)?.message)
      }
    })(),
  )

  if (process.env.SYSTEMEIO_API_KEY) {
    tasks.push(
      (async () => {
        try {
          const contact = await createOrUpdateContact({ email, locale: lang })
          try {
            const tagId = Number(process.env.SYSTEMEIO_TAG_HOME_GATE) || HOME_GATE_TAG_ID || await ensureTagByName(HOME_GATE_TAG_NAME)
            await addTagToContact(contact.id, tagId)
          } catch (tagErr) {
            // Tag déjà présent (contact revenu) ou tag supprimé côté Systeme.io :
            // le contact existe, c'est l'essentiel.
            console.error('[home-gate] systemeio tag', (tagErr as Error)?.message)
          }
        } catch (err) {
          if (err instanceof ValidationError) throw err
          console.error('[home-gate] systemeio contact', err)
        }
      })(),
    )
  }

  await Promise.all(tasks)
}

export async function POST(req: NextRequest) {
  let body: { email?: string; lang?: string; company?: string; force?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const lang: 'fr' | 'en' = body.lang === 'en' ? 'en' : 'fr'
  const fr = lang === 'fr'

  // Honeypot : un robot remplit le champ caché, on lui répond oui sans rien garder.
  if (String(body.company || '').trim()) {
    return NextResponse.json({ success: true })
  }

  const verdict = await verifyEmail(String(body.email || ''), body.force === true)
  if (!verdict.ok) {
    const message =
      verdict.reason === 'disposable'
        ? (fr ? 'Les adresses jetables ne passent pas. Utilisez votre email habituel.' : 'Disposable addresses are not accepted. Use your usual email.')
        : verdict.reason === 'no_mail_server'
          ? (fr ? 'Ce domaine ne reçoit pas d’emails. Vérifiez l’orthographe.' : 'This domain does not receive email. Check the spelling.')
          : verdict.reason === 'typo'
            ? (fr ? 'Une faute de frappe ?' : 'A typo?')
            : (fr ? 'Cet email ne semble pas valide.' : 'This email does not look valid.')
    return NextResponse.json(
      { error: message, reason: verdict.reason, suggestion: verdict.suggestion },
      { status: 400 },
    )
  }

  try {
    await saveLead(verdict.email, lang)
  } catch (err) {
    // Systeme.io vérifie la boîte elle-même (« L'adresse email n'existe pas ») :
    // c'est le contrôle le plus fort qu'on ait, on le remonte tel quel.
    if (err instanceof ValidationError) {
      // Le corps 422 arrive avec l'apostrophe échappée (`n\u0027existe pas`) : on
      // ne teste que la fin du libellé.
      const mailboxMissing = /existe pas|does not exist/i.test(err.message)
      console.warn('[home-gate] systemeio validation', err.message)
      return NextResponse.json(
        mailboxMissing
          ? {
              error: fr ? 'Cette adresse n’existe pas. Vérifiez l’orthographe.' : 'This address does not exist. Check the spelling.',
              reason: 'mailbox',
            }
          : { error: fr ? 'Cet email ne semble pas valide.' : 'This email does not look valid.', reason: 'syntax' },
        { status: 400 },
      )
    }
    console.error('[home-gate] save failed', err)
  }

  return NextResponse.json({ success: true, email: verdict.email })
}
