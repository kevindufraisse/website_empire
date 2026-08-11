'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { useReveal } from '@/hooks/useReveal'

const FRICTION = {
  fr: [
    'trouver les bons sujets',
    'écrire',
    'filmer',
    'monter',
    'adapter',
    'publier',
    'analyser',
  ],
  en: [
    'finding the right topics',
    'writing',
    'filming',
    'editing',
    'adapting',
    'publishing',
    'analyzing',
  ],
}

export default function EmpireProblemSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [ref, inView] = useReveal('-80px')

  if (autopilot) return null

  const items = fr ? FRICTION.fr : FRICTION.en

  return (
    <section ref={ref} className="relative w-full py-16 md:py-24 bg-[#0a0a0a]">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            {fr ? (
              <>
                Votre expertise n&apos;est pas le problème.{' '}
                <span className="text-empire">Sa distribution l&apos;est.</span>
              </>
            ) : (
              <>
                Your expertise isn&apos;t the problem.{' '}
                <span className="text-empire">Distribution is.</span>
              </>
            )}
          </h2>

          <p className="mt-6 text-lg text-neutral-300">
            {fr ? 'Vous savez quoi dire.' : 'You know what to say.'}
          </p>

          <p className="mt-4 text-neutral-400">
            {fr ? 'Mais entre :' : 'But between:'}
          </p>

          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {items.map((item) => (
              <li
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm text-neutral-300"
              >
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-neutral-400 max-w-xl mx-auto leading-relaxed">
            {fr
              ? 'le contenu finit toujours par passer après le business.'
              : 'content always ends up after the business.'}
          </p>

          <p className="mt-8 text-base md:text-lg text-white font-medium max-w-xl mx-auto">
            {fr
              ? 'Résultat : vous êtes excellent dans votre domaine, mais invisible en ligne.'
              : 'Result: you\'re excellent at what you do, but invisible online.'}
          </p>

          <p className="mt-10 text-xl md:text-2xl font-bold text-empire">
            {fr
              ? 'Empire transforme votre expertise en présence médiatique.'
              : 'Empire turns your expertise into media presence.'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
