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
import { Headphones, Footprints, Sparkles } from 'lucide-react'
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
      fr: ['L\'app vous pose les questions', 'Dans vos écouteurs, une question à la fois. Vous répondez à votre téléphone comme à un ami, elle enregistre et enchaîne.'],
      en: ['The app asks the questions', 'In your earphones, one question at a time. You answer your phone like you would a friend, it records and moves on.'],
    },
    {
      Icon: Footprints,
      fr: ['20 minutes en marchant', 'En promenant le chien, sur le chemin de la salle. 20 minutes de réponses font une semaine de contenu, une heure fait le mois.'],
      en: ['20 minutes while walking', 'Walking the dog, on the way to the gym. 20 minutes of answers make a week of content, one hour makes the month.'],
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
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-empire">
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
