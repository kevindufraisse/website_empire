'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, Building2, Rocket } from 'lucide-react'
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
          icon: Brain,
          num: '01',
          title: "L'IA sait produire. Pas décider quoi dire.",
          desc: 'Elle génère du texte et des images. Elle ne choisit pas l\'angle, le timing, ni ce qui fera réagir un marché.',
        },
        {
          icon: Building2,
          num: '02',
          title: 'Les entreprises cherchent cette compétence.',
          desc: 'Elles ont besoin de personnes capables de transformer leur expertise en attention - pas seulement de publier plus souvent.',
        },
        {
          icon: Rocket,
          num: '03',
          title: 'Les meilleurs créateurs deviennent des opérateurs de croissance.',
          desc: 'Ce n\'est plus seulement créer. C\'est construire un système qui attire, convertit et se répète.',
        },
      ]
    : [
        {
          icon: Brain,
          num: '01',
          title: 'AI can produce. It can\'t decide what to say.',
          desc: 'It generates text and images. It doesn\'t pick the angle, the timing, or what will move a market.',
        },
        {
          icon: Building2,
          num: '02',
          title: 'Companies are looking for this skill.',
          desc: 'They need people who can turn expertise into attention - not just post more often.',
        },
        {
          icon: Rocket,
          num: '03',
          title: 'Top creators become growth operators.',
          desc: 'It\'s no longer just creating. It\'s building a system that attracts, converts and repeats.',
        },
      ]

  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-[#0f0f0f] to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(252,165,165,0.04),transparent)]" />
      <div className="container relative z-10 max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-academy mb-3">
              {fr ? 'L\'opportunité' : 'The opportunity'}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-3xl mx-auto">
              {fr
                ? 'Pourquoi cette compétence devient indispensable'
                : 'Why this skill is becoming essential'}
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {points.map((p, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-academy/70 tracking-wider">{p.num}</span>
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-academy/10 border border-academy/20">
                    <p.icon size={18} className="text-academy" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2 leading-snug">{p.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{p.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.35}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 text-center max-w-3xl mx-auto">
            <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
              {fr
                ? 'Le marché de la creator economy est estimé à 313 Md$ en 2026 (Goldman Sachs). MrBeast recrute un Head of Viral Marketing. Les postes se paient entre 200K et 400K$/an. Le chiffre n\'est pas le pitch - c\'est la preuve que le métier existe déjà.'
                : 'The creator economy is estimated at $313B in 2026 (Goldman Sachs). MrBeast is hiring a Head of Viral Marketing. Roles pay $200K–$400K/year. The number isn\'t the pitch - it\'s proof the job already exists.'}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
