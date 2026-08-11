'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Shield } from 'lucide-react'
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

export default function AcademyGuaranteeSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  return (
    <section className="relative w-full py-16 md:py-24 bg-[#0a0a0a] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(252,165,165,0.06),transparent)]" />
      <div className="container relative z-10 max-w-3xl mx-auto">
        <FadeIn>
          <div className="rounded-3xl border border-academy/40 bg-gradient-to-br from-academy/10 to-transparent p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-academy/15 border border-academy/30 mb-5">
              <Shield className="text-academy" size={22} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-academy mb-3">
              {fr ? 'Premier client' : 'First client'}
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
              {fr
                ? 'Vous ne repartez pas seulement avec une formation.'
                : 'You don\'t leave with just a course.'}
            </h2>
            <p className="text-neutral-300 text-base md:text-lg leading-relaxed mb-4 max-w-xl mx-auto">
              {fr
                ? 'Nous restons avec vous jusqu\'à votre première mission.'
                : 'We stay with you until your first mission.'}
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xl mx-auto mb-6">
              {fr
                ? 'Si vous suivez le programme et n\'avez toujours pas de client après 3 mois, nous continuons à vous accompagner gratuitement jusqu\'à ce que vous en obteniez un.'
                : 'If you follow the program and still have no client after 3 months, we keep supporting you for free until you get one.'}
            </p>
            <p className="text-[11px] text-neutral-500 leading-relaxed max-w-lg mx-auto">
              {fr
                ? 'Réservé aux membres qui choisissent la voie Empire Partners et remplissent les conditions du programme.'
                : 'Reserved for members on the Empire Partners path who meet the program conditions.'}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
