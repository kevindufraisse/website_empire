'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import Cal, { getCalApi } from '@calcom/embed-react'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'
import type { CountryCode } from 'libphonenumber-js/min'
import { getEmpParam } from '@/hooks/useCalLink'
import { revenueBands, timings } from '@/lib/legende'
import { plans, type FlowOutcome, type PlanId } from '@/lib/legende-flow'
import { countryPhone } from '@/lib/legende-phone'
import LegendePhoneField from './LegendePhoneField'
import { INTRO_URL } from './LegendeMarketing'
import styles from './legende-form.module.css'

const CAL_LINK = 'team/empire-internet/audit-empire'
const N = ' '

const copy = {
  fr: {
    steps: ['Vos coordonnées', 'Votre projet', 'Votre créneau'],
    contactTitle: 'Candidater au 1-to-1', contactText: 'Deux minutes. Si votre profil correspond, vous choisissez votre créneau juste après.',
    firstName: 'Prénom', lastName: 'Nom', email: 'E-mail',
    projectTitle: 'Votre projet', plan: 'Quelle offre vous intéresse ?',
    revenue: 'Chiffre d’affaires HT de votre entreprise sur les 12 derniers mois', unknown: 'Je ne connais pas ce chiffre',
    timing: 'Quand souhaitez-vous démarrer ?', company: 'Votre entreprise, et ce que vous vendez (facultatif)',
    companyHint: 'Ex. : cabinet de conseil RH, 12 salariés, nous vendons des audits à 15 000 €',
    next: 'Continuer', back: 'Retour', send: 'Voir les créneaux', busy: 'Envoi…', close: 'Fermer',
    required: 'Remplissez ce champ pour continuer.',
    error: 'L’envoi a échoué. Vos réponses sont conservées, réessayez.', limit: 'Trop de tentatives. Réessayez dans 15 minutes.',
    bookTitle: (n: string) => `C’est bon, ${n}. Choisissez votre créneau.`, bookText: 'Un appel de 45 minutes avec l’équipe. Vos informations sont déjà remplies.',
    reviewTitle: 'Bien reçu.', reviewText: (p: string) => `Kevin et l’équipe lisent votre candidature et vous rappellent au ${p} si un échange a du sens.`,
    altTitle: (n: string) => `Merci, ${n}. Choisissez votre créneau.`,
    altText: 'Un appel de 45 minutes avec l’équipe pour voir si le 1-to-1 a du sens à votre stade, et sinon par où commencer. Vos informations sont déjà remplies.',
    altMore: 'Vous préférez avancer tout de suite, sans appel ?',
    altIntro: 'Une session de conseil avec Kevin, sur Intro',
    privacy: 'En continuant, vous acceptez que l’équipe Empire vous recontacte au sujet de votre projet.',
  },
  en: {
    steps: ['Your details', 'Your project', 'Your slot'],
    contactTitle: 'Apply for 1-to-1', contactText: 'Two minutes. If your profile fits, you pick a slot right after.',
    firstName: 'First name', lastName: 'Last name', email: 'Email',
    projectTitle: 'Your project', plan: 'Which plan are you interested in?',
    revenue: 'Your company’s revenue, excluding tax, over the last 12 months', unknown: 'I don’t know this figure',
    timing: 'When do you want to start?', company: 'Your company, and what you sell (optional)',
    companyHint: 'E.g. HR consulting firm, 12 staff, we sell €15,000 audits',
    next: 'Continue', back: 'Back', send: 'See available slots', busy: 'Sending…', close: 'Close',
    required: 'Fill in this field to continue.',
    error: 'Sending failed. Your answers are kept, try again.', limit: 'Too many attempts. Try again in 15 minutes.',
    bookTitle: (n: string) => `You’re in, ${n}. Pick a slot.`, bookText: 'A 45-minute call with the team. Your details are already filled in.',
    reviewTitle: 'Got it.', reviewText: (p: string) => `Kevin and the team will read your application and call you on ${p} if a conversation makes sense.`,
    altTitle: (n: string) => `Thank you, ${n}. Pick a slot.`,
    altText: 'A 45-minute call with the team to see whether 1-to-1 makes sense at your stage, and if not, where to start. Your details are already filled in.',
    altMore: 'Prefer to move forward right now, without a call?',
    altIntro: 'An advisory session with Kevin, on Intro',
    privacy: 'By continuing, you agree that the Empire team may contact you about your project.',
  },
}

const uuid = () => typeof crypto.randomUUID === 'function' ? crypto.randomUUID()
  : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16))

async function post(path: string, body: object) {
  const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  return { ok: res.ok, status: res.status, data: res.ok ? await res.json().catch(() => ({})) : {} }
}

/** Candidature 1-to-1 en une fenêtre : coordonnées (enregistrées tout de suite), projet, puis calendrier Cal.com intégré. */
export default function LegendeApplyModal({ lang, initialPlan, onClose }: { lang: 'fr' | 'en'; initialPlan?: PlanId; onClose: () => void }) {
  const t = copy[lang]
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', plan: initialPlan ?? '', revenueBand: '', timing: '', company: '', website: '' })
  const [country, setCountry] = useState<CountryCode>('FR')
  const [invalidPhone, setInvalidPhone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<'error' | 'limit'>()
  const [outcome, setOutcome] = useState<FlowOutcome>()
  const ids = useRef({ contact: uuid(), application: uuid() })
  const panel = useRef<HTMLDivElement>(null)
  const phone = countryPhone(form.phone, country)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = previous }
  }, [onClose])
  useEffect(() => { panel.current?.querySelector<HTMLElement>('input:not([type=hidden]), button[type=submit]')?.focus() }, [step, outcome])
  useEffect(() => {
    if (outcome !== 'legende' && outcome !== 'alternative') return
    void getCalApi({}).then(cal => cal('ui', { theme: 'dark', layout: 'month_view', cssVarsPerTheme: { light: { 'cal-brand': '#d4a574' }, dark: { 'cal-brand': '#d4a574' } } }))
  }, [outcome])

  const set = (key: keyof typeof form) => (value: string) => { setForm(f => ({ ...f, [key]: value })); setError(undefined) }
  const person = () => ({ firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(), phone: phone?.number, phoneCountry: country, website: form.website })

  function blankField(e: FormEvent<HTMLFormElement>) {
    const blank = Array.from(e.currentTarget.querySelectorAll<HTMLInputElement>('input[required]:not([type=radio])')).find(f => !f.value.trim())
    if (blank) { blank.setCustomValidity(t.required); blank.reportValidity(); blank.addEventListener('input', () => blank.setCustomValidity(''), { once: true }) }
    return !!blank
  }

  async function submitContact(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!phone) { setInvalidPhone(true); return }
    if (blankField(e) || !e.currentTarget.reportValidity()) return
    // Le contact part en fond : un échec ne bloque jamais la candidature, l'étape 2 renverra tout.
    void post('/api/legende/contact', { ...person(), submissionId: ids.current.contact, plan: form.plan || undefined }).catch(() => {})
    setStep(1)
  }

  async function submitProject(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!e.currentTarget.reportValidity() || busy) return
    setBusy(true); setError(undefined)
    try {
      const res = await post('/api/legende/apply', { version: 3, ...person(), submissionId: ids.current.application, plan: form.plan, timing: form.timing,
        company: form.company.trim(), revenueBand: form.revenueBand === 'unknown' ? 'unknown' : Number(form.revenueBand) })
      if (!res.ok) { setError(res.status === 429 ? 'limit' : 'error'); return }
      const kind = (res.data as { kind?: FlowOutcome }).kind
      setOutcome(kind === 'legende' || kind === 'alternative' ? kind : 'review')
      setStep(2)
    } catch { setError('error') } finally { setBusy(false) }
  }

  const radios = (key: 'plan' | 'revenueBand' | 'timing', options: { value: string; label: string }[], compact = false) =>
    <div className={styles.choices + (compact ? ' ' + styles.compact : '')}>
      {options.map(o => <label key={o.value} className={styles.option}>
        <input type="radio" name={key} value={o.value} required checked={form[key] === o.value} onChange={() => set(key)(o.value)} />
        <span>{o.label}</span>
      </label>)}
    </div>

  const emp = getEmpParam()
  const calLink = emp ? `${CAL_LINK}?emp=${encodeURIComponent(emp)}` : CAL_LINK

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="apply-title" lang={lang} onClick={e => e.stopPropagation()}
        className={`flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-[#121110] text-white sm:rounded-2xl ${outcome === 'legende' || outcome === 'alternative' ? 'sm:max-w-4xl' : 'sm:max-w-xl'}`}>
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3.5">
          <ol className="flex flex-1 items-center gap-2 text-[12.5px] font-semibold">
            {t.steps.map((label, i) => <li key={label} className={`flex items-center gap-1.5 ${i === step ? 'text-[#f1c99c]' : i < step ? 'text-neutral-300' : 'text-neutral-500'}`}>
              <span className={`grid h-5 w-5 place-content-center rounded-full text-[11px] ${i < step ? 'bg-autopilot text-[#17110b]' : 'border border-current'}`}>{i < step ? <Check size={11} strokeWidth={3} /> : i + 1}</span>
              <span className={i === step ? '' : 'hidden sm:inline'}>{label}</span>
            </li>)}
          </ol>
          <button type="button" onClick={onClose} aria-label={t.close} className="grid h-10 w-10 place-content-center rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white"><X size={18} /></button>
        </div>

        <div className="overflow-y-auto px-5 py-6 sm:px-7">
          {step === 0 && <form onSubmit={submitContact} noValidate className={styles.fields}>
            <div>
              <h2 id="apply-title" className="text-[22px] font-semibold tracking-tight">{t.contactTitle}</h2>
              <p className="mt-1 text-[15px] text-neutral-400">{t.contactText}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label>{t.firstName}<input required maxLength={60} autoComplete="given-name" className={styles.field} value={form.firstName} onChange={e => set('firstName')(e.target.value)} /></label>
              <label>{t.lastName}<input required maxLength={60} autoComplete="family-name" className={styles.field} value={form.lastName} onChange={e => set('lastName')(e.target.value)} /></label>
            </div>
            <LegendePhoneField lang={lang} country={country} value={form.phone} invalid={invalidPhone} onInvalid={() => setInvalidPhone(true)}
              onChange={(iso, raw) => { setCountry(iso); setInvalidPhone(false); set('phone')(raw) }} />
            <label>{t.email}<input required type="email" maxLength={254} autoComplete="email" className={styles.field} value={form.email} onChange={e => set('email')(e.target.value)} /></label>
            <label aria-hidden="true" className={styles.trap}>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={e => set('website')(e.target.value)} /></label>
            <p className="text-[13px] text-neutral-500">{t.privacy} <a className="underline" href="/privacy">Privacy</a></p>
            <div className={styles.actions}><button type="submit" className={styles.primary}>{t.next}<ArrowRight aria-hidden size={17} /></button></div>
          </form>}

          {step === 1 && <form onSubmit={submitProject} className={styles.fields}>
            <h2 id="apply-title" className="text-[22px] font-semibold tracking-tight">{t.projectTitle}</h2>
            <fieldset disabled={busy} className={styles.fields}>
              <fieldset><legend>{t.plan}</legend>{radios('plan', Object.entries(plans).map(([value, l]) => ({ value, label: l[lang] })))}</fieldset>
              <fieldset><legend>{t.revenue}</legend>{radios('revenueBand', [...revenueBands.map(b => ({ value: String(b.minimum), label: b[lang].replace(/(\d) (?=\d|€|million)/g, '$1 ') })), { value: 'unknown', label: t.unknown }], true)}</fieldset>
              <fieldset><legend>{t.timing}</legend>{radios('timing', Object.entries(timings).map(([value, l]) => ({ value, label: l[lang] })))}</fieldset>
              <label>{t.company}<input maxLength={200} placeholder={t.companyHint} className={styles.field} value={form.company} onChange={e => set('company')(e.target.value)} /></label>
            </fieldset>
            {error && <p role="alert" className="text-sm text-red-300">{t[error]}</p>}
            <div className={styles.actions}>
              <button type="button" className={styles.back} onClick={() => setStep(0)}><ArrowLeft aria-hidden size={16} />{t.back}</button>
              <button type="submit" disabled={busy} className={styles.primary}>{busy ? t.busy : t.send}<ArrowRight aria-hidden size={17} /></button>
            </div>
          </form>}

          {/* Sous 300 000 € de CA, le calendrier est proposé quand même : la personne a vu les prix et veut parler.
              Intro et Empire ne viennent qu'après, en option, jamais à la place du rendez-vous. */}
          {step === 2 && (outcome === 'legende' || outcome === 'alternative') && <div>
            <h2 id="apply-title" className="text-[22px] font-semibold tracking-tight">{(outcome === 'legende' ? t.bookTitle : t.altTitle)(form.firstName.trim())}</h2>
            <p className="mt-1 text-[15px] text-neutral-400">{outcome === 'legende' ? t.bookText : t.altText}</p>
            <div className="mt-4 min-h-[560px]">
              <Cal calLink={calLink} style={{ width: '100%', height: '100%', minHeight: 560 }}
                config={{ layout: 'month_view', theme: 'dark', name: `${form.firstName.trim()} ${form.lastName.trim()}`, email: form.email.trim(), smsReminderNumber: phone?.number ?? '' }} />
            </div>
            {outcome === 'alternative' && <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-[14px] text-neutral-400">{t.altMore}</p>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-semibold">
                <a href={INTRO_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-white underline underline-offset-4 hover:text-[#f1c99c]">{t.altIntro}<ArrowRight aria-hidden size={14} /></a>
              </div>
            </div>}
          </div>}

          {step === 2 && outcome === 'review' && <div>
            <span className={styles.successIcon}><Check aria-hidden size={22} strokeWidth={2.5} /></span>
            <h2 id="apply-title" className="text-[22px] font-semibold tracking-tight">{t.reviewTitle}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-neutral-300">{t.reviewText(phone?.formatInternational() ?? form.phone)}</p>
          </div>}

        </div>
      </div>
    </div>,
    document.body,
  )
}
