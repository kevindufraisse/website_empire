'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Users, TrendingUp, Award, ArrowRight } from 'lucide-react'

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

export default function CoachingAddonSection() {
  const { lang } = useLanguage()

  const features = [
    {
      icon: Users,
      title: lang === 'fr' ? 'Experts Reconnus' : 'Proven Experts',
      description: lang === 'fr' 
        ? 'Coachs qui ont accompagné les top-tiers FR et US'
        : 'Coaches who worked with top-tier creators in France and the US',
    },
    {
      icon: TrendingUp,
      title: lang === 'fr' ? 'Stratégie Sur-Mesure' : 'Custom Strategy',
      description: lang === 'fr'
        ? 'Plan personnalisé pour votre personal branding'
        : 'Personalized plan for your personal branding',
    },
    {
      icon: Award,
      title: lang === 'fr' ? 'Résultats Prouvés' : 'Proven Results',
      description: lang === 'fr'
        ? 'Méthodes testées avec les meilleurs créateurs'
        : 'Methods tested with the best creators',
    },
  ]

  return (
    <section className="container py-20 md:py-32">
      <div className="max-w-5xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-empire/10 border border-empire/30 text-empire text-sm font-bold mb-4">
              {lang === 'fr' ? 'OPTION SUPPLÉMENTAIRE' : 'OPTIONAL ADD-ON'}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {lang === 'fr' 
                ? 'Coaching Personal Branding'
                : 'Personal Branding Coaching'}
            </h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              {lang === 'fr'
                ? 'Travaillez avec des experts qui ont accompagné les meilleurs créateurs pour développer votre marque personnelle.'
                : 'Work with experts who coached top creators to build your personal brand.'}
            </p>
          </div>
        </FadeInBlock>

        <FadeInBlock delay={0.1}>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-empire/10 border border-empire/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-empire" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </FadeInBlock>

        <FadeInBlock delay={0.2}>
          <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-empire/10 to-empire/5 border border-empire/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {lang === 'fr' 
                    ? 'À partir de 700€/mois'
                    : 'Starting at €700/month'}
                </h3>
                <p className="text-neutral-300">
                  {lang === 'fr'
                    ? 'Disponible après souscription à Empire. Contactez-nous pour en savoir plus.'
                    : 'Available after subscribing to Empire. Contact us to learn more.'}
                </p>
              </div>
              <a
                href="mailto:contact@empireinternet.com?subject=Personal%20Branding%20Coaching"
                className="px-8 py-4 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)] flex items-center gap-2 whitespace-nowrap"
              >
                {lang === 'fr' ? 'En Savoir Plus' : 'Learn More'}
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

