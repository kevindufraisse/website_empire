'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function AcademyWhoSection() {
  return (
    <section className="container py-20 md:py-28">
      <div className="max-w-4xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-12">
            <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">Qui on est</p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Le bootcamp créé par{' '}
              <span className="text-empire">ceux qui le font pour vrai.</span>
            </h2>
          </div>
        </FadeInBlock>

        <FadeInBlock delay={0.15}>
          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-empire/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-empire/20 border border-empire/30 flex items-center justify-center flex-shrink-0">
                <span className="text-empire font-black text-lg">EI</span>
              </div>
              <div>
                <p className="text-white font-bold text-lg">Empire Internet</p>
                <p className="text-neutral-400 text-sm">Machine à contenu viral · 7M+ vues générées</p>
              </div>
            </div>

            <div className="space-y-5 text-neutral-300 leading-relaxed">
              <p className="text-base md:text-lg">
                On produit du contenu viral pour des entrepreneurs et on génère des millions de vues chaque mois pour nos clients.{' '}
                <span className="text-white font-semibold">Ce bootcamp, c'est notre système interne rendu accessible pour la première fois — pas une formation théorique.</span>
              </p>
              <p className="text-base md:text-lg">
                Tu n'apprends pas ce que font d'autres formateurs.{' '}
                <span className="text-empire font-semibold">Tu apprends exactement ce qu'on fait nous, au quotidien, pour nos clients.</span>
              </p>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}
