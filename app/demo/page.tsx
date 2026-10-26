'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Calendar, Play } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import YtLeadForm from '@/components/YtLeadForm'
import { storeVideoEmail } from '@/components/VideoEmailGate'
import { trackAmplitude } from '@/lib/amplitude'
import styles from './demo.module.css'

const DEMO_LOOM_ID = '00bc46ef533b4243ad108ed7549047be'
type Step = 'contact' | 'choice' | 'watch' | 'book'

export default function DemoPage() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const router = useRouter()
  const [step, setStep] = useState<Step>('contact')
  const [lead, setLead] = useState({ firstName: '', email: '' })
  const [company, setCompany] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (step !== 'contact') headingRef.current?.focus()
    setError('')
  }, [step])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return
    setSending(true)
    setError('')
    const clean = { firstName: lead.firstName.trim(), email: lead.email.trim().toLowerCase() }
    try {
      const response = await fetch('/api/demo-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...clean, company, locale: lang }),
      })
      const result = await response.json()
      if (!response.ok || !result.success) {
        setError(result.code === 'invalid_fields'
          ? (fr ? 'Vérifie ton prénom et ton email puis réessaie.' : 'Check your first name and email, then try again.')
          : (fr ? 'Tes informations n’ont pas pu être enregistrées. Réessaie dans un instant.' : 'We could not save your details. Please try again in a moment.'))
        return
      }
      setLead(clean)
      setStep('choice')
      trackAmplitude('empire_demo_requested', { source: 'demo_page' })
    } catch {
      setError(fr ? 'La connexion a été interrompue. Réessaie.' : 'The connection was interrupted. Please try again.')
    } finally { setSending(false) }
  }

  function choose(next: 'watch' | 'book') {
    setStep(next)
    trackAmplitude('empire_demo_path_selected', { path: next })
  }

  async function openWorkshop() {
    if (sending) return
    setSending(true)
    setError('')
    try {
      // Join the existing workshop flow only on request; never put the email in the URL.
      const response = await fetch('/api/vsl-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: lead.email, funnel: 'empire' }),
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error('Workshop unavailable')
      storeVideoEmail(lead.email)
      trackAmplitude('empire_workshop_clicked', { source: 'demo_video' })
      router.push('/vsl')
    } catch {
      setError(fr ? 'Le workshop n’a pas pu être ouvert. Réessaie dans un instant.' : 'We could not open the workshop. Please try again in a moment.')
    } finally { setSending(false) }
  }

  const buttonClass = styles.primaryButton
  const inputClass = styles.input

  return (
    <main className={styles.page}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={`${styles.content} ${step === 'contact' ? styles.contactLayout : ''}`}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>{fr ? 'La démo d’Empire' : 'The Empire demo'}</p>
          <h1 className={styles.title}>{fr ? <>Découvre Empire<br /><span>à ta façon.</span></> : <>Discover Empire<br /><span>your way.</span></>}</h1>
          <p className={styles.intro}>{fr ? 'Regarde la démo à ton rythme ou échange directement avec Kevin pour poser tes questions.' : 'Watch the demo at your own pace or talk with Kevin to ask your questions.'}</p>
        </header>

        {step === 'contact' && (
          <section className={`${styles.panel} ${styles.formPanel}`} aria-labelledby="contact-heading">
            <div className={styles.panelIcon}><ArrowRight size={23} aria-hidden /></div>
            <h2 id="contact-heading" className={styles.panelTitle}>{fr ? 'Demander une démo' : 'Request a demo'}</h2>
            <p className={styles.panelIntro}>{fr ? 'Laisse tes coordonnées, puis choisis entre la vidéo et un rendez-vous personnel.' : 'Enter your details, then choose between the video and a personal appointment.'}</p>
            <form onSubmit={submit} className={styles.form} aria-busy={sending}>
              <div>
                <label htmlFor="demo-first-name" className={styles.label}>{fr ? 'Ton prénom' : 'Your first name'}</label>
                <input id="demo-first-name" name="firstName" placeholder={fr ? 'Ton prénom' : 'Your first name'} autoComplete="given-name" required maxLength={100} value={lead.firstName} onChange={event => setLead({ ...lead, firstName: event.target.value })} disabled={sending} className={inputClass} />
              </div>
              <div>
                <label htmlFor="demo-email" className={styles.label}>{fr ? 'Ton email' : 'Your email'}</label>
                <input id="demo-email" placeholder="toi@entreprise.fr" type="email" name="email" autoComplete="email" required maxLength={254} value={lead.email} onChange={event => setLead({ ...lead, email: event.target.value })} disabled={sending} className={inputClass} />
              </div>
              <div className="hidden" aria-hidden="true">
                <label htmlFor="demo-company">Company</label>
                <input id="demo-company" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={event => setCompany(event.target.value)} />
              </div>
              {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
              <button type="submit" disabled={sending} className={`${buttonClass} w-full`}>{sending ? (fr ? 'Enregistrement…' : 'Saving…') : (fr ? 'Continuer' : 'Continue')}<ArrowRight size={18} aria-hidden /></button>
            </form>
          </section>
        )}

        {step === 'choice' && (
          <section aria-labelledby="choice-heading">
            <h2 id="choice-heading" ref={headingRef} tabIndex={-1} className={styles.choiceTitle}>{fr ? 'Comment préfères-tu découvrir Empire ?' : 'How would you like to discover Empire?'}</h2>
            <div className={styles.choices}>
              {([
                { path: 'watch', Icon: Play, title: fr ? 'Je regarde la démo à mon rythme' : 'I’ll watch the demo at my own pace', detail: fr ? 'La présentation enregistrée par Kevin, disponible immédiatement.' : 'Kevin’s recorded walkthrough, available right away.', cta: fr ? 'Voir la démo' : 'Watch the demo' },
                { path: 'book', Icon: Calendar, title: fr ? 'J’ai des questions, je préfère en parler' : 'I have questions, I’d rather talk', detail: fr ? 'Une démonstration personnelle avec Kevin, pour parler de ton activité.' : 'A personal demo with Kevin to discuss your business.', cta: fr ? 'Prendre rendez-vous' : 'Book an appointment' },
              ] as const).map(({ path, Icon, title, detail, cta }) => (
                <button key={path} type="button" onClick={() => choose(path)} className={`${styles.panel} ${styles.choiceCard} ${path === 'book' ? styles.personalCard : ''}`}>
                  <span className={`${styles.panelIcon} ${styles.choiceIcon}`}><Icon size={26} aria-hidden /></span>
                  <span className={styles.panelTitle}>{title}</span>
                  <span className={styles.choiceDetail}>{detail}</span>
                  <span className={styles.choiceAction}>{cta}<ArrowRight size={17} aria-hidden /></span>
                </button>
              ))}
            </div>
          </section>
        )}

        {(step === 'watch' || step === 'book') && <button type="button" onClick={() => setStep('choice')} className={styles.backButton}><ArrowLeft size={16} aria-hidden />{fr ? 'Revenir au choix' : 'Back to options'}</button>}

        {step === 'book' && (
          <section className={`${styles.panel} ${styles.formPanel}`} aria-labelledby="booking-heading">
            <div className={styles.panelIcon}><Calendar size={23} aria-hidden /></div>
            <h2 id="booking-heading" ref={headingRef} tabIndex={-1} className={`${styles.panelTitle} outline-none`}>{fr ? 'Ta démo personnelle avec Kevin' : 'Your personal demo with Kevin'}</h2>
            <p className={styles.panelIntro}>{fr ? 'Ajoute ton téléphone, puis choisis le créneau qui te convient. Ton prénom et ton email sont déjà renseignés.' : 'Add your phone number, then choose a time. Your name and email are already filled in.'}</p>
            <div className={styles.bookingForm}><YtLeadForm prefilledLead={lead} eventName="empire_demo_booking_opened" /></div>
          </section>
        )}

        {step === 'watch' && (
          <section aria-labelledby="watch-heading">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 id="watch-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-white outline-none">{fr ? 'La démo, à ton rythme' : 'The demo, at your own pace'}</h2>
              <button type="button" onClick={() => choose('book')} className={buttonClass}><Calendar size={18} aria-hidden />{fr ? 'J’ai des questions, prendre rendez-vous' : 'I have questions, book an appointment'}</button>
            </div>
            <div className={styles.videoFrame} style={{ paddingTop: '75%' }}>
              <iframe src={`https://www.loom.com/embed/${DEMO_LOOM_ID}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`} title={fr ? 'Démo complète d’Empire par Kevin' : 'Full Empire demo by Kevin (in French)'} className="absolute inset-0 h-full w-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
            </div>
            <p className="mt-3 text-center text-sm text-neutral-400">{fr ? 'Un souci avec le lecteur ? ' : 'Having trouble with the player? '}<a href={`https://www.loom.com/share/${DEMO_LOOM_ID}`} target="_blank" rel="noopener noreferrer" className="text-empire underline underline-offset-4">{fr ? 'Ouvrir sur Loom' : 'Open on Loom'}</a>{!fr && ' · Video in French'}</p>
            <div className={`${styles.panel} ${styles.workshop}`}>
              <p className="mb-2 text-sm font-semibold text-empire">{fr ? 'Pour aller plus loin · workshop gratuit' : 'Go further · free workshop'}</p>
              <h3 className="text-2xl font-bold text-white">{fr ? 'Découvre la méthode derrière Empire.' : 'Discover the method behind Empire.'}</h3>
              <p className="mb-5 mt-3 leading-relaxed text-neutral-300">{fr ? 'Après la démo de l’outil, retrouve Kevin dans le workshop pour approfondir ta stratégie de contenu.' : 'After the product demo, join Kevin’s workshop to explore your content strategy.'}</p>
              <button type="button" onClick={openWorkshop} disabled={sending} className={buttonClass}>{sending ? (fr ? 'Ouverture…' : 'Opening…') : (fr ? 'Voir le workshop gratuit' : 'Watch the free workshop')}<ArrowRight size={18} aria-hidden /></button>
              {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
            </div>
            <div className="mt-6 text-center"><button type="button" onClick={() => choose('book')} className="min-h-11 text-sm font-semibold text-empire underline underline-offset-4">{fr ? 'Tu préfères en parler ? Prendre rendez-vous avec Kevin' : 'Prefer to talk? Book an appointment with Kevin'}</button></div>
          </section>
        )}
      </div>
    </main>
  )
}
