'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { X, Check } from 'lucide-react'
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

export default function AcademyForWhoSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const notFor = fr
    ? [
        'Tu cherches un résultat sans rien faire',
        'Tu veux juste "apprendre" sans appliquer',
        'Tu as déjà une grosse audience et un système qui tourne',
        "Tu n'es pas prêt à publier chaque jour pendant 21 jours",
      ]
    : [
        "You're looking for results without doing any work",
        'You just want to "learn" without applying',
        'You already have a large audience and a running system',
        "You're not ready to publish every day for 21 days",
      ]

  const yesFor = fr
    ? [
        'Tu veux apprendre les mécaniques de la viralité',
        'Tu veux créer une activité en ligne de zéro',
        'Tu veux publier sans passer 3h à rédiger et monter',
        'Tu veux te reconvertir en head of viralité et potentiellement travailler avec nous',
        "Tu n'as pas encore de projet mais tu es prêt à te lancer",
      ]
    : [
        'You want to learn the mechanics of virality',
        'You want to build an online business from scratch',
        'You want to publish without spending 3 hours writing and editing',
        'You want to become a head of virality and potentially work with us',
        "You don't have a project yet but you're ready to start",
      ]
  return (
    <section className="relative w-full py-16 md:py-20 overflow-hidden">
      <div className="container">
        <div className="max-w-4xl mx-auto">

          <FadeInBlock>
            <div className="text-center mb-10">
              <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">{fr ? 'Pour qui' : 'Who is it for'}</p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
                {fr ? 'Ce bootcamp est' : 'This bootcamp is'} <span className="text-academy">{fr ? 'sélectif.' : 'selective.'}</span>
              </h2>
              <p className="text-sm text-neutral-400 max-w-md mx-auto">
                {fr ? 'Sur sélection : tu postules en réservant ta place et on confirme si tu fais partie des sélectionnés.' : "By application only: reserve your spot and we confirm if you're selected."}
              </p>
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.1}>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-950/30 to-transparent border border-red-500/20">
                <p className="text-xs font-bold text-red-400 tracking-widest uppercase mb-4">{fr ? 'Pas pour toi si...' : 'Not for you if...'}</p>
                <div className="space-y-2.5">
                  {notFor.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <X className="text-red-400 flex-shrink-0 mt-0.5" size={14} />
                      <span className="text-neutral-400 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-academy/15 to-transparent border border-academy/30">
                <p className="text-xs font-bold text-academy tracking-widest uppercase mb-4">{fr ? 'Pour toi si...' : 'For you if...'}</p>
                <div className="space-y-2.5">
                  {yesFor.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="text-academy flex-shrink-0 mt-0.5" size={14} />
                      <span className="text-white text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInBlock>

        </div>
      </div>
    </section>
  )
}
