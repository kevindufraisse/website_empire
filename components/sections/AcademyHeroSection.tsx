'use client'
import { motion } from 'framer-motion'
import RetroGrid from '@/components/magicui/retro-grid'
import { Meteors } from '@/components/magicui/meteors'
import { SparklesText } from '@/components/magicui/sparkles-text'
import NumberTicker from '@/components/magicui/number-ticker'
import Image from 'next/image'
import { useApplicationCount } from '@/hooks/useApplicationCount'

const MAX_SELECTED = 20

const stats = [
  { ticker: 3000, suffix: '€', label: 'objectif élèves', sub: 'dès les 1ers mois' },
  { ticker: 4, suffix: 'h', label: 'par semaine', sub: 'système en place' },
  { ticker: 10, suffix: 'M+', label: 'vues/mois', sub: 'générées pour nos clients' },
  { ticker: 21, suffix: 'j', label: 'durée du bootcamp', sub: 'de zéro à opérationnel' },
]

const founders = [
  {
    name: 'Kevin Dufraisse',
    role: 'Contenu viral & stratégie',
    url: 'https://www.linkedin.com/in/kevin-dufraisse/',
    img: 'https://media.licdn.com/dms/image/v2/D4E03AQG4nlTt-7wB9w/profile-displayphoto-crop_800_800/B4EZi8WwoyHEAI-/0/1755506740516?e=1775692800&v=beta&t=3Oq_HdQ6GKMFVN6CwQCbvB2Qh7VWo1ls1KIroOyhPYY',
  },
  {
    name: 'Marc Dufraisse',
    role: 'IA & accompagnement 1:1',
    url: 'https://www.linkedin.com/in/marc-dufraisse/',
    img: 'https://media.licdn.com/dms/image/v2/D4E03AQF43VvOp7iRkw/profile-displayphoto-scale_400_400/B4EZzc5.uqHAAg-/0/1773232713405?e=1775692800&v=beta&t=Z4CykW-joMs63r3xGQHIdOaqpNtjtC7jQdcL5HSHJNs',
  },
]

export default function AcademyHeroSection() {
  const appCount = useApplicationCount()

  return (
    <section className="relative w-full py-24 md:py-36 overflow-hidden bg-gradient-to-b from-black via-transparent to-[#0f0f0f]">
      <RetroGrid />
      <Meteors number={12} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(218,252,104,0.12),transparent)]" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge + date + candidatures */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-empire/10 border border-empire/40">
              <span className="w-2 h-2 rounded-full bg-empire animate-pulse" />
              <p className="text-xs font-bold text-empire tracking-widest uppercase">
                {appCount !== null
                  ? `${appCount} candidatures · ${MAX_SELECTED} sélectionnés`
                  : `Sur sélection · ${MAX_SELECTED} admis`}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/15">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-empire flex-shrink-0">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-xs text-empire font-bold">25 avr → 17 mai</span>
            </div>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4"
          >
            Deviens expert en viralité.{' '}
            <br className="hidden sm:block" />
            <SparklesText className="text-empire" sparklesCount={7} colors={{ first: '#DAFC68', second: '#a8f040' }}>
              Gagne 3 000€/mois
            </SparklesText>
            {' '}en 4h/semaine.
          </motion.h1>

          {/* Definition under H1 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="text-xs text-neutral-500 mb-6 tracking-wide"
          >
            Head of Viralité = la personne qui sait pourquoi un contenu explose - et qui peut le reproduire à la demande.
          </motion.p>

          {/* Subtitle - Joanna Wiebe style */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-10"
          >
            En 21 jours, tu sais créer des posts qui font des centaines de milliers de vues.{' '}
            <span className="text-white font-semibold">Et tu peux vendre cette compétence à des clients.</span>
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center gap-2 mb-12"
          >
            <a
              href="/candidature"
              className="px-10 py-4 bg-empire text-black font-bold text-lg rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(218,252,104,0.35)] inline-block"
            >
              Postuler - sur sélection →
            </a>
            <p className="text-xs text-neutral-500">
              Formulaire de 2 min · Réponse le 2 avril · Aucun engagement
            </p>
          </motion.div>


          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-10"
          >
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center py-3 px-2 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all">
                <span className="text-xl md:text-2xl font-black text-empire tabular-nums">
                  <NumberTicker value={s.ticker} delay={0.4 + i * 0.12} className="text-empire" />
                  {s.suffix}
                </span>
                <span className="text-[11px] text-white font-semibold mt-0.5">{s.label}</span>
                <span className="text-[10px] text-neutral-500">{s.sub}</span>
              </div>
            ))}
          </motion.div>

          {/* Founders */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {founders.map((f) => (
              <a
                key={f.name}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:border-empire/40 hover:bg-empire/5 transition-all group"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-empire/30">
                  <Image src={f.img} alt={f.name} width={32} height={32} className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white group-hover:text-empire transition-colors leading-tight">{f.name}</p>
                  <p className="text-[10px] text-neutral-500 leading-tight">{f.role}</p>
                </div>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-neutral-600 group-hover:text-empire transition-colors ml-0.5">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
