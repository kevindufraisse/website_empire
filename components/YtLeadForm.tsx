'use client'

import { useState, useEffect, useRef } from 'react'

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void
  }
}
import { createPortal } from 'react-dom'
import Cal, { getCalApi } from '@calcom/embed-react'
import { ChevronDown, Loader2, X } from 'lucide-react'
import { getEmpParam } from '@/hooks/useCalLink'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { CtaReassurance } from '@/components/ui/cta-reassurance'

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

// Map our budget values to Cal.com radio option labels (identifier: "price")
const BUDGET_MAP: Record<string, string> = {
  '1000-5000': '+1000€ - 5000€',
  '5000+':     '5000€ - 10 000€',
  '10000+':    '+10 000€',
}

interface Lead {
  firstName: string
  email: string
  phone: string
  budget: string
}

// ── Cal.com full-screen modal ─────────────────────────────────────────────────
function CalModal({ lead, countryCode, onClose }: { lead: Lead; countryCode: string; onClose: () => void }) {
  const calInitialized = useRef(false)
  const fullPhone = `${countryCode}${lead.phone}`

  const emp = getEmpParam()
  const calLink = emp
    ? `${CAL_LINK}?emp=${encodeURIComponent(emp)}`
    : CAL_LINK

  useEffect(() => {
    if (calInitialized.current) return
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
  }, [])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div>
            <p className="text-sm font-semibold text-white">
              C'est noté, {lead.firstName} 👋
            </p>
            <p className="text-xs text-neutral-400">Choisissez votre créneau - vos infos sont pré-remplies.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/20 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Cal.com */}
        <div className="flex-1 overflow-auto">
          <Cal
            calLink={calLink}
            style={{ width: '100%', height: '100%', minHeight: '600px' }}
            config={{
              layout: 'month_view',
              theme: 'dark',
              name: lead.firstName,
              email: lead.email,
              smsReminderNumber: fullPhone,
              price: BUDGET_MAP[lead.budget] ?? '',
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Main form ─────────────────────────────────────────────────────────────────
export default function YtLeadForm({ eventName = 'ads_conversion_book_appointment' }: { eventName?: string }) {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const accent = autopilot
    ? {
        ring: 'focus:ring-autopilot/30',
        border: 'focus:border-autopilot/50',
        focusWithin: 'focus-within:border-autopilot/50 focus-within:ring-autopilot/30',
        dropdownActive: 'bg-autopilot/10 text-autopilot',
        chipActive: 'bg-autopilot/15 border-autopilot/50 text-autopilot shadow-[0_0_12px_-4px_rgba(212,165,116,0.25)]',
        chipIdle: 'hover:border-autopilot/30',
        submit: 'bg-autopilot text-black shadow-[0_0_20px_-4px_rgba(212,165,116,0.35)] hover:shadow-[0_0_28px_-4px_rgba(212,165,116,0.5)]',
      }
    : {
        ring: 'focus:ring-empire/30',
        border: 'focus:border-empire/50',
        focusWithin: 'focus-within:border-empire/50 focus-within:ring-empire/30',
        dropdownActive: 'bg-empire/10 text-empire',
        chipActive: 'bg-empire/15 border-empire/50 text-empire shadow-[0_0_12px_-4px_rgb(var(--empire-rgb)_/_0.2)]',
        chipIdle: 'hover:border-empire/30',
        submit: 'bg-empire text-black shadow-[0_0_20px_-4px_rgb(var(--empire-rgb)_/_0.35)] hover:shadow-[0_0_28px_-4px_rgb(var(--empire-rgb)_/_0.5)]',
      }
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showCal, setShowCal] = useState(false)
  const [form, setForm] = useState<Lead>({ firstName: '', email: '', phone: '', budget: '' })
  const [countryIdx, setCountryIdx] = useState(0)
  const [countryOpen, setCountryOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCountryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function validate() {
    const e: Record<string, boolean> = {}
    if (!form.firstName.trim()) e.firstName = true
    if (!form.email.trim() || !form.email.includes('@')) e.email = true
    if (!form.phone.trim()) e.phone = true
    if (!form.budget) e.budget = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return

    if (form.budget === 'none') {
      setSubmitted(true)
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
    } catch { /* best-effort */ }
    setLoading(false)

    // Fire GA4 conversion event via GTM dataLayer
    if (typeof window !== 'undefined') {
      const payload = {
        value: form.budget === '5000+' ? 5000 : 1000,
        currency: 'EUR',
      }
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: eventName, ...payload })
    }

    setShowCal(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-lg font-bold text-white">Pas encore le budget pour un accompagnement complet ?</p>
        <p className="text-neutral-400 text-sm max-w-sm mx-auto">
          <span className="text-white font-semibold">Empire Academy</span> est fait pour toi : 21 jours pour maîtriser la viralité. On produit ton contenu pendant que tu apprends. Lance ton projet ou deviens coach Empire (500€/mission).
        </p>
        <a
          href="/academy"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#fca5a5] text-black font-bold text-sm hover:bg-[#fca5a5]/90 transition-colors"
        >
          Découvrir le bootcamp →
        </a>
        <div>
          <button
            onClick={() => { setForm({ ...form, budget: '' }); setSubmitted(false) }}
            className="text-xs text-neutral-400 hover:text-neutral-400 transition-colors underline"
          >
            Revenir au formulaire
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Votre prénom *"
          value={form.firstName}
          onChange={(e) => { setForm({ ...form, firstName: e.target.value }); setErrors({ ...errors, firstName: false }) }}
          className={`w-full px-4 py-3.5 rounded-xl bg-white/[0.12] border text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 ${accent.ring} transition-all text-base ${errors.firstName ? 'border-red-500' : `border-white/20 ${accent.border}`}`}
        />

        <input
          type="email"
          placeholder="Votre email *"
          value={form.email}
          onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: false }) }}
          autoComplete="email"
          inputMode="email"
          className={`w-full px-4 py-3.5 rounded-xl bg-white/[0.12] border text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 ${accent.ring} transition-all text-base ${errors.email ? 'border-red-500' : `border-white/20 ${accent.border}`}`}
        />

        {/* Phone with country code */}
        <div className={`flex rounded-xl bg-white/[0.12] border overflow-hidden transition-all ${errors.phone ? 'border-red-500' : `border-white/20 ${accent.focusWithin} focus-within:ring-1`}`}>
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setCountryOpen(!countryOpen)}
              className="flex items-center gap-1.5 px-3 py-4 text-white hover:bg-white/5 transition-colors border-r border-white/10 whitespace-nowrap"
            >
              <span className="text-base">{COUNTRIES[countryIdx].flag}</span>
              <span className="text-sm text-neutral-300">{COUNTRIES[countryIdx].code}</span>
              <ChevronDown size={12} className="text-neutral-400" />
            </button>
            {countryOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 max-h-52 overflow-y-auto bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-20">
                {COUNTRIES.map((c, i) => (
                  <button
                    key={`${c.code}-${c.name}`}
                    type="button"
                    onClick={() => { setCountryIdx(i); setCountryOpen(false) }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/10 transition-colors ${i === countryIdx ? accent.dropdownActive : 'text-white'}`}
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
              placeholder="Votre téléphone *"
            value={form.phone}
            onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: false }) }}
            autoComplete="tel"
            inputMode="tel"
            className="flex-1 px-3 py-4 bg-transparent text-white placeholder:text-neutral-400 focus:outline-none min-w-0 text-base"
          />
        </div>

        {/* Budget */}
        <div>
          <p className={`text-xs mb-2 ${errors.budget ? 'text-red-400' : 'text-neutral-400'}`}>
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
                className={`py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                  form.budget === value
                    ? value === 'none'
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : accent.chipActive
                    : `bg-white/[0.10] border-white/20 text-neutral-300 ${accent.chipIdle} hover:bg-white/[0.1]`
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
          className={`w-full py-4 rounded-xl ${accent.submit} font-bold text-base hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2`}
        >
          {loading
            ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {lang === 'fr' ? 'Envoi en cours...' : 'Sending...'}
              </>
            )
            : lang === 'fr'
              ? 'Valider et planifier un RDV →'
              : 'Submit and book a call →'
          }
        </button>

        <p className="text-xs text-neutral-400 text-center">
          {lang === 'fr'
            ? '300 000 vues/mois garanties · 45 min'
            : '300,000 views/month guaranteed · 45 min'}
        </p>
        <CtaReassurance className="mt-3" />
      </form>

      {/* ── Cal.com modal portal ── */}
      {showCal && mounted && (
        <CalModal
          lead={form}
          countryCode={COUNTRIES[countryIdx].code}
          onClose={() => setShowCal(false)}
        />
      )}
    </>
  )
}
