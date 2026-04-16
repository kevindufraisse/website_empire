'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { X, Check } from 'lucide-react'

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

const notFor = [
  'Tu cherches un résultat sans rien faire',
  'Tu veux juste "apprendre" sans appliquer',
  'Tu as déjà une grosse audience et un système qui tourne',
  "Tu n'es pas prêt à publier chaque jour pendant 21 jours",
]

const yesFor = [
  'Tu veux apprendre les mécaniques de la viralité',
  'Tu veux créer une activité en ligne de zéro',
  'Tu veux publier sans passer 3h à rédiger et monter',
  'Tu veux te reconvertir en head of viralité et potentiellement travailler avec nous',
]

export default function AcademyForWhoSection() {
  return (
    <section className="relative w-full py-16 md:py-20 overflow-hidden">
      <div className="container">
        <div className="max-w-4xl mx-auto">

          <FadeInBlock>
            <div className="text-center mb-10">
              <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">Pour qui</p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Ce bootcamp est <span className="text-empire">sélectif.</span>
              </h2>
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.1}>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-950/30 to-transparent border border-red-500/20">
                <p className="text-xs font-bold text-red-400 tracking-widest uppercase mb-4">Pas pour toi si...</p>
                <div className="space-y-2.5">
                  {notFor.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <X className="text-red-400 flex-shrink-0 mt-0.5" size={14} />
                      <span className="text-neutral-400 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-empire/15 to-transparent border border-empire/30">
                <p className="text-xs font-bold text-empire tracking-widest uppercase mb-4">Pour toi si...</p>
                <div className="space-y-2.5">
                  {yesFor.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="text-empire flex-shrink-0 mt-0.5" size={14} />
                      <span className="text-white text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInBlock>

        </div>
      </div>
    </section>
  )
}
