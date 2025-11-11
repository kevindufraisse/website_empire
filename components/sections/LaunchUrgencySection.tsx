'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Clock, Users, TrendingUp, AlertCircle } from 'lucide-react'
import { PRICING, LAUNCH_OFFER_ACTIVE } from '@/lib/pricing-config'

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

export default function LaunchUrgencySection() {
  const { lang } = useLanguage()

  // Ne s'affiche que si l'offre de lancement est active
  if (!LAUNCH_OFFER_ACTIVE) return null

  return (
    <section className="container py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <FadeInBlock>
          <div className="relative p-8 md:p-10 rounded-2xl bg-gradient-to-br from-red-500/10 via-orange-500/5 to-yellow-500/5 border-2 border-orange-500/30 overflow-hidden">
            {/* Animated border */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20 opacity-50 animate-pulse" />
            
            <div className="relative z-10">
              {/* Title */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/40 mb-4">
                  <AlertCircle className="text-orange-400" size={18} />
                  <span className="text-sm font-bold text-orange-400">
                    {lang === 'fr' ? 'IMPORTANT À SAVOIR' : 'IMPORTANT TO KNOW'}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {lang === 'fr' ? 'Pourquoi rejoindre maintenant ?' : 'Why Join Now?'}
                </h3>
                <p className="text-neutral-300 text-sm md:text-base">
                  {lang === 'fr' 
                    ? 'Cette offre ne sera pas disponible éternellement'
                    : 'This offer won\'t be available forever'}
                </p>
              </div>

              {/* 3 Points Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* 1. Launch Pricing */}
                <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-empire/30 to-empire/10 border-2 border-empire flex items-center justify-center mb-4">
                    <Clock className="text-empire" size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {lang === 'fr' ? '🔥 Prix de lancement' : '🔥 Launch Pricing'}
                  </h4>
                  <p className="text-sm text-neutral-400 mb-3">
                    {lang === 'fr' 
                      ? `${PRICING.monthly}€/mois pendant 1 mois`
                      : `€${PRICING.monthly}/month for 1 month`}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {lang === 'fr' 
                      ? `Puis retour à ${PRICING.monthlyNormal}€/mois`
                      : `Then back to €${PRICING.monthlyNormal}/month`}
                  </p>
                </div>

                {/* 2. Limited to 100 */}
                <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500/30 to-orange-500/10 border-2 border-orange-500 flex items-center justify-center mb-4">
                    <Users className="text-orange-400" size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {lang === 'fr' ? 'Limité à 100 clients' : 'Limited to 100 Clients'}
                  </h4>
                  <p className="text-sm text-neutral-400 mb-3">
                    {lang === 'fr' ? 'Seulement 83 places restantes' : 'Only 83 spots remaining'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {lang === 'fr' 
                      ? 'À 100/100, les inscriptions ferment'
                      : 'At 100/100, registrations close'}
                  </p>
                </div>

                {/* 3. Price Increase */}
                <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500/30 to-red-500/10 border-2 border-red-500 flex items-center justify-center mb-4">
                    <TrendingUp className="text-red-400" size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {lang === 'fr' ? 'Prix va augmenter' : 'Price Will Increase'}
                  </h4>
                  <p className="text-sm text-neutral-400 mb-3">
                    {lang === 'fr' 
                      ? `${PRICING.monthly}€ → ${PRICING.monthlyNormal}€/mois`
                      : `€${PRICING.monthly} → €${PRICING.monthlyNormal}/month`}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {lang === 'fr' 
                      ? 'Après le 1er mois'
                      : 'After the 1st month'}
                  </p>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-8 text-center">
                <a
                  href="/pricing"
                  className="inline-block px-8 py-4 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(218,252,104,0.4)]"
                >
                  {lang === 'fr' ? 'Voir les Plans Maintenant' : 'View Plans Now'}
                </a>
                <p className="text-xs text-neutral-500 mt-3">
                  {lang === 'fr' 
                    ? 'Profitez du prix de lancement avant qu\'il n\'augmente'
                    : 'Get launch pricing before it increases'}
                </p>
              </div>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

