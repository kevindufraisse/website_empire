'use client'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PricingPageHero() {
  const { lang } = useLanguage()
  
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-b from-black via-transparent to-[#0f0f0f]">
      <div className="container">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(218,252,104,0.15),transparent)]" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 rounded-full bg-empire/10 border border-empire/30 text-empire text-sm font-semibold mb-6">
              {lang === 'fr' ? '92% MOINS CHER vs Équipe Interne' : '92% OFF vs In-house Team'}
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
          >
            {lang === 'fr' ? 'Commencez à ' : 'Start at '}
            <span className="text-empire">€280{lang === 'fr' ? '/semaine' : '/week'}</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl md:text-2xl text-neutral-300 max-w-3xl mx-auto"
          >
            {lang === 'fr' 
              ? 'Pendant que d\'autres dépensent €12,000+ pour des équipes de contenu, obtenez les mêmes résultats à partir de €280/semaine. Annulez quand vous voulez.'
              : 'While others spend €12,000+ on content teams, get the same results starting at €280/week. Cancel anytime.'}
          </motion.p>
        </div>
      </div>
    </section>
  )
}

