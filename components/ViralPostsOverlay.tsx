'use client'

import { useEffect, useState } from 'react'
import { X, Eye, Heart, MessageCircle, ExternalLink, Loader2 } from 'lucide-react'
import { SocialIcons } from '@/components/ui/social-icons'

type ViralPost = {
  id: string
  platform: string
  permalink: string | null
  body: string
  impressions: number
  likes: number
  comments: number
  createdAt: string
  hasStats?: boolean
}

type Payload = { updatedAt: string; platforms: Record<string, ViralPost[]> }

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

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.0', '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace('.0', '')}K`
  return String(n)
}

export default function ViralPostsOverlay() {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<Payload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activePlatform, setActivePlatform] = useState<string | null>(null)

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
    if (!open || data) return
    setError(null)
    fetch('/api/viral-posts')
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
        setData(json)
      })
      .catch((err) => setError(err.message))
  }, [open, data])

  if (!open) return null

  const platformKeys = data
    ? PLATFORM_ORDER.filter((p) => data.platforms[p]?.length).concat(
        Object.keys(data.platforms).filter((p) => !PLATFORM_ORDER.includes(p) && data.platforms[p].length),
      )
    : []
  const current = activePlatform && platformKeys.includes(activePlatform) ? activePlatform : platformKeys[0]

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
      <div
        className="flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101112] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-white">Top 3 posts les plus viraux</h2>
          </div>
          <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-neutral-400 hover:bg-white/10 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Loading / error */}
        {!data && !error && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-neutral-400">
            <Loader2 className="animate-spin" size={28} />
            <p className="text-sm">Analyse des stats de vos posts…</p>
            <p className="text-xs text-neutral-600">(la première ouverture peut prendre quelques secondes)</p>
          </div>
        )}
        {error && (
          <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-red-400">{error}</div>
        )}

        {data && (
          <>
            {/* Platform tabs */}
            <div className="flex gap-1.5 overflow-x-auto border-b border-white/10 px-4 py-3">
              {platformKeys.map((p) => {
                const Icon = SocialIcons[p as keyof typeof SocialIcons]
                return (
                  <button
                    key={p}
                    onClick={() => setActivePlatform(p)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      p === current ? 'bg-empire text-black' : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    {Icon && (
                      <span className={`[&_svg]:h-3.5 [&_svg]:w-3.5 ${p === current ? '[&_path]:fill-black [&_circle]:fill-black' : ''}`}>
                        <Icon />
                      </span>
                    )}
                    {PLATFORM_LABELS[p] ?? p}
                  </button>
                )
              })}
            </div>

            {/* Posts list */}
            <div className="flex-1 overflow-y-auto p-4">
              {current &&
                data.platforms[current]?.map((post, i) => (
                  <a
                    key={`${post.id}-${i}`}
                    href={post.permalink ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mb-2 block rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5 transition-colors ${
                      post.permalink ? 'hover:border-empire/40 hover:bg-white/[0.06]' : 'cursor-default'
                    }`}
                  >
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="w-5 text-right font-mono text-xs text-neutral-600">#{i + 1}</span>
                      {post.hasStats !== false && post.impressions > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[13px] font-bold text-empire">
                          <Eye size={13} />
                          {formatCount(post.impressions)}
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-neutral-500">Post récent</span>
                      )}
                      {post.likes > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
                          <Heart size={12} />
                          {formatCount(post.likes)}
                        </span>
                      )}
                      {post.comments > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
                          <MessageCircle size={12} />
                          {formatCount(post.comments)}
                        </span>
                      )}
                      {post.permalink && <ExternalLink size={12} className="ml-auto text-neutral-500" />}
                    </div>
                    <p className="line-clamp-3 whitespace-pre-line text-[13px] leading-snug text-neutral-300">{post.body}</p>
                  </a>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
