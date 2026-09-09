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
            {lang === 'fr' ? 'La formule · 1. Le message' : 'The formula · 1. The message'}
          </p>
          <h2 className="text-3xl font-extrabold leading-[1.1] text-white md:text-5xl">
            {lang === 'fr'
              ? 'Votre message ne se voit pas parce qu\'il ne parle pas le langage des réseaux.'
              : 'Nobody sees your message because it doesn\'t speak the networks\' language.'}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg">
            {lang === 'fr'
              ? 'Vous avez déjà des choses à dire. Le problème, c\'est que chaque réseau a son langage, et qu\'il n\'écoute que ceux qui le parlent. Notre travail : traduire.'
              : 'You already have things to say. The problem is that each network has its own language, and only listens to those who speak it. Our job: translate.'}
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
          <p className="mb-2 text-center text-lg font-semibold text-white md:text-xl">
            {lang === 'fr' ? 'Vous parlez. On traduit pour chaque réseau.' : 'You talk. We translate for each network.'}
          </p>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 sm:text-xs">
            {(lang === 'fr'
              ? ['1 idée', '1 contenu', '10+ contenus', 'Tous vos réseaux']
              : ['1 idea', '1 piece', '10+ pieces', 'Every network']
            ).map((step, i, arr) => (
              <span key={step} className="inline-flex items-center gap-2">
                <span className={i === arr.length - 1 ? 'text-empire' : 'text-neutral-300'}>{step}</span>
                {i < arr.length - 1 && <span className="text-neutral-600">→</span>}
              </span>
            ))}
          </div>
          <VoiceToContentAnimation />
        </motion.div>
      </div>
    </section>
  )
}
