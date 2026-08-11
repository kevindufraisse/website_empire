'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { Mic, ArrowRight, Check, Brain, RotateCw } from 'lucide-react'
import { StarRating } from '@/components/ui/star-rating'
import AnimatedList, { AnimatedListItem } from '@/components/magicui/animated-list'
import CalendarGrid from '@/components/magicui/calendar-grid'
import OrbitingCircles from '@/components/magicui/orbiting-circles'
import BorderBeam from '@/components/magicui/border-beam'
import NumberTicker from '@/components/magicui/number-ticker'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

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

// Voice Animation Component — pure CSS, no JS intervals
const VOICE_BARS = Array.from({ length: 24 }, (_, i) => ({
  h: 25 + ((i * 37 + 13) % 60),
  delay: (i * 0.12) % 1.8,
}))

function VoiceAnimation() {
  return (
    <div className="flex items-center justify-center gap-[2px] w-full max-w-xs h-20">
      {VOICE_BARS.map((bar, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-gradient-to-t from-empire/80 to-empire/40"
          style={{
            animation: `voice-bar 1.2s ease-in-out ${bar.delay}s infinite alternate`,
            height: `${bar.h}%`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes voice-bar {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  )
}

// Content notification items for AnimatedList
const getNotificationsFr = (SocialIconComponent: typeof SocialIcon): AnimatedListItem[] => [
  {
    id: 1,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20 shadow-lg">
        <div className="flex-shrink-0"><SocialIconComponent type="linkedin" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">30 LinkedIn posts</p>
          <p className="text-xs text-neutral-400">Écrit & planifié · À l'instant</p>
        </div>
        <div className="text-xs text-empire font-bold">✓</div>
            </div>
    ),
  },
  {
    id: 2,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20 shadow-lg">
        <div className="flex-shrink-0"><SocialIconComponent type="newsletter" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">30 newsletters</p>
          <p className="text-xs text-neutral-400">Contenu quotidien · 2m</p>
            </div>
        <div className="text-xs text-empire font-bold">✓</div>
          </div>
    ),
  },
  {
    id: 3,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20 shadow-lg">
        <div className="flex-shrink-0"><SocialIconComponent type="reels" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">30 reels/shorts</p>
          <p className="text-xs text-neutral-400">Édité & optimisé · 5m</p>
        </div>
        <div className="text-xs text-empire font-bold">✓</div>
        </div>
      ),
    },
    {
    id: 4,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20 shadow-lg">
        <div className="flex-shrink-0"><SocialIconComponent type="instagram" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">30 Instagram posts</p>
          <p className="text-xs text-neutral-400">Designé & légendé · 8m</p>
                      </div>
        <div className="text-xs text-empire font-bold">✓</div>
                  </div>
    ),
  },
  {
    id: 5,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20 shadow-lg">
        <div className="flex-shrink-0"><SocialIconComponent type="twitter" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">10 Twitter posts</p>
          <p className="text-xs text-neutral-400">Idées décortiquées · 12m</p>
            </div>
        <div className="text-xs text-empire font-bold">✓</div>
          </div>
    ),
  },
  {
    id: 6,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20 shadow-lg">
        <div className="flex-shrink-0"><SocialIconComponent type="threads" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">10 Threads posts</p>
          <p className="text-xs text-neutral-400">Contenu engageant · 15m</p>
              </div>
        <div className="text-xs text-empire font-bold">✓</div>
            </div>
    ),
  },
]

const getNotificationsEn = (SocialIconComponent: typeof SocialIcon): AnimatedListItem[] => [
  {
    id: 1,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20 shadow-lg">
        <div className="flex-shrink-0"><SocialIconComponent type="linkedin" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">30 LinkedIn posts</p>
          <p className="text-xs text-neutral-400">Written & scheduled · Just now</p>
              </div>
        <div className="text-xs text-empire font-bold">✓</div>
              </div>
    ),
  },
  {
    id: 2,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20 shadow-lg">
        <div className="flex-shrink-0"><SocialIconComponent type="newsletter" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">30 newsletters</p>
          <p className="text-xs text-neutral-400">Daily content · 2m ago</p>
            </div>
        <div className="text-xs text-empire font-bold">✓</div>
          </div>
    ),
  },
  {
    id: 3,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20 shadow-lg">
        <div className="flex-shrink-0"><SocialIconComponent type="reels" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">30 reels/shorts</p>
          <p className="text-xs text-neutral-400">Edited & optimized · 5m ago</p>
        </div>
        <div className="text-xs text-empire font-bold">✓</div>
        </div>
      ),
    },
    {
    id: 4,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20 shadow-lg">
        <div className="flex-shrink-0"><SocialIconComponent type="instagram" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">30 Instagram posts</p>
          <p className="text-xs text-neutral-400">Designed & captioned · 8m ago</p>
            </div>
        <div className="text-xs text-empire font-bold">✓</div>
            </div>
    ),
  },
  {
    id: 5,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20 shadow-lg">
        <div className="flex-shrink-0"><SocialIconComponent type="twitter" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">10 Twitter posts</p>
          <p className="text-xs text-neutral-400">Ideas unpacked · 12m ago</p>
            </div>
        <div className="text-xs text-empire font-bold">✓</div>
          </div>
    ),
  },
  {
    id: 6,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20 shadow-lg">
        <div className="flex-shrink-0"><SocialIconComponent type="threads" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">10 Threads posts</p>
          <p className="text-xs text-neutral-400">Engaging content · 15m ago</p>
        </div>
        <div className="text-xs text-empire font-bold">✓</div>
        </div>
      ),
    },
  ]

// Topics surfaced by the Empire brain, with a virality score to make the ranking legible.
const getTopicsFr = (): AnimatedListItem[] => [
  { id: 1, label: 'Pourquoi j\'ai refusé un client à 50 000 €', score: 94, tag: 'LinkedIn' },
  { id: 2, label: 'L\'erreur de recrutement que tout le monde répète', score: 91, tag: 'Reels' },
  { id: 3, label: 'Ce que 3 ans de contenu m\'ont vraiment rapporté', score: 88, tag: 'Newsletter' },
  { id: 4, label: 'Le prix, ce n\'est jamais le vrai problème', score: 86, tag: 'LinkedIn' },
].map(TopicCard)

const getTopicsEn = (): AnimatedListItem[] => [
  { id: 1, label: 'Why I turned down a €50,000 client', score: 94, tag: 'LinkedIn' },
  { id: 2, label: 'The hiring mistake everyone keeps making', score: 91, tag: 'Reels' },
  { id: 3, label: 'What 3 years of content actually earned me', score: 88, tag: 'Newsletter' },
  { id: 4, label: 'Price is never the real objection', score: 86, tag: 'LinkedIn' },
].map(TopicCard)

function TopicCard({ id, label, score, tag }: { id: number; label: string; score: number; tag: string }): AnimatedListItem {
  return {
    id,
    content: (
      <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 border border-empire/20 shadow-lg">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium leading-snug line-clamp-2 text-white">{label}</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">{tag}</p>
        </div>
        <div className="flex-shrink-0 flex flex-col items-center rounded-md bg-empire/15 border border-empire/30 px-1.5 py-1">
          <span className="text-[11px] font-bold leading-none text-empire">{score}</span>
          <span className="text-[8px] uppercase tracking-wider text-empire/60">score</span>
        </div>
      </div>
    ),
  }
}

/** Step 1 — the Empire brain scanning a niche and ranking topics. */
function BrainTopicsVisual({ topics }: { topics: AnimatedListItem[] }) {
  const { lang } = useLanguage()
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 rounded-full bg-empire/15 border border-empire/40 backdrop-blur-sm">
        <Brain className="text-empire flex-shrink-0" size={12} />
        <span className="text-[10px] font-bold uppercase tracking-wider text-empire">
          {lang === 'fr' ? 'Cerveau Empire' : 'Empire brain'}
        </span>
      </div>
      <div className="absolute inset-0 pt-11 px-3 [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)]">
        <AnimatedList items={topics} delay={1000} className="w-full" />
      </div>
    </div>
  )
}

// Social Icons
const SocialIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'linkedin':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    case 'newsletter':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--empire-hex)">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      )
    case 'reels':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    case 'instagram':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FED373"/>
              <stop offset="30%" stopColor="#D92E7F"/>
              <stop offset="100%" stopColor="#515BD4"/>
            </linearGradient>
          </defs>
          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" fill="url(#ig-grad)"/>
        </svg>
      )
    case 'twitter':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DA1F2">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    case 'threads':
      return (
        <svg width="18" height="18" viewBox="0 0 192 192" fill="white">
          <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"/>
        </svg>
      )
    default:
      return null
  }
}

/**
 * Étape 5 d'Empire — le live hebdomadaire. Présenté en bandeau et non en 5e
 * carte : les quatre premières étapes sont la boucle de production, celle-ci est
 * ce qui tourne en parallèle, et c'est ce qui distingue Empire d'une agence.
 */
function LiveWeeklyVisual() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  return (
    <div className="flex flex-shrink-0 items-center gap-4">
      <div className="relative">
        <div className="absolute -inset-2 rounded-full bg-empire/10 animate-pulse opacity-50" style={{ animationDuration: '3s' }} />
        <div className="relative flex -space-x-3">
          <img
            src="/founders/kevin.jpg"
            alt="Kevin Dufraisse"
            className="h-12 w-12 rounded-full border-2 border-empire object-cover object-top ring-2 ring-black"
            loading="lazy"
          />
          <img
            src="/founders/marc.jpg"
            alt="Marc Dufraisse"
            className="h-12 w-12 rounded-full border-2 border-empire object-cover ring-2 ring-black"
            loading="lazy"
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-empire bg-empire/20 text-[11px] font-bold text-empire ring-2 ring-black">
            +40
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-red-500/40 bg-red-500/15 px-2.5 py-1">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
          {fr ? 'En direct' : 'Live'}
        </span>
      </div>
    </div>
  )
}

/** Step 1 — OrbitingCircles with strategy icons around a crown. */
function LegendAuditVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {/* Central icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-autopilot/20 border border-autopilot/40 z-10">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-autopilot">
          <path d="M2 4l3 12h14l3-12-5.5 6L12 2l-4.5 8L2 4z" />
          <path d="M5 16l-1 4h16l-1-4" />
        </svg>
      </div>
      <OrbitingCircles radius={52} duration={25} delay={0} path>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-autopilot/15 border border-autopilot/30 text-autopilot">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </div>
      </OrbitingCircles>
      <OrbitingCircles radius={52} duration={25} delay={8} path={false}>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-autopilot/15 border border-autopilot/30 text-autopilot">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
        </div>
      </OrbitingCircles>
      <OrbitingCircles radius={52} duration={25} delay={16} path={false}>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-autopilot/15 border border-autopilot/30 text-autopilot">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
        </div>
      </OrbitingCircles>
    </div>
  )
}

/** Step 2 — Experts with pulsing ring + border beam card feel. */
function LegendExpertsVisual() {
  const { lang } = useLanguage()
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className="absolute -inset-3 rounded-full bg-autopilot/10 animate-pulse opacity-40" style={{ animationDuration: '3s' }} />
        <div className="relative flex -space-x-3">
          <img
            src="/founders/kevin.jpg"
            alt="Kevin Dufraisse"
            className="h-12 w-12 rounded-full border-2 border-autopilot object-cover object-top ring-2 ring-black"
            loading="lazy"
          />
          <img
            src="/founders/marc.jpg"
            alt="Marc"
            className="h-12 w-12 rounded-full border-2 border-autopilot object-cover ring-2 ring-black"
            loading="lazy"
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-autopilot bg-autopilot/20 text-xs font-bold text-autopilot ring-2 ring-black">
            +3
          </div>
        </div>
      </div>
      <p className="text-center text-[10px] font-bold uppercase tracking-wider text-autopilot">
        {lang === 'fr' ? '1M+ vues/mois · Top 55 LinkedIn FR' : '1M+ views/mo · Top 55 LinkedIn FR'}
      </p>
    </div>
  )
}

/** Platform logo SVGs for orbiting circles. */
const PlatformLogos = {
  linkedin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  instagram: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.088 4.088 0 011.523.99 4.088 4.088 0 01.99 1.523c.163.46.35 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.088 4.088 0 01-.99 1.523 4.088 4.088 0 01-1.523.99c-.46.163-1.26.35-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.088 4.088 0 01-1.523-.99 4.088 4.088 0 01-.99-1.523c-.163-.46-.35-1.26-.403-2.43C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43a4.088 4.088 0 01.99-1.523A4.088 4.088 0 015.15 2.207c.46-.163 1.26-.35 2.43-.403C8.846 2.175 9.227 2.163 12 2.163M12 0C8.741 0 8.333.014 7.053.072 5.775.13 4.903.333 4.14.63a6.21 6.21 0 00-2.244 1.46A6.21 6.21 0 00.436 4.334C.139 5.097-.064 5.969.006 7.247.014 8.527 0 8.935 0 12.194s.014 3.668.072 4.948c.058 1.277.26 2.15.558 2.913a6.21 6.21 0 001.46 2.244 6.21 6.21 0 002.244 1.46c.763.297 1.636.5 2.913.558C8.527 23.986 8.935 24 12 24s3.668-.014 4.948-.072c1.277-.058 2.15-.26 2.913-.558a6.21 6.21 0 002.244-1.46 6.21 6.21 0 001.46-2.244c.297-.763.5-1.636.558-2.913.058-1.28.072-1.688.072-4.948s-.014-3.668-.072-4.948c-.058-1.277-.26-2.15-.558-2.913a6.21 6.21 0 00-1.46-2.244A6.21 6.21 0 0019.86.63C19.097.333 18.225.13 16.948.072 15.668.014 15.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  tiktok: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9a6.27 6.27 0 00-.79-.05A6.34 6.34 0 003.15 15.4a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.17a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.6z"/>
    </svg>
  ),
  youtube: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  x: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  threads: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
      <path d="M17.688 10.939c-.1-.044-.2-.085-.3-.124-.174-3.4-1.934-5.34-4.992-5.36h-.026c-1.83 0-3.35.79-4.282 2.23l1.684 1.154c.695-1.064 1.79-1.292 2.598-1.292h.018c1.003.007 1.762.298 2.256.866.36.414.6.987.72 1.717a12.64 12.64 0 00-2.9-.187c-2.898.168-4.762 1.854-4.636 4.194.064 1.196.66 2.224 1.676 2.896.86.57 1.967.853 3.115.796 1.516-.075 2.705-.636 3.534-1.668.63-.783 1.03-1.8 1.22-3.116.73.44 1.273.99 1.575 1.647.51 1.12.54 2.958-.66 4.156-1.05 1.049-2.313 1.503-4.222 1.518-2.12-.016-3.73-.695-4.784-2.02-1.016-1.278-1.54-3.117-1.558-5.465.018-2.348.542-4.188 1.558-5.466C8.563 5.193 10.173 4.513 12.292 4.497c2.135.017 3.774.699 4.87 2.026.54.654.94 1.46 1.2 2.393l1.903-.51a8.578 8.578 0 00-1.595-3.167C17.114 3.382 14.926 2.514 12.3 2.494h-.016c-2.618.02-4.786.888-6.45 2.583C4.216 6.829 3.511 9.143 3.49 12.006l-.001.06.001.06c.021 2.863.726 5.177 2.344 6.929 1.664 1.8 3.832 2.564 6.45 2.583h.016c2.324-.017 4.036-.64 5.406-1.965 1.75-1.692 1.802-3.905 1.108-5.44-.498-1.1-1.408-2.003-2.625-2.627-.082.584-.196 1.131-.344 1.638.652.352 1.113.79 1.372 1.324.38.78.395 2.134-.575 3.101-.85.847-1.88 1.207-3.38 1.218-1.674-.013-2.925-.548-3.865-1.67-.862-1.03-1.314-2.515-1.345-4.417.031-1.902.483-3.387 1.345-4.417.94-1.122 2.19-1.657 3.866-1.67h.013c.967.006 1.81.172 2.515.493z"/>
    </svg>
  ),
}

/** Step 3 — Orbiting platform logos around a central "publish" button. */
function LegendPublishVisual() {
  const items: { key: string; icon: React.ReactNode; bg: string }[] = [
    { key: 'li', icon: PlatformLogos.linkedin, bg: '#0A66C2' },
    { key: 'ig', icon: PlatformLogos.instagram, bg: '#E1306C' },
    { key: 'tk', icon: PlatformLogos.tiktok, bg: '#000' },
    { key: 'yt', icon: PlatformLogos.youtube, bg: '#FF0000' },
    { key: 'x', icon: PlatformLogos.x, bg: '#000' },
    { key: 'th', icon: PlatformLogos.threads, bg: '#000' },
  ]
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-autopilot text-black font-bold text-sm z-10 shadow-[0_0_20px_rgba(212,165,116,0.5)]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </div>
      {items.map((p, i) => (
        <OrbitingCircles key={p.key} radius={48} duration={22} delay={i * (22 / items.length)} path={i === 0}>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full shadow-lg border border-white/20"
            style={{ background: p.bg }}
          >
            {p.icon}
          </div>
        </OrbitingCircles>
      ))}
    </div>
  )
}

/** Step 4 — Animated stats going up. */
function LegendIterateVisual() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="flex h-full flex-col items-center justify-center gap-2">
      <div className="flex items-end gap-[3px]">
        {[35, 50, 42, 65, 58, 80, 75, 95].map((h, i) => (
          <motion.div
            key={i}
            className="w-[6px] rounded-t bg-gradient-to-t from-autopilot/60 to-autopilot"
            initial={{ height: 0 }}
            animate={isInView ? { height: h * 0.55 } : { height: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * i, ease: 'easeOut' }}
          />
        ))}
      </div>
      {isInView && (
        <div className="flex items-baseline gap-1 text-autopilot">
          <span className="text-xl font-bold">+</span>
          <NumberTicker value={340} className="text-xl font-bold text-autopilot" />
          <span className="text-[10px] font-bold uppercase tracking-wider">%</span>
        </div>
      )}
    </div>
  )
}

/**
 * Étape 5 de Légende — le système de conversion. En bandeau : les quatre
 * premières étapes produisent l'audience, celle-ci la transforme en rendez-vous.
 */
function LegendConversionVisual() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  return (
    <div className="flex flex-shrink-0 items-center gap-3">
      <div className="w-[150px] rounded-xl border border-autopilot/30 bg-gradient-to-br from-autopilot/15 to-white/[0.02] p-2.5">
        <p className="text-[9px] font-bold uppercase tracking-wider text-autopilot">
          {fr ? 'Votre page' : 'Your page'}
        </p>
        <div className="mt-1.5 rounded-md border border-white/10 bg-black/40 px-2 py-1.5">
          <p className="text-[9px] text-neutral-500">votre@email.com</p>
        </div>
        <div className="mt-1.5 rounded-md bg-autopilot px-2 py-1.5 text-center text-[9px] font-bold text-black">
          {fr ? 'Réserver un appel' : 'Book a call'}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {[
          fr ? 'Lun. 14h' : 'Mon 2pm',
          fr ? 'Mar. 10h' : 'Tue 10am',
          fr ? 'Jeu. 16h' : 'Thu 4pm',
        ].map((slot, i) => (
          <div
            key={slot}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-md border border-autopilot/25 bg-white/5 px-2 py-1"
          >
            <Check className="flex-shrink-0 text-autopilot" size={10} />
            <span className="text-[9px] text-neutral-300">{slot}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Légende: four short steps with Magic UI animations. */
function LegendHowItWorks() {
  const { t, lang } = useLanguage()
  const steps = [t.autopilot.howItWorks.b1, t.autopilot.howItWorks.b2, t.autopilot.howItWorks.b3, t.autopilot.howItWorks.b4]

  const visuals = [
    <LegendAuditVisual key="audit" />,
    <LegendExpertsVisual key="experts" />,
    <LegendPublishVisual key="publish" />,
    <LegendIterateVisual key="iterate" />,
  ]

  return (
    <section id="how-it-works" className="relative w-full py-12 md:py-16 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(212,165,116,0.08),transparent)]" />

      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">
          <FadeInBlock>
            <div className="text-center mb-10">
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-autopilot/10 border border-autopilot/40">
                <p className="text-sm font-bold text-autopilot">{t.autopilot.howItWorks.badge}</p>
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold leading-tight"
                dangerouslySetInnerHTML={{ __html: t.autopilot.howItWorks.title }}
              />
              <p className="mt-3 text-base text-neutral-400 max-w-xl mx-auto">
                {t.autopilot.howItWorks.subtitle}
              </p>
            </div>
          </FadeInBlock>

          <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <FadeInBlock key={step.title} delay={0.1 + i * 0.1}>
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-autopilot/25 bg-gradient-to-br from-autopilot/10 to-white/[0.02]">
                  <BorderBeam size={120} duration={8 + i * 2} delay={i * 1.5} colorFrom="var(--autopilot-hex, #d4a574)" colorTo="rgba(212,165,116,0.2)" />
                  <div className="h-[160px] flex items-center justify-center p-4">{visuals[i]}</div>
                  <div className="relative mt-auto bg-gradient-to-t from-black via-black/90 to-transparent p-5 pt-4">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-autopilot text-sm font-bold text-black">
                      {i + 1}
                    </span>
                    <p className="mt-2.5 text-base font-bold text-white leading-snug">{step.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">{step.desc}</p>
                  </div>
                </div>
              </FadeInBlock>
            ))}
          </div>

          {/* Étape 5 — le système de conversion, en bandeau */}
          <FadeInBlock delay={0.5}>
            <div className="relative mt-5 overflow-hidden rounded-2xl border border-autopilot/30 bg-gradient-to-br from-autopilot/10 to-white/[0.02] p-5 md:p-7">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
                <LegendConversionVisual />
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-autopilot text-sm font-bold text-black">5</span>
                    <h3 className="text-base font-bold text-white md:text-lg">{t.autopilot.howItWorks.b5.title}</h3>
                    <span className="whitespace-nowrap rounded-full border border-autopilot/30 bg-autopilot/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-autopilot">
                      {t.autopilot.howItWorks.b5.badge}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 md:text-base">{t.autopilot.howItWorks.b5.desc}</p>
                </div>
              </div>
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}

export default function HowItWorksAccordion() {
  const { t, lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const notifications = lang === 'fr' ? getNotificationsFr(SocialIcon) : getNotificationsEn(SocialIcon)
  const topics = lang === 'fr' ? getTopicsFr() : getTopicsEn()

  // Légende buyers don't need the product demo — they're delegating, not using it.
  if (autopilot) return <LegendHowItWorks />

  return (
    <section id="how-it-works" className="relative w-full py-16 md:py-28 overflow-hidden bg-[#0a0a0a]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.08),transparent)]" />

      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
        {/* Title */}
        <FadeInBlock>
            <div className="text-center mb-6 md:mb-10">
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-empire/10 border border-empire/30">
                <p className="text-sm font-bold text-empire">
                  {lang === 'fr' ? 'COMMENT ÇA MARCHE' : 'HOW IT WORKS'}
                </p>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {lang === 'fr'
                  ? <>Lancez votre <span className="text-empire">machine média</span></>
                  : <>Launch your <span className="text-empire">media machine</span></>}
              </h2>
              <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto">
                {lang === 'fr'
                  ? 'Vous ne manquez pas de temps. Vous manquez de système. 1 h de parole, on produit le mois.'
                  : 'You don\'t lack time. You lack a system. 1 hour of talking, we produce the month.'}
              </p>
          </div>
        </FadeInBlock>

        {/* Star Rating */}
        <FadeInBlock delay={0.05}>
          <div className="flex justify-center mb-8 md:mb-10">
            <StarRating />
          </div>
        </FadeInBlock>

          {/* 4 Visual Blocks */}
        <FadeInBlock delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">

              {/* BLOCK 1 - Le cerveau Empire trouve vos sujets */}
              <div className="group relative flex flex-col overflow-hidden rounded-xl transition-all min-h-[340px] bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30">
                <div className="h-[200px]">
                  <BrainTopicsVisual topics={topics} />
                </div>
                <div className="relative z-10 p-5 pt-3 mt-auto h-[140px] bg-gradient-to-t from-black via-black/90 to-transparent">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-md bg-empire flex items-center justify-center text-black font-bold text-sm">1</span>
                    <h3 className="text-base font-semibold text-white">
                      {lang === 'fr' ? 'Nous trouvons vos prochains sujets' : 'We find your next topics'}
                    </h3>
                  </div>
                  <p className="text-neutral-400 text-sm">
                    {lang === 'fr'
                      ? 'On analyse votre expertise, votre marché et vos contenus pour identifier les angles viraux à exploiter.'
                      : 'We analyze your expertise, market and content to find the viral angles worth exploiting.'}
                  </p>
                </div>
              </div>

              {/* BLOCK 2 - Vous enregistrez */}
              <div className="group relative flex flex-col overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all min-h-[340px]">
                <div className="h-[200px] flex flex-col items-center justify-center p-6 gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-empire/30 to-empire/10 border-2 border-empire flex items-center justify-center">
                    <Mic className="text-empire" size={24} />
                  </div>
                  <VoiceAnimation />
                  <p className="text-xs text-empire font-semibold tracking-wider uppercase">
                    {lang === 'fr' ? 'Enregistrement...' : 'Recording...'}
                  </p>
                </div>
                <div className="relative z-10 p-5 pt-3 mt-auto h-[140px] bg-gradient-to-t from-black via-black/90 to-transparent">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-md bg-empire flex items-center justify-center text-black font-bold text-sm">2</span>
                    <h3 className="text-base font-semibold text-white">
                      {lang === 'fr' ? 'Vous enregistrez' : 'You record'}
                    </h3>
                  </div>
                  <p className="text-neutral-400 text-sm">
                    {lang === 'fr'
                      ? 'Vous parlez face caméra sur ces sujets, seul ou guidé par nos questions. Zéro préparation.'
                      : 'You talk on camera about those topics, freely or guided by our questions. Zero prep.'}
                  </p>
                </div>
              </div>

              {/* BLOCK 3 - On rédige et on monte */}
              <div className="group relative flex flex-col overflow-hidden rounded-xl transition-all min-h-[340px] bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30">
                <div className="h-[200px] relative overflow-hidden">
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/40 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-semibold text-green-400">
                      {lang === 'fr' ? 'Vérifié par des humains' : 'Verified by humans'}
                    </span>
                  </div>
                  <div className="absolute inset-0 pt-10 px-3 [mask-image:linear-gradient(to_top,transparent_20%,#000_100%)]">
                    <AnimatedList items={notifications} delay={1200} className="w-full" />
                  </div>
                </div>
                <div className="relative z-10 p-5 pt-3 mt-auto h-[140px] bg-gradient-to-t from-black via-black/90 to-transparent">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-md bg-empire flex items-center justify-center text-black font-bold text-sm">3</span>
                    <h3 className="text-base font-semibold text-white">
                      {lang === 'fr' ? 'On rédige et monte' : 'We write & edit'}
                    </h3>
                  </div>
                  <p className="text-neutral-400 text-sm">
                    {lang === 'fr'
                      ? 'Notre équipe découpe et monte vos Reels, rédige vos posts LinkedIn et vos newsletters.'
                      : 'Our team cuts and edits your Reels, writes your LinkedIn posts and newsletters.'}
                  </p>
                </div>
              </div>

              {/* BLOCK 4 - On duplique partout */}
              <div className="group relative flex flex-col overflow-hidden rounded-xl transition-all min-h-[340px] bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30">
                <div className="h-[200px] flex items-center justify-center p-4">
                  <CalendarGrid
                    className="max-w-[180px]"
                    label={lang === 'fr' ? '1 clic pour publier' : '1 click to publish'}
                  />
                </div>
                <div className="relative z-10 p-5 pt-3 mt-auto h-[140px] bg-gradient-to-t from-black via-black/90 to-transparent">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-md bg-empire flex items-center justify-center text-black font-bold text-sm">4</span>
                    <h3 className="text-base font-semibold text-white">
                      {lang === 'fr' ? 'On adapte aux 7 plateformes' : 'We adapt to all 7 platforms'}
                    </h3>
                  </div>
                  <p className="text-neutral-400 text-sm">
                    {lang === 'fr'
                      ? 'Chaque idée est retravaillée pour les codes de chaque plateforme. Vous validez, ça part en 1 clic.'
                      : 'Each idea is reshaped for every platform\'s codes. You approve, it goes out in 1 click.'}
                  </p>
                </div>
              </div>

            </div>
          </FadeInBlock>

          {/* BLOCK 5 - Le live hebdomadaire, en bandeau : il tourne en parallèle de la boucle */}
          <FadeInBlock delay={0.15}>
            <div className="relative mt-4 md:mt-6 overflow-hidden rounded-xl border border-empire/30 bg-gradient-to-br from-empire/10 to-white/[0.02] p-5 md:p-7">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
                <LiveWeeklyVisual />
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-empire text-sm font-bold text-black">5</span>
                    <h3 className="text-base font-semibold text-white md:text-lg">
                      {lang === 'fr'
                        ? 'Et chaque semaine, on boucle en live'
                        : 'And every week, we close the loop live'}
                    </h3>
                    <span className="hidden whitespace-nowrap rounded-full border border-empire/30 bg-empire/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-empire sm:inline">
                      {lang === 'fr' ? '1h sur Zoom' : '1h on Zoom'}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 md:text-base">
                    {lang === 'fr'
                      ? 'Une heure sur Zoom avec nos experts et la communauté : on regarde ce qui a marché, on trouve vos prochains angles, vous repartez avec une direction claire.'
                      : 'One hour on Zoom with our experts and the community: we review what worked, find your next angles, you leave with a clear direction.'}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-empire">
                    <RotateCw size={13} />
                    {lang === 'fr' ? 'Et on repart à l’étape 1' : 'And back to step 1'}
                  </p>
                </div>
              </div>
            </div>
          </FadeInBlock>

      </div>
      </div>
    </section>
  )
}
