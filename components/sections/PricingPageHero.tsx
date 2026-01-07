'use client'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import { PRICING, LAUNCH_OFFER_ACTIVE } from '@/lib/pricing-config'

export default function PricingPageHero() {
  const { lang } = useLanguage()
  
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-b from-black via-transparent to-[#0f0f0f]">
      <div className="container">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(218,252,104,0.15),transparent)]" />
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {LAUNCH_OFFER_ACTIVE && (
              <div className="inline-block px-4 py-2 rounded-full bg-empire text-black text-sm font-bold mb-4">
                🔥 {lang === 'fr' ? 'OFFRE DE LANCEMENT ACTIVE' : 'LAUNCH OFFER ACTIVE'}
              </div>
            )}
            <div className="inline-block px-4 py-2 rounded-full bg-empire/10 border border-empire/30 text-empire text-sm font-semibold mb-6">
              {lang === 'fr' ? `${PRICING.percentOff}% MOINS CHER vs Équipe Interne` : `${PRICING.percentOff}% OFF vs In-house Team`}
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4"
          >
            {lang === 'fr' ? 'Commencez à ' : 'Start at '}
            <span className="text-empire">€{PRICING.monthly}{lang === 'fr' ? '/mois' : '/month'}</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl md:text-2xl text-neutral-300 max-w-3xl mx-auto mb-12"
          >
            {lang === 'fr' 
              ? `Pendant que d'autres dépensent €12,000+ pour des équipes de contenu, obtenez les mêmes résultats à partir de €${PRICING.monthly}/mois. Annulez quand vous voulez.`
              : `While others spend €12,000+ on content teams, get the same results starting at €${PRICING.monthly}/month. Cancel anytime.`}
          </motion.p>

          {/* Top Creators Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="text-center">
              <p className="text-sm text-neutral-400 mb-2">
                {lang === 'fr' 
                  ? 'Les systèmes utilisés par les meilleurs créateurs mondiaux'
                  : 'The systems used by the world\'s top creators'}
              </p>
              <p className="text-xs text-red-400 font-semibold mb-4">
                {lang === 'fr'
                  ? 'Ils paient 50-100K€/mois pour leurs systèmes de contenu'
                  : 'They pay €50-100K/month for their content systems'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {/* Grant Cardone */}
                <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group">
                  <img 
                    src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4295dabe20aff6b9885_Cardone.webp"
                    alt="Grant Cardone"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-center">
                    <p className="text-xs font-bold text-white group-hover:text-empire transition-colors">Grant Cardone</p>
                    <p className="text-[10px] text-neutral-500">~€100K/mo</p>
                  </div>
                </div>

                {/* Alex Hormozi */}
                <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group">
                  <img 
                    src="https://yt3.googleusercontent.com/29XFUn3pc3cC81yUUCFiyCKKdgi856IGMJ4EZBnf53zTfrWWUGvmYnYGx86K08f4XR03UxpWyw=s900-c-k-c0x00ffffff-no-rj"
                    alt="Alex Hormozi"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-center">
                    <p className="text-xs font-bold text-white group-hover:text-empire transition-colors">Alex Hormozi</p>
                    <p className="text-[10px] text-neutral-500">~€80K/mo</p>
                  </div>
                </div>

                {/* Ali Abdaal */}
                <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group">
                  <img 
                    src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d436f96370e8ccb7c4_Abdaal.webp"
                    alt="Ali Abdaal"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-center">
                    <p className="text-xs font-bold text-white group-hover:text-empire transition-colors">Ali Abdaal</p>
                    <p className="text-[10px] text-neutral-500">~€75K/mo</p>
                  </div>
                </div>

                {/* Matt Gray */}
                <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group">
                  <img 
                    src="https://yt3.googleusercontent.com/W_GKaSoEuny3REkdSVW-AD6wcB_z5Ltr3hY_Mos94yDKlFLupVnJ6Gf8w1YfjEGps2nr62fB=s160-c-k-c0x00ffffff-no-rj"
                    alt="Matt Gray"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-center">
                    <p className="text-xs font-bold text-white group-hover:text-empire transition-colors">Matt Gray</p>
                    <p className="text-[10px] text-neutral-500">~€60K/mo</p>
                  </div>
                </div>

                {/* Chris Williamson */}
                <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group">
                  <img 
                    src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d4f950bcf495c7dfb2_Williamson.webp"
                    alt="Chris Williamson"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-center">
                    <p className="text-xs font-bold text-white group-hover:text-empire transition-colors">Chris Williamson</p>
                    <p className="text-[10px] text-neutral-500">~€70K/mo</p>
                  </div>
                </div>
              </div>
              
              {/* Bottom message - MEGA Enhanced pricing box */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
                className="mt-10 inline-flex flex-col items-center gap-4 px-12 py-8 rounded-3xl bg-gradient-to-br from-empire/30 via-empire/15 to-empire/5 border-3 border-empire shadow-[0_0_60px_rgba(218,252,104,0.4)] relative overflow-hidden"
              >
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(218,252,104,0.15),transparent_70%)] animate-pulse" />
                
                <div className="relative z-10 flex flex-col items-center gap-4">
                  {/* Recommended badge */}
                  <div className="px-4 py-1.5 bg-empire text-black text-xs font-black rounded-full uppercase tracking-wider">
                    {lang === 'fr' ? '⭐ Vous êtes recommandé' : '⭐ You are referred'}
                  </div>
                  
                  <p className="text-sm text-neutral-300 uppercase tracking-wider font-semibold">
                    {lang === 'fr' ? 'Remise de 500€ appliquée' : '€500 discount applied'}
                  </p>
                  
                  <div className="flex flex-col items-center gap-2">
                    {LAUNCH_OFFER_ACTIVE && (
                      <span className="text-3xl font-bold text-neutral-500 line-through decoration-red-500 decoration-3">€{PRICING.monthlyNormal}</span>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl md:text-7xl font-black text-empire drop-shadow-[0_0_30px_rgba(218,252,104,0.5)]">€{PRICING.monthly}</span>
                      <span className="text-xl text-neutral-300 font-medium">{lang === 'fr' ? '/mois' : '/month'}</span>
                    </div>
                  </div>
                  
                  {LAUNCH_OFFER_ACTIVE && (
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="px-6 py-2.5 bg-gradient-to-r from-green-500/20 to-green-400/20 rounded-full border-2 border-green-400/50"
                    >
                      <p className="text-lg text-green-400 font-black">
                        💰 {lang === 'fr' ? `Économisez ${PRICING.monthlyNormal - PRICING.monthly}€/mois` : `Save €${PRICING.monthlyNormal - PRICING.monthly}/month`}
                      </p>
                    </motion.div>
                  )}
                  
                  <p className="text-sm text-neutral-400 text-center max-w-sm mt-2">
                    {lang === 'fr' ? 'Le même système que les top créateurs à 1% du prix' : 'The same system as top creators at 1% of the price'}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

