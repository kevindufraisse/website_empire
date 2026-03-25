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

const steps = [
  {
    num: '01',
    title: 'Tu rejoins le bootcamp',
    desc: 'Accès immédiat aux vidéos, défis quotidiens, 6 lives et groupe privé. Le programme démarre le jour même.',
    tag: null,
  },
  {
    num: '02',
    title: 'Tu crées chaque jour',
    desc: "Un défi par jour, posté dans le groupe. Tu reçois des feedbacks, tu vois progresser ton niveau. Pas de théorie — que de l'action.",
    tag: null,
  },
  {
    num: '03',
    title: "À J21, tu sors avec un vrai métier",
    desc: "Tu as créé du contenu chaque jour pendant 3 semaines. Tu sais ce qui fonctionne sur chaque réseau, tu as eu des feedbacks, tu as vu tes progrès. Pas des slides — une vraie compétence.",
    tag: 'Semaine 3',
  },
  {
    num: '04',
    title: 'Bonus : les meilleurs rejoignent le réseau Empire',
    desc: "On repère les profils qui se démarquent dans le groupe. On leur envoie des missions directement. C'est mérité — pas garanti.",
    tag: '+ Bonus',
    highlight: true,
  },
]

export default function AcademyProcessSection() {
  return (
    <section className="container py-20 md:py-28">
      <div className="max-w-4xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-16">
            <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">Comment ça se passe</p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Ce qui se passe{' '}
              <span className="text-empire">concrètement.</span>
            </h2>
          </div>
        </FadeInBlock>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-empire/50 via-empire/20 to-transparent hidden md:block" />

          <div className="space-y-6">
            {steps.map((step, i) => (
              <FadeInBlock key={i} delay={i * 0.1}>
                <div className={`relative flex gap-6 md:gap-8 p-6 md:p-8 rounded-2xl border transition-all ${
                  step.highlight
                    ? 'bg-gradient-to-br from-empire/15 to-empire/5 border-empire/40'
                    : 'bg-gradient-to-br from-white/8 to-white/[0.02] border-white/10 hover:border-white/20'
                }`}>
                  {/* Number */}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 font-black text-lg border-2 ${
                    step.highlight
                      ? 'bg-empire text-black border-empire shadow-[0_0_20px_rgba(218,252,104,0.4)]'
                      : 'bg-white/5 text-empire border-empire/30'
                  }`}>
                    {step.num}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                      <h3 className="text-lg md:text-xl font-bold text-white">{step.title}</h3>
                      {step.tag && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
                          step.tag === 'VIP'
                            ? 'bg-empire/20 text-empire border border-empire/30'
                            : 'bg-white/10 text-neutral-300 border border-white/15'
                        }`}>
                          {step.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-400 text-sm md:text-base leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </FadeInBlock>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
