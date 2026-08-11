'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AcademyPainSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const pains = fr
    ? [
        'Vous savez que les entreprises ont besoin de contenu, mais vous ne savez pas comment le produire efficacement.',
        'Vous passez des heures sur un post sans comprendre pourquoi il fonctionne ou non.',
        'Vous voyez des créateurs exploser et vous aimeriez comprendre la mécanique derrière leurs résultats.',
        'Vous voulez une compétence monétisable, sans devoir créer une audience énorme avant de gagner de l\'argent.',
        'Vous avez envie de vous lancer dans le contenu mais vous ne savez pas comment trouver vos premières missions.',
      ]
    : [
        'You know companies need content, but you don\'t know how to produce it efficiently.',
        'You spend hours on a post without understanding why it works or doesn\'t.',
        'You see creators take off and want to understand the mechanics behind their results.',
        'You want a monetizable skill, without needing a huge audience before you can earn.',
        'You want to get into content but don\'t know how to find your first missions.',
      ]

  return (
    <section ref={ref} className="relative py-16 md:py-20 bg-[#0a0a0a] overflow-hidden">
      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold text-neutral-400 tracking-widest uppercase mb-4"
          >
            {fr ? 'Le problème' : 'The problem'}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-2xl md:text-3xl font-bold text-white leading-tight mb-8"
          >
            {fr
              ? 'Vous avez compris que le contenu est devenu une compétence. Mais vous ne savez pas encore en faire un métier.'
              : 'You know content has become a skill. You just don\'t know how to turn it into a career yet.'}
          </motion.h2>

          <p className="text-sm text-neutral-500 mb-5 text-left">
            {fr ? 'Vous êtes peut-être ici :' : 'You might be here:'}
          </p>

          <div className="space-y-3">
            {pains.map((pain, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.08] border border-white/15 text-left"
              >
                <span className="text-academy/80 text-sm flex-shrink-0 mt-0.5">→</span>
                <span className="text-neutral-300 text-sm md:text-base">{pain}</span>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-8 text-base md:text-lg text-white font-semibold"
          >
            {fr ? 'Academy existe pour vous apprendre exactement ça.' : 'Academy exists to teach you exactly that.'}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
