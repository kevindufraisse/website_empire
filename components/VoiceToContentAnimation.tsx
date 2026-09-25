'use client'

import { useEffect, useRef, useState } from 'react'
import { Link2, Mic, Video } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { SocialIcons } from '@/components/ui/social-icons'

const CURVE_PATH =
  'M0.015625 560.146C337.059 571.196 1010.54 591.914 1050.16 228.406C1066.24 80.7926 931.217 -4.30466 828.806 0.710031C716.039 6.23188 527.779 113.881 602.37 312.791C676.962 511.701 832.95 721.76 1127.17 651.313C1421.39 580.866 1421.39 435.827 2101 435.827'

const TEXT_SPEED = 280
const SEP = '\u00A0\u00A0\u00A0\u00A0\u00A0'

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

type Source = 'voice' | 'link' | 'video' | 'competitor' | 'viral'

type Topic = {
  source: Source
  nameFr: string
  nameEn: string
  textFr: string
  textEn: string
}

export default function VoiceToContentAnimation() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const chunk = fr
    ? `là je vous explique comment j’ai signé mon premier client à 10k…${SEP}je vous envoie le reel, vous me dites ce que j’en fais…${SEP}mon concurrent a posté ça hier, est-ce que je réponds…${SEP}et le sujet qui tourne partout cette semaine, on le prend…${SEP}`
    : `so here’s how I signed my first 10k client…${SEP}I’m sending you the reel, tell me what to do with it…${SEP}my competitor posted this yesterday, do I answer…${SEP}and the topic everywhere this week, do we take it…${SEP}`

  const topics: Topic[] = fr
    ? [
        { source: 'voice', nameFr: 'Vocal Telegram', nameEn: '', textFr: 'Signer un client à 10K sans pub.\nLe vocal est déjà un sujet.', textEn: '' },
        { source: 'link', nameFr: 'Lien envoyé', nameEn: '', textFr: 'Le reel que vous avez collé.\nLe sujet est prêt, il reste à cliquer.', textEn: '' },
        { source: 'video', nameFr: 'Vidéo', nameEn: '', textFr: 'La vidéo que vous avez envoyée.\nRangée avec le reste, prête à sortir.', textEn: '' },
        { source: 'competitor', nameFr: 'Concurrent', nameEn: '', textFr: 'Ce qu’ils ont posté la semaine dernière.\nVous pouvez répondre, ou passer.', textEn: '' },
        { source: 'viral', nameFr: 'Sujet viral', nameEn: '', textFr: 'Ce qui fait des vues en ce moment.\nYouTube, Instagram, TikTok.', textEn: '' },
      ]
    : [
        { source: 'voice', nameFr: '', nameEn: 'Telegram voice note', textFr: '', textEn: 'Signing a 10K client without ads.\nThe voice note is already a topic.' },
        { source: 'link', nameFr: '', nameEn: 'Link you sent', textFr: '', textEn: 'The reel you pasted.\nThe topic is ready. You just click.' },
        { source: 'video', nameFr: '', nameEn: 'Video', textFr: '', textEn: 'The video you sent.\nFiled with the rest, ready to go.' },
        { source: 'competitor', nameFr: '', nameEn: 'Competitor', textFr: '', textEn: 'What they posted last week.\nYou can answer, or skip it.' },
        { source: 'viral', nameFr: '', nameEn: 'Viral topic', textFr: '', textEn: 'What’s getting views right now.\nYouTube, Instagram, TikTok.' },
      ]

  const measureRef = useRef<SVGTextElement | null>(null)
  const [chunkLen, setChunkLen] = useState<number | null>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    setChunkLen(null)
    const raf = requestAnimationFrame(() => {
      if (measureRef.current) setChunkLen(measureRef.current.getComputedTextLength())
    })
    return () => cancelAnimationFrame(raf)
  }, [chunk])

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % topics.length), 2800)
    return () => clearInterval(id)
  }, [topics.length])

  const repeated = chunk.repeat(4)

  return (
    <div className="flex flex-col items-center gap-2 md:flex-row md:gap-6">
      <div className="relative h-[340px] w-full min-w-0 md:h-auto md:flex-1" style={{ aspectRatio: '2101 / 666' }}>
        <div className="absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_55%_48%_at_50%_38%,black_50%,transparent_100%)] md:[mask-image:linear-gradient(to_right,black_0%,black_70%,transparent_100%)]">
          <div className="h-[110px] w-[340px] shrink-0 translate-x-[38px] rotate-90 md:h-full md:w-full md:translate-x-0 md:rotate-0">
            <svg aria-hidden="true" viewBox="0 0 2101 666" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
              <defs>
                <path id="voice-curve" d={CURVE_PATH} fill="none" />
              </defs>
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

        <div
          role="img"
          aria-label={fr ? 'Vocal, lien et vidéo qui arrivent' : 'Voice note, link and video coming in'}
          className="absolute left-1/2 top-0 z-10 inline-flex h-9 w-fit -translate-x-1/2 -translate-y-1/2 items-center gap-[2.5px] rounded-full border border-white/10 bg-[#1a1b1d] px-3 shadow-lg shadow-black/40 md:left-0 md:top-[80.6%]"
        >
          <Mic className="mr-1 h-3.5 w-3.5 shrink-0 text-white/80" aria-hidden />
          {VOICE_BARS.map((bar, i) => (
            <span key={i} className="voicebar block w-[2px] rounded-full bg-white/80" style={{ height: bar.h, animationDuration: `${bar.d}s`, animationDelay: `${bar.delay}s` }} />
          ))}
          <Link2 className="ml-2 h-3.5 w-3.5 shrink-0 text-white/70" aria-hidden />
          <Video className="h-3.5 w-3.5 shrink-0 text-white/70" aria-hidden />
        </div>
      </div>

      <div className="relative h-[160px] w-full shrink-0 md:h-[200px] md:w-[340px]">
        {topics.map((topic, i) => {
          const isActive = i === active
          const Icon =
            topic.source === 'voice' ? Mic : topic.source === 'link' ? Link2 : topic.source === 'video' ? Video : topic.source === 'competitor' ? SocialIcons.linkedin : SocialIcons.tiktok
          return (
            <div
              key={topic.source}
              className="absolute inset-x-0 top-1/2 transition-[opacity,transform] ease-out"
              style={
                isActive
                  ? { opacity: 1, transform: 'translate(0px, -50%)', transitionDuration: '500ms', transitionDelay: '150ms' }
                  : { opacity: 0, transform: 'translate(-24px, -50%) scale(0.97)', transitionDuration: '250ms' }
              }
            >
              <div className="overflow-hidden rounded-[22px] border border-empire/40 bg-[#141a0e] px-4 pt-3.5 pb-3 text-left shadow-lg shadow-black/20">
                <div className="flex w-full items-center gap-1.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center text-empire [&_svg]:h-4 [&_svg]:w-4">
                    <Icon />
                  </span>
                  <span className="truncate text-xs font-medium text-[#f7f8f8]">{fr ? topic.nameFr : topic.nameEn}</span>
                  <span className="shrink-0 select-none text-xs text-white/35">{fr ? 'prêt' : 'ready'}</span>
                </div>
                <p className="mt-1.5 whitespace-pre-line text-[13px] leading-[1.5] text-white">{fr ? topic.textFr : topic.textEn}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
