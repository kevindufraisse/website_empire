'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Play, Repeat, Trophy } from 'lucide-react'

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
    icon: Play,
    week: 'Jour 1',
    title: 'Vous rejoignez le bootcamp',
    desc: 'Accès immédiat aux vidéos, lives et groupe privé. Votre premier contenu est déjà prêt.',
  },
  {
    icon: Repeat,
    week: '21 jours',
    title: 'Vous publiez, on vous forme',
    desc: 'Chaque jour : on vous crée votre contenu, vous publiez en 15 min, et vous apprenez la viralité via les vidéos et lives.',
  },
  {
    icon: Trophy,
    week: 'Après',
    title: 'Vous maîtrisez la viralité',
    desc: 'Vous savez ce qui fait exploser un contenu. Les meilleurs profils rejoignent le réseau Empire et reçoivent des clients.',
    highlight: true,
  },
]

export default function AcademyProcessSection() {
  return (
    <section className="container py-20 md:py-28">
      <div className="max-w-3xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-14">
            <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">Comment ça marche</p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Simple.{' '}
              <span className="text-empire">En 3 étapes.</span>
            </h2>
          </div>
        </FadeInBlock>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <FadeInBlock key={i} delay={i * 0.1}>
              <div className={`relative h-full p-6 rounded-2xl border transition-all text-center ${
                step.highlight
                  ? 'bg-gradient-to-br from-empire/15 to-empire/5 border-empire/40'
                  : 'bg-gradient-to-br from-white/8 to-white/[0.02] border-white/10'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  step.highlight
                    ? 'bg-empire/20 border border-empire/40'
                    : 'bg-white/10 border border-white/15'
                }`}>
                  <step.icon className={step.highlight ? 'text-empire' : 'text-neutral-300'} size={24} />
                </div>
                <p className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${
                  step.highlight ? 'text-empire' : 'text-neutral-500'
                }`}>{step.week}</p>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </FadeInBlock>
          ))}
        </div>
      </div>
    </section>
  )
}
