'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Zap, Lightbulb, Mic, FileText, Send } from 'lucide-react'
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

export default function AcademyEmpireAlphaSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const howItWorks = [
    {
      icon: Lightbulb,
      num: '01',
      title: fr ? 'On trouve tes sujets' : 'We find your topics',
      desc: fr
        ? 'On identifie les thématiques qui marchent dans ta niche. Tu ne pars jamais de zéro - on te donne les angles.'
        : 'We identify the topics that work in your niche. You never start from scratch — we give you the angles.',
    },
    {
      icon: Mic,
      num: '02',
      title: fr ? 'Tu parles 15 minutes' : 'You talk for 15 minutes',
      desc: fr
        ? 'Via Empire Alpha, notre outil simplifié. Tu parles comme un vocal - ton point de vue, tes idées, ton expérience. Pas besoin de savoir écrire ou monter.'
        : 'Via Empire Alpha, our simplified tool. You talk like a voice note — your perspective, your ideas, your experience. No writing or editing skills needed.',
    },
    {
      icon: FileText,
      num: '03',
      title: fr ? 'On écrit tes contenus' : 'We write your content',
      desc: fr
        ? 'On récupère ta transcription. On rédige tes posts LinkedIn, on monte tes Shorts. Tout est prêt à publier.'
        : 'We take your transcription. We write your LinkedIn posts, we edit your Shorts. Everything is ready to publish.',
    },
    {
      icon: Send,
      num: '04',
      title: fr ? 'Tu publies en 15 min' : 'You publish in 15 min',
      desc: fr
        ? 'Tu copies, tu colles, tu postes. Chaque jour, du contenu de qualité sur tes réseaux - sans y passer ta vie.'
        : 'You copy, you paste, you post. Every day, quality content on your channels — without spending your whole day on it.',
    },
  ]

  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-black to-[#0f0f0f] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(252, 165, 165,0.06),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto">

          {/* Part 1: How content creation works */}
          <FadeInBlock>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-academy/10 border border-academy/30 mb-5">
                <Zap className="text-academy" size={14} />
                <span className="text-xs font-bold text-academy tracking-widest uppercase">
                  {fr ? 'Comment ça marche' : 'How it works'}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                {fr ? 'On trouve les sujets. Tu parles.' : 'We find the topics. You talk.'}{' '}
                <span className="text-academy">{fr ? 'On écrit tout.' : 'We write everything.'}</span>
              </h2>
              <p className="text-neutral-400 text-base md:text-lg max-w-xl mx-auto">
                {fr
                  ? 'Pas de page blanche. Pas de montage. On te donne les thématiques, tu parles 15 min, on fait le reste.'
                  : 'No blank page. No editing. We give you the topics, you talk for 15 min, we do the rest.'}
              </p>
            </div>
          </FadeInBlock>

          <div className="space-y-5">
            {howItWorks.map((step, i) => (
              <FadeInBlock key={i} delay={i * 0.1}>
                <div className="flex items-start gap-5 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/8 to-white/[0.02] border border-white/10 hover:border-academy/30 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-academy/15 border border-academy/30 flex items-center justify-center flex-shrink-0">
                    <step.icon className="text-academy" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-academy/60 tracking-widest uppercase mb-1">{step.num}</p>
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
