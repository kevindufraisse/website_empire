'use client'
import { motion } from 'framer-motion'
import RetroGrid from '@/components/magicui/retro-grid'
import { Meteors } from '@/components/magicui/meteors'
import { SparklesText } from '@/components/magicui/sparkles-text'
import { useApplicationCount } from '@/hooks/useApplicationCount'
import { COHORT_RANGE_SHORT } from '@/lib/cohort-config'

const MAX_SELECTED = 20

const founders = [
  {
    name: 'Kevin Dufraisse',
    url: 'https://www.linkedin.com/in/kevin-dufraisse/',
    img: '/founders/kevin.png',
    stats: [
      '#48 influenceur LinkedIn France',
      '2M de vues / mois',
      '+4 000 clients accompagnés',
    ],
  },
  {
    name: 'Marc Dufraisse',
    url: 'https://www.linkedin.com/in/marc-dufraisse/',
    img: '/founders/marc.jpg',
    stats: [
      '40K abonnés LinkedIn',
      '+4 000 leads en 1 post',
      'Top 3 expert IA France',
    ],
  },
]

export default function AcademyHeroSection() {
  const appCount = useApplicationCount()

  return (
    <section className="relative w-full py-24 md:py-36 overflow-hidden bg-gradient-to-b from-black via-transparent to-[#0f0f0f]">
      <RetroGrid />
      <Meteors number={12} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(252, 165, 165,0.12),transparent)]" />

      <div className="container relative z-10">

        {/* 3-column layout: Kevin | Center content | Marc */}
        <div className="relative flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-6">

          {/* Kevin - left */}
          <motion.a
            href={founders[0].url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="hidden lg:flex flex-col items-center gap-3 w-48 mt-24 group"
          >
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-academy/40 group-hover:border-academy transition-all shadow-[0_0_25px_rgba(252, 165, 165,0.15)]">
              <img src={founders[0].img} alt={founders[0].name} className="w-full h-full object-cover" />
            </div>
            <p className="text-sm font-bold text-white group-hover:text-academy transition-colors">{founders[0].name}</p>
            <div className="flex flex-col gap-1.5">
              {founders[0].stats.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-academy flex-shrink-0" />
                  <span className="text-[11px] text-neutral-400 leading-tight">{s}</span>
                </div>
              ))}
            </div>
          </motion.a>

          {/* Center content */}
          <div className="max-w-3xl text-center flex-1">

            {/* Tier kicker - positions Academy against Copilot/Autopilot */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-5 flex justify-center"
            >
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full border bg-academy/10 border-academy/40 shadow-[0_0_20px_rgba(252,165,165,0.2)]">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-academy" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-academy" />
                </span>
                <span className="text-[11px] md:text-xs font-black tracking-[0.18em] uppercase text-academy flex-shrink-0">
                  Academy
                </span>
                <span className="hidden sm:inline text-[11px] md:text-xs text-neutral-400 font-medium">
                  21 jours · Contenu produit pour toi
                </span>
              </div>
            </motion.div>

            {/* Badge + date */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-2 mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-academy/10 border border-academy/40">
                <span className="w-2 h-2 rounded-full bg-academy animate-pulse" />
                <p className="text-xs font-bold text-academy tracking-widest uppercase">
                  {appCount !== null
                    ? `${appCount} candidatures · ${MAX_SELECTED} sélectionnés`
                    : `Sur sélection · ${MAX_SELECTED} admis`}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/15">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-academy flex-shrink-0">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="text-xs text-academy font-bold">{COHORT_RANGE_SHORT}</span>
              </div>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-5"
            >
              21 jours pour apprendre la{' '}
              <SparklesText className="text-academy" sparklesCount={7} colors={{ first: '#fca5a5', second: '#f87171' }}>
                viralité
              </SparklesText>
              .
            </motion.h1>

            {/* Value prop - one unified block */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-md mx-auto mb-8"
            >
              <p className="text-lg md:text-xl text-neutral-300 text-center mb-5">
                1 challenge par jour. On écrit et monte ton contenu. Tu publies sur :
              </p>
              <div className="flex items-center justify-center gap-3 mb-5">
                {[
                  { name: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                  { name: 'YouTube', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
                  { name: 'Instagram', path: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                  { name: 'TikTok', path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z' },
                  { name: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                  { name: 'Threads', path: 'M141.537 88.988c-.893-.452-1.804-.875-2.732-1.27-1.56-27.306-16.398-42.94-41.457-43.1h-.165c-14.985 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.077c8.25.053 14.474 2.452 18.503 7.129 2.933 3.405 4.893 8.11 5.865 14.05-7.314-1.243-15.224-1.625-23.68-1.14-23.82 1.372-39.134 15.264-38.105 34.568.519 9.792 5.397 18.216 13.733 23.719 7.047 4.652 16.123 6.927 25.557 6.412 12.457-.683 22.23-5.437 29.048-14.127 5.178-6.601 8.452-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.547 38.375-11.318 11.309-24.924 16.2-45.587 16.352-22.81-.17-40.06-7.484-51.275-21.742C20.168 139.965 14.74 120.681 14.537 96c.203-24.681 5.631-43.965 16.136-57.314C41.929 24.425 59.179 17.11 81.988 16.94c22.975.17 40.526 7.521 52.171 21.847 5.71 7.025 10.016 15.861 12.853 26.162l17.147-4.308c-3.44-12.7-8.853-23.626-16.22-32.687C133.036 9.641 111.202.196 82.07 0H81.942C52.867.19 31.277 9.642 16.773 28.08 3.867 44.487-2.79 67.316-3.007 95.932L-3 96l-0.007.068c.217 28.616 6.874 51.445 19.78 67.852C31.277 182.358 52.867 191.81 81.942 192h1.112c26.96-.173 44.555-6.708 59.05-21.19C161.08 151.866 160.51 128.12 154.26 113.54c-4.484-10.454-13.033-18.945-24.724-24.553zM98.44 129.507c-10.44.588-21.286-4.098-21.821-14.135-.464-7.441 5.229-15.745 22.394-16.735 1.966-.113 3.895-.168 5.79-.168 6.235 0 12.068.606 17.371 1.766-1.978 24.702-13.58 28.713-23.734 29.272z', viewBox: '0 0 192 192' },
                ].map((p, i) => (
                  <div key={i} className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center" title={p.name}>
                    <svg viewBox={p.viewBox || '0 0 24 24'} fill="currentColor" className="w-3.5 h-3.5 text-neutral-400">
                      <path d={p.path} />
                    </svg>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {[
                  'Comprendre pourquoi certains contenus explosent - et le reproduire',
                  'Maîtriser la viralité sur tous les réseaux en même temps',
                  'Transformer les vues en clients et en revenus concrets',
                ].map((line, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-left">
                    <span className="text-academy mt-0.5 flex-shrink-0 font-bold">›</span>
                    <span className="text-base text-neutral-200">{line}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col items-center gap-2 mb-10"
            >
              <a
                href="/candidature"
                className="px-10 py-4 bg-academy text-black font-bold text-lg rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(252, 165, 165,0.35)] inline-block"
              >
                Postuler - sur sélection →
              </a>
              <p className="text-xs text-neutral-400">
                Formulaire de 2 min · Aucun engagement
              </p>
            </motion.div>


          </div>

          {/* Marc - right */}
          <motion.a
            href={founders[1].url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="hidden lg:flex flex-col items-center gap-3 w-48 mt-24 group"
          >
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-academy/40 group-hover:border-academy transition-all shadow-[0_0_25px_rgba(252, 165, 165,0.15)]">
              <img src={founders[1].img} alt={founders[1].name} className="w-full h-full object-cover" />
            </div>
            <p className="text-sm font-bold text-white group-hover:text-academy transition-colors">{founders[1].name}</p>
            <div className="flex flex-col gap-1.5">
              {founders[1].stats.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-academy flex-shrink-0" />
                  <span className="text-[11px] text-neutral-400 leading-tight">{s}</span>
                </div>
              ))}
            </div>
          </motion.a>

        </div>

        {/* Mobile founders - shown below center content on small screens */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="lg:hidden grid grid-cols-2 gap-4 max-w-md mx-auto mt-10"
        >
          {founders.map((f, idx) => (
            <a
              key={idx}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white/[0.08] border border-white/15 hover:border-academy/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-academy/30 group-hover:border-academy transition-all">
                <img src={f.img} alt={f.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs font-bold text-white group-hover:text-academy transition-colors">{f.name}</p>
              <div className="flex flex-col gap-1">
                {f.stats.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-academy flex-shrink-0" />
                    <span className="text-[10px] text-neutral-400 leading-tight">{s}</span>
                  </div>
                ))}
              </div>
            </a>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
