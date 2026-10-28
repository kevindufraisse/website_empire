'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Calendar, Check, Play } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import YtLeadForm from '@/components/YtLeadForm'
import { storeVideoEmail } from '@/components/VideoEmailGate'
import { trackAmplitude } from '@/lib/amplitude'
import { startFreeTrial } from '@/lib/startTrial'
import styles from './demo.module.css'

const DEMO_LOOM_ID = '00bc46ef533b4243ad108ed7549047be'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// Le workshop n'apparaît qu'à ceux qui restent sur la démo (choix de Kevin, 27 octobre 2026).
const WORKSHOP_AFTER_MS = 3 * 60 * 1000
type Step = 'contact' | 'watch' | 'book'

/**
 * Systeme.io met jusqu'à 40 s à répondre : on n'attend jamais la capture pour
 * montrer la démo. Elle part en fond, avec un second essai si la première échoue.
 */
function captureInBackground(url: string, body: Record<string, unknown>, event: string) {
  const send = () => fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body), keepalive: true,
  }).then(r => { if (!r.ok) throw new Error(String(r.status)) })
  send().catch(() => new Promise(r => setTimeout(r, 3000)).then(send))
    .catch(() => trackAmplitude(event))
}

export default function DemoPage() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const router = useRouter()
  const [step, setStep] = useState<Step>('contact')
  const [lead, setLead] = useState({ firstName: '', email: '' })
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')
  const [trialLoading, setTrialLoading] = useState(false)
  const [showWorkshop, setShowWorkshop] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (step !== 'contact') headingRef.current?.focus()
    setError('')
  }, [step])

  useEffect(() => {
    if (step !== 'watch' || showWorkshop) return
    const timer = setTimeout(() => {
      setShowWorkshop(true)
      trackAmplitude('empire_demo_workshop_shown')
    }, WORKSHOP_AFTER_MS)
    return () => clearTimeout(timer)
  }, [step, showWorkshop])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const clean = { firstName: lead.firstName.trim(), email: lead.email.trim().toLowerCase() }
    if (!clean.firstName || clean.firstName.length > 100 || clean.email.length > 254 || !EMAIL_RE.test(clean.email)) {
      setError(fr ? 'Vérifie ton prénom et ton email puis réessaie.' : 'Check your first name and email, then try again.')
      return
    }
    // Pot de miel : un robot avance comme tout le monde, mais rien n'est enregistré.
    if (!company) captureInBackground('/api/demo-email', { ...clean, company, locale: lang }, 'empire_demo_capture_failed')
    setLead(clean)
    setStep('watch')
    trackAmplitude('empire_demo_requested', { source: 'demo_page' })
  }

  function book(source: string) {
    setStep('book')
    trackAmplitude('empire_demo_path_selected', { path: 'book', source })
  }

  async function startTrial(location: string) {
    if (trialLoading) return
    setTrialLoading(true)
    trackAmplitude('empire_trial_clicked', { source: `demo-${location}` })
    await startFreeTrial()
  }

  function openWorkshop() {
    captureInBackground('/api/vsl-email', { email: lead.email, funnel: 'empire' }, 'empire_workshop_capture_failed')
    storeVideoEmail(lead.email)
    trackAmplitude('empire_workshop_clicked', { source: 'demo_video' })
    router.push('/vsl')
  }

  const buttonClass = styles.primaryButton
  const inputClass = styles.input

  const trialCta = (location: string) => (
    <div className={styles.trialRow}>
      <button type="button" onClick={() => startTrial(location)} disabled={trialLoading} className={buttonClass}>
        {trialLoading ? (fr ? 'Ouverture…' : 'Opening…') : (fr ? 'Tester 7 jours gratuitement' : 'Start my 7-day free trial')}<ArrowRight size={18} aria-hidden />
      </button>
      <button type="button" onClick={() => book(location)} className={styles.secondaryButton}>
        <Calendar size={18} aria-hidden />{fr ? 'Une question ? Prendre rendez-vous' : 'A question? Book a call'}
      </button>
    </div>
  )

  return (
    <main className={styles.page}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={`${styles.content} ${step === 'contact' ? styles.contactLayout : ''}`}>
        {step === 'contact' && (
          <header className={styles.hero}>
            <p className={styles.eyebrow}>{fr ? 'La démo d’Empire' : 'The Empire demo'}</p>
            <h1 className={styles.title}>{fr ? <>Découvre Empire<br /><span>en vidéo.</span></> : <>Discover Empire<br /><span>on video.</span></>}</h1>
            <p className={styles.intro}>{fr ? 'Kevin te montre l’outil de bout en bout. Tu peux démarrer ton essai pendant que tu regardes, ou prendre rendez-vous si tu veux en savoir plus.' : 'Kevin walks you through the whole tool. Start your trial while you watch, or book a call if you want to know more.'}</p>
          </header>
        )}

        {step === 'contact' && (
          <section className={`${styles.panel} ${styles.formPanel}`} aria-labelledby="contact-heading">
            <div className={styles.panelIcon}><Play size={23} aria-hidden /></div>
            <h2 id="contact-heading" className={styles.panelTitle}>{fr ? 'Voir la démo' : 'Watch the demo'}</h2>
            <p className={styles.panelIntro}>{fr ? 'Ton prénom et ton email, et la démo s’ouvre tout de suite.' : 'Your first name and email, and the demo opens right away.'}</p>
            <form onSubmit={submit} className={styles.form} noValidate>
              <div>
                <label htmlFor="demo-first-name" className={styles.label}>{fr ? 'Ton prénom' : 'Your first name'}</label>
                <input id="demo-first-name" name="firstName" placeholder={fr ? 'Ton prénom' : 'Your first name'} autoComplete="given-name" required maxLength={100} value={lead.firstName} onChange={event => setLead({ ...lead, firstName: event.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="demo-email" className={styles.label}>{fr ? 'Ton email' : 'Your email'}</label>
                <input id="demo-email" placeholder="toi@entreprise.fr" type="email" name="email" autoComplete="email" required maxLength={254} value={lead.email} onChange={event => setLead({ ...lead, email: event.target.value })} className={inputClass} />
              </div>
              <div className="hidden" aria-hidden="true">
                <label htmlFor="demo-company">Company</label>
                <input id="demo-company" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={event => setCompany(event.target.value)} />
              </div>
              {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
              <button type="submit" className={`${buttonClass} w-full`}>{fr ? 'Voir la démo' : 'Watch the demo'}<ArrowRight size={18} aria-hidden /></button>
            </form>
          </section>
        )}

        {step === 'book' && <button type="button" onClick={() => setStep('watch')} className={styles.backButton}><ArrowLeft size={16} aria-hidden />{fr ? 'Revenir à la démo' : 'Back to the demo'}</button>}

        {step === 'book' && (
          <section className={`${styles.panel} ${styles.formPanel}`} aria-labelledby="booking-heading">
            <div className={styles.panelIcon}><Calendar size={23} aria-hidden /></div>
            <h2 id="booking-heading" ref={headingRef} tabIndex={-1} className={`${styles.panelTitle} outline-none`}>{fr ? 'Ton rendez-vous avec Kevin' : 'Your call with Kevin'}</h2>
            <p className={styles.panelIntro}>{fr ? 'Ajoute ton téléphone, puis choisis ton créneau. Ton prénom et ton email sont déjà renseignés.' : 'Add your phone number, then choose a time. Your name and email are already filled in.'}</p>
            <div className={styles.bookingForm}><YtLeadForm prefilledLead={lead} eventName="empire_demo_booking_opened" /></div>
          </section>
        )}

        {step === 'watch' && (
          <section aria-labelledby="watch-heading">
            <h2 id="watch-heading" ref={headingRef} tabIndex={-1} className="mb-5 text-center text-2xl font-bold text-white outline-none sm:text-3xl">
              {fr ? `${lead.firstName ? `${lead.firstName}, voici` : 'Voici'} la démo d’Empire` : `${lead.firstName ? `${lead.firstName}, here’s` : 'Here’s'} the Empire demo`}
            </h2>
            <div className={styles.videoFrame} style={{ paddingTop: '62.5%' }}>
              <iframe src={`https://www.loom.com/embed/${DEMO_LOOM_ID}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`} title={fr ? 'Démo complète d’Empire par Kevin' : 'Full Empire demo by Kevin (in French)'} className="absolute inset-0 h-full w-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
            </div>
            <p className="mt-3 text-center text-sm text-neutral-400">{fr ? 'Un souci avec le lecteur ? ' : 'Having trouble with the player? '}<a href={`https://www.loom.com/share/${DEMO_LOOM_ID}`} target="_blank" rel="noopener noreferrer" className="text-neutral-300 underline underline-offset-4">{fr ? 'Ouvrir sur Loom' : 'Open on Loom'}</a>{!fr && ' · Video in French'}</p>

            {trialCta('below-video')}
            <ul className={styles.trialPoints}>
              {(fr
                ? ['7 jours gratuits avec 500 crédits', 'L’abonnement démarre au 8e jour, ou dès que tu dépasses les 500 crédits', 'Tu arrêtes en un clic']
                : ['7 days free with 500 credits', 'Your plan starts on day 8, or once you go past 500 credits', 'Cancel in one click']
              ).map(point => <li key={point}><Check size={15} aria-hidden />{point}</li>)}
            </ul>

            {showWorkshop && (
              <div className={`${styles.panel} ${styles.workshop}`}>
                <p className="mb-2 text-sm font-semibold text-neutral-200">{fr ? 'Avant de prendre rendez-vous · workshop gratuit' : 'Before booking a call · free workshop'}</p>
                <h3 className="text-2xl font-bold text-white">{fr ? 'La méthode derrière Empire, en une vidéo.' : 'The method behind Empire, in one video.'}</h3>
                <p className="mb-5 mt-3 leading-relaxed text-neutral-300">{fr ? 'Tu as vu l’outil. Le workshop te montre la stratégie : quels formats font des vues et comment ils t’amènent des clients. Beaucoup de questions trouvent leur réponse dedans.' : 'You’ve seen the tool. The workshop shows the strategy: which formats get views and how they bring you clients. Most questions get answered there.'}</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={openWorkshop} className={buttonClass}>{fr ? 'Voir le workshop gratuit' : 'Watch the free workshop'}<ArrowRight size={18} aria-hidden /></button>
                  <button type="button" onClick={() => book('workshop')} className={styles.secondaryButton}><Calendar size={18} aria-hidden />{fr ? 'Prendre rendez-vous quand même' : 'Book a call anyway'}</button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  )
}
