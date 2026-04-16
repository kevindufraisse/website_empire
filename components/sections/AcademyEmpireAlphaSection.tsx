'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Zap, Mic, FileText, Send, Flame, Trophy } from 'lucide-react'

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

const howItWorks = [
  {
    icon: Mic,
    num: '01',
    title: 'Tu parles 15 minutes',
    desc: 'Comme un vocal. De tes sujets, de tes idées. Pas besoin de savoir écrire ou monter.',
  },
  {
    icon: FileText,
    num: '02',
    title: 'On rédige et on monte',
    desc: 'On récupère ta transcription. Nos assistantes créent ton calendrier. On rédige tes posts avec nos meilleurs prompts.',
  },
  {
    icon: Send,
    num: '03',
    title: 'Tu publies en 15 min',
    desc: 'Tes posts LinkedIn + Shorts sont prêts. Tu copies, tu colles, tu postes.',
  },
]

const bootcampSteps = [
  {
    icon: Flame,
    tag: 'Jour 1',
    title: 'Tu rejoins le bootcamp',
    desc: 'Accès immédiat aux challenges, lives et groupe privé. Ton premier contenu est déjà prêt.',
  },
  {
    icon: Send,
    tag: '21 jours',
    title: 'Tu publies, on te forme',
    desc: 'Chaque jour : un challenge + ton contenu prêt à poster. Tu apprends la viralité en faisant.',
  },
  {
    icon: Trophy,
    tag: 'Après',
    title: 'Tu maîtrises la viralité',
    desc: 'Tu sais ce qui fait exploser un contenu. Tu choisis : développer ta propre audience, ou rejoindre notre réseau et recevoir des missions clients payées.',
    highlight: true,
  },
]

export default function AcademyEmpireAlphaSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-black to-[#0f0f0f] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(218,252,104,0.06),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto">

          {/* Part 1: How content creation works */}
          <FadeInBlock>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-empire/10 border border-empire/30 mb-5">
                <Zap className="text-empire" size={14} />
                <span className="text-xs font-bold text-empire tracking-widest uppercase">Comment ça marche</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                Tu parles. On rédige.{' '}
                <span className="text-empire">Tu publies.</span>
              </h2>
              <p className="text-neutral-400 text-base md:text-lg max-w-xl mx-auto">
                Pas de page blanche. Pas de montage. Tu nous donnes ta voix, on fait le reste.
              </p>
            </div>
          </FadeInBlock>

          <div className="space-y-5 mb-20">
            {howItWorks.map((step, i) => (
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

          {/* Part 2: Bootcamp timeline */}
          <FadeInBlock>
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-neutral-500 tracking-widest uppercase mb-3">Le déroulé</p>
              <h3 className="text-2xl md:text-3xl font-bold">
                Ton parcours en{' '}
                <span className="text-empire">3 étapes.</span>
              </h3>
            </div>
          </FadeInBlock>

          <div className="grid md:grid-cols-3 gap-5">
            {bootcampSteps.map((step, i) => (
              <FadeInBlock key={i} delay={i * 0.1}>
                <div className={`relative h-full p-6 rounded-2xl border transition-all text-center ${
                  step.highlight
                    ? 'bg-gradient-to-br from-empire/15 to-empire/5 border-empire/40'
                    : 'bg-gradient-to-br from-white/8 to-white/[0.02] border-white/10'
                }`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                    step.highlight
                      ? 'bg-empire/20 border border-empire/40'
                      : 'bg-white/10 border border-white/15'
                  }`}>
                    <step.icon className={step.highlight ? 'text-empire' : 'text-neutral-300'} size={20} />
                  </div>
                  <p className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${
                    step.highlight ? 'text-empire' : 'text-neutral-500'
                  }`}>{step.tag}</p>
                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </FadeInBlock>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
