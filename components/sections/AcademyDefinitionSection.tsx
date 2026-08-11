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

export default function AcademyDefinitionSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const notList = fr
    ? [
        'Vous n\'êtes pas community manager.',
        'Vous n\'êtes pas simple copywriter.',
        'Vous n\'êtes pas monteur vidéo.',
      ]
    : [
        'You\'re not a community manager.',
        'You\'re not just a copywriter.',
        'You\'re not a video editor.',
      ]

  return (
    <section className="relative w-full py-20 md:py-28 bg-[#0a0a0a] overflow-hidden">
      <div className="container relative z-10 max-w-3xl mx-auto">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-widest text-academy mb-3 text-center">
            {fr ? 'Le métier' : 'The role'}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center leading-tight mb-6">
            {fr ? 'C\'est quoi, exactement, un Head of Viralité ?' : 'What exactly is a Head of Virality?'}
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="space-y-4 text-neutral-300 text-base md:text-lg leading-relaxed text-center mb-10">
            <p>
              {fr
                ? 'Les entreprises savent qu\'elles doivent publier. Mais elles ne savent pas toujours quoi dire, comment le dire, ou pourquoi certains contenus explosent et d\'autres meurent à 200 vues.'
                : 'Companies know they need to publish. They often don\'t know what to say, how to say it, or why some posts take off while others die at 200 views.'}
            </p>
            <p className="text-white font-medium">
              {fr
                ? 'Le Head of Viralité est la personne qui transforme l\'expertise d\'une marque ou d\'un dirigeant en contenu capable d\'attirer l\'attention, construire une audience et générer des opportunités.'
                : 'A Head of Virality turns a brand or founder\'s expertise into content that earns attention, builds an audience and creates opportunities.'}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <ul className="space-y-2.5 mb-8 max-w-md mx-auto">
            {notList.map((line) => (
              <li
                key={line}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-neutral-400 text-center"
              >
                {line}
              </li>
            ))}
          </ul>
          <p className="text-center text-lg font-semibold text-academy">
            {fr
              ? 'Vous êtes la personne qui construit le système de contenu.'
              : 'You\'re the person who builds the content system.'}
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
