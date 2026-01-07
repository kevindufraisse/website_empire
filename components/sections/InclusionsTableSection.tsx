'use client'
import { PRICING } from '@/lib/pricing-config'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { CheckCircle2, FileText, Video, Mail, Image as ImageIcon, Headphones, Globe2, Bot, Code } from 'lucide-react'

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

export default function InclusionsTableSection() {
  const { lang } = useLanguage()

  const contentOutputs = [
    {
      icon: FileText,
      name: lang === 'fr' ? '30 Posts LinkedIn' : '30 LinkedIn Posts',
    },
    {
      icon: Mail,
      name: lang === 'fr' ? '30 Newsletters' : '30 Newsletters',
    },
    {
      icon: Video,
      name: lang === 'fr' ? '30 Reels/Shorts' : '30 Reels/Shorts',
    },
    {
      icon: FileText,
      name: lang === 'fr' ? '30 Posts Instagram' : '30 Instagram Posts',
    },
    {
      icon: FileText,
      name: lang === 'fr' ? '30 Posts Twitter' : '30 Twitter Posts',
    },
    {
      icon: ImageIcon,
      name: lang === 'fr' ? '4 Carrousels' : '4 Carousels',
    },
    {
      icon: Headphones,
      name: lang === 'fr' ? '4 Podcasts MP3' : '4 MP3 Podcasts',
    },
  ]

  const bonusFeatures = [
    {
      icon: Bot,
      name: 'LinkedIn AI Setter',
      badge: lang === 'fr' ? 'Bonus' : 'Bonus',
    },
    {
      icon: Globe2,
      name: lang === 'fr' ? 'Accès API Multi-diffusion' : 'Multi-Distribution API Access',
      badge: lang === 'fr' ? 'Bonus' : 'Bonus',
    },
  ]

  const support = [
    {
      icon: CheckCircle2,
      name: lang === 'fr' ? 'Assistant QA Humain' : 'Human QA Assistant',
    },
  ]

  return (
    <section className="container py-20 md:py-32">
      <div className="max-w-4xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {lang === 'fr' ? 'Ce Que Vous Obtenez' : 'What You Get'}
            </h2>
            <p className="text-xl text-neutral-300">
              {lang === 'fr' 
                ? 'Tout inclus dans chaque plan. Aucun supplément.'
                : 'Everything included in every plan. No upsells.'}
            </p>
          </div>
        </FadeInBlock>

        <FadeInBlock delay={0.1}>
          <div className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10">
            {/* Content Outputs */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">
                {lang === 'fr' ? 'Contenus Créés' : 'Content Outputs'}
              </h3>
              <div className="space-y-3">
                {contentOutputs.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-empire/10 border border-empire/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <item.icon className="text-empire" size={20} />
                      </div>
                      <p className="font-semibold text-white">{item.name}</p>
                    </div>
                    <CheckCircle2 className="text-empire" size={20} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bonus Features */}
            <div className="mb-8 pt-8 border-t border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">
                {lang === 'fr' ? 'Fonctionnalités Bonus' : 'Bonus Features'}
              </h3>
              <div className="space-y-3">
                {bonusFeatures.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-empire/5 hover:bg-empire/10 transition-all group border border-empire/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-empire/20 border border-empire/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <item.icon className="text-empire" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        {item.badge && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-empire/20 border border-empire/30 text-empire text-xs font-bold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <CheckCircle2 className="text-empire" size={20} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="mb-8 pt-8 border-t border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">
                {lang === 'fr' ? 'Support' : 'Support'}
              </h3>
              <div className="space-y-3">
                {support.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.05, duration: 0.5 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-empire/10 border border-empire/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <item.icon className="text-empire" size={20} />
                      </div>
                      <p className="font-semibold text-white">{item.name}</p>
                    </div>
                    <CheckCircle2 className="text-empire" size={20} />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <p className="text-sm text-neutral-400 mb-2">
                {lang === 'fr' ? 'Valeur totale si acheté séparément :' : 'Total value if purchased separately:'}
              </p>
              <p className="text-4xl font-bold text-empire mb-1">
                €15,800{lang === 'fr' ? '/mois' : '/month'}
              </p>
              <p className="text-neutral-300">
                {lang === 'fr' ? 'Vous payez :' : 'You pay:'} 
                <span className="text-white font-bold"> €{PRICING.yearly}{lang === 'fr' ? '/mois' : '/month'}</span>
              </p>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

