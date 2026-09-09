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
              ? 'Tout le monde a quelque chose à dire. Presque personne ne sait le faire entendre.'
              : 'Everyone has something to say. Almost no one knows how to make it heard.'}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg">
            {lang === 'fr'
              ? 'Une opinion, un constat, une actu à commenter : vous l\'avez déjà. Ce qui manque, ce n\'est pas le message. C\'est la façon de le dire pour qu\'on s\'arrête, et l\'endroit où le mettre pour qu\'on le voie. Des millions de gens ont un message. Ceux qu\'on écoute sont ceux qui ont le reste de la formule.'
              : 'An opinion, an observation, a piece of news to react to: you already have it. What is missing is not the message. It is the way to say it so people stop, and the place to put it so people see it. Millions of people have a message. The ones we listen to are the ones who have the rest of the formula.'}
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
            {lang === 'fr' ? 'Vous le dites. On en fait le reste.' : 'You say it. We turn it into the rest.'}
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
