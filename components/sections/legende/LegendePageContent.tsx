'use client'

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { ArrowRight, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import LoomEmbed from '@/components/LoomEmbed'
import { decisions, revenueBands, scopes, timings } from '@/lib/legende'
import { normalizeCandidatePhone } from '@/lib/candidate-phone'
import type { Outcome } from '@/lib/legende-intake'

const CalModal = dynamic(() => import('@/components/YtLeadForm').then(m => m.CalModal), { ssr: false })

const copy = {
  fr: {
    intro: 'Tu veux déléguer ton contenu ? Avec Légende, Kevin et son équipe prennent en charge la stratégie, la production et la publication.',
    video: 'Kevin présente l’accompagnement Légende', steps: ['Ton projet', 'Pour en parler', 'Ta candidature'],
    scope: 'Pour qui veux-tu développer du contenu ?', select: 'Choisir une réponse',
    goal: 'Dans six mois, quel résultat concret aimerais-tu obtenir avec ton contenu ?',
    obstacle: 'Qu’est-ce qui t’empêche d’y arriver aujourd’hui ?',
    tried: 'Qu’as-tu déjà essayé et qu’est-ce que ça a donné ?',
    name: 'Ton nom', email: 'Ton e-mail', phone: 'Ton numéro de téléphone',
    phoneHint: 'Hors de France, ajoute l’indicatif de ton pays.', phoneError: 'Vérifie ton numéro et son indicatif.',
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
    video: 'Kevin introduces the Légende programme', steps: ['Your project', 'Getting in touch', 'Your application'],
    scope: 'Who are you looking to create content for?', select: 'Choose an answer',
    goal: 'Six months from now, what specific result would you like your content to deliver?',
    obstacle: 'What is keeping you from getting there today?', tried: 'What have you already tried, and how did it work out?',
    name: 'Your name', email: 'Your email', phone: 'Your phone number',
    phoneHint: 'Outside France, include your country calling code.', phoneError: 'Check your phone number and country calling code.',
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
const fieldClass = 'mt-2 block w-full rounded-lg border border-white/20 bg-black px-4 py-3 text-white focus:border-autopilot focus:outline-none focus:ring-1 focus:ring-autopilot'
const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-lg bg-autopilot px-5 py-3 font-semibold text-black hover:brightness-110 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-autopilot disabled:opacity-60'
const empty = { scope: '', goal: '', obstacle: '', tried: '', timing: '', name: '', email: '', phone: '', company: '', decision: '', revenueBand: '', website: '' }

export default function LegendePageContent() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(empty)
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

  function bind(key: keyof typeof empty) {
    return { name: key, value: answers[key], onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value
      event.target.setCustomValidity('')
      setAnswers(previous => ({ ...previous, ...(key === 'scope' && value !== previous.scope ? { company: '', revenueBand: '', decision: '' } : {}), [key]: value }))
      setError(undefined)
    } }
  }

  function select(key: 'scope' | 'timing' | 'decision', label: string, options: Record<string, { fr: string; en: string }>) {
    return <label className="block">{label}<select className={fieldClass} required {...bind(key)}>
      <option value="" disabled>{t.select}</option>
      {Object.entries(options).map(([value, text]) => <option key={value} value={value}>{text[lang]}</option>)}
    </select></label>
  }

  async function send(action: 'apply' | 'consultation') {
    if (inFlight.current) return
    inFlight.current = true
    setError(undefined)
    setBusy(true)
    const fields = { ...answers, version: 2, action, phone: normalizeCandidatePhone(answers.phone),
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
    if (step === 1 && !normalizeCandidatePhone(answers.phone)) {
      const input = event.currentTarget.elements.namedItem('phone') as HTMLInputElement
      input.setCustomValidity(t.phoneError)
      input.reportValidity()
      return
    }
    if (step < 2) setStep(step + 1)
    else void send('apply')
  }

  return <main lang={lang} className="mx-auto max-w-3xl px-5 pb-16 pt-28 text-white sm:px-8 md:pt-32">
    <header>
      <p className="text-sm font-semibold text-autopilot">Légende</p>
      <h1 className="mt-2 text-5xl font-bold tracking-tight sm:text-6xl">Work with Kevin</h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">{t.intro}</p>
    </header>
    <LoomEmbed id="031aba6220874a0d838ac246ce538a88" title={t.video} className="mt-7" />

    <section ref={section} tabIndex={-1} aria-labelledby="legende-heading" className="mt-9 scroll-mt-20 border-t border-white/15 pt-8 outline-none">
      {receipt ? <div>
        <Check aria-hidden className="mb-3 text-autopilot" />
        <h2 id="legende-heading" className="text-2xl font-semibold">{receipt.kind === 'consultation' ? t.requested : receipt.kind === 'alternative' ? 'Better Call Kevin' : t.received}</h2>
        <p className="my-4 max-w-xl leading-relaxed text-neutral-300">{{
          legende: t.call, review: t.review + ' ' + answers.phone + '.', alternative: t.alternative, consultation: t.followup,
        }[receipt.kind]}</p>
        {receipt.kind === 'legende' && <>
          <a href="https://cal.com/team/empire-internet/audit-empire" className={buttonClass} onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
            event.preventDefault(); setCalendar(true)
          }}>{t.book}<ArrowRight aria-hidden size={17} /></a>
          {calendar && <CalModal informal countryCode="" lead={{ firstName: answers.name, email: answers.email, phone: normalizeCandidatePhone(answers.phone)! }} onClose={() => setCalendar(false)} />}
        </>}
        {receipt.kind === 'alternative' && <button type="button" disabled={busy} className={buttonClass} onClick={() => void send('consultation')}>{busy ? t.busy : t.consult}</button>}
        {receipt.kind === 'consultation' && receipt.bookingUrl && <a href={receipt.bookingUrl} className={buttonClass}>{t.paidBook}</a>}
      </div> : <form onSubmit={submit}>
        <p className="mb-2 text-sm text-autopilot">{lang === 'fr' ? 'Étape' : 'Step'} {step + 1}/3</p>
        <h2 id="legende-heading" className="mb-6 text-2xl font-semibold">{t.steps[step]}</h2>
        <fieldset disabled={!ready || busy} className="space-y-5">
          {step === 0 && <>
            {select('scope', t.scope, scopes)}
            {(['goal', 'obstacle', 'tried'] as const).map(key => <label key={key} className="block">{t[key]}
              <textarea rows={2} required maxLength={800} className={fieldClass} {...bind(key)} />
            </label>)}
          </>}
          {step === 1 && <>
            <div className="grid gap-5 sm:grid-cols-2">
              <label>{t.name}<input required maxLength={100} autoComplete="name" className={fieldClass} {...bind('name')} /></label>
              <label>{t.email}<input required type="email" maxLength={254} autoComplete="email" className={fieldClass} {...bind('email')} /></label>
            </div>
            <label className="block">{t.phone}
              <input required type="tel" autoComplete="tel" maxLength={32} aria-describedby="legende-tel-hint" className={fieldClass} {...bind('phone')} />
              <span id="legende-tel-hint" className="mt-1 block text-sm text-neutral-400">{t.phoneHint}</span>
            </label>
            {select('timing', t.timing, timings)}
          </>}
          {step === 2 && <>
            <p className="text-neutral-300">{t.price}</p>
            {!personal && <>
              <label className="block">{t.company}<input required autoComplete="organization" maxLength={140} className={fieldClass} {...bind('company')} /></label>
              {select('decision', t.decision, decisions)}
              <label className="block">{t.revenue}<select required className={fieldClass} {...bind('revenueBand')}>
                <option value="" disabled>{t.select}</option>
                {revenueBands.map(band => <option key={band.minimum} value={band.minimum}>{band[lang]}</option>)}
                <option value="unknown">{t.unknown}</option>
              </select></label>
            </>}
            <p className="text-sm text-neutral-400">{t.note} <a className="underline" href="/privacy">{t.privacy}</a></p>
          </>}
          <label aria-hidden="true" className="hidden">Website<input tabIndex={-1} autoComplete="off" {...bind('website')} /></label>
          <div className="flex flex-wrap items-center gap-5">
            <button type="submit" className={buttonClass}>{busy ? t.busy : step === 2 ? t.send : t.next}<ArrowRight aria-hidden size={17} /></button>
            {step > 0 && <button type="button" className="py-2 text-neutral-300 underline" onClick={() => { setError(undefined); setStep(step - 1) }}>{t.back}</button>}
          </div>
        </fieldset>
      </form>}
      {error && <p role="alert" className="mt-4 text-sm text-red-300">{t[error]}</p>}
    </section>
  </main>
}
