'use client'

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { ArrowDown, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import LoomEmbed from '@/components/LoomEmbed'
import { budgets, decisions, revenueBands, scopes, timings } from '@/lib/legende'
import { countryPhone } from '@/lib/legende-phone'
import type { CountryCode } from 'libphonenumber-js/min'
import LegendePhoneField from './LegendePhoneField'
import styles from './legende-form.module.css'
import type { Outcome } from '@/lib/legende-intake'

const CalModal = dynamic(() => import('@/components/YtLeadForm').then(m => m.CalModal), { ssr: false })

const copy = {
  fr: {
    badge: 'Sur candidature uniquement', studio: 'Personal branding studio',
    title: ['Toi', '= des milliers de', 'leads', 'par an.'], earbuds: 'des écouteurs', phone: 'un téléphone',
    intro: 'On construit des réputations. Du positionnement à la publication, chaque décision est pensée pour te rendre mémorable, crédible et impossible à ignorer. Kevin et son équipe créent ton contenu sur tous les réseaux. Toi, tu parles.',
    apply: 'Candidater', applyNote: 'Chaque candidature est lue personnellement', watch: 'Regarder la vidéo',
    video: 'Regarde la vidéo de Kevin',
    servicesLabel: 'Le studio', servicesTitle: 'Ce qu’on construit pour toi',
    services: [
      ['Positionnement', ['Angle', 'Message', 'Récit']],
      ['Création sur tous les réseaux', ['LinkedIn', 'Instagram', 'TikTok', 'YouTube']],
      ['Publication', ['Calendrier', 'Formats', 'Rythme']],
      ['Acquisition', ['Leads', 'Rendez-vous', 'Clients']],
    ] as [string, string[]][],
    processLabel: 'Le process', processTitle: 'Comment on construit ton influence',
    ready: 'Prêt à construire quelque chose qui mérite d’être suivi ?',
    faqLabel: 'Questions', faqTitle: 'Questions fréquentes',
    faq: [
      ['Pour qui est Légende ?', 'Pour les dirigeants, fondateurs et experts qui veulent que leur nom travaille pour leur entreprise, sans y passer leurs semaines.'],
      ['Combien de temps ça me prend ?', 'Environ une heure par mois. Tu parles, on s’occupe de la stratégie, de la création et de la publication.'],
      ['Sur quels réseaux ?', 'LinkedIn, Instagram, TikTok et YouTube, selon là où se trouvent tes clients.'],
      ['Combien ça coûte ?', 'On en parle pendant l’appel, si ton profil est retenu. L’accompagnement dure douze mois.'],
    ] as [string, string][],
    formLabel: 'Candidature',
    process: [
      ['Tu candidates', 'Présente ton entreprise, tes résultats et tes ambitions.'],
      ['Kevin étudie ton dossier', 'Chaque candidature est lue, une par une.'],
      ['Tu reçois une réponse personnelle', 'Si ton profil est qualifié pour travailler avec Kevin.'],
    ],
    formTitle: 'Ta candidature', stepOf: (a: number, b: number) => `Étape ${a} sur ${b}`,
    steps: ['Projet', 'Expérience', 'Contact', 'Envoi'],
    headings: ['Ton ambition', 'Ce que tu as déjà construit', 'Comment te joindre ?', 'Finaliser ta candidature'],
    examples: { goal: 'Ex. : 50 rendez-vous qualifiés par mois, devenir la référence de mon marché.', obstacle: 'Ex. : je sais quoi dire, mais filmer me prend trop de temps.', tried: 'Ex. : 3 cabinets, 40 salariés, 2 M€ de CA, une communauté de 20 000 personnes…' },
    scope: 'Pour qui veux-tu développer du contenu ?',
    goal: 'Dans un an, que doit t’avoir rapporté ton contenu ?',
    obstacle: 'Qu’est-ce qui t’empêche d’y arriver aujourd’hui ?',
    tried: 'Qu’as-tu déjà construit ? Ton entreprise, tes résultats, ce dont tu es le plus fier.',
    name: 'Ton nom', email: 'Ton e-mail',
    timing: 'Quand aimerais-tu démarrer ?', decision: 'Qui prend la décision pour cet accompagnement ?',
    company: 'Nom de l’entreprise', revenue: 'Quel chiffre d’affaires HT cette entreprise a-t-elle réalisé sur les 12 derniers mois ?',
    unknown: 'Je ne connais pas ce chiffre',
    budget: 'Combien es-tu prêt à investir pour régler définitivement ton problème de contenu ?',
    note: 'En envoyant ta candidature, tu acceptes que l’équipe Empire te recontacte au sujet de ton projet.',
    privacy: 'Confidentialité', next: 'Continuer', back: 'Retour', send: 'Envoyer ma candidature', busy: 'Envoi en cours…',
    received: 'Ta candidature est retenue', call: 'Ton profil correspond à ce que Kevin recherche. Choisis un créneau de 45 minutes pour en parler avec l’équipe.', book: 'Réserver mon appel',
    review: 'Kevin et son équipe vont lire tes réponses. Si un échange est pertinent, ils pourront te rappeler au',
    alternative: 'Pour ton projet, Kevin te propose une séance de conseil individuelle de 30 minutes à 500 €. Tu peux y travailler le blocage que tu viens de décrire.',
    consult: 'Demander la séance à 500 €', requested: 'Demande de séance reçue',
    followup: 'L’équipe te recontactera pour organiser tes 30 minutes avec Kevin.', paidBook: 'Réserver ma séance à 500 €',
    error: 'L’envoi a échoué. Tes réponses sont conservées. Tu peux réessayer.',
    limit: 'Plusieurs demandes ont déjà été envoyées. Réessaie dans 15 minutes.',
  },
  en: {
    badge: 'Application only', studio: 'Personal branding studio',
    title: ['You', '= thousands of', 'leads', 'a year.'], earbuds: 'earbuds', phone: 'a phone',
    intro: 'We build reputations. From positioning to publishing, every decision is made to make you memorable, trusted and impossible to ignore. Kevin and his team create your content on every network. You just talk.',
    apply: 'Apply', applyNote: 'Every application is read personally', watch: 'Watch the video',
    video: 'Watch Kevin’s video',
    servicesLabel: 'The studio', servicesTitle: 'What we build for you',
    services: [
      ['Positioning', ['Angle', 'Message', 'Story']],
      ['Content on every network', ['LinkedIn', 'Instagram', 'TikTok', 'YouTube']],
      ['Publishing', ['Calendar', 'Formats', 'Cadence']],
      ['Acquisition', ['Leads', 'Meetings', 'Clients']],
    ] as [string, string[]][],
    processLabel: 'The process', processTitle: 'How we build your influence',
    ready: 'Ready to build something worth following?',
    faqLabel: 'Questions', faqTitle: 'Frequently asked questions',
    faq: [
      ['Who is Légende for?', 'For leaders, founders and experts who want their name to work for their business, without spending their weeks on it.'],
      ['How much of my time does it take?', 'About one hour a month. You talk; we handle strategy, creation and publishing.'],
      ['Which networks?', 'LinkedIn, Instagram, TikTok and YouTube, depending on where your clients are.'],
      ['How much does it cost?', 'We discuss it on the call, if your profile is shortlisted. The programme runs for twelve months.'],
    ] as [string, string][],
    formLabel: 'Application',
    process: [
      ['You apply', 'Tell us about your business, your results and your ambitions.'],
      ['Kevin reviews it', 'Every application is read, one by one.'],
      ['You get a personal reply', 'If you qualify to work with Kevin.'],
    ],
    formTitle: 'Your application', stepOf: (a: number, b: number) => `Step ${a} of ${b}`,
    steps: ['Project', 'Experience', 'Contact', 'Submit'],
    headings: ['Your ambition', 'What you’ve built', 'How can we reach you?', 'Finish your application'],
    examples: { goal: 'For example: 50 qualified meetings a month, becoming the reference in my market.', obstacle: 'For example, I have ideas but filming takes too long.', tried: 'For example: 3 offices, 40 staff, €2M revenue, a community of 20,000…' },
    scope: 'Who are you looking to create content for?',
    goal: 'A year from now, what should your content have brought you?',
    obstacle: 'What is keeping you from getting there today?', tried: 'What have you built so far? Your company, your results, what you’re proudest of.',
    name: 'Your name', email: 'Your email',
    timing: 'When would you like to start?', decision: 'Who decides whether to go ahead?',
    company: 'Company name', revenue: 'What was this company’s revenue, excluding tax, over the last 12 months?',
    unknown: 'I don’t know this figure',
    budget: 'How much are you ready to invest to solve your content problem for good?',
    note: 'By submitting your application, you agree that the Empire team may contact you about your project.',
    privacy: 'Privacy', next: 'Continue', back: 'Back', send: 'Submit my application', busy: 'Sending…',
    received: 'Your application is shortlisted', call: 'Your profile matches what Kevin is looking for. Pick a 45-minute slot to talk it through with the team.', book: 'Book my call',
    review: 'Kevin and his team will review your answers. If a call would be helpful, they can reach you at',
    alternative: 'For your project, Kevin offers a 30-minute one-to-one consultation for €500. You can focus on the obstacle you just described.',
    consult: 'Request the €500 session', requested: 'Consultation request received',
    followup: 'The team will get in touch to arrange your 30 minutes with Kevin.', paidBook: 'Book my €500 session',
    error: 'We couldn’t confirm delivery. Your answers are still here. Please try again.',
    limit: 'Several requests have already been sent. Please try again in 15 minutes.',
  },
}
const uuid = () => typeof crypto.randomUUID === 'function' ? crypto.randomUUID()
  : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16))
const fieldClass = styles.field
const buttonClass = styles.primary
const empty = { scope: '', goal: '', obstacle: '', tried: '', timing: '', name: '', email: '', phone: '', company: '', decision: '', revenueBand: '', budget: '', website: '' }

function Earbuds({ label }: { label: string }) {
  return <svg role="img" aria-label={label} viewBox="0 0 64 64" className="h-[1em] w-[1em] shrink-0">
    <defs>
      <linearGradient id="earbud-shell" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#d9d6cf" />
      </linearGradient>
    </defs>
    {[{ x: 4, flip: false }, { x: 34, flip: true }].map(({ x, flip }) => <g key={x} transform={flip ? `translate(${x + 26} 0) scale(-1 1)` : `translate(${x} 0)`}>
      <ellipse cx="11" cy="17" rx="10" ry="11" fill="url(#earbud-shell)" stroke="#b7b0a2" strokeWidth="1" />
      <ellipse cx="7.5" cy="15" rx="4" ry="4.5" fill="#2b2d31" />
      <rect x="15" y="21" width="7" height="34" rx="3.5" fill="url(#earbud-shell)" stroke="#b7b0a2" strokeWidth="1" />
      <rect x="15.5" y="50" width="6" height="4" rx="2" fill="#9ea2a8" />
    </g>)}
  </svg>
}

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

  function choices(key: 'scope' | 'timing' | 'decision' | 'revenueBand' | 'budget', label: string, options: { value: string; label: string }[]) {
    return <fieldset>
      <legend>{label}</legend>
      <div className={styles.choices + (key === 'revenueBand' || key === 'budget' ? ' ' + styles.compact : '')}>
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
      if (lastRequest.current.values !== values) lastRequest.current = { values, id: uuid() }
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

  return <main lang={lang} className={styles.page}>
    <header className="mx-auto max-w-5xl px-5 pt-16 sm:px-8 md:pt-24">
      <p className={styles.label}><span className="h-1.5 w-1.5 rounded-full bg-autopilot" aria-hidden />Légende · {t.studio} · {t.badge.toLowerCase()}</p>
      <h1 className={styles.display}>
        <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {t.title[0]}<span className="text-neutral-600">+</span><Earbuds label={t.earbuds} /><span className="text-neutral-600">+</span><span role="img" aria-label={t.phone}>📱</span>
        </span>
        <span className="block">{t.title[1]} <em>{t.title[2]}</em> {t.title[3]}</span>
      </h1>
      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <p className="max-w-xl text-[17px] leading-relaxed text-neutral-300">{t.intro}</p>
        <div className="flex flex-wrap items-center gap-3">
          <a href="#candidature" className={styles.pill}>{t.apply}<ArrowRight aria-hidden size={15} /></a>
          <a href="#video" className={styles.ghost}>{t.watch}<ArrowDown aria-hidden size={15} /></a>
        </div>
      </div>
    </header>

    <div id="video" className="mx-auto mt-14 max-w-5xl scroll-mt-20 px-5 sm:px-8">
      <LoomEmbed facade id="031aba6220874a0d838ac246ce538a88" title={t.video} />
      <p className="mt-3 text-[13px] text-neutral-500">{t.applyNote}</p>
    </div>

    <section className="mx-auto mt-24 max-w-5xl px-5 sm:px-8" aria-labelledby="legende-services">
      <p className={styles.label}><span className="h-1.5 w-1.5 rounded-full bg-autopilot" aria-hidden />{t.servicesLabel}</p>
      <h2 id="legende-services" className={styles.sectionTitle}>{t.servicesTitle}</h2>
      <ul className="mt-8 border-t border-[white/10">
        {t.services.map(([name, tags]) => <li key={name} className="flex flex-col gap-3 border-b border-[white/10 py-5 sm:flex-row sm:items-center sm:justify-between">
          <span className={styles.serviceName}>{name}</span>
          <span className="flex flex-wrap gap-1.5">{tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}</span>
        </li>)}
      </ul>
    </section>

    <section className="mx-auto mt-24 max-w-5xl px-5 sm:px-8" aria-labelledby="legende-process">
      <p className={styles.label}><span className="h-1.5 w-1.5 rounded-full bg-autopilot" aria-hidden />{t.processLabel}</p>
      <h2 id="legende-process" className={styles.sectionTitle}>{t.processTitle}</h2>
      <ol className="mt-8 grid gap-8 md:grid-cols-3">
        {t.process.map(([title, body], i) => <li key={title} className="border-t border-[white/10 pt-5">
          <span className={styles.number}>0{i + 1}</span>
          <h3 className="mt-3 text-[16px] font-semibold">{title}</h3>
          <p className="mt-1 text-[15px] leading-relaxed text-neutral-400">{body}</p>
        </li>)}
      </ol>
      <div className="mt-12 flex flex-col gap-4 border-y border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-semibold">{t.ready}</p>
        <a href="#candidature" className={styles.pill}>{t.apply}<ArrowRight aria-hidden size={15} /></a>
      </div>
    </section>

    <section className="mx-auto mt-24 max-w-5xl px-5 sm:px-8" aria-labelledby="legende-faq">
      <p className={styles.label}><span className="h-1.5 w-1.5 rounded-full bg-autopilot" aria-hidden />{t.faqLabel}</p>
      <h2 id="legende-faq" className={styles.sectionTitle}>{t.faqTitle}</h2>
      <div className="mt-8 border-t border-white/10">
        {t.faq.map(([q, a]) => <details key={q} className={styles.faq}>
          <summary>{q}<span aria-hidden>+</span></summary>
          <p>{a}</p>
        </details>)}
      </div>
    </section>

    <div id="candidature" className="mx-auto mt-24 max-w-3xl scroll-mt-20 px-5 sm:px-8">
    <p className={styles.label}><span className="h-1.5 w-1.5 rounded-full bg-autopilot" aria-hidden />{t.formLabel}</p>
    <section ref={section} tabIndex={-1} aria-labelledby="legende-heading" className={styles.panel}>
      {receipt ? <div>
        <span className={styles.successIcon}><Check aria-hidden size={22} strokeWidth={2.5} /></span>
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
        <div className={styles.formHead}>
          <span>{t.formTitle}</span>
          <span aria-live="polite">{t.stepOf(step + 1, t.steps.length)}</span>
        </div>
        <nav aria-label={lang === 'fr' ? 'Étapes de la candidature' : 'Application steps'} className={styles.steps}>
          {t.steps.map((label, i) => <button key={i} type="button" disabled={busy || i >= step} aria-current={i === step ? 'step' : undefined}
            data-done={i < step || undefined} onClick={() => { setError(undefined); setStep(i) }}>
            <span className={styles.stepDot} aria-hidden>{i < step ? <Check size={12} strokeWidth={3} /> : i + 1}</span>{label}
          </button>)}
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
              {choices('revenueBand', t.revenue, [...revenueBands.map(band => ({ value: String(band.minimum), label: band[lang].replace(/(\d) (?=\d|€|million)/g, '$1\u00a0') })), { value: 'unknown', label: t.unknown }])}
            </>}
            {choices('budget', t.budget, localized(budgets).map(o => ({ ...o, label: o.label.replace(/(\d) (?=\d|€)/g, '$1\u00a0') })))}
            <p className="text-sm text-neutral-500">{t.note} <a className="underline" href="/privacy">{t.privacy}</a></p>
          </>}
          <label aria-hidden="true" className={styles.trap}>Website<input tabIndex={-1} autoComplete="off" {...bind('website')} /></label>
          <div className={styles.actions}>
            {step > 0 && <button type="button" className={styles.back} onClick={() => { setError(undefined); setStep(step - 1) }}><ArrowLeft aria-hidden size={16} />{t.back}</button>}
            <button type="submit" className={buttonClass}>{busy ? t.busy : step === 3 ? t.send : t.next}<ArrowRight aria-hidden size={17} /></button>
          </div>
        </fieldset>
      </form>}
      {error && <p role="alert" className="mt-4 text-sm text-red-300">{t[error]}</p>}
    </section>
    </div>
    <footer className="mt-28 overflow-hidden px-5 sm:px-8">
      <div className="mx-auto flex max-w-5xl justify-between border-t border-[white/10 py-4 text-[12px] text-neutral-500">
        <span>© Empire Internet</span><a href="/privacy" className="underline">{t.privacy}</a>
      </div>
      <p aria-hidden="true" className={styles.wordmark}>Légende</p>
    </footer>
  </main>
}
