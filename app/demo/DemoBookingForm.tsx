'use client'

import { FormEvent, useState } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { CalModal, COUNTRIES } from '@/components/YtLeadForm'
import { getEmpParam } from '@/hooks/useCalLink'
import { toInternational } from './phone'
import { fieldError, input, label, primaryButton } from './ui'

/**
 * Étape rendez-vous de /demo : le téléphone, puis le calendrier Cal.
 * Même envoi que YtLeadForm (/api/callback, événement dataLayer), avec les
 * champs de l'étape 1, un vrai message d'erreur et un numéro propre.
 */
export default function DemoBookingForm({ lead, fr }: { lead: { firstName: string; email: string }; fr: boolean }) {
  const [phone, setPhone] = useState('')
  const [countryIdx, setCountryIdx] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fullPhone, setFullPhone] = useState('')
  const [showCal, setShowCal] = useState(false)
  const country = COUNTRIES[countryIdx]

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    if (!phone.trim()) {
      setError(fr ? 'Ajoute ton numéro de téléphone.' : 'Add your phone number.')
      return
    }
    const full = toInternational(country.code, phone)
    if (!full) {
      setError(fr ? 'Vérifie ton numéro de téléphone.' : 'Check your phone number.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: lead.firstName,
          email: lead.email,
          phone: full,
          emp: getEmpParam() || undefined,
          offer: 'empire',
          budget: 'call',
        }),
      })
    } catch { /* le calendrier s'ouvre quand même */ }
    setLoading(false)
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'empire_demo_booking_opened', value: 1000, currency: 'EUR' })
    setFullPhone(full)
    setShowCal(true)
  }

  return (
    <>
      <form onSubmit={submit} noValidate className="grid grid-cols-1 gap-3.5">
        <div className="min-w-0">
          <label htmlFor="demo-phone" className={label}>{fr ? 'Ton téléphone' : 'Your phone number'}</label>
          <div className={`flex rounded-xl border bg-white/[0.06] transition-all focus-within:ring-1 ${error ? 'border-red-400 focus-within:ring-red-400/40' : 'border-white/20 focus-within:border-empire/60 focus-within:ring-empire/40'}`}>
            {/* Liste native : le sélecteur du téléphone s'ouvre, rien n'est coupé par la carte. */}
            <div className="relative flex shrink-0 items-center gap-1.5 rounded-l-xl border-r border-white/15 px-3 text-base text-white has-[:focus-visible]:bg-white/10">
              <span aria-hidden="true">{country.flag}</span>
              <span className="text-neutral-200" aria-hidden="true">{country.code}</span>
              <ChevronDown size={14} className="text-neutral-400" aria-hidden />
              <select
                aria-label={fr ? 'Indicatif du pays' : 'Country code'}
                value={countryIdx}
                onChange={event => { setCountryIdx(Number(event.target.value)); setError('') }}
                className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0 [color-scheme:dark]"
              >
                {COUNTRIES.map((c, i) => <option key={`${c.code}-${c.name}`} value={i}>{c.name} ({c.code})</option>)}
              </select>
            </div>
            <input
              id="demo-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder={country.code === '+33' ? '06 12 34 56 78' : ''}
              maxLength={24}
              value={phone}
              onChange={event => { setPhone(event.target.value); setError('') }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'demo-phone-error' : undefined}
              className="min-h-[50px] w-full min-w-0 flex-1 rounded-r-xl bg-transparent px-4 py-3 text-base text-white placeholder:text-neutral-500 focus:outline-none"
            />
          </div>
        </div>
        {error && <p id="demo-phone-error" role="alert" className={fieldError}>{error}</p>}
        <button type="submit" disabled={loading} className={`${primaryButton} mt-1 w-full`}>
          {loading
            ? <><Loader2 size={18} className="animate-spin" aria-hidden />{fr ? 'Un instant…' : 'One moment…'}</>
            : <>{fr ? 'Choisir mon créneau' : 'Choose my time'}<span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span></>}
        </button>
        <p className="text-center text-xs text-neutral-400">{fr ? 'Le calendrier s’ouvre juste après.' : 'The calendar opens right after.'}</p>
      </form>

      {showCal && (
        <CalModal
          lead={{ ...lead, phone: fullPhone }}
          countryCode=""
          informal
          onClose={() => setShowCal(false)}
        />
      )}
    </>
  )
}
