'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Brain, Clock } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { SocialIcons } from '@/components/ui/social-icons'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

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
  time: string
  text: string
  tag: string
  tagColor: string
}

export default function VoiceToContentSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  // What you say, flowing along the curve (one chunk, repeated for a seamless loop)
  const chunk = fr
    ? `là je vous explique comment j'ai signé mon premier client à 10k sans dépenser un euro en pub…${SEP}l'erreur que tout le monde fait sur LinkedIn, c'est de poster sans stratégie…${SEP}et franchement le secret c'est pas le talent, c'est la régularité…${SEP}`
    : `so here's how I signed my first 10k client without spending a euro on ads…${SEP}the mistake everyone makes on LinkedIn is posting without a strategy…${SEP}and honestly the secret isn't talent, it's consistency…${SEP}`

  const posts: PostCard[] = fr
    ? [
        { icon: 'linkedin', name: 'LinkedIn', time: '0:12', text: 'Post publié : « L\u2019erreur que 90% des consultants font avec leur contenu… »', tag: 'Post', tagColor: '#5eb0ef' },
        { icon: 'instagram', name: 'Instagram', time: '0:19', text: 'Reel monté et planifié : hooks, sous-titres, zoom sur les moments forts.', tag: 'Reel', tagColor: '#f472b6' },
        { icon: 'twitter', name: 'X', time: '0:27', text: 'Thread de 8 posts programmé, extrait de votre enregistrement.', tag: 'Thread', tagColor: '#e5e7eb' },
        { icon: 'threads', name: 'Threads', time: '0:34', text: 'Post adapté au format Threads et publié en même temps.', tag: 'Threads', tagColor: '#e5e7eb' },
        { icon: 'newsletter', name: 'Newsletter', time: '0:41', text: 'Newsletter rédigée avec votre voix, prête à partir à votre liste.', tag: 'Email', tagColor: '#DAFC68' },
        { icon: 'youtube', name: 'YouTube', time: '0:48', text: 'Short découpé au meilleur moment, miniature générée.', tag: 'Short', tagColor: '#f87171' },
      ]
    : [
        { icon: 'linkedin', name: 'LinkedIn', time: '0:12', text: 'Post published: \u201cThe mistake 90% of consultants make with their content…\u201d', tag: 'Post', tagColor: '#5eb0ef' },
        { icon: 'instagram', name: 'Instagram', time: '0:19', text: 'Reel edited and scheduled: hooks, subtitles, zoom on the key moments.', tag: 'Reel', tagColor: '#f472b6' },
        { icon: 'twitter', name: 'X', time: '0:27', text: '8-post thread scheduled, extracted from your recording.', tag: 'Thread', tagColor: '#e5e7eb' },
        { icon: 'threads', name: 'Threads', time: '0:34', text: 'Post adapted to Threads and published at the same time.', tag: 'Threads', tagColor: '#e5e7eb' },
        { icon: 'newsletter', name: 'Newsletter', time: '0:41', text: 'Newsletter written in your voice, ready to hit your list.', tag: 'Email', tagColor: '#DAFC68' },
        { icon: 'youtube', name: 'YouTube', time: '0:48', text: 'Short cut at the best moment, thumbnail generated.', tag: 'Short', tagColor: '#f87171' },
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
    <section className="relative w-full section-spacing bg-gradient-to-b from-black via-[#0a0a0a] to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgb(var(--empire-rgb)_/_0.06),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          <FadeInBlock>
            <div className="text-center">
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-empire/10 border border-empire/30">
                <p className="text-sm font-bold text-empire">
                  {fr ? 'COMMENT ÇA MARCHE' : 'HOW IT WORKS'}
                </p>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {fr
                  ? <>Vous parlez. <span className="text-empire">On publie.</span></>
                  : <>You talk. <span className="text-empire">We publish.</span></>}
              </h2>
              <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto">
                {fr
                  ? 'On a passé 8 mois à cloner les meilleurs copywriters et monteurs vidéo. Dans un seul système : Empire Internet.'
                  : 'We spent 8 months cloning the best copywriters and video editors. In one single system: Empire Internet.'}
              </p>
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.1}>
            <div className="mt-8 flex flex-col items-center gap-2 md:mt-10 md:flex-row md:gap-6">
              {/* Voice flowing along the curve */}
              <div className="relative h-[420px] w-full min-w-0 md:h-auto md:flex-1" style={{ aspectRatio: '2101 / 666' }}>
                <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_100%)] md:[mask-image:linear-gradient(to_right,black_0%,black_70%,transparent_100%)]">
                  <div className="absolute top-1/2 left-1/2 h-[133px] w-[420px] -translate-x-1/2 -translate-y-1/2 rotate-90 md:static md:h-full md:w-full md:translate-x-0 md:translate-y-0 md:rotate-0">
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
                  className="absolute top-0 left-[calc(50%-41px)] z-10 inline-flex h-9 w-fit -translate-x-1/2 -translate-y-1/2 items-center gap-[2.5px] rounded-full border border-white/10 bg-[#1a1b1d] px-3 shadow-lg shadow-black/40 md:top-[80.6%] md:left-0"
                >
                  {VOICE_BARS.map((bar, i) => (
                    <span
                      key={i}
                      className="voicebar block w-[2px] rounded-full bg-white/80"
                      style={{ height: bar.h, animationDuration: `${bar.d}s`, animationDelay: `${bar.delay}s` }}
                    />
                  ))}
                </div>
              </div>

              {/* Empire brain: the system that transforms voice into content */}
              <div className="relative z-10 flex shrink-0 flex-col items-center gap-2.5 py-2 md:px-2">
                <div className="relative flex h-20 w-20 items-center justify-center md:h-24 md:w-24">
                  <span className="absolute inset-0 rounded-full bg-empire/20 blur-xl" />
                  <span className="brainpulse absolute inset-0 rounded-full border border-empire/40" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-empire/50 bg-gradient-to-br from-empire/25 to-empire/5 shadow-lg shadow-empire/20 md:h-20 md:w-20">
                    <Brain className="text-empire" size={34} />
                  </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-empire">
                  {fr ? 'Cerveau Empire' : 'Empire Brain'}
                </p>
                <div className="flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/15 px-2.5 py-1 backdrop-blur-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span className="text-[10px] font-semibold text-green-400">
                    {fr ? 'Vérifié par des humains' : 'Verified by humans'}
                  </span>
                </div>
              </div>

              {/* Published content cards, cycling */}
              <div className="relative h-[190px] w-full shrink-0 md:h-[260px] md:w-[360px]">
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
                      <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#141516] px-4 pt-3.5 pb-3 shadow-lg shadow-black/20">
                        <div className="flex w-full items-center gap-1.5">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
                            <Icon />
                          </span>
                          <span className="truncate text-xs font-medium text-[#f7f8f8]">{post.name}</span>
                          <span className="shrink-0 select-none text-xs text-white/35">{fr ? 'à l\u2019instant' : 'now'}</span>
                          <span className="ml-auto inline-flex h-5 shrink-0 select-none items-center gap-1 rounded-sm border border-white/5 bg-white/10 px-1.5">
                            <Clock size={12} className="opacity-30 text-[#f7f8f8]" />
                            <span className="font-mono text-[11px] leading-none tabular-nums text-[#8a8f98]">{post.time}</span>
                          </span>
                        </div>
                        <p className="mt-1.5 text-[13px] leading-[1.5] text-white">{post.text}</p>
                        <div className="mt-2 flex items-center">
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
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}
