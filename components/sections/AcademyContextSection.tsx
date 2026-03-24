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

const deadJobs = [
  'Copywriting',
  'Montage vidéo',
  'SEO',
  'Graphisme',
  'Rédaction web',
  'Traduction',
  'Community mgmt',
]

export default function AcademyContextSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-[#0f0f0f] to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(218,252,104,0.04),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          <FadeInBlock>
            <div className="text-center mb-16">
              <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">Le contexte</p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                L'IA a tué des métiers entiers.
                <br />
                <span className="text-empire">Pas celui-là.</span>
              </h2>
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.15}>
            <div className="grid md:grid-cols-2 gap-6 items-start">
              {/* Colonne métiers morts */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-950/30 to-red-900/10 border border-red-500/20">
                <p className="text-xs font-bold text-red-400 tracking-widest uppercase mb-4">Menacés par l'IA</p>
                <div className="space-y-2">
                  {deadJobs.map((job, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg bg-red-500/5 border border-red-500/10"
                    >
                      <X className="text-red-400 flex-shrink-0" size={14} />
                      <span className="text-neutral-400 text-sm line-through">{job}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Colonne Head of Viralité */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-empire/20 to-empire/5 border border-empire/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-empire/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Check className="text-empire" size={16} />
                    <p className="text-xs font-bold text-empire tracking-widest uppercase">Résistant à l'IA</p>
                  </div>
                  <p className="text-2xl font-black text-white mb-4">Head of Viralité</p>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    L'IA peut générer du contenu à l'infini. Elle ne peut pas décider{' '}
                    <span className="text-white font-semibold">pourquoi quelqu'un va s'arrêter, regarder, partager.</span>
                  </p>
                  <p className="text-neutral-300 text-sm leading-relaxed mt-3">
                    Comprendre le cerveau humain — la psychologie de l'attention, la mécanique de la viralité — c'est{' '}
                    <span className="text-empire font-semibold">la seule compétence qui reste toute ta vie.</span>
                  </p>
                  <p className="text-neutral-400 text-sm mt-3">
                    Et c'est exactement ce qu'on t'enseigne.
                  </p>
                </div>
              </div>
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}
