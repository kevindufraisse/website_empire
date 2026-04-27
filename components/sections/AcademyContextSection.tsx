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
  { job: 'Copywriting', stat: 'GPT-4 produit 10 000 mots en 30s' },
  { job: 'Montage vidéo', stat: 'Runway Gen-3 monte en temps réel' },
  { job: 'SEO', stat: '90% des articles classés sont générés par IA' },
  { job: 'Graphisme', stat: 'Midjourney surpasse 90% des designers' },
  { job: 'Rédaction web', stat: 'Claude écrit mieux que la plupart' },
  { job: 'Traduction', stat: 'DeepL L2 = niveau professionnel certifié' },
  { job: 'Community mgmt', stat: 'Des bots gèrent des millions d\'interactions' },
]

export default function AcademyContextSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-[#0f0f0f] to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(252, 165, 165,0.03),transparent)]" />
      {/* Red tint for dystopian feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(220,38,38,0.04),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          <FadeInBlock>
            <div className="text-center mb-16">
              <p className="text-sm text-red-400/80 mb-3 tracking-widest uppercase font-bold">Le contexte</p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                Des millions de salariés ont perdu leur job en 2024.
                <br />
                <span className="text-red-400">L'IA n'a pas fini.</span>
              </h2>
              <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto">
                Ce n'est pas une prédiction. C'est ce qui se passe maintenant.{' '}
                <span className="text-white font-semibold">Les métiers de la connaissance pure disparaissent - remplacés en quelques mois par des modèles entraînés sur tout internet.</span>
              </p>
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.15}>
            <div className="grid md:grid-cols-2 gap-6 items-start">
              {/* Colonne métiers morts */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-950/40 to-red-900/10 border border-red-500/25">
                <p className="text-xs font-bold text-red-400 tracking-widest uppercase mb-1">Métiers en cours de destruction</p>
                <p className="text-neutral-400 text-xs mb-4">Pendant que vous lisez ces lignes.</p>
                <div className="space-y-2">
                  {deadJobs.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 py-2 px-3 rounded-lg bg-red-500/5 border border-red-500/10"
                    >
                      <X className="text-red-500 flex-shrink-0 mt-0.5" size={13} />
                      <div>
                        <span className="text-neutral-400 text-sm line-through block leading-tight">{item.job}</span>
                        <span className="text-neutral-400 text-[11px] leading-tight">{item.stat}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Colonne insight */}
              <div className="flex flex-col gap-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-academy/20 to-academy/5 border border-academy/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-academy/10 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Check className="text-academy" size={16} />
                      <p className="text-xs font-bold text-academy tracking-widest uppercase">La seule chose qui résiste</p>
                    </div>
                    <p className="text-xl font-black text-white mb-4 leading-snug">
                      L'IA peut générer du contenu à l'infini. Elle ne peut pas décider pourquoi <em>vous</em> vous vous arrêtez, regardez, partagez.
                    </p>
                    <p className="text-neutral-300 text-sm leading-relaxed">
                      Comprendre le cerveau humain - la psychologie de l'attention, la mécanique de la viralité - c'est{' '}
                      <span className="text-white font-semibold">la seule compétence que l'IA ne peut pas reproduire.</span>{' '}
                      Parce qu'elle ne ressent pas. Elle prédit.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.08] border border-white/15">
                  <p className="text-neutral-400 text-xs uppercase tracking-widest mb-2 font-bold">La logique qui suit</p>
                  <p className="text-neutral-300 text-sm leading-relaxed mb-3">
                    Dans un monde où la compétence est égale pour tous, les gens choisissent soit le plus visible, soit celui en qui ils ont le plus confiance.
                  </p>
                  <p className="text-academy text-sm font-semibold">
                    Construire une audience aujourd'hui, c'est le seul moyen de ne pas être interchangeable demain.
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
