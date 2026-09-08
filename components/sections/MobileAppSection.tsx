'use client'

/**
 * MobileAppSection — l'app sur le téléphone, les écouteurs, et le fait qu'on
 * crée en marchant. C'était absent de la page alors que c'est le geste
 * quotidien du produit : sur mobile il ne reste que la rafale et la dictée,
 * et c'est exactement ce qu'on montre ici.
 *
 * `earphones.webp` est une image du reel « podcast » de Kevin : écouteurs
 * filaires, téléphone tenu à la main, sous-titres posés par l'app - pas une
 * mise en scène. Les trois arguments reprennent les faits du produit
 * (l'interview par questions, 20 min → une semaine de contenu, montage et
 * rédaction faits au retour) tels qu'ils sont dits au setter ; pas de chiffre
 * qui n'y soit pas.
 */

import { motion } from 'framer-motion'
import { Headphones, Footprints, Sparkles, Mic } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { useReveal } from '@/hooks/useReveal'

export default function MobileAppSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [ref, inView] = useReveal('-80px')

  if (autopilot) return null

  const points = [
    {
      Icon: Headphones,
      fr: ['Tous les formats dans la poche', 'Tier list, réaction, citation, flou → net, podcast : chaque format se tourne depuis l\'app. Et pour l\'interview, elle vous pose les questions dans les écouteurs, une à la fois.'],
      en: ['Every format in your pocket', 'Tier list, reaction, quote, blur → reveal, podcast: every format is shot from the app. And for the interview, it asks you the questions in your earphones, one at a time.'],
    },
    {
      Icon: Footprints,
      fr: ['20 minutes en marchant', 'En promenant le chien, sur le chemin de la salle. 20 minutes de réponses font une semaine de contenu, une heure fait le mois.'],
      en: ['20 minutes while walking', 'Walking the dog, on the way to the gym. 20 minutes of answers make a week of content, one hour makes the month.'],
    },
    {
      Icon: Mic,
      fr: ['Sans montrer votre visage, si vous préférez', 'Le mode dictée : vous parlez, sans caméra. On en fait les posts, les carrousels, la newsletter et les vidéos citation. Une note vocale Telegram suffit aussi.'],
      en: ['Without showing your face, if you prefer', 'Dictation mode: you talk, no camera. We turn it into the posts, carousels, newsletter and quote videos. A Telegram voice note works too.'],
    },
    {
      Icon: Sparkles,
      fr: ['Tout est prêt quand vous rentrez', 'Les vidéos sont montées, les posts et la newsletter écrits et relus par un humain. Il reste un bouton : publier.'],
      en: ['Everything is ready when you get home', 'Videos edited, posts and newsletter written and proofread by a human. One button left: publish.'],
    },
  ]

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-black py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_30%,rgb(var(--empire-rgb)_/_0.08),transparent)]" />
      <div className="container relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Téléphone */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="order-2 flex justify-center lg:order-1"
          >
            <div className="relative w-[260px] sm:w-[300px]">
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[2.4rem] border border-white/10 bg-[#0b0b0b] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.95)] ring-1 ring-white/5">
                <img src="/formats/earphones.webp" alt={fr ? 'Kevin enregistre avec ses écouteurs' : 'Kevin recording with his earphones'} className="absolute inset-0 h-full w-full object-cover" loading="lazy" draggable={false} />
                <div className="absolute left-1/2 top-2.5 h-5 w-24 -translate-x-1/2 rounded-full bg-black/90" />
                {/* La question en cours, telle que l'app la lit dans les écouteurs */}
                <div className="absolute inset-x-3 top-11">
                  <div className="rounded-2xl border border-white/10 bg-black/60 px-3.5 py-2.5 backdrop-blur-md">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-empire">{fr ? 'Question 3 / 7' : 'Question 3 / 7'}</p>
                    <p className="mt-1 text-[12.5px] font-medium leading-snug text-white">
                      {fr ? '« Le pire conseil qu\'on donne aux gens qui se lancent ? »' : '“The worst advice people give to those starting out?”'}
                    </p>
                  </div>
                </div>
                {/* Timer + micro */}
                <div className="absolute inset-x-3 bottom-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 px-3.5 py-2.5 backdrop-blur-md">
                  <span className="flex items-center gap-2 text-[12px] font-semibold text-white">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                    {fr ? 'Enregistre' : 'Recording'}
                  </span>
                  <span className="text-[12px] tabular-nums text-neutral-300">06:42</span>
                </div>
              </div>
              {/* Pastille écouteurs, hors du cadre */}
              <div className="absolute -right-6 top-1/2 hidden -translate-y-1/2 rotate-6 rounded-2xl border border-white/10 bg-[#0b0b0b] px-3 py-2 shadow-xl sm:block">
                <p className="flex items-center gap-2 text-[11px] font-semibold text-white">
                  <Headphones className="h-3.5 w-3.5 text-empire" />
                  {fr ? 'Écouteurs connectés' : 'Earphones connected'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="order-1 lg:order-2"
          >
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-empire">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              {fr ? 'L\'app iPhone' : 'The iPhone app'}
            </p>
            <h2 className="text-3xl font-extrabold leading-[1.1] text-white md:text-5xl">
              {fr ? 'Le contenu du mois, en promenant le chien.' : 'A month of content, while walking the dog.'}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-neutral-400 md:text-lg">
              {fr
                ? 'Pas de bureau, pas de caméra à régler, pas de page blanche. Un téléphone, vos écouteurs, et la voix de l\'app qui vous pose les bonnes questions.'
                : 'No desk, no camera to set up, no blank page. A phone, your earphones, and the app\'s voice asking you the right questions.'}
            </p>
            <ul className="mt-8 space-y-5">
              {points.map(({ Icon, fr: pfr, en: pen }) => {
                const [title, desc] = fr ? pfr : pen
                return (
                  <li key={title} className="flex gap-4">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-empire/30 bg-empire/10 text-empire">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-base font-bold text-white">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-400">{desc}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
