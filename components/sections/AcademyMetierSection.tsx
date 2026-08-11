'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
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

export default function AcademyMetierSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const skills = fr
    ? [
        { title: 'Trouver les angles', desc: 'Identifier ce qui mérite d\'être dit.' },
        { title: 'Créer l\'attention', desc: 'Hooks, storytelling, formats, psychologie.' },
        { title: 'Produire', desc: 'Transformer une idée en contenu pour chaque plateforme.' },
        { title: 'Distribuer', desc: 'Comprendre comment adapter et diffuser.' },
        { title: 'Convertir', desc: 'Transformer l\'attention en audience, leads et rendez-vous.' },
        { title: 'Accompagner un client', desc: 'Auditer sa présence et construire sa stratégie.' },
      ]
    : [
        { title: 'Find the angles', desc: 'Identify what\'s worth saying.' },
        { title: 'Create attention', desc: 'Hooks, storytelling, formats, psychology.' },
        { title: 'Produce', desc: 'Turn an idea into content for every platform.' },
        { title: 'Distribute', desc: 'Know how to adapt and ship.' },
        { title: 'Convert', desc: 'Turn attention into audience, leads and meetings.' },
        { title: 'Coach a client', desc: 'Audit their presence and build their strategy.' },
      ]

  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-black to-[#0f0f0f] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(252,165,165,0.05),transparent)]" />
      <div className="container relative z-10 max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-academy mb-3">
              {fr ? 'La transformation' : 'The transformation'}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-2xl mx-auto">
              {fr
                ? 'Vous n\'apprenez pas à faire des posts. Vous apprenez un métier.'
                : 'You\'re not learning to make posts. You\'re learning a craft.'}
            </h2>
            <p className="mt-4 text-neutral-400 max-w-xl mx-auto">
              {fr
                ? 'En 21 jours, voici ce que vous saurez faire.'
                : 'In 21 days, here\'s what you\'ll be able to do.'}
            </p>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((s, i) => (
            <FadeIn key={s.title} delay={0.05 + i * 0.06}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <span className="text-[11px] font-bold text-academy/70 tracking-wider">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 text-base font-bold text-white">{s.title}</h3>
                <p className="mt-1.5 text-sm text-neutral-400 leading-relaxed">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <p className="mt-10 text-center text-sm text-neutral-500">
            {fr
              ? 'C\'est exactement ce qui justifie le titre Head of Viralité.'
              : 'That\'s exactly what earns the Head of Virality title.'}
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
