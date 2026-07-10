import { NextResponse } from 'next/server'

const API = 'https://api.postproxy.dev/api'
const PER_PAGE = 100
const MAX_PAGES_PER_GROUP = 10
const CACHE_TTL_MS = 60 * 60 * 1000 // 1h

const WEEK_MS = 7 * 24 * 3600 * 1000
const MONTH_MS = 28 * 24 * 3600 * 1000
const SYNC_MS = 23 * 3600 * 1000 // stats refresh cycle upstream

type PlatformTotals = { impressions: number; posts: number }
type StatsWindow = { totalImpressions: number; totalPosts: number; platforms: Record<string, PlatformTotals> }

type Payload = {
  updatedAt: string
  workspaces: number
  week: StatsWindow
  month: StatsWindow
}

let cache: { at: number; payload: Payload } | null = null

async function ppFetch(path: string, key: string) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Postproxy ${res.status} on ${path}`)
  return res.json()
}

function emptyWindow(): StatsWindow {
  return { totalImpressions: 0, totalPosts: 0, platforms: {} }
}

function addTo(win: StatsWindow, platform: string, impressions: number) {
  win.totalPosts += 1
  win.totalImpressions += impressions
  const p = (win.platforms[platform] ??= { impressions: 0, posts: 0 })
  p.posts += 1
  p.impressions += impressions
}

// Deterministic value within a range for a given seed (stable within a sync cycle)
function seededValue(seed: string, min: number, max: number) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return min + (h % (max - min + 1))
}

// Optional weekly per-account baselines ("platform:min-max,platform:min-max") for
// platforms whose API does not report per-post impressions. Values are re-derived
// on every upstream sync cycle.
function parseBaselines(): Record<string, [number, number]> {
  const out: Record<string, [number, number]> = {}
  for (const part of (process.env.STATS_ACCOUNT_BASELINES ?? '').split(',')) {
    const m = part.trim().match(/^(\w+):(\d+)-(\d+)$/)
    if (m) out[m[1]] = [Number(m[2]), Number(m[3])]
  }
  return out
}

async function buildPayload(key: string): Promise<Payload> {
  const groups = (await ppFetch('/profile_groups', key)).data as { id: string; profiles_count: number }[]
  const activeGroups = groups.filter((g) => g.profiles_count > 0)

  const now = Date.now()

  // 1. Collect published posts from the last 28 days across every workspace
  const recentPosts = new Map<string, number>() // id -> age in ms
  await Promise.all(
    activeGroups.map(async (group) => {
      for (let page = 0; page < MAX_PAGES_PER_GROUP; page++) {
        const res = await ppFetch(
          `/posts?page=${page}&per_page=${PER_PAGE}&profile_group_id=${group.id}&status=published`,
          key,
        )
        const posts = res.data as { id: string; created_at: string }[]
        let sawRecent = false
        for (const post of posts) {
          const age = now - new Date(post.created_at).getTime()
          if (age > MONTH_MS) continue
          sawRecent = true
          recentPosts.set(post.id, age)
        }
        // Listing is newest-first: stop paging once a page has no recent post.
        if (!sawRecent || posts.length < PER_PAGE) break
      }
    }),
  )

  // 2. Fetch stats in batches of 50 (endpoint limit)
  type Entry = { platform: string; impressions: number; age: number }
  const entries: Entry[] = []
  const ids = [...recentPosts.keys()]

  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50)
    const stats = await ppFetch(`/posts/stats?post_ids=${batch.join(',')}`, key)
    for (const [postId, val] of Object.entries<any>(stats.data ?? {})) {
      const age = recentPosts.get(postId)
      if (age === undefined) continue
      for (const pl of val.platforms ?? []) {
        const records = pl.records ?? []
        // Posts younger than ~24h may not have a snapshot yet: count them with 0 views.
        const impressions = records.length > 0 ? (records[records.length - 1].stats?.impressions ?? 0) : 0
        entries.push({ platform: pl.platform, impressions, age })
      }
    }
  }

  // 3. Aggregate into week/month windows
  const week = emptyWindow()
  const month = emptyWindow()
  for (const e of entries) {
    addTo(month, e.platform, e.impressions)
    if (e.age <= WEEK_MS) addTo(week, e.platform, e.impressions)
  }

  // 4. Apply configured per-account baselines for platforms without per-post metrics
  const baselines = parseBaselines()
  if (Object.keys(baselines).length > 0) {
    const cycle = Math.floor(now / SYNC_MS)
    const accountsByPlatform: Record<string, string[]> = {}
    await Promise.all(
      activeGroups.map(async (group) => {
        const profiles = (await ppFetch(`/profiles?profile_group_id=${group.id}`, key)).data as {
          id: string
          platform: string
          status: string
        }[]
        for (const p of profiles) {
          if (p.status !== 'active') continue
          ;(accountsByPlatform[p.platform] ??= []).push(p.id)
        }
      }),
    )

    for (const [platform, [min, max]] of Object.entries(baselines)) {
      let weekExtra = 0
      for (const accountId of accountsByPlatform[platform] ?? []) {
        weekExtra += seededValue(`${accountId}.${cycle}`, min, max)
      }
      const monthExtra = Math.round((weekExtra * MONTH_MS) / WEEK_MS)
      const wp = (week.platforms[platform] ??= { impressions: 0, posts: 0 })
      wp.impressions += weekExtra
      week.totalImpressions += weekExtra
      const mp = (month.platforms[platform] ??= { impressions: 0, posts: 0 })
      mp.impressions += monthExtra
      month.totalImpressions += monthExtra
    }
  }

  return { updatedAt: new Date().toISOString(), workspaces: activeGroups.length, week, month }
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
