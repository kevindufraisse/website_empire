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
          className="mx-auto mb-6 max-w-4xl text-center md:mb-8"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-empire">
            {lang === 'fr' ? 'Étape 1 · Message' : 'Step 1 · Message'}
          </p>
          <h2 className="text-2xl font-extrabold leading-[1.2] text-white sm:text-3xl md:text-4xl">
            {lang === 'fr'
              ? <>Vos sujets sont là avant que vous les cherchiez.</>
              : <>Your topics are there before you look for them.</>}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg">
            {lang === 'fr'
              ? 'Tout passe par Telegram : un reel, une note, un vocal, une vidéo. Ça arrive dans votre espace. On y ajoute ce que vos concurrents ont posté la semaine dernière, et les sujets qui font le plus de vues en ce moment sur YouTube, Instagram et TikTok.'
              : 'Everything goes through Telegram: a reel, a note, a voice memo, a video. It lands in your workspace. We add what your competitors posted last week, and the topics getting the most views right now on YouTube, Instagram and TikTok.'}
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
              ? 'Vous ouvrez l\'app, les sujets sont prêts. Il reste un bouton à presser.'
              : 'You open the app, the topics are ready. One button left to press.'}
          </p>
          <VoiceToContentAnimation />
        </motion.div>
      </div>
    </section>
  )
}
