'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { X, CheckCircle2, Calendar as CalendarIcon, TrendingUp, Clock } from 'lucide-react'

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

export default function QuickWinsSection() {
  const { lang } = useLanguage()

  return (
    <section className="container py-20 md:py-32">
      <div className="max-w-6xl mx-auto">
        <FadeInBlock>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            {lang === 'fr' ? 'Avant Empire vs Après Empire' : 'Before Empire vs After Empire'}
          </h2>
        </FadeInBlock>

        <div className="grid md:grid-cols-2 gap-8">
          {/* AVANT */}
          <FadeInBlock delay={0.1}>
            <div className="relative p-8 rounded-2xl border-2 border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="text-red-400" size={24} />
                </div>
              </div>

              <p className="text-red-400 font-bold text-sm mb-6">
                {lang === 'fr' ? 'SANS EMPIRE' : 'WITHOUT EMPIRE'}
              </p>

              {/* Mini calendrier vide */}
              <div className="mb-6 p-4 rounded-lg bg-black/40 border border-red-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon className="text-red-400" size={20} />
                  <p className="text-sm font-semibold text-neutral-400">
                    {lang === 'fr' ? 'Votre calendrier' : 'Your calendar'}
                  </p>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(28)].map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded ${
                        [3, 9, 17, 24].includes(i)
                          ? 'bg-red-500/30 border border-red-500/50'
                          : 'bg-white/5'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-neutral-500 mt-3 text-center">
                  {lang === 'fr' ? '4 posts / mois' : '4 posts / month'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <X className="text-red-400 flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {lang === 'fr' ? '12h/semaine de travail' : '12h/week of work'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {lang === 'fr' ? 'Écriture, montage, planification...' : 'Writing, editing, scheduling...'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <X className="text-red-400 flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {lang === 'fr' ? '~2K views/mois' : '~2K views/month'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {lang === 'fr' ? 'Visibilité limitée' : 'Limited visibility'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <X className="text-red-400 flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {lang === 'fr' ? 'Inconsistant & stressant' : 'Inconsistent & stressful'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {lang === 'fr' ? 'Burnout garanti' : 'Burnout guaranteed'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInBlock>

          {/* APRÈS */}
          <FadeInBlock delay={0.2}>
            <div className="relative p-8 rounded-2xl border-2 border-empire bg-gradient-to-br from-empire/10 to-transparent overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="w-10 h-10 rounded-full bg-empire/20 flex items-center justify-center">
                  <CheckCircle2 className="text-empire" size={24} />
                </div>
              </div>

              <p className="text-empire font-bold text-sm mb-6">
                {lang === 'fr' ? 'AVEC EMPIRE' : 'WITH EMPIRE'}
              </p>

              {/* Mini calendrier plein */}
              <div className="mb-6 p-4 rounded-lg bg-black/40 border border-empire/20">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon className="text-empire" size={20} />
                  <p className="text-sm font-semibold text-neutral-400">
                    {lang === 'fr' ? 'Votre calendrier' : 'Your calendar'}
                  </p>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(28)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded bg-empire/30 border border-empire/50"
                    />
                  ))}
                </div>
                <p className="text-xs text-empire font-semibold mt-3 text-center">
                  {lang === 'fr' ? '30+ posts / mois' : '30+ posts / month'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-empire flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {lang === 'fr' ? '15min/semaine de travail' : '15min/week of work'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {lang === 'fr' ? 'Juste parler, on fait le reste' : 'Just talk, we do the rest'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-empire flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {lang === 'fr' ? '1M+ views/mois' : '1M+ views/month'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {lang === 'fr' ? 'Visibilité maximale' : 'Maximum visibility'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-empire flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {lang === 'fr' ? 'Publié quotidiennement' : 'Published daily'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {lang === 'fr' ? 'Omnipresence automatique' : 'Automatic omnipresence'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInBlock>
        </div>

        {/* Bottom stat */}
        <FadeInBlock delay={0.3}>
          <div className="mt-12 text-center">
            <p className="text-xl md:text-2xl text-neutral-300">
              {lang === 'fr' ? 'Récupérez ' : 'Get back '}
              <span className="text-empire font-bold">
                {lang === 'fr' ? '11h45/semaine' : '11h45/week'}
              </span>
              {lang === 'fr' ? ' de votre vie' : ' of your life'}
            </p>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

