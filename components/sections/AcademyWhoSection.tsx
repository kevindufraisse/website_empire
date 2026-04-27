'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { COHORT_START_TEXT } from '@/lib/cohort-config'

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

const founders = [
  { name: 'Kevin Dufraisse', img: '/founders/kevin.png' },
  { name: 'Marc Dufraisse', img: '/founders/marc.jpg' },
]

export default function AcademyWhoSection() {
  return (
    <section className="container py-20 md:py-28">
      <div className="max-w-4xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-12">
            <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">Qui on est</p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Le bootcamp créé par{' '}
              <span className="text-academy">ceux qui le font pour vrai.</span>
            </h2>
          </div>
        </FadeInBlock>

        <FadeInBlock delay={0.15}>
          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-academy/5 rounded-full blur-3xl pointer-events-none" />

            {/* EI + founders inline */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-11 h-11 rounded-xl bg-academy/20 border border-academy/30 flex items-center justify-center">
                  <span className="text-academy font-black text-sm">EI</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Empire Internet</p>
                  <p className="text-neutral-400 text-xs">10M+ vues/mois</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10 flex-shrink-0" />
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-academy/40 shadow-[0_0_10px_rgba(252,165,165,0.2)]">
                    <img src="/founders/kevin.png" alt="Kevin Dufraisse" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-academy/40 shadow-[0_0_10px_rgba(252,165,165,0.2)]">
                    <img src="/founders/marc.jpg" alt="Marc Dufraisse" className="w-full h-full object-cover" />
                  </div>
                </div>
                <p className="text-neutral-400 text-sm">
                  Kevin &amp; Marc Dufraisse <span className="text-neutral-400">- fondateurs</span>
                </p>
              </div>
            </div>

            <div className="space-y-5 text-neutral-300 leading-relaxed">
              <p className="text-base md:text-lg">
                On a commencé en créant du contenu pour nos propres projets. On a testé tout : hooks, formats, rythmes. Beaucoup de ratés. Puis certains contenus ont explosé.{' '}
                <span className="text-white font-semibold">On a compris pourquoi. Et on a rendu ça systématique.</span>
              </p>
              <p className="text-base md:text-lg">
                Aujourd'hui on produit du contenu viral pour des entrepreneurs et des marques - 10M+ vues par mois. Ce bootcamp, c'est notre méthode exacte. Pas une théorie.{' '}
                <span className="text-academy font-semibold">Tu apprends ce qu'on fait nous, cette semaine, pour nos clients.</span>
              </p>
              <p className="text-base md:text-lg text-neutral-400">
                Et pendant que tu apprends, on te crée ton contenu chaque jour. Tu n'as qu'à publier.
              </p>
            </div>
          </div>
        </FadeInBlock>

        {/* CTA enrollment block */}
        <FadeInBlock delay={0.3}>
          <div className="mt-10 relative p-8 md:p-10 rounded-2xl bg-gradient-to-br from-academy/[0.08] to-transparent border border-academy/20 overflow-hidden text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(252,165,165,0.06),transparent)] pointer-events-none" />

            <div className="relative z-10">
              <p className="text-sm text-academy font-bold tracking-widest uppercase mb-3">Vous rejoignez la promo</p>
              <p className="text-2xl md:text-3xl font-extrabold text-white mb-6">{COHORT_START_TEXT}</p>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex -space-x-3">
                  {founders.map(f => (
                    <img
                      key={f.name}
                      src={f.img}
                      alt={f.name}
                      className="w-11 h-11 rounded-full border-2 border-academy/40 object-cover shadow-[0_0_15px_rgba(252,165,165,0.15)]"
                    />
                  ))}
                </div>
                <p className="text-sm text-neutral-400 text-left leading-snug">
                  Kevin &amp; Marc lisent chaque candidature{' '}
                  <span className="text-white font-semibold">personnellement.</span>
                </p>
              </div>

              <a
                href="/candidature"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-academy text-black font-bold text-base rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(252,165,165,0.25)]"
              >
                Postuler maintenant
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}
