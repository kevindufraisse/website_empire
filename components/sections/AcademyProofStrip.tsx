'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import NumberTicker from '@/components/magicui/number-ticker'
import { useLanguage } from '@/contexts/LanguageContext'

function StatCard({
  label,
  raw,
  suffix = '',
  staticVal,
  isAfter,
  delay,
  inView,
}: {
  label: string
  raw: number | null
  suffix?: string
  staticVal: string | null
  isAfter: boolean
  delay: number
  inView: boolean
}) {
  return (
    <div className={`flex flex-col items-center py-3 px-4 rounded-xl border transition-all ${
      isAfter
        ? 'bg-academy/10 border-academy/40'
        : 'bg-white/[0.08] border-white/15'
    }`}>
      <span className={`text-xl md:text-2xl font-black tabular-nums leading-none ${isAfter ? 'text-academy' : 'text-neutral-400'}`}>
        {isAfter && raw !== null && inView ? (
          <><NumberTicker value={raw} delay={delay} className={isAfter ? 'text-academy' : 'text-neutral-400'} />{suffix}</>
        ) : (
          staticVal
        )}
      </span>
      <span className={`text-[10px] mt-1 ${isAfter ? 'text-academy/60' : 'text-neutral-400'}`}>{label}</span>
    </div>
  )
}

function formatBig(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.', ',') + 'M'
  if (n >= 1_000) return Math.round(n / 1000) + 'K'
  return n.toString()
}

export default function AcademyProofStrip() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const before = [
    { label: fr ? 'Vues' : 'Views', value: '247', raw: null },
    { label: 'Likes', value: '4', raw: null },
    { label: fr ? 'Abonnés gagnés' : 'Followers gained', value: '0', raw: null },
    { label: fr ? 'RDV générés / mois' : 'Meetings booked / month', value: '0', raw: null },
    { label: fr ? 'Revenus générés' : 'Revenue generated', value: '0€', raw: null },
  ]

  const after = [
    { label: fr ? 'Vues' : 'Views', value: null, raw: 1199942, suffix: '' },
    { label: 'Likes', value: null, raw: 38391, suffix: '' },
    { label: fr ? 'Abonnés gagnés' : 'Followers gained', value: null, raw: 2099, suffix: '+' },
    { label: fr ? 'RDV générés / mois' : 'Meetings booked / month', value: null, raw: 14, suffix: '+' },
    { label: fr ? 'Revenus générés' : 'Revenue generated', value: null, raw: 3200, suffix: '€' },
  ]

  return (
    <section ref={ref} className="relative py-12 md:py-16 bg-[#0a0a0a] border-y border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(252, 165, 165,0.03),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto">

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center text-xs font-bold text-neutral-400 tracking-widest uppercase mb-8"
          >
            {fr ? 'Ce que ça change - en 21 jours' : 'What it changes - in 21 days'}
          </motion.p>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-6">

            {/* AVANT */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                  <span className="text-neutral-400 text-[10px] font-black">↓</span>
                </div>
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{fr ? 'Avant' : 'Before'}</span>
              </div>
              {before.map((s, i) => (
                <StatCard
                  key={i}
                  label={s.label}
                  raw={null}
                  staticVal={s.value}
                  isAfter={false}
                  delay={0}
                  inView={inView}
                />
              ))}
            </motion.div>

            {/* Flèche centrale */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-10 h-10 rounded-full bg-academy/20 border border-academy/40 flex items-center justify-center shadow-[0_0_20px_rgba(252, 165, 165,0.2)]">
                <span className="text-academy font-black text-lg">→</span>
              </div>
              <span className="text-[9px] font-bold text-academy/60 uppercase tracking-wider text-center leading-tight">21<br/>{fr ? 'jours' : 'days'}</span>
            </motion.div>

            {/* APRÈS */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-academy/20 border border-academy/40 flex items-center justify-center">
                  <span className="text-academy text-[10px] font-black">↑</span>
                </div>
                <span className="text-xs font-semibold text-academy uppercase tracking-wider">{fr ? 'Après' : 'After'}</span>
              </div>
              {after.map((s, i) => (
                <StatCard
                  key={i}
                  label={before[i].label}
                  raw={s.raw}
                  suffix={s.suffix}
                  staticVal={s.raw !== null ? formatBig(s.raw) + s.suffix : s.value}
                  isAfter={true}
                  delay={0.4 + i * 0.15}
                  inView={inView}
                />
              ))}
            </motion.div>

          </div>

          {/* Légende */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-center text-xs text-neutral-400 mt-8"
          >
            {fr
              ? "Résultats de nos clients agence · La méthode exacte qu'on t'enseigne"
              : "Results from our agency clients · The exact method we teach you"}
          </motion.p>

        </div>
      </div>
    </section>
  )
}
