import { NextResponse } from 'next/server'

const API = 'https://api.postproxy.dev/api'
const PER_PAGE = 100
const MAX_PAGES = 20
const TOP_PER_PLATFORM = 3
const CACHE_TTL_MS = 60 * 60 * 1000 // 1h
// Personal profile group (Kevin) — the API key spans all client groups
const PROFILE_GROUP_ID = process.env.POSTPROXY_PROFILE_GROUP_ID ?? 'ZlF5G1'

// Kevin's Postproxy profile IDs within ZlF5G1 (avoids client/corporate accounts)
const KEVIN_PROFILE_IDS = new Set(
  (process.env.POSTPROXY_PROFILE_IDS ?? 'PkUPdP,8qUKxG,xKUeAm,3VUMxd,naUje3,mxUA7M')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
)

function cleanPostBody(raw: string) {
  return raw
    .replace(/@\[([^\]]+)\]\(urn:[^)]+\)/g, '@$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function isUsablePost(body: string) {
  const cleaned = cleanPostBody(body)
  if (cleaned.length < 50) return false
  if (/^rédigé par empire/i.test(cleaned)) return false
  return true
}

function isPromoPost(body: string) {
  const b = cleanPostBody(body).toLowerCase()
  return (
    /tally\.so/i.test(b) ||
    /unicity\.video/i.test(b) ||
    /ouvrons \d+ places/i.test(b) ||
    /postulez ici/i.test(b) ||
    /ask an invitation code/i.test(b) ||
    /^rédigé par empire/i.test(b)
  )
}

type ViralPost = {
  id: string
  platform: string
  permalink: string | null
  body: string
  impressions: number
  likes: number
  comments: number
  createdAt: string
  hasStats: boolean
}

type Payload = { updatedAt: string; platforms: Record<string, ViralPost[]> }

let cache: { at: number; payload: Payload } | null = null

async function ppFetch(path: string, key: string) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Postproxy ${res.status} on ${path}`)
  return res.json()
}

async function inBatches<T, R>(items: T[], size: number, fn: (batch: T[]) => Promise<R>): Promise<R[]> {
  const results: R[] = []
  for (let i = 0; i < items.length; i += size) {
    results.push(await fn(items.slice(i, i + size)))
  }
  return results
}

const PLATFORMS = ['linkedin', 'instagram', 'threads', 'tiktok', 'youtube', 'twitter', 'facebook']
const LINKEDIN_MIN_IMPRESSIONS = 1000

function buildLinkedInTop(
  posts: Map<string, { body: string; createdAt: string; permalinks: Record<string, string | null> }>,
  fromStats: ViralPost[],
): ViralPost[] {
  const trusted = fromStats
    .filter((e) => e.impressions >= LINKEDIN_MIN_IMPRESSIONS && !isPromoPost(e.body))
    .sort((a, b) => b.impressions - a.impressions)

  if (trusted.length >= TOP_PER_PLATFORM) {
    return trusted.slice(0, TOP_PER_PLATFORM)
  }

  // Postproxy rarely syncs LinkedIn impressions — fall back to recent personal posts
  const recent: ViralPost[] = []
  for (const [id, meta] of posts) {
    if (!meta.permalinks.linkedin) continue
    const body = cleanPostBody(meta.body)
    if (!isUsablePost(body) || isPromoPost(body)) continue
    recent.push({
      id,
      platform: 'linkedin',
      permalink: meta.permalinks.linkedin,
      body: body.slice(0, 280),
      impressions: 0,
      likes: 0,
      comments: 0,
      createdAt: meta.createdAt,
      hasStats: false,
    })
  }
  recent.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return recent.slice(0, TOP_PER_PLATFORM)
}

async function buildPayload(key: string): Promise<Payload> {
  // 1. List posts per platform: the unfiltered listing silently omits some posts,
  // so query each platform explicitly.
  type PostMeta = { body: string; createdAt: string; permalinks: Record<string, string | null> }
  const posts = new Map<string, PostMeta>()

  await Promise.all(
    PLATFORMS.map(async (platform) => {
      const listPath = (page: number) =>
        `/posts?page=${page}&per_page=${PER_PAGE}&profile_group_id=${PROFILE_GROUP_ID}&platforms[]=${platform}`
      const first = await ppFetch(listPath(0), key)
      const totalPages = Math.min(Math.ceil(first.total / PER_PAGE), MAX_PAGES)
      const pages = [first.data]
      for (let p = 1; p < totalPages; p++) {
        pages.push(await ppFetch(listPath(p), key).then((r) => r.data))
      }
      for (const page of pages) {
        for (const post of page) {
          const permalinks: Record<string, string | null> = {}
          for (const pl of post.platforms ?? []) {
            if (pl.status === 'published') permalinks[pl.platform] = pl.permalink ?? null
          }
          if (Object.keys(permalinks).length === 0) continue
          const existing = posts.get(post.id)
          if (existing) {
            Object.assign(existing.permalinks, permalinks)
          } else {
            posts.set(post.id, { body: post.body ?? '', createdAt: post.created_at, permalinks })
          }
        }
      }
    }),
  )

  // 2. Stats in batches (the stats endpoint returns at most 50 posts per call)
  const ids = [...posts.keys()]
  const entries: ViralPost[] = []
  await inBatches(ids, 50, async (batch) => {
    const stats = await ppFetch(`/posts/stats?post_ids=${batch.join(',')}`, key)
    for (const [postId, val] of Object.entries<any>(stats.data ?? {})) {
      const meta = posts.get(postId)
      if (!meta) continue
      for (const pl of val.platforms ?? []) {
        if (pl.profile_id && !KEVIN_PROFILE_IDS.has(pl.profile_id)) continue
        const records = pl.records ?? []
        if (records.length === 0) continue
        const last = records[records.length - 1].stats ?? {}
        const impressions = last.impressions ?? 0
        if (impressions <= 0) continue
        const body = cleanPostBody(meta.body)
        if (!isUsablePost(body)) continue
        entries.push({
          id: postId,
          platform: pl.platform,
          permalink: meta.permalinks[pl.platform] ?? null,
          body: body.slice(0, 280),
          impressions,
          likes: last.likes ?? 0,
          comments: last.comments ?? last.replies ?? 0,
          createdAt: meta.createdAt,
          hasStats: true,
        })
      }
    }
    return null
  })

  // 3. Top N per platform (LinkedIn uses a dedicated strategy)
  const platforms: Record<string, ViralPost[]> = {}
  const linkedinFromStats: ViralPost[] = []

  for (const entry of entries) {
    if (entry.platform === 'linkedin') {
      linkedinFromStats.push(entry)
    } else {
      ;(platforms[entry.platform] ??= []).push(entry)
    }
  }

  for (const list of Object.values(platforms)) {
    list.sort((a, b) => b.impressions - a.impressions)
    list.splice(TOP_PER_PLATFORM)
  }

  platforms.linkedin = buildLinkedInTop(posts, linkedinFromStats)

  return { updatedAt: new Date().toISOString(), platforms }
}

export async function GET(request: Request) {
  const key = process.env.POSTPROXY_API_KEY
  if (!key) return NextResponse.json({ error: 'POSTPROXY_API_KEY missing' }, { status: 500 })

  const refresh = new URL(request.url).searchParams.get('refresh') === '1'
  if (refresh) cache = null

  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return NextResponse.json(cache.payload)
  }

  try {
    const payload = await buildPayload(key)
    cache = { at: Date.now(), payload }
    return NextResponse.json(payload)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'unknown error' }, { status: 502 })
  }
}
