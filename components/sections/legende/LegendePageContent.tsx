'use client'

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import LoomEmbed from '@/components/LoomEmbed'
import { decisions, revenueBands, scopes, timings } from '@/lib/legende'
import { countryPhone } from '@/lib/legende-phone'
import type { CountryCode } from 'libphonenumber-js/min'
import LegendePhoneField from './LegendePhoneField'
import styles from './legende-form.module.css'
import type { Outcome } from '@/lib/legende-intake'

const CalModal = dynamic(() => import('@/components/YtLeadForm').then(m => m.CalModal), { ssr: false })

const copy = {
  fr: {
    intro: 'Tu veux déléguer ton contenu ? Avec Légende, Kevin et son équipe prennent en charge la stratégie, la production et la publication.',
    video: 'Kevin présente l’accompagnement Légende', steps: ['Projet', 'Expérience', 'Contact', 'Envoi'],
    headings: ['Ton projet de contenu', 'Ce que tu as déjà essayé', 'Comment te joindre ?', 'Finaliser ta candidature'],
    examples: { goal: 'Ex. : obtenir cinq demandes de devis par mois.', obstacle: 'Ex. : je sais quoi dire, mais filmer me prend trop de temps.', tried: 'Qu’as-tu testé ? Si tu démarres, tu peux simplement le préciser.' },
    scope: 'Pour qui veux-tu développer du contenu ?',
    goal: 'Dans six mois, quel résultat concret aimerais-tu obtenir avec ton contenu ?',
    obstacle: 'Qu’est-ce qui t’empêche d’y arriver aujourd’hui ?',
    tried: 'Qu’as-tu déjà essayé et qu’est-ce que ça a donné ?',
    name: 'Ton nom', email: 'Ton e-mail',
    timing: 'Quand aimerais-tu démarrer ?', decision: 'Qui prend la décision pour cet accompagnement ?',
    company: 'Nom de l’entreprise', revenue: 'Quel chiffre d’affaires HT cette entreprise a-t-elle réalisé sur les 12 derniers mois ?',
    unknown: 'Je ne connais pas ce chiffre', price: 'Légende coûte 4 000 € par mois sur 12 mois, soit 48 000 € sur l’année.',
    note: 'En envoyant ta candidature, tu acceptes que l’équipe Empire te recontacte au sujet de ton projet.',
    privacy: 'Confidentialité', next: 'Continuer', back: 'Retour', send: 'Envoyer ma candidature', busy: 'Envoi en cours…',
    received: 'Candidature reçue', call: 'Choisis un créneau de 45 minutes pour discuter de ton projet avec l’équipe Empire.', book: 'Réserver mon appel',
    review: 'Kevin et son équipe vont lire tes réponses. Si un échange est pertinent, ils pourront te rappeler au',
    alternative: 'Pour ton projet, Kevin te propose une séance de conseil individuelle de 30 minutes à 500 €. Tu peux y travailler le blocage que tu viens de décrire.',
    consult: 'Demander la séance à 500 €', requested: 'Demande de séance reçue',
    followup: 'L’équipe te recontactera pour organiser tes 30 minutes avec Kevin.', paidBook: 'Réserver ma séance à 500 €',
    error: 'L’envoi a échoué. Tes réponses sont conservées. Tu peux réessayer.',
    limit: 'Plusieurs demandes ont déjà été envoyées. Réessaie dans 15 minutes.',
  },
  en: {
    intro: 'Want to hand over content production? With Légende, Kevin and his team handle strategy, production and publishing.',
    video: 'Kevin introduces the Légende programme', steps: ['Project', 'Experience', 'Contact', 'Submit'],
    headings: ['Your content project', 'What you’ve tried', 'How can we reach you?', 'Finish your application'],
    examples: { goal: 'For example, five qualified enquiries a month.', obstacle: 'For example, I have ideas but filming takes too long.', tried: 'What did you try? If you’re just starting, say so.' },
    scope: 'Who are you looking to create content for?',
    goal: 'Six months from now, what specific result would you like your content to deliver?',
    obstacle: 'What is keeping you from getting there today?', tried: 'What have you already tried, and how did it work out?',
    name: 'Your name', email: 'Your email',
    timing: 'When would you like to start?', decision: 'Who decides whether to go ahead?',
    company: 'Company name', revenue: 'What was this company’s revenue, excluding tax, over the last 12 months?',
    unknown: 'I don’t know this figure', price: 'Légende costs €4,000 a month for 12 months, or €48,000 for the year.',
    note: 'By submitting your application, you agree that the Empire team may contact you about your project.',
    privacy: 'Privacy', next: 'Continue', back: 'Back', send: 'Submit my application', busy: 'Sending…',
    received: 'Application received', call: 'Pick a 45-minute slot to discuss your project with the Empire team.', book: 'Book my call',
    review: 'Kevin and his team will review your answers. If a call would be helpful, they can reach you at',
    alternative: 'For your project, Kevin offers a 30-minute one-to-one consultation for €500. You can focus on the obstacle you just described.',
    consult: 'Request the €500 session', requested: 'Consultation request received',
    followup: 'The team will get in touch to arrange your 30 minutes with Kevin.', paidBook: 'Book my €500 session',
    error: 'We couldn’t confirm delivery. Your answers are still here. Please try again.',
    limit: 'Several requests have already been sent. Please try again in 15 minutes.',
  },
}
const fieldClass = styles.field
const buttonClass = styles.primary
const empty = { scope: '', goal: '', obstacle: '', tried: '', timing: '', name: '', email: '', phone: '', company: '', decision: '', revenueBand: '', website: '' }

export default function LegendePageContent() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(empty)
  const [country, setCountry] = useState<CountryCode>('FR')
  const [invalidPhone, setInvalidPhone] = useState(false)
  const phone = countryPhone(answers.phone, country)
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<'error' | 'limit'>()
  const [receipt, setReceipt] = useState<{ kind: Outcome; bookingUrl?: string }>()
  const [calendar, setCalendar] = useState(false)
  const section = useRef<HTMLElement>(null)
  const lastRequest = useRef({ values: '', id: '' })
  const inFlight = useRef(false)
  const personal = answers.scope === 'personal'
  useEffect(() => setReady(true), [])
  const hasStarted = useRef(false)
  useEffect(() => {
    if (hasStarted.current) section.current?.focus()
  }, [step, receipt])

  function change(key: keyof typeof empty, value: string) {
    setAnswers(previous => ({ ...previous, ...(key === 'scope' && value !== previous.scope ? { company: '', revenueBand: '', decision: '' } : {}), [key]: value }))
    setError(undefined)
  }

  function bind(key: keyof typeof empty) {
    return { name: key, value: answers[key], onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      event.target.setCustomValidity('')
      change(key, event.target.value)
    } }
  }

  function choices(key: 'scope' | 'timing' | 'decision' | 'revenueBand', label: string, options: { value: string; label: string }[]) {
    return <fieldset>
      <legend>{label}</legend>
      <div className={styles.choices + (key === 'revenueBand' ? ' ' + styles.compact : '')}>
        {options.map(option => <label key={option.value} className={styles.option}>
          <input type="radio" name={key} value={option.value} required checked={answers[key] === option.value}
            onChange={() => change(key, option.value)} />
          <span>{option.label}</span>
        </label>)}
      </div>
    </fieldset>
  }

  function localized(options: Record<string, { fr: string; en: string }>) {
    return Object.entries(options).map(([value, label]) => ({ value, label: label[lang] }))
  }

  function question(key: 'goal' | 'obstacle' | 'tried') {
    return <label className="block">{t[key]}
      <textarea rows={2} required maxLength={800} placeholder={t.examples[key]} className={fieldClass} {...bind(key)} />
    </label>
  }

  async function send(action: 'apply' | 'consultation') {
    if (inFlight.current) return
    inFlight.current = true
    setError(undefined)
    setBusy(true)
    const fields = { ...answers, version: 2, action, phone: phone?.number, phoneCountry: country,
      company: personal ? undefined : answers.company, decision: personal ? undefined : answers.decision,
      revenueBand: personal ? undefined : answers.revenueBand === 'unknown' ? 'unknown' : Number(answers.revenueBand) }
    try {
      const values = JSON.stringify(fields)
      if (lastRequest.current.values !== values) lastRequest.current = { values, id: crypto.randomUUID() }
      const res = await fetch('/api/legende/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, submissionId: lastRequest.current.id }) })
      if (!res.ok) {
        setError(res.status === 429 ? 'limit' : 'error')
        return
      }
      const result = await res.json()
      if (!result.success || !['legende','review','alternative','consultation'].includes(result.kind)) throw new Error('delivery_failed')
      setReceipt(result)
    } catch { setError('error') }
    finally { inFlight.current = false; setBusy(false) }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    hasStarted.current = true
    if (step === 2 && !phone) {
      const input = event.currentTarget.elements.namedItem('phone') as HTMLInputElement
      setInvalidPhone(true)
      input.focus()
      return
    }
    const blank = Array.from(event.currentTarget.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('textarea[required], input[required]:not([type=radio])')).find(field => !field.value.trim())
    if (blank) {
      blank.setCustomValidity(lang === 'fr' ? 'Précise ta réponse pour continuer.' : 'Enter your answer to continue.')
      blank.reportValidity()
      return
    }
    if (step < 3) setStep(step + 1)
    else void send('apply')
  }

  return <main lang={lang} className="mx-auto max-w-3xl px-5 pb-16 pt-28 text-white sm:px-8 md:pt-32">
    <header>
      <p className="text-sm font-semibold text-autopilot">Légende</p>
      <h1 className="mt-2 text-5xl font-bold tracking-tight sm:text-6xl">Work with Kevin</h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">{t.intro}</p>
    </header>
    <LoomEmbed id="031aba6220874a0d838ac246ce538a88" title={t.video} className="mt-7" />

    <section ref={section} tabIndex={-1} aria-labelledby="legende-heading" className={styles.panel}>
      {receipt ? <div>
        <Check aria-hidden className="mb-3 text-autopilot" />
        <h2 id="legende-heading" className="text-2xl font-semibold">{receipt.kind === 'consultation' ? t.requested : receipt.kind === 'alternative' ? 'Better Call Kevin' : t.received}</h2>
        <p className="my-4 max-w-xl leading-relaxed text-neutral-300">{{
          legende: t.call, review: t.review + ' ' + (phone?.formatInternational() || answers.phone) + '.', alternative: t.alternative, consultation: t.followup,
        }[receipt.kind]}</p>
        {receipt.kind === 'legende' && <>
          <a href="https://cal.com/team/empire-internet/audit-empire" className={buttonClass} onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
            event.preventDefault(); setCalendar(true)
          }}>{t.book}<ArrowRight aria-hidden size={17} /></a>
          {calendar && <CalModal informal countryCode="" lead={{ firstName: answers.name, email: answers.email, phone: phone!.number }} onClose={() => setCalendar(false)} />}
        </>}
        {receipt.kind === 'alternative' && <button type="button" disabled={busy} className={buttonClass} onClick={() => void send('consultation')}>{busy ? t.busy : t.consult}</button>}
        {receipt.kind === 'consultation' && receipt.bookingUrl && <a href={receipt.bookingUrl} className={buttonClass}>{t.paidBook}</a>}
      </div> : <form onSubmit={submit}>
        <nav aria-label={lang === 'fr' ? 'Étapes de la candidature' : 'Application steps'} className={styles.steps}>
          {t.steps.map((label, i) => <button key={i} type="button" disabled={busy || i >= step} aria-current={i === step ? 'step' : undefined}
            onClick={() => { setError(undefined); setStep(i) }}>{label}</button>)}
        </nav>
        <h2 id="legende-heading" className={styles.stepTitle}>{t.headings[step]}</h2>
        <fieldset disabled={!ready || busy} className={styles.fields}>
          {step === 0 && <>
            {choices('scope', t.scope, localized(scopes))}
            {question('goal')}
          </>}
          {step === 1 && <>
            {question('obstacle')}
            {question('tried')}
          </>}
          {step === 2 && <>
            <div className="grid gap-5 sm:grid-cols-2">
              <label>{t.name}<input required maxLength={100} autoComplete="name" className={fieldClass} {...bind('name')} /></label>
              <label>{t.email}<input required type="email" maxLength={254} autoComplete="email" className={fieldClass} {...bind('email')} /></label>
            </div>
            <LegendePhoneField lang={lang} country={country} value={answers.phone} invalid={invalidPhone} onInvalid={() => setInvalidPhone(true)}
              onChange={(iso, raw) => { setCountry(iso); setInvalidPhone(false); change('phone', raw) }} />
            {choices('timing', t.timing, localized(timings))}
          </>}
          {step === 3 && <>
            <div className={styles.summary}>
              <strong>{answers.name}</strong><span>{answers.email} · {phone?.formatInternational()}</span>
            </div>
            {!personal && <>
              <label className="block">{t.company}<input required autoComplete="organization" maxLength={140} className={fieldClass} {...bind('company')} /></label>
              {choices('decision', t.decision, localized(decisions))}
              {choices('revenueBand', t.revenue, [...revenueBands.map(band => ({ value: String(band.minimum), label: band[lang] })), { value: 'unknown', label: t.unknown }])}
            </>}
            <p className="text-neutral-300">{t.price}</p>
            <p className="text-sm text-neutral-400">{t.note} <a className="underline" href="/privacy">{t.privacy}</a></p>
          </>}
          <label aria-hidden="true" className="hidden">Website<input tabIndex={-1} autoComplete="off" {...bind('website')} /></label>
          <div className={styles.actions}>
            {step > 0 && <button type="button" className={styles.back} onClick={() => { setError(undefined); setStep(step - 1) }}><ArrowLeft aria-hidden size={16} />{t.back}</button>}
            <button type="submit" className={buttonClass}>{busy ? t.busy : step === 3 ? t.send : t.next}<ArrowRight aria-hidden size={17} /></button>
          </div>
        </fieldset>
      </form>}
      {error && <p role="alert" className="mt-4 text-sm text-red-300">{t[error]}</p>}
    </section>
  </main>
}
