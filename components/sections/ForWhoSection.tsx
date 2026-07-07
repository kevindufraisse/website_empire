'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Check, X } from 'lucide-react'

export default function ForWhoSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const forYou = fr
    ? [
        'Entrepreneurs, freelances, consultants, coachs',
        'Vous avez une expertise mais pas le temps de créer du contenu',
        'Vous voulez attirer des clients via LinkedIn, YouTube, Instagram',
        'Vous êtes prêt à parler 1h par semaine',
        'Vous voulez déléguer le contenu et vous concentrer sur votre business',
      ]
    : [
        'Entrepreneurs, freelancers, consultants, coaches',
        'You have expertise but no time to create content',
        'You want to attract clients via LinkedIn, YouTube, Instagram',
        'You\'re ready to talk 1 hour per week',
        'You want to delegate content and focus on your business',
      ]

  const notForYou = fr
    ? [
        'Vous n\'avez aucune expertise ou offre à vendre',
        'Vous voulez tout contrôler et réécrire chaque mot',
        'Vous cherchez des résultats sans rien enregistrer',
        'Vous n\'êtes pas prêt à investir dans votre visibilité',
      ]
    : [
        'You have no expertise or offer to sell',
        'You want to control everything and rewrite every word',
        'You want results without recording anything',
        'You\'re not ready to invest in your visibility',
      ]

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.04),transparent)]" />

      <div ref={ref} className="relative z-10 container max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {fr ? 'Est-ce fait pour vous ?' : 'Is this right for you?'}
          </h2>
          <p className="text-neutral-400 text-lg">
            {fr
              ? 'Empire fonctionne pour un profil précis. Vérifiez avant de commencer.'
              : 'Empire works for a specific profile. Check before you start.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* For you */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Check className="text-emerald-400" size={20} />
              </div>
              <h3 className="text-xl font-bold text-emerald-400">
                {fr ? 'C\'est pour vous si...' : 'It\'s for you if...'}
              </h3>
            </div>
            <ul className="space-y-4">
              {forYou.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <Check className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-neutral-200">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Not for you */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <X className="text-red-400" size={20} />
              </div>
              <h3 className="text-xl font-bold text-red-400">
                {fr ? 'Ce n\'est PAS pour vous si...' : 'It\'s NOT for you if...'}
              </h3>
            </div>
            <ul className="space-y-4">
              {notForYou.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <X className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-neutral-300">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
