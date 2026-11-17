'use client'

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import PartnerFinalCta from '@/components/sections/PartnerFinalCta'
import { Reveal } from './LegendeWeekScroll'
import LegendeMarketing, { INTRO_URL, PLACES_LEFT } from './LegendeMarketing'
import { TRIAL_URL } from '@/lib/startTrial'
import { budgets, decisions, revenueBands, scopes, timings } from '@/lib/legende'
import { countryPhone } from '@/lib/legende-phone'
import type { CountryCode } from 'libphonenumber-js/min'
import LegendePhoneField from './LegendePhoneField'
import styles from './legende-form.module.css'
import type { Outcome } from '@/lib/legende-intake'

const CalModal = dynamic(() => import('@/components/YtLeadForm').then(m => m.CalModal), { ssr: false })


const copy = {
  fr: {
    apply: 'Candidater', applyNote: 'Chaque candidature est lue personnellement', solo: 'Continuer seul, gratuitement',
    advisory: 'Réserver une session avec Kevin', heroStat: ['700M+', 'vues générées pour nos clients'],
    faqLabel: 'Questions', faqTitle: 'Questions fréquentes',
    faq: [
      ['Pour qui c’est ?', 'Pour les dirigeants, fondateurs et experts d’une entreprise qui fait au moins 300 000 € de chiffre d’affaires par an, qui ont des choses à dire et pas le temps de les publier.'],
      ['Combien de temps ça me prend ?', 'Une heure par semaine, maximum : ton interview. Le reste, on s’en occupe.'],
      ['Avec qui je travaille ?', 'Avec Kevin, sur l’offre à 4 500 € : c’est lui qui t’interviewe 4 fois par mois et qui retravaille ton offre. Avec un Head of Content formé par Kevin, sur l’offre de 1 000 à 3 000 €. Dans les deux cas, l’équipe Empire produit, publie et suit tes résultats.'],
      ['Vous tournez en studio ?', 'Non, et c’est voulu. Tes vidéos sont des lives filmés à l’iPhone avec des écouteurs. On l’a testé sur des milliers de posts : ce format performe bien mieux qu’une production de studio.'],
      ['Qu’est-ce que vous publiez pour moi ?', 'Au moins une publication par jour sur 7 réseaux (LinkedIn, Instagram, TikTok, YouTube, Facebook, X et Threads), et des vidéos YouTube longues. Les sujets, on les crée pour toi.'],
      ['Combien ça coûte ?', '4 500 € par mois avec Kevin, de 1 000 à 3 000 € par mois avec un Head of Content selon ton volume, pendant douze mois. Avec Kevin, il reste ' + PLACES_LEFT + ' places sur 10 cette année.'],
      ['Et si je veux d’abord un avis de Kevin ?', 'Tu peux réserver une session de conseil avec lui sur Intro, sans candidature. Vous travaillez directement sur ton blocage.'],
      ['Pourquoi pas simplement l’abonnement Empire ?', 'Si tu veux garder la main et que 20 minutes par semaine te vont, l’abonnement suffit, et il coûte bien moins cher. Le 1-to-1, c’est quand tu ne veux plus t’en occuper du tout.'],
    ] as [string, string][],
    notReady: 'Tu préfères garder la main ? Commence seul avec Empire.',
    formLabel: 'Candidature',
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
    alternative: 'Pour ton projet, le plus utile est une session de conseil avec Kevin. Tu la réserves directement sur Intro, et vous travaillez ensemble sur le blocage que tu viens de décrire.', alternativeTitle: 'Une session avec Kevin',
    consult: 'Demander la séance à 500 €', requested: 'Demande de séance reçue',
    followup: 'L’équipe te recontactera pour organiser tes 30 minutes avec Kevin.', paidBook: 'Réserver ma séance à 500 €',
    error: 'L’envoi a échoué. Tes réponses sont conservées. Tu peux réessayer.',
    limit: 'Plusieurs demandes ont déjà été envoyées. Réessaie dans 15 minutes.',
  },
  en: {
    apply: 'Apply', applyNote: 'Every application is read personally', solo: 'Continue on your own, free',
    advisory: 'Book a session with Kevin', heroStat: ['700M+', 'views generated for our clients'],
    faqLabel: 'Questions', faqTitle: 'Frequently asked questions',
    faq: [
      ['Who is it for?', 'For leaders, founders and experts whose company makes at least €300,000 in revenue a year, who have things to say and no time to publish them.'],
      ['How much of my time does it take?', 'One hour a week, at most: your interview. We handle the rest.'],
      ['Who will I work with?', 'With Kevin on the €4,500 plan: he interviews you 4 times a month and reworks your offer. With a Head of Content trained by Kevin on the €1,000 to €3,000 plan. Either way, the Empire team produces, publishes and tracks your results.'],
      ['Do you shoot in a studio?', 'No, on purpose. Your videos are live streams shot on an iPhone with earphones. We tested it on thousands of posts: this format performs far better than a studio production.'],
      ['What do you publish for me?', 'At least one post a day on 7 networks (LinkedIn, Instagram, TikTok, YouTube, Facebook, X and Threads), plus long-form YouTube videos. We create the topics for you.'],
      ['How much does it cost?', '€4,500 a month with Kevin, €1,000 to €3,000 a month with a Head of Content depending on your volume, for twelve months. With Kevin, ' + PLACES_LEFT + ' of 10 spots are left this year.'],
      ['What if I want Kevin’s advice first?', 'You can book an advisory session with him on Intro, no application needed. You work directly on what’s blocking you.'],
      ['Why not just the Empire subscription?', 'If you want to stay hands-on and 20 minutes a week works for you, the subscription is enough, and it costs far less. 1-to-1 is for when you don’t want to deal with it at all.'],
    ] as [string, string][],
    notReady: 'Prefer to stay hands-on? Start on your own with Empire.',
    formLabel: 'Application',
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
    alternative: 'For your project, the most useful step is an advisory session with Kevin. You book it directly on Intro and work together on the obstacle you just described.', alternativeTitle: 'A session with Kevin',
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
    <LegendeMarketing lang={lang} />

    <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8 md:mt-20" aria-labelledby="legende-faq">
      <Reveal>
      <p className={styles.label}><span className="h-1.5 w-1.5 rounded-full bg-autopilot" aria-hidden />{t.faqLabel}</p>
      <h2 id="legende-faq" className={styles.sectionTitle}>{t.faqTitle}</h2>
      <div className="mt-8 border-t border-white/10">
        {t.faq.map(([q, a]) => <details key={q} className={styles.faq}>
          <summary>{q}<span aria-hidden>+</span></summary>
          <p>{a}</p>
        </details>)}
      </div>
      </Reveal>
    </section>

    <div id="candidature" className="mx-auto mt-16 max-w-3xl scroll-mt-20 px-5 sm:px-8 md:mt-20">
    <p className={styles.label}><span className="h-1.5 w-1.5 rounded-full bg-autopilot" aria-hidden />{t.formLabel}</p>
    <section ref={section} tabIndex={-1} aria-labelledby="legende-heading" className={styles.panel}>
      {receipt ? <div>
        <span className={styles.successIcon}><Check aria-hidden size={22} strokeWidth={2.5} /></span>
        <h2 id="legende-heading" className="text-2xl font-semibold">{receipt.kind === 'consultation' ? t.requested : receipt.kind === 'alternative' ? t.alternativeTitle : t.received}</h2>
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
        {receipt.kind === 'alternative' && <a href={INTRO_URL} target="_blank" rel="noopener" className={buttonClass}>{t.advisory}<ArrowRight aria-hidden size={17} /></a>}
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
    <p className="mt-5 text-center text-sm text-neutral-400">{t.notReady} <a href={TRIAL_URL} className="font-semibold text-white underline underline-offset-4">{t.solo}</a></p>
    <p className="mt-2 text-center text-sm text-neutral-400"><a href={INTRO_URL} target="_blank" rel="noopener" className="font-semibold text-white underline underline-offset-4">{t.advisory}</a></p>
    </div>
    <div className="mt-16 md:mt-20"><PartnerFinalCta /></div>
    <footer className="mt-10 overflow-hidden px-5 sm:px-8">
      <div className="mx-auto flex max-w-5xl justify-between border-t border-[white/10 py-4 text-[12px] text-neutral-500">
        <span>© Empire Internet</span><a href="/privacy" className="underline">{t.privacy}</a>
      </div>
      <p aria-hidden="true" className={styles.wordmark}>1-to-1</p>
    </footer>
  </main>
}
