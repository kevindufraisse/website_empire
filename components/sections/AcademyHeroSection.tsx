'use client'
import { motion } from 'framer-motion'
import RetroGrid from '@/components/magicui/retro-grid'
import { Meteors } from '@/components/magicui/meteors'

const stats = [
  { value: '3 000€', label: 'par mois', sub: 'objectif atteignable' },
  { value: '4h', label: 'par semaine', sub: 'une fois lancé' },
  { value: '7M', label: 'vues générées', sub: 'avec la méthode' },
  { value: '21', label: 'jours pour', sub: 'tout maîtriser' },
]

export default function AcademyHeroSection() {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-b from-black via-transparent to-[#0f0f0f]">
      <RetroGrid />
      <Meteors number={12} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(218,252,104,0.12),transparent)]" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge lancement */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-empire/10 border border-empire/40"
          >
            <span className="w-2 h-2 rounded-full bg-empire animate-pulse" />
            <p className="text-xs font-bold text-empire tracking-widest uppercase">
              Bootcamp de lancement · Places limitées · Offre à 500€ uniquement au lancement
            </p>
          </motion.div>

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-sm text-neutral-400 mb-3 tracking-widest uppercase"
          >
            Empire Internet · Bootcamp 21 jours
          </motion.p>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4"
          >
            On forme les prochains{' '}
            <span className="text-empire">Head of Viralité.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-base md:text-lg text-empire font-semibold mb-3"
          >
            Les meilleurs reçoivent nos clients directement.
          </motion.p>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-4"
          >
            Découvre le nouveau métier qui permet de gagner 3 000€/mois en 4h par semaine — et que l'IA ne peut pas te voler. En 21 jours, tu maîtrises les techniques qui nous ont valu 7 millions de vues sur tous les réseaux.
          </motion.p>

          {/* Proof line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-xs md:text-sm text-neutral-500 mb-8"
          >
            → 7 000 000 vues générées · 2M vues/mois · Applicable par n'importe qui · 0 audience requise
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center gap-3 mb-8"
          >
            <a
              href="#academy-pricing"
              className="px-8 py-4 bg-empire text-black font-bold text-lg rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(218,252,104,0.35)] inline-block"
            >
              Je postule au bootcamp à 500€ →
            </a>
            <p className="text-xs text-neutral-500">
              6 lives experts · 2 Q&A en direct · Vidéos · Exercices · Groupe privé
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all">
                <span className="text-2xl md:text-3xl font-black text-empire">{stat.value}</span>
                <span className="text-xs md:text-sm text-white font-semibold mt-1">{stat.label}</span>
                <span className="text-[10px] md:text-xs text-neutral-500 mt-0.5">{stat.sub}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
