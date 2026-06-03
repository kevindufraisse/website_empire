'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Cal, { getCalApi } from '@calcom/embed-react'
import {
  ChevronDown,
  Loader2,
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  FileText,
  X,
} from 'lucide-react'
import { getEmpParam } from '@/hooks/useCalLink'

const CAL_LINK = 'team/empire-internet/audit-empire'

// 1 interview camera = 1 week of content (7 posts + 7 NL + 7 reels)
// 7×85 + 7×115 + 7×29 = 1 603 crédits
const INTERVIEW_BUNDLE_CREDITS = 1603

// ── Credit costs per content type (matches canvas grille tarifaire) ───
const CREDIT_COSTS: Record<string, number> = {
  reels_montes: 350,
  youtube: 275,
  carrousels: 180,
  newsletters: 115,
  posts: 85,
  reels: 29,
}

const COUNTRIES = [
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+32', flag: '🇧🇪', name: 'Belgique' },
  { code: '+41', flag: '🇨🇭', name: 'Suisse' },
  { code: '+352', flag: '🇱🇺', name: 'Luxembourg' },
  { code: '+1', flag: '🇺🇸', name: 'USA / Canada' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+49', flag: '🇩🇪', name: 'Deutschland' },
  { code: '+212', flag: '🇲🇦', name: 'Maroc' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisie' },
  { code: '+213', flag: '🇩🇿', name: 'Algérie' },
  { code: '+225', flag: '🇨🇮', name: "Côte d'Ivoire" },
  { code: '+221', flag: '🇸🇳', name: 'Sénégal' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
]

const PLATFORMS = [
  { id: 'linkedin', label: 'LinkedIn', svg: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { id: 'instagram', label: 'Instagram', svg: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { id: 'tiktok', label: 'TikTok', svg: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z' },
  { id: 'youtube', label: 'YouTube', svg: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  { id: 'newsletter', label: 'Newsletter', svg: 'M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z' },
  { id: 'x', label: 'X (Twitter)', svg: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
]

const CONTENT_TYPE_IDS = [
  'reels_montes', 'youtube', 'carrousels', 'newsletters', 'posts', 'reels',
] as const

type Pack = {
  id: string
  name: string
  badge?: 'populaire' | 'best'
  monthlyPrice: number
  credits: number // -1 = unlimited
  interviews: number // how many interview bundles fit (-1 = unlimited)
  weeksCovered: number // how many weeks of content (-1 = unlimited)
  contentsPerMonth: number // total content pieces produced (-1 = unlimited)
  tagline: string
}

const CONTENTS_PER_INTERVIEW = 21 // 7 posts + 7 NL + 7 Reels

// Single source of truth (mirror in app/api/payg-waitlist/route.ts: TIER_PACKS).
const PAYG_TIERS: Pack[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 199,
    credits: 2200,
    interviews: 1,
    weeksCovered: 1,
    contentsPerMonth: 21,
    tagline: '1 semaine couverte sur 4',
  },
  {
    id: 'growth',
    name: 'Growth',
    badge: 'populaire',
    monthlyPrice: 499,
    credits: 6000,
    interviews: 3,
    weeksCovered: 3,
    contentsPerMonth: 63,
    tagline: '3 semaines couvertes · présence quasi-continue',
  },
  {
    id: 'scale',
    name: 'Scale',
    monthlyPrice: 799,
    credits: 10400,
    interviews: 6,
    weeksCovered: 4,
    contentsPerMonth: 126,
    tagline: 'Le mois entier couvert + du stock d\'avance',
  },
]

const SITUATIONS = [
  { value: 'rien', label: "Je ne publie rien aujourd'hui" },
  { value: 'solo', label: 'Je publie moi-même' },
  { value: 'freelance', label: "J'ai un freelance / créateur" },
  { value: 'agence', label: "J'ai une agence" },
  { value: 'in_house', label: "J'ai une équipe in-house" },
]

interface FormState {
  platforms: string[]
  contentTypes: string[]
  packId: string
  firstName: string
  email: string
  phone: string
  currentSituation: string
}

type Step = 1 | 2 | 'done'

export default function PaygClient() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormState>({
    platforms: [],
    contentTypes: [],
    packId: '',
    firstName: '',
    email: '',
    phone: '',
    currentSituation: '',
  })
  const [countryIdx, setCountryIdx] = useState(0)
  const [countryOpen, setCountryOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [position, setPosition] = useState<number | null>(null)
  const [submittedPack, setSubmittedPack] = useState<Pack | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showCal, setShowCal] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCountryOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const selectedPack = PAYG_TIERS.find((t) => t.id === form.packId)
  const isUnlimitedSelected = false

  function togglePlatform(id: string) {
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(id)
        ? f.platforms.filter((p) => p !== id)
        : [...f.platforms, id],
    }))
    setErrors((e) => ({ ...e, platforms: false }))
  }

  function validateStep1() {
    const e: Record<string, boolean> = {}
    if (form.platforms.length === 0) e.platforms = true
    if (!form.packId) e.packId = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep2() {
    const e: Record<string, boolean> = {}
    if (!form.firstName.trim()) e.firstName = true
    if (!form.email.trim() || !form.email.includes('@')) e.email = true
    if (!form.phone.trim()) e.phone = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleStep1Submit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validateStep1()) return
    setStep(2)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  async function handleStep2Submit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validateStep2() || !selectedPack) return

    setLoading(true)
    setSubmitError(null)
    const fullPhone = `${COUNTRIES[countryIdx].code}${form.phone}`
    try {
      const res = await fetch('/api/payg-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          email: form.email,
          phone: fullPhone,
          platforms: form.platforms,
          contentTypes: form.contentTypes,
          packId: form.packId,
          currentSituation: form.currentSituation || undefined,
          emp: getEmpParam() || undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json?.error || 'Erreur serveur')
      }
      setPosition(json.position ?? null)
      setSubmittedPack(selectedPack)

      if (typeof window !== 'undefined') {
        ;(window as any).dataLayer = (window as any).dataLayer || []
        ;(window as any).dataLayer.push({
          event: isUnlimitedSelected
            ? 'payg_unlimited_book_call'
            : 'payg_waitlist_join',
          pack_id: selectedPack.id,
          estimated_monthly_price: selectedPack.monthlyPrice,
          credits_per_month: selectedPack.credits,
          platforms: form.platforms,
          content_types: form.contentTypes,
          currency: 'EUR',
        })
      }

      // Illimité tier → open Cal directly so the high-ticket lead can book a call with Kevin.
      if (isUnlimitedSelected) {
        setShowCal(true)
      } else {
        setStep('done')
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur serveur'
      setSubmitError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_50%_at_50%_-10%,rgb(var(--empire-rgb)_/_0.08),transparent)]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="border-b border-white/5">
          <div className="flex items-center justify-between max-w-5xl mx-auto w-full px-4 sm:px-6 py-4">
            <a
              href="/"
              className="text-white font-bold text-base tracking-tight hover:text-empire transition-colors"
            >
              Empire Internet
            </a>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-empire animate-pulse" />
              <span className="text-empire font-semibold uppercase tracking-wider">
                Beta · 50 places
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-14 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* ── Left column : pitch ─────────────────────────────── */}
          <div className="lg:sticky lg:top-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-empire/10 border border-empire/30 text-empire text-xs font-bold uppercase tracking-wider mb-5">
              <Sparkles size={12} />
              Beta · 50 places
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
              1 interview ={' '}
              <span className="text-empire">1 semaine de contenu</span>.
            </h1>

            <p className="text-neutral-400 text-base mb-8 leading-relaxed">
              On produit tout à partir d&apos;une interview caméra et on publie
              partout pour toi. Choisis juste le volume.
            </p>

            <div className="space-y-4">
              {[
                { icon: FileText, value: '21', label: 'contenus par interview' },
                { icon: Check, value: '0', label: 'engagement · résilie quand tu veux' },
                { icon: ArrowRight, value: '∞', label: 'crédits non utilisés reportés' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-empire/10 border border-empire/30 flex items-center justify-center">
                    <span className="text-empire text-sm font-extrabold">{item.value}</span>
                  </div>
                  <span className="text-sm text-neutral-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column : form ─────────────────────────────── */}
          <div>
            <div className="relative rounded-2xl border border-empire/30 bg-gradient-to-b from-white/[0.08] to-white/[0.04] p-5 sm:p-7 shadow-[0_0_60px_-20px_rgb(var(--empire-rgb)_/_0.30)] overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-empire" />

              {step !== 'done' && (
                <div className="flex items-center gap-2 mb-5">
                  <StepDot active={step === 1} done={step === 2} number={1} label="Pack & cadence" />
                  <div className="flex-1 h-px bg-white/10" />
                  <StepDot active={step === 2} done={false} number={2} label="Coordonnées" />
                </div>
              )}

              {step === 1 && (
                <form onSubmit={handleStep1Submit} className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">
                      Combien de contenu tu veux ?
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Pas d&apos;email demandé tout de suite. 3 questions rapides.
                    </p>
                  </div>

                  {/* Platforms */}
                  <div>
                    <p
                      className={`text-xs mb-2 font-medium ${
                        errors.platforms ? 'text-red-400' : 'text-neutral-400'
                      }`}
                    >
                      Sur quels réseaux tu veux être présent ? *
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {PLATFORMS.map((p) => {
                        const selected = form.platforms.includes(p.id)
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => togglePlatform(p.id)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                              selected
                                ? 'bg-empire/15 border-empire/50 text-empire shadow-[0_0_12px_-4px_rgb(var(--empire-rgb)_/_0.25)]'
                                : 'bg-white/[0.06] border-white/15 text-neutral-300 hover:border-empire/30'
                            }`}
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                              <path d={p.svg} />
                            </svg>
                            <span className="truncate">{p.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Pack selection */}
                  <div>
                    <p
                      className={`text-xs mb-3 font-medium ${
                        errors.packId ? 'text-red-400' : 'text-neutral-400'
                      }`}
                    >
                      Combien de contenu par mois ? *{' '}
                      <a
                        href="/pay-as-you-go/credits"
                        className="text-empire font-normal hover:underline"
                      >
                        Comment ça marche ?
                      </a>
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {PAYG_TIERS.map((tier) => {
                        const selected = form.packId === tier.id
                        return (
                          <button
                            key={tier.id}
                            type="button"
                            onClick={() => {
                              setForm((s) => ({ ...s, packId: tier.id }))
                              setErrors((e) => ({ ...e, packId: false }))
                            }}
                            className={`relative flex flex-col items-center text-center px-2 py-4 rounded-xl border transition-all ${
                              selected
                                ? 'bg-empire/[0.08] border-empire/50 shadow-[0_0_16px_-6px_rgb(var(--empire-rgb)_/_0.35)]'
                                : 'bg-white/[0.04] border-white/15 hover:border-empire/30'
                            }`}
                          >
                            {tier.badge && (
                              <span
                                className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap ${
                                  tier.badge === 'best'
                                    ? 'bg-empire text-black'
                                    : 'bg-empire/20 text-empire border border-empire/40'
                                }`}
                              >
                                {tier.badge === 'best' ? 'Best' : 'Populaire'}
                              </span>
                            )}
                            <span className="text-[10px] text-neutral-500">
                              ~ {tier.contentsPerMonth} contenus
                            </span>
                            <span
                              className={`text-2xl font-extrabold leading-none mt-1 ${
                                selected ? 'text-empire' : 'text-white'
                              }`}
                            >
                              {tier.credits.toLocaleString('fr-FR')}
                            </span>
                            <span className="text-[10px] text-neutral-400 mt-0.5">
                              crédits
                            </span>
                            <span
                              className={`text-sm font-bold mt-2 ${
                                selected ? 'text-empire' : 'text-neutral-300'
                              }`}
                            >
                              {tier.monthlyPrice}€
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-empire text-black font-bold text-base hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_-4px_rgb(var(--empire-rgb)_/_0.35)]"
                  >
                    Continuer
                    <ArrowRight size={18} />
                  </button>

                  <p className="text-[11px] text-neutral-500 text-center">
                    Étape 2 = juste tes coordonnées. Pas de spam.
                  </p>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleStep2Submit} className="space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">
                      Tu y es presque.
                    </h2>
                    <p className="text-xs text-neutral-400">
                      {isUnlimitedSelected
                        ? 'Laisse tes coordonnées, tu choisis ton créneau avec Kevin juste après.'
                        : 'On a 50 places en beta — laisse tes coordonnées pour réserver la tienne.'}
                    </p>
                  </div>

                  {selectedPack && (
                    <div className="rounded-xl border border-empire/30 bg-empire/[0.06] px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-empire font-bold">
                          Ta sélection
                        </p>
                        <p className="text-sm text-white font-semibold mt-0.5">
                          {selectedPack.name}
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          {selectedPack.credits === -1
                            ? 'Crédits illimités'
                            : `${selectedPack.credits.toLocaleString('fr-FR')} crédits / mois`}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-extrabold text-empire leading-none">
                          {selectedPack.monthlyPrice}€
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">/mois</div>
                      </div>
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Votre prénom *"
                    value={form.firstName}
                    onChange={(e) => {
                      setForm({ ...form, firstName: e.target.value })
                      setErrors({ ...errors, firstName: false })
                    }}
                    className={`w-full px-4 py-3.5 rounded-xl bg-white/[0.12] border text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-empire/30 transition-all text-base ${
                      errors.firstName
                        ? 'border-red-500'
                        : 'border-white/20 focus:border-empire/50'
                    }`}
                  />

                  <input
                    type="email"
                    placeholder="Votre email *"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value })
                      setErrors({ ...errors, email: false })
                    }}
                    autoComplete="email"
                    inputMode="email"
                    className={`w-full px-4 py-3.5 rounded-xl bg-white/[0.12] border text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-empire/30 transition-all text-base ${
                      errors.email
                        ? 'border-red-500'
                        : 'border-white/20 focus:border-empire/50'
                    }`}
                  />

                  <div
                    className={`flex rounded-xl bg-white/[0.12] border overflow-hidden transition-all ${
                      errors.phone
                        ? 'border-red-500'
                        : 'border-white/20 focus-within:border-empire/50 focus-within:ring-1 focus-within:ring-empire/30'
                    }`}
                  >
                    <div ref={dropdownRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setCountryOpen(!countryOpen)}
                        className="flex items-center gap-1.5 px-3 py-4 text-white hover:bg-white/5 transition-colors border-r border-white/10 whitespace-nowrap"
                      >
                        <span className="text-base">{COUNTRIES[countryIdx].flag}</span>
                        <span className="text-sm text-neutral-300">
                          {COUNTRIES[countryIdx].code}
                        </span>
                        <ChevronDown size={12} className="text-neutral-400" />
                      </button>
                      {countryOpen && (
                        <div className="absolute top-full left-0 mt-1 w-56 max-h-52 overflow-y-auto bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-20">
                          {COUNTRIES.map((c, i) => (
                            <button
                              key={`${c.code}-${c.name}`}
                              type="button"
                              onClick={() => {
                                setCountryIdx(i)
                                setCountryOpen(false)
                              }}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/10 transition-colors ${
                                i === countryIdx ? 'bg-empire/10 text-empire' : 'text-white'
                              }`}
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
                      onChange={(e) => {
                        setForm({ ...form, phone: e.target.value })
                        setErrors({ ...errors, phone: false })
                      }}
                      autoComplete="tel"
                      inputMode="tel"
                      className="flex-1 px-3 py-4 bg-transparent text-white placeholder:text-neutral-400 focus:outline-none min-w-0 text-base"
                    />
                  </div>

                  <div>
                    <p className="text-xs mb-2 text-neutral-400">
                      Ta situation actuelle (optionnel)
                    </p>
                    <select
                      value={form.currentSituation}
                      onChange={(e) =>
                        setForm({ ...form, currentSituation: e.target.value })
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-white/[0.12] border border-white/20 text-white focus:outline-none focus:ring-1 focus:ring-empire/30 focus:border-empire/50 transition-all text-base appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#1a1a1a]">
                        — choisir —
                      </option>
                      {SITUATIONS.map((s) => (
                        <option key={s.value} value={s.value} className="bg-[#1a1a1a]">
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {submitError && (
                    <p className="text-xs text-red-400 text-center">{submitError}</p>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-4 rounded-xl bg-white/5 border border-white/15 text-neutral-300 font-medium text-sm hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                      <ArrowLeft size={16} />
                      Retour
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-4 rounded-xl bg-empire text-black font-bold text-base hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-[0_0_20px_-4px_rgb(var(--empire-rgb)_/_0.35)]"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Envoi en cours...
                        </>
                      ) : isUnlimitedSelected ? (
                        <>
                          Réserver mon appel
                          <ArrowRight size={18} />
                        </>
                      ) : (
                        <>
                          Rejoindre la beta
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-neutral-500 text-center pt-1">
                    {isUnlimitedSelected
                      ? 'Tu choisis ton créneau juste après. 15 min, gratuit, sans engagement.'
                      : 'On te contacte sous 48h. Tes infos ne seront jamais revendues.'}
                  </p>
                </form>
              )}

              {step === 'done' && submittedPack && (
                <div className="text-center py-4 space-y-5">
                  <div className="mx-auto w-14 h-14 rounded-full bg-empire/15 border border-empire/40 flex items-center justify-center">
                    <Check size={28} className="text-empire" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-white mb-1">
                      Tu es sur la liste, {form.firstName}.
                    </h2>
                    {position !== null && (
                      <p className="text-sm text-neutral-400">
                        Tu es <span className="text-empire font-bold">#{position}</span> sur
                        la waitlist beta.
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border border-empire/30 bg-empire/[0.06] p-4 text-left space-y-2">
                    <div className="flex items-baseline justify-between">
                      <p className="text-xs uppercase tracking-widest text-empire font-bold">
                        Pack réservé
                      </p>
                      <span className="text-xl font-extrabold text-empire">
                        {submittedPack.monthlyPrice}€/mois
                      </span>
                    </div>
                    <p className="text-sm text-white font-semibold">{submittedPack.name}</p>
                    <p className="text-xs text-neutral-300">
                      {submittedPack.credits === -1
                        ? 'Crédits illimités'
                        : `${submittedPack.credits.toLocaleString('fr-FR')} crédits / mois`}
                    </p>
                    <p className="text-xs text-neutral-400 pt-2 border-t border-white/10">
                      📡{' '}
                      {form.platforms
                        .map((id) => PLATFORMS.find((p) => p.id === id)?.label ?? id)
                        .join(', ')}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-neutral-300">
                    <p>
                      On te contacte sous{' '}
                      <span className="text-white font-semibold">48h</span> au{' '}
                      {COUNTRIES[countryIdx].code}
                      {form.phone}.
                    </p>
                    <p className="text-xs text-neutral-400">
                      Tu veux qu&apos;on discute plus tôt ? Réserve un créneau direct :
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCal(true)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-empire text-black font-bold text-sm hover:brightness-110 transition-colors"
                    >
                      Réserver un appel avec Kevin →
                    </button>
                    <a
                      href="/"
                      className="text-xs text-neutral-400 hover:text-white transition-colors underline"
                    >
                      Retour à l&apos;accueil
                    </a>
                  </div>
                </div>
              )}
            </div>

            {step !== 'done' && (
              <p className="text-xs text-neutral-500 text-center mt-3">
                Beta lancée juin 2026 · Limitée à 50 créateurs
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-white/5 py-5 text-center">
          <p className="text-xs text-neutral-400">
            © 2026 Empire Internet ·{' '}
            <a href="/" className="hover:text-white transition-colors">
              Retour au site
            </a>
          </p>
        </div>
      </div>

      {showCal && mounted && (
        <CalModal
          firstName={form.firstName}
          email={form.email}
          fullPhone={`${COUNTRIES[countryIdx].code}${form.phone}`}
          onClose={() => setShowCal(false)}
        />
      )}
    </main>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────

function StepDot({
  active,
  done,
  number,
  label,
}: {
  active: boolean
  done: boolean
  number: number
  label: string
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border transition-all ${
          done
            ? 'bg-empire/20 border-empire/50 text-empire'
            : active
            ? 'bg-empire text-black border-empire'
            : 'bg-white/5 border-white/15 text-neutral-500'
        }`}
      >
        {done ? <Check size={12} /> : number}
      </div>
      <span
        className={`text-[11px] uppercase tracking-wider font-bold ${
          active ? 'text-white' : 'text-neutral-500'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

function CalModal({
  firstName,
  email,
  fullPhone,
  onClose,
}: {
  firstName: string
  email: string
  fullPhone: string
  onClose: () => void
}) {
  const calInitialized = useRef(false)
  const emp = getEmpParam()
  const calLink = emp ? `${CAL_LINK}?emp=${encodeURIComponent(emp)}` : CAL_LINK

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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div>
            <p className="text-sm font-semibold text-white">
              {firstName ? `C'est noté, ${firstName} 👋` : 'Réserve ton appel'}
            </p>
            <p className="text-xs text-neutral-400">
              Choisis ton créneau avec Kevin · 15 min, sans engagement.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/20 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <Cal
            calLink={calLink}
            style={{ width: '100%', height: '100%', minHeight: '600px' }}
            config={{
              layout: 'month_view',
              theme: 'dark',
              name: firstName,
              email,
              smsReminderNumber: fullPhone,
            }}
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}
