'use client'

import { useState, useEffect, useRef } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import { ChevronDown, Loader2, CheckCircle2 } from 'lucide-react'
import { getEmpParam } from '@/hooks/useCalLink'

const CAL_LINK = 'team/empire-internet/audit-empire'

const COUNTRIES = [
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+32', flag: '🇧🇪', name: 'Belgique' },
  { code: '+41', flag: '🇨🇭', name: 'Suisse' },
  { code: '+352', flag: '🇱🇺', name: 'Luxembourg' },
  { code: '+1',  flag: '🇺🇸', name: 'USA / Canada' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+49', flag: '🇩🇪', name: 'Deutschland' },
  { code: '+212', flag: '🇲🇦', name: 'Maroc' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisie' },
  { code: '+213', flag: '🇩🇿', name: 'Algérie' },
  { code: '+225', flag: '🇨🇮', name: "Côte d'Ivoire" },
  { code: '+221', flag: '🇸🇳', name: 'Sénégal' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
]

type Step = 'form' | 'booking' | 'disqualified'

interface Lead {
  firstName: string
  email: string
  phone: string
  budget: string
}

export default function YtLeadForm() {
  const [step, setStep] = useState<Step>('form')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<Lead>({ firstName: '', email: '', phone: '', budget: '' })
  const [countryIdx, setCountryIdx] = useState(0)
  const [countryOpen, setCountryOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const dropdownRef = useRef<HTMLDivElement>(null)
  const calInitialized = useRef(false)
  const bookingRef = useRef<HTMLDivElement>(null)

  // Close country dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCountryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Init Cal.com when step changes to booking
  useEffect(() => {
    if (step !== 'booking' || calInitialized.current) return
    calInitialized.current = true
    ;(async () => {
      const cal = await getCalApi({})
      cal('ui', {
        theme: 'dark',
        hideEventTypeDetails: false,
        layout: 'month_view',
        cssVarsPerTheme: {
          light: { 'cal-brand': '#dafc68' },
          dark: { 'cal-brand': '#dafc68' },
        },
      })
    })()
    setTimeout(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
  }, [step])

  function validate() {
    const e: Record<string, boolean> = {}
    if (!form.firstName.trim()) e.firstName = true
    if (!form.email.trim() || !form.email.includes('@')) e.email = true
    if (!form.phone.trim()) e.phone = true
    if (!form.budget) e.budget = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    if (form.budget === 'none') {
      setStep('disqualified')
      return
    }

    setLoading(true)
    const fullPhone = `${COUNTRIES[countryIdx].code}${form.phone}`
    try {
      await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          email: form.email,
          phone: fullPhone,
          budget: form.budget,
          emp: getEmpParam() || undefined,
        }),
      })
    } catch {
      // Lead capture best-effort — don't block
    } finally {
      setLoading(false)
      setStep('booking')
    }
  }

  const fullPhone = `${COUNTRIES[countryIdx].code}${form.phone}`

  return (
    <div className="w-full">
      {/* ── STEP 1 : Form ────────────────────────── */}
      {step === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Ton prénom *"
            value={form.firstName}
            onChange={(e) => { setForm({ ...form, firstName: e.target.value }); setErrors({ ...errors, firstName: false }) }}
            className={`w-full px-4 py-4 rounded-xl bg-white/5 border text-white placeholder:text-neutral-500 focus:outline-none transition-colors text-base ${errors.firstName ? 'border-red-500' : 'border-white/10 focus:border-empire/60'}`}
          />

          <input
            type="email"
            placeholder="Ton email *"
            value={form.email}
            onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: false }) }}
            autoComplete="email"
            inputMode="email"
            className={`w-full px-4 py-4 rounded-xl bg-white/5 border text-white placeholder:text-neutral-500 focus:outline-none transition-colors text-base ${errors.email ? 'border-red-500' : 'border-white/10 focus:border-empire/60'}`}
          />

          {/* Phone with country code */}
          <div className={`flex rounded-xl bg-white/5 border overflow-hidden transition-colors ${errors.phone ? 'border-red-500' : 'border-white/10 focus-within:border-empire/60'}`}>
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setCountryOpen(!countryOpen)}
                className="flex items-center gap-1.5 px-3 py-4 text-white hover:bg-white/5 transition-colors border-r border-white/10 whitespace-nowrap"
              >
                <span className="text-base">{COUNTRIES[countryIdx].flag}</span>
                <span className="text-sm text-neutral-300">{COUNTRIES[countryIdx].code}</span>
                <ChevronDown size={12} className="text-neutral-500" />
              </button>
              {countryOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 max-h-52 overflow-y-auto bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-20">
                  {COUNTRIES.map((c, i) => (
                    <button
                      key={`${c.code}-${c.name}`}
                      type="button"
                      onClick={() => { setCountryIdx(i); setCountryOpen(false) }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/10 transition-colors ${i === countryIdx ? 'bg-empire/10 text-empire' : 'text-white'}`}
                    >
                      <span>{c.flag}</span>
                      <span className="text-sm flex-1">{c.name}</span>
                      <span className="text-xs text-neutral-400">{c.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="tel"
              placeholder="Ton téléphone *"
              value={form.phone}
              onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: false }) }}
              autoComplete="tel"
              inputMode="tel"
              className="flex-1 px-3 py-4 bg-transparent text-white placeholder:text-neutral-500 focus:outline-none min-w-0 text-base"
            />
          </div>

          {/* Budget */}
          <div>
            <p className={`text-xs mb-2 ${errors.budget ? 'text-red-400' : 'text-neutral-500'}`}>
              Budget mensuel pour résoudre ce problème *
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: '1000-5000', label: '1k – 5k€' },
                { value: '5000+',    label: '5 000€+' },
                { value: 'none',     label: 'Pas encore' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setForm({ ...form, budget: value }); setErrors({ ...errors, budget: false }) }}
                  className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                    form.budget === value
                      ? value === 'none'
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'bg-empire/15 border-empire/50 text-empire'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:border-empire/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-empire text-black font-bold text-base hover:bg-empire/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-1"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Envoi en cours...</>
            ) : (
              'Réserver mon appel gratuit →'
            )}
          </button>

          <p className="text-xs text-neutral-600 text-center">
            30 min · Gratuit · Sans engagement · Avec Kevin ou Marc
          </p>
        </form>
      )}

      {/* ── STEP 2 : Cal.com ─────────────────────── */}
      {step === 'booking' && (
        <div ref={bookingRef}>
          <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-empire/10 border border-empire/20">
            <CheckCircle2 size={16} className="text-empire flex-shrink-0" />
            <p className="text-sm text-white">
              C'est noté, <span className="font-semibold">{form.firstName}</span> 👋 Choisis ton créneau — tes infos sont déjà pré-remplies.
            </p>
          </div>
          <Cal
            calLink={CAL_LINK}
            style={{ width: '100%', height: '100%', overflow: 'scroll' }}
            config={{
              layout: 'month_view',
              theme: 'dark',
              name: form.firstName,
              email: form.email,
              phone: fullPhone,
            }}
          />
        </div>
      )}

      {/* ── STEP 3 : Disqualified ────────────────── */}
      {step === 'disqualified' && (
        <div className="text-center py-8">
          <p className="text-lg font-bold text-white mb-2">Pas de souci.</p>
          <p className="text-neutral-400 text-sm max-w-sm mx-auto">
            Ce n'est peut-être pas le bon moment. Quand tu es prêt à investir dans ta visibilité,{' '}
            <button
              onClick={() => { setForm({ ...form, budget: '' }); setStep('form') }}
              className="text-empire underline hover:no-underline"
            >
              reviens ici
            </button>
            .
          </p>
        </div>
      )}
    </div>
  )
}
