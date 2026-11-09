'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowLeft, Calendar, Play, Star } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import YtLeadForm from '@/components/YtLeadForm'
import { storeVideoEmail } from '@/components/VideoEmailGate'
import { trackAmplitude } from '@/lib/amplitude'
import { startFreeTrial, TRIAL_TERMS_EN, TRIAL_TERMS_FR } from '@/lib/startTrial'
import styles from './demo.module.css'

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

// Mêmes classes que la home (HeroSection) : bouton lime, texte noir, rayon 12 px.
const primaryButton =
  'group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-empire px-8 py-3.5 text-base font-bold text-black shadow-[0_0_30px_rgb(var(--empire-rgb)_/_0.35)] transition-all hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-empire'
const secondaryButton =
  'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold text-white sm:px-6 transition hover:border-white/40 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
const badge = 'inline-flex items-center gap-2 rounded-full border border-empire/40 bg-empire/10 px-4 py-1.5 text-xs font-bold text-empire'
const card = 'rounded-2xl border border-white/10 bg-[#111]'
const input =
  'w-full rounded-xl border border-white/20 bg-white/[0.06] px-4 py-3 text-base text-white placeholder:text-neutral-500 transition-all focus:border-empire/60 focus:outline-none focus:ring-1 focus:ring-empire/40'
const label = 'mb-1.5 block text-sm font-medium text-neutral-300'
const arrow = <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>

export default function DemoPage() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [step, setStep] = useState<Step>('contact')
  const [lead, setLead] = useState({ firstName: '', email: '' })
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')
  const [trialLoading, setTrialLoading] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstNameRef = useRef<HTMLInputElement>(null)
  const videoShown = useRef(false)

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
    await startFreeTrial()
  }

  // La miniature n'est pas la vidéo : elle amène au formulaire.
  function focusForm() {
    const field = firstNameRef.current
    if (!field) return
    field.scrollIntoView({ block: 'center', behavior: 'smooth' })
    field.focus({ preventScroll: true })
  }

  const creatorsBand = (
    <div className="flex max-w-full items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 pl-2 sm:gap-4">
      <div className="flex shrink-0 -space-x-2">
        {DEMO_CREATORS.map(c => (
          <img key={c.name} src={c.img} alt={c.name} title={c.name} width={40} height={40} loading="lazy" className="h-9 w-9 rounded-full border-2 border-black bg-neutral-800 object-cover" />
        ))}
      </div>
      <span className="text-left text-[11px] leading-snug text-neutral-300 sm:text-xs">
        {fr
          ? <>Le système exact derrière Hormozi, Matt Gray ou Justin Welsh. <span className="text-neutral-500">Prêt à filmer pour toi.</span></>
          : <>The exact system behind Hormozi, Matt Gray or Justin Welsh. <span className="text-neutral-500">Ready to film for you.</span></>}
      </span>
    </div>
  )

  const ratingLine = (
    <p className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400">
      <span className="inline-flex gap-0.5 text-[#f3c45c]" aria-hidden="true">
        {[0, 1, 2, 3, 4].map(i => <Star key={i} size={13} fill="currentColor" aria-hidden />)}
      </span>
      {fr ? 'Validé par plus de 100 créateurs' : 'Trusted by 100+ creators'}
    </p>
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
              <p className="mx-auto mt-3 max-w-xl text-pretty text-[15px] leading-relaxed text-neutral-300 min-[900px]:mx-0 md:text-lg">
                {fr
                  ? 'Avec Empire, tu es vu, acheté et recommandé grâce à ton contenu, en 1h par semaine.'
                  : 'With Empire, you get seen, chosen and recommended through your content in one hour a week.'}
              </p>
            </header>

            <section className={`${styles.formCard} ${card} p-5 sm:p-7`} aria-labelledby="contact-heading">
              <h2 id="contact-heading" className="text-base font-semibold leading-snug text-white sm:text-lg">
                {fr ? 'Ton prénom et ton email, et la démo démarre tout de suite.' : 'Your first name and email, and the demo starts right away.'}
              </h2>
              <form onSubmit={submit} className="mt-4 grid gap-3.5">
                <div>
                  <label htmlFor="demo-first-name" className={label}>{fr ? 'Ton prénom' : 'Your first name'}</label>
                  <input ref={firstNameRef} id="demo-first-name" name="firstName" placeholder={fr ? 'Ton prénom' : 'Your first name'} autoComplete="given-name" required maxLength={100} value={lead.firstName} onChange={event => setLead({ ...lead, firstName: event.target.value })} className={input} />
                </div>
                <div>
                  <label htmlFor="demo-email" className={label}>{fr ? 'Ton email' : 'Your email'}</label>
                  <input id="demo-email" placeholder={fr ? 'toi@entreprise.fr' : 'you@company.com'} type="email" name="email" autoComplete="email" inputMode="email" required maxLength={254} value={lead.email} onChange={event => setLead({ ...lead, email: event.target.value })} className={input} />
                </div>
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="demo-company">Company</label>
                  <input id="demo-company" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={event => setCompany(event.target.value)} />
                </div>
                {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
                <button type="submit" className={`${primaryButton} mt-1 w-full`}>{fr ? 'Voir la démo' : 'Watch the demo'}{arrow}</button>
                <p className="text-center text-xs text-neutral-400">{fr ? 'Accès immédiat · Aucune carte demandée' : 'Instant access · No card required'}</p>
              </form>
            </section>

            <div className={styles.thumbWrap}>
              <button
                type="button"
                onClick={focusForm}
                aria-label={fr ? 'Voir la démo : remplis le formulaire' : 'Watch the demo: fill in the form'}
                className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-empire"
              >
                <img src="/demo/demo-thumb.jpg" alt="" width={1024} height={580} loading="lazy" className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100" />
                <span className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-black/50" aria-hidden="true" />
                <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-empire text-black shadow-[0_0_30px_rgb(var(--empire-rgb)_/_0.35)] transition-transform group-hover:scale-105" aria-hidden="true">
                  <Play size={20} fill="currentColor" className="ml-0.5" aria-hidden />
                </span>
                <span className="absolute bottom-2.5 left-2.5 rounded-full border border-white/15 bg-black/80 px-2.5 py-1 text-xs font-semibold text-white" aria-hidden="true">24 min</span>
              </button>
              <p className="mt-2.5 text-center text-xs text-neutral-400 min-[900px]:text-left">
                {fr ? 'La démo enregistrée par Kevin, disponible tout de suite.' : 'Kevin’s recorded walkthrough, available right away. Video in French.'}
              </p>
            </div>

            <div className={`${styles.proof} flex flex-col items-center gap-3 min-[900px]:items-start`}>
              {creatorsBand}
              {ratingLine}
            </div>
          </div>
        )}

        {step === 'watch' && (
          <section aria-labelledby="watch-heading" className="mx-auto max-w-[880px]">
            <header className="mb-5 text-center md:mb-7">
              {videoBadge}
              <h1 id="watch-heading" ref={headingRef} tabIndex={-1} className="mt-3 text-balance text-2xl font-extrabold leading-[1.15] text-white outline-none sm:text-3xl md:text-4xl">
                {lead.firstName
                  ? (fr ? `${lead.firstName}, voici la démo d’Empire.` : `${lead.firstName}, here is the Empire demo.`)
                  : (fr ? 'La démo d’Empire' : 'The Empire demo')}
              </h1>
            </header>

            {/* 16:9, bord à bord sur téléphone. */}
            <div className="-mx-4 sm:mx-0">
              <div className="relative aspect-video w-full overflow-hidden border-y border-white/10 bg-[#111] sm:rounded-2xl sm:border">
                <iframe src={`https://www.loom.com/embed/${DEMO_LOOM_ID}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`} title={fr ? 'Démo complète d’Empire par Kevin' : 'Full Empire demo by Kevin (in French)'} className="absolute inset-0 h-full w-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[13px] text-neutral-400">
              <p>
                <span className="lg:hidden">{fr ? 'Astuce : passe en plein écran, téléphone à l’horizontale.' : 'Tip: go full screen and turn your phone sideways.'}</span>
                <span className="hidden lg:inline">{fr ? 'Astuce : passe en plein écran.' : 'Tip: go full screen.'}</span>
              </p>
              <p>
                <a href={`https://www.loom.com/share/${DEMO_LOOM_ID}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 transition-colors hover:text-white">{fr ? 'Ouvrir sur Loom ↗' : 'Open on Loom ↗'}</a>
                {!fr && ' · Video in French'}
              </p>
            </div>

            <div className={`${card} mt-6 flex flex-col items-center p-5 text-center sm:p-8`}>
              <p className="text-balance text-lg font-bold leading-snug text-white sm:text-xl">{fr ? 'Essaie Empire sur ton propre contenu.' : 'Try Empire on your own content.'}</p>
              <button type="button" onClick={trial} disabled={trialLoading} className={`${primaryButton} mt-4 w-full sm:w-auto sm:px-12`}>
                {trialLoading ? (fr ? 'Ouverture…' : 'Opening…') : (fr ? 'Tester gratuitement' : 'Try it for free')}
                {!trialLoading && arrow}
              </button>
              <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-neutral-400">{fr ? TRIAL_TERMS_FR : TRIAL_TERMS_EN}</p>
              <a href="/tarifs" className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-white underline underline-offset-4 transition-colors hover:text-empire">
                {fr ? 'Voir les tarifs' : 'See pricing'}
              </a>
              <div className="mt-3 flex w-full flex-col items-center gap-3 border-t border-white/10 pt-5">
                <p className="text-sm text-neutral-400">{fr ? 'Tu préfères en parler d’abord ?' : 'Prefer to talk first?'}</p>
                <button type="button" onClick={book} className={`${secondaryButton} w-full sm:w-auto`}>
                  <Calendar size={18} aria-hidden />
                  {fr ? 'Prendre rendez-vous avec un expert' : 'Book a call with an expert'}
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
              {creatorsBand}
              {ratingLine}
            </div>
          </section>
        )}

        {step === 'book' && (
          <div className="mx-auto max-w-[520px]">
            <button type="button" onClick={() => setStep('watch')} className="mb-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              <ArrowLeft size={16} aria-hidden />{fr ? 'Revenir à la démo' : 'Back to the demo'}
            </button>
            <section className={`${card} p-5 sm:p-7`} aria-labelledby="booking-heading">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-empire/40 bg-empire/10 text-empire"><Calendar size={21} aria-hidden /></div>
              <h1 id="booking-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold leading-tight text-white outline-none">{fr ? 'Ton rendez-vous avec un expert Empire' : 'Your call with an Empire expert'}</h1>
              <p className="mb-5 mt-2 text-[15px] leading-relaxed text-neutral-300">{fr ? 'Ajoute ton téléphone, puis choisis ton créneau. Ton prénom et ton email sont déjà remplis.' : 'Add your phone number, then choose a time. Your name and email are already filled in.'}</p>
              <div className={styles.bookingForm}><YtLeadForm prefilledLead={lead} eventName="empire_demo_booking_opened" informal /></div>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
