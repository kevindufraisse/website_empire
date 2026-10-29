'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { ArrowRight, Check, GraduationCap, UserRound } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getPartnerFestivalPricing } from '@/lib/partner-festival-pricing'
import { trackAmplitude } from '@/lib/amplitude'
import glass from '@/components/pricing/pricing.module.css'
import { ORDER_CTA_SECONDARY, ORDER_LABEL, ORDER_TAG } from '@/lib/orderStyles'

/**
 * Les options de /tarifs (29 octobre 2026), à ajouter à une formule comme dans
 * un panier :
 *  - le bootcamp Academy, au prix du jour de la grille de la semaine, payé à
 *    part sur /join/academy?offer=bootcamp ;
 *  - un expert Empire Partners, 500 €/mois réglés avec l'expert : sur demande,
 *    rien n'est payé en ligne. La demande part à Marc (via /api/expert-request)
 *    et l'expert contacte le client en privé sous 48 h.
 */

const EXPERT_MONTHLY_EUROS = 500
// Le paiement du bootcamp seul, au prix de la grille de la semaine.
const BOOTCAMP_CHECKOUT_URL = 'https://app.empire-internet.com/join/academy?offer=bootcamp'

type Spots = { total: number | null; left: number | null }

export default function OptionsPanel({ plan }: { plan: string }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const bootcampEuros = getPartnerFestivalPricing().bootcampPrice
  const [spots, setSpots] = useState<Spots | null>(null)
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<null | { waitlist: boolean }>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/expert-request')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (!cancelled && data) setSpots(data) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const full = spots?.left === 0
  const spotsLine = full
    ? (fr ? 'Plus de place ce mois-ci : liste d’attente.' : 'No spot left this month: waiting list.')
    : typeof spots?.left === 'number'
      ? (fr ? `${spots.left} place${spots.left > 1 ? 's' : ''} ce mois-ci.` : `${spots.left} spot${spots.left > 1 ? 's' : ''} this month.`)
      : ''

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sending) return
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email') || '').trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(fr ? 'Entre un email valide.' : 'Enter a valid email.')
      return
    }
    setError('')
    setSending(true)
    try {
      const res = await fetch('/api/expert-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: form.get('name'), phone: form.get('phone'), plan }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || '')
      trackAmplitude('pricing_page_expert_requested', { plan, waitlist: Boolean(data.waitlist) })
      setDone({ waitlist: Boolean(data.waitlist) })
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : (fr ? 'La demande n’est pas partie. Réessaie.' : 'The request didn’t go through. Try again.'))
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="mx-auto mt-10 max-w-4xl">
      <p className={`text-center ${ORDER_LABEL}`}>{fr ? 'Options, à ajouter à ta formule' : 'Add-ons for your plan'}</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className={`flex flex-col gap-3 p-5 ${glass.panel}`}>
          <div className="flex items-start justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-white">
              <GraduationCap className="h-4 w-4 text-neutral-300" />
              {fr ? 'Le bootcamp Academy 21 jours' : 'The 21-day Academy bootcamp'}
            </p>
            <span className={`whitespace-nowrap ${ORDER_TAG}`}>+{bootcampEuros} €</span>
          </div>
          <p className="text-sm leading-relaxed text-neutral-300">
            {fr
              ? 'Apprends la méthode à ton rythme : 21 vidéos, la certification et la communauté. Payé une fois, au prix de la semaine.'
              : 'Learn the method at your own pace: 21 videos, the certification and the community. Paid once, at this week’s price.'}
          </p>
          <a
            href={BOOTCAMP_CHECKOUT_URL}
            onClick={() => trackAmplitude('pricing_page_bootcamp_clicked', { plan, price: bootcampEuros })}
            className={`mt-auto ${ORDER_CTA_SECONDARY}`}
          >
            {fr ? `Ajouter le bootcamp · ${bootcampEuros} €` : `Add the bootcamp · €${bootcampEuros}`}
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>

        <div className={`flex flex-col gap-3 p-5 ${glass.panel}`}>
          <div className="flex items-start justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-white">
              <UserRound className="h-4 w-4 text-neutral-300" />
              {fr ? 'Un expert Empire t’accompagne' : 'An Empire expert coaches you'}
            </p>
            <span className={`whitespace-nowrap ${ORDER_TAG}`}>{EXPERT_MONTHLY_EUROS} €{fr ? '/mois' : '/mo'}</span>
          </div>
          <p className="text-sm leading-relaxed text-neutral-300">
            {fr
              ? 'Un expert Empire Partners t’accompagne, en plus de ta formule. Sur demande, rien n’est payé ici : ton expert te contacte en privé sous 48 h et vous réglez ensemble.'
              : 'An Empire Partners expert coaches you, on top of your plan. On request, nothing is paid here: your expert contacts you privately within 48h and you settle it together.'}
            {spotsLine && <span className="mt-1 block text-xs text-neutral-300">{spotsLine}</span>}
          </p>

          {done ? (
            <p className="flex items-start gap-2 text-sm text-white" role="status">
              <Check className="mt-0.5 h-4 w-4 shrink-0" />
              {done.waitlist
                ? (fr ? 'C’est noté, tu es sur la liste d’attente. On te prévient dès qu’une place se libère.' : 'Noted, you’re on the waiting list. We’ll tell you as soon as a spot opens.')
                : (fr ? 'C’est noté. Ton expert te contacte en privé sous 48 h.' : 'Noted. Your expert will contact you privately within 48h.')}
            </p>
          ) : open ? (
            <form onSubmit={submit} className="space-y-2" noValidate>
              <input name="name" autoComplete="name" placeholder={fr ? 'Prénom et nom' : 'Full name'} className="min-h-11 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 text-sm text-white placeholder:text-neutral-400" />
              <input name="email" type="email" required autoComplete="email" placeholder="toi@entreprise.com" onChange={() => setError('')} className="min-h-11 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 text-sm text-white placeholder:text-neutral-400" />
              <input name="phone" type="tel" autoComplete="tel" placeholder={fr ? 'Téléphone (WhatsApp)' : 'Phone (WhatsApp)'} className="min-h-11 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 text-sm text-white placeholder:text-neutral-400" />
              {error && <p className="text-xs text-red-300" role="alert">{error}</p>}
              <button type="submit" disabled={sending} className={ORDER_CTA_SECONDARY}>
                {sending ? (fr ? 'Envoi…' : 'Sending…') : (full ? (fr ? 'Rejoindre la liste d’attente' : 'Join the waiting list') : (fr ? 'Envoyer ma demande' : 'Send my request'))}
              </button>
            </form>
          ) : (
            <button type="button" onClick={() => { setOpen(true); trackAmplitude('pricing_page_expert_opened', { plan }) }} className={ORDER_CTA_SECONDARY}>
              {full ? (fr ? 'Rejoindre la liste d’attente' : 'Join the waiting list') : (fr ? 'Être mis en relation' : 'Get introduced')}
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
