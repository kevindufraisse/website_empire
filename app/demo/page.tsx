'use client'

import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowLeft, Calendar, Play } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { storeVideoEmail } from '@/components/VideoEmailGate'
import { flushAmplitude, trackAmplitude } from '@/lib/amplitude'
import { startFreeTrial, TRIAL_TERMS_EN, TRIAL_TERMS_FR } from '@/lib/startTrial'
import DemoBookingForm from './DemoBookingForm'
import { badge, card, fieldError, input, label, primaryButton, secondaryButton } from './ui'
import styles from './demo.module.css'

// Mêmes conditions que lib/startTrial.ts, mot pour mot : on empêche seulement
// la coupure entre un nombre et son unité (« 8e / jour », « 0 / € »).
const keepUnits = (terms: string) => terms.replace(/(\d+e?) (?=jours?|crédits|days|credits|€)/g, '$1\u00a0').replace(/ :/g, '\u00a0:')

const DEMO_LOOM_ID = '00bc46ef533b4243ad108ed7549047be'
// Mêmes portraits locaux que le hero de la home (public/creators) : jamais de hotlink.
const DEMO_CREATORS = [
  { name: 'Alex Hormozi', img: '/creators/hormozi.jpg' },
  { name: 'Matt Gray', img: '/creators/gray.jpg' },
  { name: 'Ali Abdaal', img: '/creators/abdaal.webp' },
  { name: 'Justin Welsh', img: '/creators/welsh.webp' },
  { name: 'Dan Koe', img: '/creators/koe.webp' },
]
// Prénom + email, puis la démo enregistrée tout de suite (l'email part chez
// Systeme.io en arrière-plan), avec deux suites : l'essai ou un rendez-vous.
type Step = 'contact' | 'watch' | 'book'
type Lead = { firstName: string; email: string }

// La démo reste ouverte dans l'onglet : après « Voir les tarifs » puis retour,
// ou un rechargement, on retrouve la vidéo sans redonner son email (et sans
// compter la personne deux fois).
const LEAD_KEY = 'empire_demo_lead'
function readStoredLead(): Lead | null {
  try {
    const stored = JSON.parse(sessionStorage.getItem(LEAD_KEY) || 'null')
    return stored && typeof stored.firstName === 'string' && typeof stored.email === 'string' && stored.email ? { firstName: stored.firstName, email: stored.email } : null
  } catch {
    return null
  }
}
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const arrow = <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>

export default function DemoPage() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [step, setStep] = useState<Step>('contact')
  const [lead, setLead] = useState<Lead>({ firstName: '', email: '' })
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')
  const [trialLoading, setTrialLoading] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const videoShown = useRef(false)

  useBrowserLayoutEffect(() => {
    const stored = readStoredLead()
    if (!stored) return
    videoShown.current = true
    setLead(stored)
    setStep('watch')
  }, [])

  useEffect(() => {
    if (step !== 'contact') {
      headingRef.current?.focus({ preventScroll: true })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    if (step === 'watch' && !videoShown.current) {
      videoShown.current = true
      trackAmplitude('demo_video_shown')
    }
    setError('')
  }, [step])

  // Le <html> du site est en lang="en" (layout racine, commun à toutes les
  // pages). Ici on annonce la vraie langue de la page, et on remet en partant.
  useEffect(() => {
    const root = document.documentElement
    const previous = root.lang
    root.lang = lang
    return () => { root.lang = previous }
  }, [lang])

  // Pas d'attente du serveur : la démo s'ouvre au clic.
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const rawName = lead.firstName.trim()
    const clean = {
      firstName: rawName ? rawName.charAt(0).toLocaleUpperCase(fr ? 'fr-FR' : 'en-US') + rawName.slice(1) : '',
      email: lead.email.trim().toLowerCase(),
    }
    if (!clean.firstName || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean.email)) {
      setError(fr ? 'Vérifie ton prénom et ton email.' : 'Check your first name and email.')
      return
    }
    fetch('/api/demo-email', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...clean, company, locale: lang }),
      keepalive: true,
    }).catch(() => {})
    storeVideoEmail(clean.email)
    try { sessionStorage.setItem(LEAD_KEY, JSON.stringify(clean)) } catch {}
    setLead(clean)
    setStep('watch')
    trackAmplitude('empire_demo_requested', { source: 'demo_page' })
  }

  function book() {
    setStep('book')
    trackAmplitude('empire_demo_path_selected', { path: 'book' })
    trackAmplitude('demo_booking_opened')
  }

  async function trial() {
    if (trialLoading) return
    setTrialLoading(true)
    trackAmplitude('empire_demo_trial_clicked', { location: 'bottom' })
    trackAmplitude('demo_trial_clicked')
    // On part sur l'app : les deux événements doivent être envoyés avant.
    await flushAmplitude()
    await startFreeTrial()
  }

  // Même pastille et même phrase que le hero de la home, au tutoiement.
  const creatorsBand = (
    <div className="flex max-w-full items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 pl-2 sm:gap-4">
      <div className="flex shrink-0 -space-x-2">
        {DEMO_CREATORS.map(c => (
          <img key={c.name} src={c.img} alt={c.name} title={c.name} width={40} height={40} loading="lazy" className="h-9 w-9 rounded-full border-2 border-black bg-neutral-800 object-cover sm:h-10 sm:w-10" />
        ))}
      </div>
      <span className="text-left text-[11px] leading-snug text-neutral-300 sm:text-xs">
        {fr
          ? <>Ils utilisent cette formule. <span className="text-neutral-500">Prête à utiliser pour toi.</span></>
          : <>They use this formula. <span className="text-neutral-500">Ready for you.</span></>}
      </span>
    </div>
  )

  const videoBadge = <p className={badge}><Play size={11} fill="currentColor" aria-hidden />{fr ? 'Démo vidéo · 24 min' : 'Video demo · 24 min'}</p>

  return (
    <main lang={lang} className="relative isolate min-h-[90svh] overflow-x-clip bg-black px-4 pb-14 pt-[84px] md:px-6 md:pb-24 md:pt-28">
      <div className={styles.glow} aria-hidden="true" />
      <div className="mx-auto max-w-[1040px]">
        {step === 'contact' && (
          <div className={styles.contactLayout}>
            <header className={`${styles.hero} text-center min-[900px]:text-left`}>
              {videoBadge}
              <h1 className="mt-3 text-balance text-3xl font-extrabold leading-[1.15] text-white sm:text-4xl md:text-5xl">
                {fr ? 'Découvre Empire en vidéo.' : 'Discover Empire on video.'}
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-balance text-[15px] leading-relaxed text-neutral-300 min-[900px]:mx-0 md:text-lg">
                {fr
                  ? 'Sois vu, choisi et recommandé grâce à ton contenu, en 1h par semaine.'
                  : 'Get seen, chosen and recommended through your content in one hour a week.'}
              </p>
            </header>

            <section className={`${styles.formCard} ${card} p-5 sm:p-7`} aria-labelledby="contact-heading">
              <h2 id="contact-heading" className="text-balance text-xl font-bold leading-snug text-white">
                {fr ? 'Laisse ton prénom et ton email.' : 'Leave your first name and email.'}
              </h2>
              <form onSubmit={submit} className="mt-4 grid gap-3.5">
                <div>
                  <label htmlFor="demo-first-name" className={label}>{fr ? 'Ton prénom' : 'Your first name'}</label>
                  <input id="demo-first-name" name="firstName" placeholder="Camille" autoComplete="given-name" required maxLength={100} value={lead.firstName} onChange={event => setLead({ ...lead, firstName: event.target.value })} className={input} />
                </div>
                <div>
                  <label htmlFor="demo-email" className={label}>{fr ? 'Ton email' : 'Your email'}</label>
                  <input id="demo-email" placeholder={fr ? 'camille@entreprise.fr' : 'camille@company.com'} type="email" name="email" autoComplete="email" inputMode="email" required maxLength={254} value={lead.email} onChange={event => setLead({ ...lead, email: event.target.value })} className={input} />
                </div>
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="demo-company">Company</label>
                  <input id="demo-company" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={event => setCompany(event.target.value)} />
                </div>
                {error && <p role="alert" className={fieldError}>{error}</p>}
                <button type="submit" className={`${primaryButton} mt-1 w-full`}>{fr ? 'Voir la démo' : 'Watch the demo'}{arrow}</button>
                <p className="text-center text-xs text-neutral-400">{fr ? 'Gratuit · La démo démarre tout de suite.' : 'Free · The demo starts right away. Video in French.'}</p>
              </form>
            </section>

            <div className={`${styles.proof} flex flex-col items-center gap-4 min-[900px]:items-start`}>
              <p className="flex items-center gap-3 text-left text-[13px] leading-snug text-neutral-300">
                <img src="/founders/kevin.jpg" alt="" width={40} height={40} loading="lazy" className="h-10 w-10 shrink-0 rounded-full border border-white/15 bg-neutral-800 object-cover" />
                <span>{fr
                  ? <>C’est Kevin, le fondateur d’Empire, <span className="whitespace-nowrap">qui te fait la démo.</span></>
                  : <>Kevin, Empire’s founder, <span className="whitespace-nowrap">walks you through it.</span></>}</span>
              </p>
              {creatorsBand}
            </div>
          </div>
        )}

        {step === 'watch' && (
          <section aria-labelledby="watch-heading" className="mx-auto max-w-[880px] lg:max-w-none">
            <header className="mb-5 text-center md:mb-7">
              {videoBadge}
              <h1 id="watch-heading" ref={headingRef} tabIndex={-1} className="mt-3 text-balance text-2xl font-extrabold leading-[1.15] text-white outline-none sm:text-3xl md:text-4xl">
                {lead.firstName
                  ? (fr ? `${lead.firstName}, voici la démo d’Empire.` : `${lead.firstName}, here is the Empire demo.`)
                  : (fr ? 'La démo d’Empire' : 'The Empire demo')}
              </h1>
            </header>

            {/* Ordinateur : la vidéo à gauche, l'essai et le rendez-vous à
                droite, tous deux visibles sans faire défiler (1280 × 720 compris). */}
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-6">
            <div>
            {/* Bord à bord sur téléphone. La bordure est sur le cadre extérieur,
                pour que le lecteur reste en 16:9 exact. */}
            <div className="-mx-4 overflow-hidden border-y border-white/10 bg-[#111] sm:mx-0 sm:rounded-2xl sm:border">
              <div className="relative aspect-video w-full">
                <iframe src={`https://www.loom.com/embed/${DEMO_LOOM_ID}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`} title={fr ? 'Démo complète d’Empire par Kevin' : 'Full Empire demo by Kevin (in French)'} className="absolute inset-0 h-full w-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
              </div>
            </div>
            <div className="mt-3 flex flex-col items-center text-center text-[13px] text-neutral-400 sm:flex-row sm:justify-between sm:text-left">
              <p className="text-balance">
                <span className="lg:hidden">{fr ? 'Astuce : tourne ton téléphone pour voir en grand.' : 'Tip: turn your phone sideways for a bigger picture.'}</span>
                <span className="hidden lg:inline">{fr ? 'Astuce : passe en plein écran.' : 'Tip: go full screen.'}</span>
              </p>
              <p>
                <a href={`https://www.loom.com/share/${DEMO_LOOM_ID}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center px-2 underline underline-offset-4 transition-colors hover:text-white">{fr ? 'Ouvrir sur Loom ↗' : 'Open on Loom ↗'}</a>
                {!fr && ' · Video in French'}
              </p>
            </div>
            </div>

            <div className={`${card} mt-4 flex flex-col items-center p-5 text-center sm:mt-6 sm:p-8 lg:mt-0 lg:p-6`}>
              <p className="text-balance text-lg font-bold leading-snug text-white sm:text-xl">{fr ? 'Essaie Empire sur ton propre contenu.' : 'Try Empire on your own content.'}</p>
              <button type="button" onClick={trial} disabled={trialLoading} className={`${primaryButton} mt-4 w-full sm:w-auto sm:px-12 lg:w-full lg:px-5`}>
                {trialLoading ? (fr ? 'Ouverture…' : 'Opening…') : (fr ? 'Tester gratuitement' : 'Try it for free')}
                {!trialLoading && arrow}
              </button>
              <p className="mt-3 max-w-md text-balance text-sm leading-relaxed text-neutral-400">{keepUnits(fr ? TRIAL_TERMS_FR : TRIAL_TERMS_EN)}</p>
              <a href="/tarifs" className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-white underline underline-offset-4 transition-colors hover:text-empire">
                {fr ? 'Voir les tarifs' : 'See pricing'}
              </a>
              <div className="mt-3 flex w-full flex-col items-center gap-3 border-t border-white/10 pt-5">
                <p className="text-sm text-neutral-400">{fr ? 'Tu préfères en parler d’abord ?' : 'Prefer to talk first?'}</p>
                <button type="button" onClick={book} className={`${secondaryButton} w-full sm:w-auto lg:w-full`}>
                  <Calendar size={18} className="shrink-0" aria-hidden />
                  {fr ? 'Parler à un expert Empire' : 'Talk to an Empire expert'}
                </button>
              </div>
            </div>
            </div>

            <div className="mt-6 flex justify-center">{creatorsBand}</div>
          </section>
        )}

        {step === 'book' && (
          <div className="mx-auto max-w-[520px]">
            <button type="button" onClick={() => setStep('watch')} className="mb-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              <ArrowLeft size={16} aria-hidden />{fr ? 'Revenir à la démo' : 'Back to the demo'}
            </button>
            <section className={`${card} p-5 sm:p-7`} aria-labelledby="booking-heading">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-empire/40 bg-empire/10 text-empire"><Calendar size={21} aria-hidden /></div>
              <h1 id="booking-heading" ref={headingRef} tabIndex={-1} className="text-balance text-2xl font-extrabold leading-tight text-white outline-none">{fr ? 'Ton rendez\u2011vous avec un expert Empire' : 'Your call with an Empire expert'}</h1>
              <p className="mb-5 mt-2 text-[15px] leading-relaxed text-neutral-300">{fr ? 'Ajoute ton téléphone, puis choisis ton créneau. Ton prénom et ton email sont déjà remplis.' : 'Add your phone number, then choose a time. Your name and email are already filled in.'}</p>
              <DemoBookingForm lead={lead} fr={fr} />
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
