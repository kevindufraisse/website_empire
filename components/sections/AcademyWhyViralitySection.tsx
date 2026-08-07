'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { TrendingUp, Brain, Shield, Briefcase } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay }}>
      {children}
    </motion.div>
  )
}

export default function AcademyWhyViralitySection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const points = fr
    ? [
        {
          icon: TrendingUp,
          title: 'Un marché à 313 milliards de dollars',
          desc: 'La creator economy pèse 313 Mds$ en 2026 et atteindra 480 Mds$ en 2027 selon Goldman Sachs. Les entreprises recrutent massivement des experts en viralité.',
        },
        {
          icon: Briefcase,
          title: 'MrBeast recrute un Head of Viral Marketing',
          desc: 'Le plus grand créateur du monde formalise la viralité comme discipline. Les postes "Head of Virality" se paient entre 200K et 400K$/an.',
        },
        {
          icon: Brain,
          title: 'La compétence que l\u2019IA ne remplace pas',
          desc: 'L\u2019IA produit du contenu. Mais 40 % des consommateurs perdent confiance quand une marque en abuse. Comprendre les humains reste votre avantage à vie.',
        },
        {
          icon: Shield,
          title: 'Votre barrière contre l\u2019obsolescence',
          desc: 'À l\u2019ère où tout s\u2019automatise, la confiance est la seule chose qu\u2019on ne peut pas automatiser. La viralité, c\u2019est savoir créer cette confiance à grande échelle.',
        },
      ]
    : [
        {
          icon: TrendingUp,
          title: 'A $313 billion market',
          desc: 'The creator economy is worth $313B in 2026 and will reach $480B by 2027 according to Goldman Sachs. Companies are hiring virality experts at scale.',
        },
        {
          icon: Briefcase,
          title: 'MrBeast is hiring a Head of Viral Marketing',
          desc: 'The world\u2019s biggest creator is formalizing virality as a discipline. "Head of Virality" roles pay $200K\u2013$400K/year.',
        },
        {
          icon: Brain,
          title: 'The skill AI can\u2019t replace',
          desc: 'AI produces content. But 40% of consumers lose trust when a brand overuses it. Understanding humans remains your lifelong edge.',
        },
        {
          icon: Shield,
          title: 'Your barrier against obsolescence',
          desc: 'In an era where everything gets automated, trust is the one thing you can\u2019t automate. Virality is knowing how to build trust at scale.',
        },
      ]

  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-[#0f0f0f] to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(252,165,165,0.04),transparent)]" />
      <div className="container relative z-10 max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-academy mb-3">
              {fr ? 'Pourquoi ce métier' : 'Why this career'}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {fr
                ? 'Head of Viralité : le métier le plus recherché de 2026.'
                : 'Head of Virality: the most in-demand role of 2026.'}
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {points.map((p, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-academy/10 border border-academy/20">
                    <p.icon size={20} className="text-academy" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{p.title}</h3>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">{p.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <p className="text-center text-sm text-neutral-500 mt-10 max-w-2xl mx-auto">
            {fr
              ? 'Sources : Goldman Sachs, Grand View Research, Digiday, Y Combinator, Fractl 2026.'
              : 'Sources: Goldman Sachs, Grand View Research, Digiday, Y Combinator, Fractl 2026.'}
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
