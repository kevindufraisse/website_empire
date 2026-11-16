'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import LoomEmbed from '@/components/LoomEmbed'
import { revenueBands, requestKind, type RevenueBand, type RequestKind } from '@/lib/legende'

const copy = {
  fr: {
    intro: 'Tu veux déléguer ton contenu ? Avec Légende, Kevin et son équipe prennent en charge la stratégie, la production et la publication.',
    price: 'L’accompagnement Légende coûte 4 000 € par mois pendant 12 mois, soit 48 000 € sur l’année.',
    video: 'Kevin présente l’accompagnement Légende',
    question: 'Quel chiffre d’affaires HT ton entreprise a-t-elle réalisé sur les 12 derniers mois ?',
    alternative: 'Pour un besoin ponctuel, réserve 30 minutes de conseil individuel avec Kevin à 500 €. Tu viens avec une question précise sur ton contenu.',
    interest: 'Cette séance m’intéresse', dossier: 'Ta candidature', enquiry: 'Ta demande de conseil',
    name: 'Ton nom', email: 'Ton e-mail',
    project: 'Quelle est ton activité et que veux-tu obtenir avec ton contenu ?',
    topic: 'Quelle question veux-tu travailler avec Kevin ?',
    submit: 'Envoyer ma candidature', consult: 'Demander la séance à 500 €', busy: 'Envoi en cours…',
    note: 'L’équipe te répondra à cette adresse au sujet de ta demande.', privacy: 'Confidentialité',
    received: 'Candidature reçue', followup: 'Kevin et son équipe vont lire ton projet. S’il correspond à l’accompagnement Légende, ils te proposeront un échange par e-mail.',
    requested: 'Demande de conseil reçue', emailBooking: 'L’équipe te recontactera par e-mail pour organiser ta séance de 30 minutes à 500 €.',
    booking: 'Tu peux maintenant réserver ta séance de 30 minutes à 500 €.', book: 'Réserver ma séance',
    error: 'L’envoi a échoué. Tes réponses sont conservées. Tu peux réessayer.',
    invalid: 'Vérifie ton nom, ton e-mail et ta réponse avant de réessayer.',
    limit: 'Plusieurs demandes ont déjà été envoyées. Réessaie dans 15 minutes.',
  },
  en: {
    intro: 'Want to hand over content production? With Légende, Kevin and his team handle strategy, production and publishing.',
    price: 'Légende costs €4,000 a month for 12 months, or €48,000 for the year.',
    video: 'Kevin introduces the Légende programme',
    question: 'What was your company’s revenue, excluding tax, over the last 12 months?',
    alternative: 'For a specific question about your content, you can book a 30-minute one-to-one consultation with Kevin for €500.',
    interest: 'I’m interested in this session', dossier: 'Your application', enquiry: 'Your consultation request',
    name: 'Your name', email: 'Your email',
    project: 'What does your business do, and what do you want your content to achieve?',
    topic: 'What question would you like to work through with Kevin?',
    submit: 'Send my application', consult: 'Request the €500 session', busy: 'Sending…',
    note: 'The team will reply to this address about your request.', privacy: 'Privacy',
    received: 'Application received', followup: 'Kevin and his team will review your project. If Légende fits your needs, they’ll email you to arrange a conversation.',
    requested: 'Consultation request received', emailBooking: 'The team will email you to arrange your 30-minute, €500 session.',
    booking: 'You can now book your 30-minute, €500 session.', book: 'Book my session',
    error: 'We couldn’t confirm delivery. Your answers are still here. Please try again.',
    invalid: 'Check your name, email and response before trying again.',
    limit: 'Several requests have already been sent. Please try again in 15 minutes.',
  },
}

const fieldClass = 'mt-2 block w-full rounded-lg border border-white/20 bg-black px-4 py-3 text-white focus:border-autopilot focus:outline-none focus:ring-1 focus:ring-autopilot'
const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-lg bg-autopilot px-5 py-3 font-semibold text-black hover:brightness-110 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-autopilot disabled:opacity-60'

export default function LegendePageContent({ loomId }: { loomId?: string }) {
  const { lang } = useLanguage()
  const t = copy[lang]
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const [revenueBand, setRevenueBand] = useState<RevenueBand>()
  const [interested, setInterested] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<'error' | 'invalid' | 'limit'>()
  const [receipt, setReceipt] = useState<{ kind: RequestKind; bookingUrl?: string }>()
  const lastRequest = useRef({ values: '', id: '' })
  const kind = revenueBand && requestKind(revenueBand)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!revenueBand || !kind || (kind === 'consultation' && !interested) || busy) return
    const data = new FormData(event.currentTarget)
    const fields = { name: data.get('name'), email: data.get('email'), project: data.get('project'), website: data.get('website'), revenueBand: revenueBand.minimum, kind }
    const values = JSON.stringify(fields)
    setError(undefined)
    setBusy(true)
    try {
      if (lastRequest.current.values !== values) lastRequest.current = { values, id: crypto.randomUUID() }
      const response = await fetch('/api/legende/apply', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, submissionId: lastRequest.current.id }),
      })
      if (!response.ok) {
        setError(response.status === 429 ? 'limit' : response.status === 400 ? 'invalid' : 'error')
        return
      }
      const result = await response.json()
      if (result.success !== true || result.kind !== kind) throw new Error('delivery_failed')
      setReceipt({ kind: result.kind, bookingUrl: result.bookingUrl })
    } catch {
      setError('error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main lang={lang} className="mx-auto max-w-3xl px-5 pb-16 pt-28 text-white sm:px-8 md:pt-32">
      <header>
        <p className="text-sm font-semibold text-autopilot">Légende</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight sm:text-6xl">Work with Kevin</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">{t.intro}</p>
      </header>

      {loomId && <LoomEmbed id={loomId} title={t.video} className="mt-7" />}

      <section className="mt-9 border-t border-white/15 pt-8">
        {receipt ? (
          <div role="status">
            <Check aria-hidden className="mb-3 text-autopilot" />
            <h2 className="text-2xl font-semibold">{receipt.kind === 'legende' ? t.received : t.requested}</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-neutral-300">
              {receipt.kind === 'legende' ? t.followup : receipt.bookingUrl ? t.booking : t.emailBooking}
            </p>
            {receipt.kind === 'consultation' && receipt.bookingUrl && <a href={receipt.bookingUrl} className={buttonClass + ' mt-5'}>{t.book}<ArrowRight size={17} /></a>}
          </div>
        ) : (
          <form onSubmit={submit}>
            <fieldset disabled={!ready || busy}>
              <legend className="text-xl font-semibold tracking-tight sm:text-2xl">{t.question}</legend>
              <div className="mt-5 space-y-2">
                {revenueBands.map(band => (
                  <label key={band.minimum} className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 ${revenueBand === band ? 'border-autopilot bg-autopilot/10' : 'border-white/20 hover:border-white/40'}`}>
                    <input type="radio" name="revenueBand" value={band.minimum} required checked={revenueBand === band}
                      className="mt-1 accent-autopilot"
                      onChange={() => { setRevenueBand(band); setInterested(false); setError(undefined) }} />
                    <span>{band[lang]}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {kind === 'consultation' && (
              <div className="mt-7 rounded-xl border border-autopilot/40 p-5">
                <h2 className="text-xl font-bold">Better Call Kevin</h2>
                <p className="mb-4 mt-2 leading-relaxed text-neutral-300">{t.alternative}</p>
                {!interested && <button type="button" className={buttonClass} onClick={() => setInterested(true)}>{t.interest}<ArrowRight size={17} /></button>}
              </div>
            )}

            {(kind === 'legende' || interested) && (
              <fieldset key={kind} disabled={busy} className="mt-8 space-y-5">
                <legend className="text-xl font-semibold">{kind === 'legende' ? t.dossier : t.enquiry}</legend>
                {kind === 'legende' && <p className="text-neutral-300">{t.price}</p>}
                <div className="grid gap-5 sm:grid-cols-2">
                  <label>{t.name}<input className={fieldClass} name="name" autoComplete="name" required maxLength={100} /></label>
                  <label>{t.email}<input className={fieldClass} name="email" type="email" autoComplete="email" required maxLength={254} /></label>
                </div>
                <label className="block">{kind === 'legende' ? t.project : t.topic}
                  <textarea className={fieldClass} name="project" rows={3} required maxLength={1200} />
                </label>
                <label aria-hidden="true" className="hidden">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
                <p className="text-sm text-neutral-400">{t.note} <a className="underline" href="/privacy">{t.privacy}</a></p>
                {error && <p role="alert" className="text-sm text-red-300">{t[error]}</p>}
                <button type="submit" disabled={busy} className={buttonClass}>{busy ? t.busy : kind === 'legende' ? t.submit : t.consult}<ArrowRight aria-hidden size={17} /></button>
              </fieldset>
            )}
          </form>
        )}
      </section>
    </main>
  )
}
