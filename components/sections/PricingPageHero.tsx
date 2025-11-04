'use client'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'

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
            className="text-xl md:text-2xl text-neutral-300 max-w-3xl mx-auto mb-12"
          >
            {lang === 'fr' 
              ? 'Pendant que d\'autres dépensent €12,000+ pour des équipes de contenu, obtenez les mêmes résultats à partir de €280/semaine. Annulez quand vous voulez.'
              : 'While others spend €12,000+ on content teams, get the same results starting at €280/week. Cancel anytime.'}
          </motion.p>

          {/* Top Creators Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="text-center">
              <p className="text-sm text-neutral-400 mb-4">
                {lang === 'fr' 
                  ? 'Enfin accès aux systèmes des meilleurs créateurs du monde'
                  : 'Finally access to the systems of the world\'s top creators'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {/* Grant Cardone */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group">
                  <img 
                    src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4295dabe20aff6b9885_Cardone.webp"
                    alt="Grant Cardone"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex items-center gap-2">
                    <img 
                      src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc429d393fce8535a5023_Tiktok.webp"
                      alt="TikTok"
                      className="w-4 h-4"
                    />
                    <p className="text-sm font-bold text-white group-hover:text-empire transition-colors">Grant Cardone</p>
                  </div>
                </div>

                {/* Ali Abdaal */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group">
                  <img 
                    src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d436f96370e8ccb7c4_Abdaal.webp"
                    alt="Ali Abdaal"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex items-center gap-2">
                    <img 
                      src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d3ced50075f19fe516_Ytb.webp"
                      alt="YouTube"
                      className="w-4 h-4"
                    />
                    <p className="text-sm font-bold text-white group-hover:text-empire transition-colors">Ali Abdaal</p>
                  </div>
                </div>

                {/* Chris Williamson */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group">
                  <img 
                    src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d4f950bcf495c7dfb2_Williamson.webp"
                    alt="Chris Williamson"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex items-center gap-2">
                    <img 
                      src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d203d064fc4e0bfedc_Instagram.webp"
                      alt="Instagram"
                      className="w-4 h-4"
                    />
                    <p className="text-sm font-bold text-white group-hover:text-empire transition-colors">Chris Williamson</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

