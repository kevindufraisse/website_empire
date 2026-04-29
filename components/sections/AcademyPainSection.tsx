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
        'Tu passes 3h à écrire un post qui fait 200 vues',
        'Tu vois les autres exploser en ligne et tu comprends pas comment ils font',
        'Tu as peur de publier, de te ridiculiser devant ton réseau',
        'Tu sais pas comment transformer des vues en clients concrets',
        'Tu veux te lancer mais tu sais pas par où commencer',
      ]
    : [
        'You spend 3 hours writing a post that gets 200 views',
        "You see others blowing up online and you don't understand how they do it",
        "You're afraid to post, afraid of looking foolish in front of your network",
        "You don't know how to turn views into actual clients",
        "You want to get started but you don't know where to begin",
      ]

  return (
    <section ref={ref} className="relative py-16 md:py-20 bg-[#0a0a0a] overflow-hidden">
      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center">

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold text-neutral-400 tracking-widest uppercase mb-6"
          >
            {fr ? 'Si tu te reconnais' : 'If this sounds like you'}
          </motion.p>

          <div className="space-y-3">
            {pains.map((pain, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.08] border border-white/15"
              >
                <span className="text-red-400/70 text-sm flex-shrink-0">✕</span>
                <span className="text-neutral-400 text-sm md:text-base text-left">{pain}</span>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 text-base md:text-lg text-white font-semibold"
          >
            {fr ? 'Ce bootcamp existe pour ça.' : 'This bootcamp was built for this.'}
          </motion.p>

        </div>
      </div>
    </section>
  )
}
