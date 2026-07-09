'use client'

import { useEffect, useRef, useState } from 'react'
import { Eye } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { SocialIcons } from '@/components/ui/social-icons'

const CURVE_PATH =
  'M0.015625 560.146C337.059 571.196 1010.54 591.914 1050.16 228.406C1066.24 80.7926 931.217 -4.30466 828.806 0.710031C716.039 6.23188 527.779 113.881 602.37 312.791C676.962 511.701 832.95 721.76 1127.17 651.313C1421.39 580.866 1421.39 435.827 2101 435.827'

// Speed of the flowing text along the path, in px/s
const TEXT_SPEED = 280
const SEP = '\u00A0\u00A0\u00A0\u00A0\u00A0'

// Static bar heights/timings for the voice-note pill (stable => no hydration mismatch)
const VOICE_BARS = [
  { h: 5.6, d: 0.72, delay: 0 },
  { h: 9.6, d: 0.94, delay: 0.12 },
  { h: 13.6, d: 0.66, delay: 0.28 },
  { h: 8, d: 1.05, delay: 0.05 },
  { h: 15.2, d: 0.78, delay: 0.4 },
  { h: 10.4, d: 0.9, delay: 0.18 },
  { h: 6.4, d: 0.7, delay: 0.33 },
  { h: 12, d: 1, delay: 0.08 },
  { h: 8.8, d: 0.82, delay: 0.24 },
  { h: 14.4, d: 0.68, delay: 0.44 },
  { h: 7.2, d: 0.96, delay: 0.15 },
  { h: 11.2, d: 0.76, delay: 0.36 },
  { h: 5.6, d: 0.88, delay: 0.02 },
  { h: 9.6, d: 0.74, delay: 0.21 },
  { h: 7.2, d: 0.98, delay: 0.3 },
]

type PostCard = {
  icon: keyof typeof SocialIcons
  name: string
  text: string
  tag: string
  tagColor: string
  views?: string
}

export default function VoiceToContentAnimation() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  // What you say, flowing along the curve (one chunk, repeated for a seamless loop)
  const chunk = fr
    ? `là je vous explique comment j'ai signé mon premier client à 10k sans dépenser un euro en pub…${SEP}l'erreur que tout le monde fait sur LinkedIn, c'est de poster sans stratégie…${SEP}et franchement le secret c'est pas le talent, c'est la régularité…${SEP}`
    : `so here's how I signed my first 10k client without spending a euro on ads…${SEP}the mistake everyone makes on LinkedIn is posting without a strategy…${SEP}and honestly the secret isn't talent, it's consistency…${SEP}`

  const posts: PostCard[] = fr
    ? [
        { icon: 'linkedin', name: 'LinkedIn', text: 'J\u2019ai signé mon premier client à 10K sans dépenser un euro en pub.\n\nVoici les 3 choses que j\u2019ai faites différemment \u2193', tag: 'Post', tagColor: '#5eb0ef', views: '1M+ vues/mois en moyenne' },
        { icon: 'instagram', name: 'Instagram', text: '\u25B6 « L\u2019erreur que tout le monde fait sur LinkedIn : poster sans stratégie. »', tag: 'Reel', tagColor: '#f472b6', views: 'jusqu\u2019à 8M vues/mois' },
        { icon: 'twitter', name: 'X', text: 'Le secret, c\u2019est pas le talent. C\u2019est la régularité.\n\nComment tenir 12 mois sans s\u2019épuiser 🧵 (1/8)', tag: 'Thread', tagColor: '#e5e7eb', views: 'jusqu\u2019à 100K vues/mois' },
        { icon: 'threads', name: 'Threads', text: 'Poster sans stratégie, c\u2019est l\u2019erreur n°1 sur LinkedIn. La preuve en chiffres \u2193', tag: 'Threads', tagColor: '#e5e7eb', views: 'jusqu\u2019à 1M vues/mois' },
        { icon: 'newsletter', name: 'Newsletter', text: 'Objet : Mon premier client à 10K (sans un euro de pub)', tag: 'Email', tagColor: '#DAFC68', views: '30 newsletters/mois' },
        { icon: 'youtube', name: 'YouTube', text: '\u25B6 « Le secret c\u2019est pas le talent, c\u2019est la régularité » — 0:34', tag: 'Short', tagColor: '#f87171', views: 'jusqu\u2019à 200K vues/mois' },
      ]
    : [
        { icon: 'linkedin', name: 'LinkedIn', text: 'I signed my first 10K client without spending a euro on ads.\n\nHere are the 3 things I did differently \u2193', tag: 'Post', tagColor: '#5eb0ef', views: '1M+ views/mo on average' },
        { icon: 'instagram', name: 'Instagram', text: '\u25B6 \u201cThe mistake everyone makes on LinkedIn: posting without a strategy.\u201d', tag: 'Reel', tagColor: '#f472b6', views: 'up to 8M views/mo' },
        { icon: 'twitter', name: 'X', text: 'The secret isn\u2019t talent. It\u2019s consistency.\n\nHow to keep going 12 months without burning out 🧵 (1/8)', tag: 'Thread', tagColor: '#e5e7eb', views: 'up to 100K views/mo' },
        { icon: 'threads', name: 'Threads', text: 'Posting without a strategy is mistake #1 on LinkedIn. Here\u2019s the proof in numbers \u2193', tag: 'Threads', tagColor: '#e5e7eb', views: 'up to 1M views/mo' },
        { icon: 'newsletter', name: 'Newsletter', text: 'Subject: My first 10K client (without a euro in ads)', tag: 'Email', tagColor: '#DAFC68', views: '30 newsletters/mo' },
        { icon: 'youtube', name: 'YouTube', text: '\u25B6 \u201cThe secret isn\u2019t talent, it\u2019s consistency\u201d — 0:34', tag: 'Short', tagColor: '#f87171', views: 'up to 200K views/mo' },
      ]

  // Measure one chunk so the SMIL loop advances by exactly one chunk (seamless)
  const measureRef = useRef<SVGTextElement | null>(null)
  const [chunkLen, setChunkLen] = useState<number | null>(null)
  useEffect(() => {
    setChunkLen(null)
    // Wait a frame so the hidden text is laid out with the right content
    const raf = requestAnimationFrame(() => {
      if (measureRef.current) setChunkLen(measureRef.current.getComputedTextLength())
    })
    return () => cancelAnimationFrame(raf)
  }, [chunk])

  // Rotating platform cards
  const [active, setActive] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % posts.length), 2800)
    return () => clearInterval(id)
  }, [posts.length])

  const repeated = chunk.repeat(4)

  return (
    <div className="flex flex-col items-center gap-2 md:flex-row md:gap-6">
      {/* Voice flowing along the curve */}
      <div className="relative h-[340px] w-full min-w-0 md:h-auto md:flex-1" style={{ aspectRatio: '2101 / 666' }}>
        <div className="absolute inset-0 flex items-center justify-center [mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_100%)] md:[mask-image:linear-gradient(to_right,black_0%,black_70%,transparent_100%)]">
          <div className="h-[110px] w-[340px] shrink-0 rotate-90 overflow-hidden md:h-full md:w-full md:rotate-0 md:overflow-visible">
            <svg
              aria-hidden="true"
              viewBox="0 0 2101 666"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <path id="voice-curve" d={CURVE_PATH} fill="none" />
              </defs>
              {/* Hidden single chunk, used to measure the loop distance */}
              <text ref={measureRef} style={{ fontSize: 90, fontWeight: 400 }} fill="none" opacity={0} aria-hidden="true">
                {chunk}
              </text>
              <text style={{ fontSize: 90, fontWeight: 400 }} fill="#FAFAFA">
                <textPath href="#voice-curve" startOffset={chunkLen ? -chunkLen : 0}>
                  {repeated}
                  {chunkLen && (
                    <animate
                      attributeName="startOffset"
                      from={String(-chunkLen)}
                      to="0"
                      dur={`${(chunkLen / TEXT_SPEED).toFixed(2)}s`}
                      repeatCount="indefinite"
                    />
                  )}
                </textPath>
              </text>
            </svg>
          </div>
        </div>

        {/* Voice note pill at the start of the curve */}
        <div
          role="img"
          aria-label={fr ? 'Enregistrement d\u2019une note vocale' : 'Recording a voice note'}
          className="absolute left-1/2 top-0 z-10 inline-flex h-9 w-fit -translate-x-1/2 -translate-y-1/2 items-center gap-[2.5px] rounded-full border border-white/10 bg-[#1a1b1d] px-3 shadow-lg shadow-black/40 md:top-[80.6%] md:left-0"
        >
          <span className="relative mr-1.5 flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          {VOICE_BARS.map((bar, i) => (
            <span
              key={i}
              className="voicebar block w-[2px] rounded-full bg-white/80"
              style={{ height: bar.h, animationDuration: `${bar.d}s`, animationDelay: `${bar.delay}s` }}
            />
          ))}
        </div>
      </div>

      {/* Published content cards, cycling */}
      <div className="relative h-[180px] w-full shrink-0 md:h-[240px] md:w-[340px]">
        {posts.map((post, i) => {
          const Icon = SocialIcons[post.icon]
          const isActive = i === active
          return (
            <div
              key={i}
              className="absolute inset-x-0 top-1/2 transition-[opacity,transform] ease-out"
              style={
                isActive
                  ? { opacity: 1, transform: 'translate(0px, -50%)', transitionDuration: '500ms', transitionDelay: '150ms' }
                  : { opacity: 0, transform: 'translate(-24px, -50%) scale(0.97)', transitionDuration: '250ms', transitionDelay: '0ms' }
              }
            >
              <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#141516] px-4 pt-3.5 pb-3 text-left shadow-lg shadow-black/20">
                <div className="flex w-full items-center gap-1.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
                    <Icon />
                  </span>
                  <span className="truncate text-xs font-medium text-[#f7f8f8]">{post.name}</span>
                  <span className="shrink-0 select-none text-xs text-white/35">{fr ? 'à l\u2019instant' : 'now'}</span>
                </div>
                <p className="mt-1.5 whitespace-pre-line text-[13px] leading-[1.5] text-white">{post.text}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="inline-flex h-5 items-center whitespace-nowrap rounded-full px-2 text-[11px] leading-none"
                    style={{
                      background: `${post.tagColor}18`,
                      border: `0.5px solid ${post.tagColor}20`,
                      borderTop: `0.5px solid ${post.tagColor}40`,
                      color: post.tagColor,
                    }}
                  >
                    {post.tag}
                  </span>
                  {post.views && (
                    <span className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] leading-none text-white/45">
                      <Eye size={12} className="shrink-0 opacity-70" />
                      {post.views}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
