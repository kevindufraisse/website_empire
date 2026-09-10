'use client'
import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'

const VoiceToContentAnimation = dynamic(() => import('@/components/VoiceToContentAnimation'), { ssr: false })

export default function HomeDemoSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  if (autopilot) return null

  return (
    <section className="relative w-full bg-[#0c0c0c] py-16 md:py-24">
      <div ref={ref} className="container">
        {/* Premier terme de la formule (FormulaBar → #formula-message). Sans
            ce bloc, « Message » reste abstrait : on pose le constat avant de
            montrer la démo. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-empire">
            {lang === 'fr' ? 'Étape 1 · Votre message' : 'Step 1 · Your message'}
          </p>
          <h2 className="text-3xl font-extrabold leading-[1.1] text-white md:text-5xl">
            {lang === 'fr'
              ? 'Vous avez déjà quelque chose à dire. Chaque réseau a son propre langage.'
              : 'You already have something to say. Each network has its own language.'}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg">
            {lang === 'fr'
              ? 'Notre mission : traduire votre message pour que chaque plateforme l\'écoute.'
              : 'Our mission: translate your message so every platform listens.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="mx-auto w-full max-w-3xl"
        >
          {/* À la place d'une démo produit : le message dit à voix haute, et
              ce qu'il devient. C'est le terme 1 de la formule, montré. */}
          <p className="mb-5 text-center text-base text-neutral-400 md:text-lg">
            {lang === 'fr'
              ? 'Le même message peut faire 100 vues ou 1 million. La différence, c\'est comment vous le dites.'
              : 'The same message can get 100 views or 1 million. The difference is how you say it.'}
          </p>
          <VoiceToContentAnimation />
        </motion.div>
      </div>
    </section>
  )
}
