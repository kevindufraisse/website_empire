'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Flame, Repeat, Trophy } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

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

export default function AcademyProcessSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const steps = [
    {
      icon: Flame,
      week: fr ? 'Jour 1' : 'Day 1',
      title: fr ? 'Tu rejoins le bootcamp' : 'You join the bootcamp',
      desc: fr
        ? 'Accès immédiat aux challenges, lives et groupe privé. Ton premier contenu est déjà prêt à publier.'
        : 'Immediate access to challenges, live sessions, and the private group. Your first piece of content is ready to publish.',
    },
    {
      icon: Repeat,
      week: fr ? '21 jours' : '21 days',
      title: fr ? 'Tu publies, on te forme' : 'You publish, we train you',
      desc: fr
        ? 'Chaque jour : un challenge, ton contenu prêt à poster, et des feedbacks. Tu apprends la viralité en faisant.'
        : 'Every day: a challenge, your content ready to post, and feedback. You learn virality by doing.',
    },
    {
      icon: Trophy,
      week: fr ? 'Après' : 'After',
      title: fr ? 'Tu maîtrises la viralité' : 'You master virality',
      desc: fr
        ? 'Tu sais ce qui fait exploser un contenu. 3 options s\'offrent à toi : solo, licence Empire, ou partenaire.'
        : 'You know what makes content go viral. 3 options are available: solo, Empire license, or partner.',
      highlight: true,
    },
  ]

  return (
    <section className="container py-20 md:py-28">
      <div className="max-w-3xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-14">
            <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">{fr ? 'Le déroulé' : 'The process'}</p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Simple.{' '}
              <span className="text-academy">{fr ? 'En 3 étapes.' : 'In 3 steps.'}</span>
            </h2>
          </div>
        </FadeInBlock>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <FadeInBlock key={i} delay={i * 0.1}>
              <div className={`relative h-full p-6 rounded-2xl border transition-all text-center ${
                step.highlight
                  ? 'bg-gradient-to-br from-academy/15 to-academy/5 border-academy/40'
                  : 'bg-gradient-to-br from-white/8 to-white/[0.02] border-white/10'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  step.highlight
                    ? 'bg-academy/20 border border-academy/40'
                    : 'bg-white/10 border border-white/15'
                }`}>
                  <step.icon className={step.highlight ? 'text-academy' : 'text-neutral-300'} size={24} />
                </div>
                <p className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${
                  step.highlight ? 'text-academy' : 'text-neutral-400'
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
