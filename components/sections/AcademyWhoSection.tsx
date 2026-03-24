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
              Empire Internet forme<br />
              <span className="text-empire">ses futurs collaborateurs.</span>
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
                <p className="text-neutral-400 text-sm">Bootcamp 21 jours · Head of Viralité</p>
              </div>
            </div>

            <div className="space-y-5 text-neutral-300 leading-relaxed">
              <p className="text-base md:text-lg">
                On produit du contenu viral pour des entrepreneurs — et on génère des millions de vues chaque mois pour nos clients. Ce bootcamp, c'est la façon dont on partage nos méthodes internes et dont on identifie les profils qui pourraient rejoindre notre réseau.{' '}
                <span className="text-white font-semibold">Les meilleurs participants reçoivent des missions directement de notre part.</span>
              </p>
              <p className="text-base md:text-lg">
                Ce n'est pas une formation théorique.{' '}
                <span className="text-empire font-semibold">C'est le système exact qu'on utilise au quotidien</span> — rendu accessible pour la première fois, à 500€.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
              {[
                { v: '7M+', l: 'vues générées' },
                { v: '2M', l: 'vues / mois' },
                { v: '100', l: 'clients max' },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-2xl font-black text-empire">{s.v}</p>
                  <p className="text-xs text-neutral-400 mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}
