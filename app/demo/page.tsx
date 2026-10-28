'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import YtLeadForm from '@/components/YtLeadForm'
import { storeVideoEmail } from '@/components/VideoEmailGate'
import { trackAmplitude } from '@/lib/amplitude'
import { startFreeTrial } from '@/lib/startTrial'
import styles from './demo.module.css'
import DemoExitOffer from './DemoExitOffer'

const DEMO_LOOM_ID = '00bc46ef533b4243ad108ed7549047be'
// Prénom + email, puis la démo enregistrée tout de suite (l'email part chez
// Systeme.io en arrière-plan), avec deux suites : l'essai ou un rendez-vous.
type Step = 'contact' | 'watch' | 'book'

export default function DemoPage() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [step, setStep] = useState<Step>('contact')
  const [lead, setLead] = useState({ firstName: '', email: '' })
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')
  const [trialLoading, setTrialLoading] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (step !== 'contact') {
      headingRef.current?.focus()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setError('')
  }, [step])

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
  }

  async function trial() {
    if (trialLoading) return
    setTrialLoading(true)
    trackAmplitude('empire_demo_trial_clicked', { location: 'bottom' })
    await startFreeTrial()
  }

  const buttonClass = styles.primaryButton
  const inputClass = styles.input

  return (
    <main className={styles.page}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={`${styles.content} ${step === 'contact' ? styles.contactLayout : ''}`}>
        {step === 'contact' && (
          <header className={styles.hero}>
            <p className={styles.eyebrow}>{fr ? 'La démo d’Empire' : 'The Empire demo'}</p>
            <h1 className={styles.title}>{fr ? <>Découvre Empire<br /><span>en vidéo.</span></> : <>Discover Empire<br /><span>on video.</span></>}</h1>
            <p className={styles.intro}>{fr ? 'La démo enregistrée par Kevin, disponible tout de suite.' : 'Kevin’s recorded walkthrough, available right away.'}</p>
          </header>
        )}

        {step === 'contact' && (
          <section className={`${styles.panel} ${styles.formPanel}`} aria-labelledby="contact-heading">
            <div className={styles.panelIcon}><ArrowRight size={23} aria-hidden /></div>
            <h2 id="contact-heading" className={styles.panelTitle}>{fr ? 'Voir la démo' : 'Watch the demo'}</h2>
            <p className={styles.panelIntro}>{fr ? 'Ton prénom et ton email, et la démo démarre tout de suite.' : 'Your first name and email, and the demo starts right away.'}</p>
            <form onSubmit={submit} className={styles.form}>
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

        {step === 'watch' && (
          <section aria-labelledby="watch-heading" className={styles.watch}>
            <header className={styles.watchHero}>
              <p className={styles.eyebrow}>{fr ? 'Démo complète · 24 min' : 'Full demo · 24 min'}</p>
              <h2 id="watch-heading" ref={headingRef} tabIndex={-1} className={styles.watchTitle}>
                {lead.firstName
                  ? (fr ? <>{lead.firstName}, voici la démo <span>d’Empire.</span></> : <>{lead.firstName}, here is <span>the Empire demo.</span></>)
                  : (fr ? 'La démo d’Empire' : 'The Empire demo')}
              </h2>
            </header>
            <div className={styles.playerShell}>
              <div className={styles.videoFrame} style={{ paddingTop: '75%' }}>
                <iframe src={`https://www.loom.com/embed/${DEMO_LOOM_ID}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`} title={fr ? 'Démo complète d’Empire par Kevin' : 'Full Empire demo by Kevin (in French)'} className="absolute inset-0 h-full w-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
              </div>
            </div>
            <p className={styles.loomFallback}><a href={`https://www.loom.com/share/${DEMO_LOOM_ID}`} target="_blank" rel="noopener noreferrer">{fr ? 'Ouvrir sur Loom ↗' : 'Open on Loom ↗'}</a>{!fr && ' · Video in French'}</p>
            <div className={`${styles.panel} ${styles.ctaPanel}`}>
              <div className={styles.ctaCopy}>
                <p className={styles.ctaTitle}>{fr ? 'Essaie Empire sur ton propre contenu.' : 'Try Empire on your own content.'}</p>
                <p className={styles.ctaNote}>{fr ? '7 jours gratuits avec 500 crédits · annulable en un clic' : '7 days free with 500 credits · cancel in one click'}</p>
              </div>
              <div className={styles.ctaButtons}>
                <button type="button" onClick={trial} disabled={trialLoading} className={buttonClass}>
                  {trialLoading ? (fr ? 'Ouverture…' : 'Opening…') : (fr ? 'Tester gratuitement' : 'Try it for free')}
                  {!trialLoading && <ArrowRight size={18} aria-hidden />}
                </button>
                <button type="button" onClick={book} className={styles.secondaryButton}>
                  <Calendar size={18} aria-hidden />
                  {fr ? 'Prendre rendez-vous avec un expert' : 'Book a call with an expert'}
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 'book' && (
          <>
            <button type="button" onClick={() => setStep('watch')} className={styles.backButton}><ArrowLeft size={16} aria-hidden />{fr ? 'Revenir à la démo' : 'Back to the demo'}</button>
            <section className={`${styles.panel} ${styles.formPanel}`} aria-labelledby="booking-heading">
              <div className={styles.panelIcon}><Calendar size={23} aria-hidden /></div>
              <h2 id="booking-heading" ref={headingRef} tabIndex={-1} className={`${styles.panelTitle} outline-none`}>{fr ? 'Ton rendez-vous avec un expert' : 'Your call with an expert'}</h2>
              <p className={styles.panelIntro}>{fr ? 'Ajoute ton téléphone, puis choisis le créneau qui te convient. Ton prénom et ton email sont déjà renseignés.' : 'Add your phone number, then choose a time. Your name and email are already filled in.'}</p>
              <div className={styles.bookingForm}><YtLeadForm prefilledLead={lead} eventName="empire_demo_booking_opened" /></div>
            </section>
          </>
        )}
      </div>
      <DemoExitOffer email={step === 'contact' ? '' : lead.email} fr={fr} />
    </main>
  )
}
