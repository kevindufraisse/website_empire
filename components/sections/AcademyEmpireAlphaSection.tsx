'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Zap, Sparkles, Send, TrendingUp } from 'lucide-react'

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
    icon: Sparkles,
    num: '01',
    title: 'On crée votre contenu',
    desc: 'Chaque matin, votre post LinkedIn + votre Short sont prêts. Rédigés, montés, optimisés.',
  },
  {
    icon: Send,
    num: '02',
    title: 'Vous publiez en 15 min',
    desc: 'Copier, coller, poster. C\'est tout ce qu\'on vous demande.',
  },
  {
    icon: TrendingUp,
    num: '03',
    title: 'Vous apprenez la viralité',
    desc: 'Vidéos, lives, feedbacks. Vous comprenez pourquoi ça marche — et vous savez le reproduire.',
  },
]

export default function AcademyEmpireAlphaSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-black to-[#0f0f0f] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(218,252,104,0.06),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto">

          <FadeInBlock>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-empire/10 border border-empire/30 mb-5">
                <Zap className="text-empire" size={14} />
                <span className="text-xs font-bold text-empire tracking-widest uppercase">Votre avantage injuste</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                Pendant que vous apprenez,{' '}
                <span className="text-empire">on crée pour vous.</span>
              </h2>
              <p className="text-neutral-400 text-base md:text-lg max-w-xl mx-auto">
                Les autres bootcamps vous demandent de tout faire. Ici, vous vous concentrez sur la viralité.
              </p>
            </div>
          </FadeInBlock>

          <div className="space-y-5">
            {steps.map((step, i) => (
              <FadeInBlock key={i} delay={i * 0.1}>
                <div className="flex items-start gap-5 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/8 to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-empire/15 border border-empire/30 flex items-center justify-center flex-shrink-0">
                    <step.icon className="text-empire" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-empire/60 tracking-widest uppercase mb-1">{step.num}</p>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1">{step.title}</h3>
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
