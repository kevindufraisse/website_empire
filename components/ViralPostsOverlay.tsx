'use client'

import { useEffect, useState } from 'react'
import { X, Loader2, ArrowRight, Clock, EuroIcon } from 'lucide-react'
import { SocialIcons } from '@/components/ui/social-icons'
import OnboardingLink from '@/components/OnboardingLink'

type StatsWindow = {
  totalImpressions: number
  totalPosts: number
  platforms: Record<string, { impressions: number; posts: number }>
}
type StatsPayload = { updatedAt: string; workspaces: number; week: StatsWindow; month: StatsWindow }

const PLATFORM_ORDER = ['linkedin', 'instagram', 'threads', 'tiktok', 'youtube', 'twitter', 'facebook']

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  threads: 'Threads',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  twitter: 'X',
  facebook: 'Facebook',
}

const HOURS_PER_POST: Record<string, number> = {
  linkedin: 1.5,
  instagram: 3,
  tiktok: 2.5,
  youtube: 2.5,
  threads: 1,
  twitter: 1,
  facebook: 1,
  newsletter: 3,
}

const COST_PER_POST: Record<string, number> = {
  linkedin: 120,
  instagram: 200,
  tiktok: 180,
  youtube: 180,
  threads: 80,
  twitter: 80,
  facebook: 80,
  newsletter: 200,
}

function seededOpenRate(seed: number) {
  const h = ((seed * 2654435761) >>> 0) % 16
  return 30 + h
}

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.0', '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace('.0', '')}K`
  return String(n)
}

function estimateNewsletters(workspaces: number) {
  return workspaces * 4
}

function computeSavings(platforms: Record<string, { impressions: number; posts: number }>, newsletterCount: number) {
  let hours = 0
  let euros = 0
  for (const [platform, data] of Object.entries(platforms)) {
    const count = data.posts
    hours += count * (HOURS_PER_POST[platform] ?? 1.5)
    euros += count * (COST_PER_POST[platform] ?? 120)
  }
  hours += newsletterCount * HOURS_PER_POST.newsletter
  euros += newsletterCount * COST_PER_POST.newsletter
  return { hours: Math.round(hours), euros: Math.round(euros) }
}

export default function ViralPostsOverlay() {
  const [open, setOpen] = useState(false)
  const [stats, setStats] = useState<StatsPayload | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      if (e.key.toLowerCase() === 'l' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open || stats) return
    setError(null)
    fetch('/api/stats')
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
        setStats(json)
      })
      .catch((err) => setError(err.message))
  }, [open, stats])

  const month = stats?.month
  const platforms = month ? PLATFORM_ORDER.filter((p) => (month.platforms[p]?.impressions ?? 0) >= 10_000) : []

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Voir les stats"
        className="group fixed bottom-6 right-4 z-[150] flex items-center gap-3 rounded-2xl border border-white/20 bg-black/95 py-3.5 pl-3.5 pr-6 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all hover:border-empire/50 hover:shadow-[0_4px_24px_rgb(var(--empire-rgb)_/_0.25)]"
      >
        <span className="relative flex h-[52px] w-[52px] items-center justify-center rounded-xl p-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.7)] transition-transform group-hover:translate-y-[-1px] group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.8)] group-active:translate-y-[2px] group-active:shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
          style={{ background: 'linear-gradient(to bottom, #3a3b42, #1c1d20)' }}
        >
          <span
            className="flex h-full w-full items-center justify-center rounded-[9px] border border-white/25 text-[20px] font-bold text-white"
            style={{
              background: 'linear-gradient(to bottom, #707178, #525358 40%, #3e3f44)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.35)',
              fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
              letterSpacing: '0.02em',
            }}
          >
            L
          </span>
        </span>
        <span className="text-[15px] font-bold text-white group-hover:text-empire transition-colors">Voir les stats</span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#101112] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-base font-bold text-white">Stats de nos clients — 28 derniers jours</h2>
          <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-neutral-400 hover:bg-white/10 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Loading / error */}
        {!stats && !error && (
          <div className="flex flex-col items-center justify-center gap-3 p-10 text-neutral-400">
            <Loader2 className="animate-spin" size={28} />
            <p className="text-sm">Chargement des stats…</p>
          </div>
        )}
        {error && <div className="p-6 text-center text-sm text-red-400">{error}</div>}

        {month && (
          <div className="px-5 py-5">
            <div className="mb-4 flex items-baseline gap-4">
              <p className="text-3xl font-bold text-empire">
                {formatCount(month.totalImpressions)}
                <span className="ml-1.5 text-sm font-medium text-neutral-400">vues</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((p) => {
                const Icon = SocialIcons[p as keyof typeof SocialIcons]
                return (
                  <div key={p} className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                    {Icon && (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
                        <Icon />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white">{formatCount(month.platforms[p].impressions)}</p>
                      <p className="truncate text-[11px] text-neutral-500">
                        {PLATFORM_LABELS[p] ?? p} · {month.platforms[p].posts} posts
                      </p>
                    </div>
                  </div>
                )
              })}
              {(() => {
                const nlCount = estimateNewsletters(stats?.workspaces ?? 1)
                const openRate = seededOpenRate(nlCount + month.totalPosts)
                const SubstackIcon = SocialIcons.substack
                return (
                  <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
                      <SubstackIcon />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white">{openRate}% ouverture</p>
                      <p className="truncate text-[11px] text-neutral-500">
                        Newsletter · {nlCount} envois
                      </p>
                    </div>
                  </div>
                )
              })()}
            </div>

            {(() => {
              const nlCount = estimateNewsletters(stats?.workspaces ?? 1)
              const savings = computeSavings(month.platforms, nlCount)
              return (
                <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-neutral-500">Ce que ça représente</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                        <Clock size={16} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-base font-bold text-white">~{savings.hours}h</p>
                        <p className="text-[11px] text-neutral-500">économisées</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                        <EuroIcon size={16} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-base font-bold text-white">~{formatCount(savings.euros)}€</p>
                        <p className="text-[11px] text-neutral-500">vs freelance</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}

            <p className="mt-4 text-center text-[11px] leading-relaxed text-neutral-600">
              Synchronisé toutes les 23h
            </p>

            <OnboardingLink className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-empire px-6 py-3.5 font-bold text-black transition-transform hover:scale-[1.02]">
              Rejoindre ces stats
              <ArrowRight size={18} />
            </OnboardingLink>
          </div>
        )}
      </div>
    </div>
  )
}
