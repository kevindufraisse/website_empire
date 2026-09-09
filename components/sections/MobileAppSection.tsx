'use client'

/**
 * MobileAppSection — l'app sur le téléphone, et le fait qu'on crée dans les
 * creux de la journée (déjeuner, rue, volant, salle d'attente : le lieu n'a
 * pas d'importance, c'est le geste qui compte). Tous les formats se tournent
 * depuis l'app, pas seulement l'interview vocale : le sélecteur de formats
 * sur le mock le rappelle.
 *
 * `earphones.webp` est une image du reel « podcast » de Kevin : écouteurs
 * filaires, téléphone tenu à la main, sous-titres posés par l'app - pas une
 * mise en scène. Les quatre arguments reprennent les faits du produit
 * (formats depuis l'app, 20 min → une semaine de contenu, dictée sans caméra,
 * montage et rédaction faits ensuite) tels qu'ils sont dits au setter ; pas
 * de chiffre qui n'y soit pas.
 */

import { motion } from 'framer-motion'
import { Headphones } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { useReveal } from '@/hooks/useReveal'

export default function MobileAppSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [ref, inView] = useReveal('-80px')

  if (autopilot) return null

  const points: { fr: [string, string]; en: [string, string] }[] = [
    {
      fr: ['Tous les formats, depuis le téléphone', 'Tier list, réaction, citation, flou → net, podcast, interview : chaque format se tourne depuis l\'app, avec le cadre et les consignes à l\'écran. Pour l\'interview, les questions arrivent dans les écouteurs, une à la fois.'],
      en: ['Every format, from the phone', 'Tier list, reaction, quote, blur → reveal, podcast, interview: every format is shot from the app, with the framing and the instructions on screen. For the interview, the questions come through your earphones, one at a time.'],
    },
    {
      fr: ['20 minutes dans un creux de la journée', 'Au déjeuner, dans la rue, au volant, entre deux rendez-vous. 20 minutes font une semaine de contenu, une heure fait le mois.'],
      en: ['20 minutes in a gap of the day', 'Over lunch, in the street, behind the wheel, between two meetings. 20 minutes make a week of content, one hour makes the month.'],
    },
    {
      fr: ['Sans montrer votre visage, si vous préférez', 'Le mode dictée : vous parlez, sans caméra. Posts, carrousels, newsletter, vidéos citation. Une note vocale Telegram suffit aussi.'],
      en: ['Without showing your face, if you prefer', 'Dictation mode: you talk, no camera. Posts, carousels, newsletter, quote videos. A Telegram voice note works too.'],
    },
    {
      fr: ['Tout est prêt quand vous rouvrez l\'app', 'Vidéos montées, posts et newsletter écrits et relus par un humain. Il reste un bouton : publier.'],
      en: ['Everything is ready when you reopen the app', 'Videos edited, posts and newsletter written and proofread by a human. One button left: publish.'],
    },
  ]

  const formats = fr
    ? ['Interview', 'Tier list', 'Réaction', 'Citation', 'Dictée']
    : ['Interview', 'Tier list', 'Reaction', 'Quote', 'Dictation']

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
                {/* Le sélecteur de format, puis la question en cours telle que
                    l'app la lit dans les écouteurs (format Interview actif) */}
                <div className="absolute inset-x-3 top-11 space-y-2">
                  <div className="flex gap-1.5 overflow-hidden">
                    {formats.map((f, i) => (
                      <span
                        key={f}
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md ${
                          i === 0 ? 'bg-empire text-black' : 'border border-white/15 bg-black/50 text-neutral-300'
                        }`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
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
              {fr ? 'Le contenu du mois, dans les creux de votre journée.' : 'A month of content, in the gaps of your day.'}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-neutral-400 md:text-lg">
              {fr
                ? 'Pas de bureau, pas de caméra à régler, pas de page blanche. Un téléphone, et tous les formats Empire dedans : face caméra, interview guidée dans les écouteurs, ou dictée sans image.'
                : 'No desk, no camera to set up, no blank page. A phone, with every Empire format inside: on camera, guided interview in your earphones, or dictation with no picture.'}
            </p>
            {/* Liste numérotée, filets fins : pas de pictos. */}
            <ol className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {points.map(({ fr: pfr, en: pen }, i) => {
                const [title, desc] = fr ? pfr : pen
                return (
                  <li key={title} className="grid grid-cols-[2.25rem_1fr] gap-3 py-4">
                    <span className="pt-0.5 text-[12px] font-bold tabular-nums text-empire">0{i + 1}</span>
                    <div>
                      <p className="text-base font-bold text-white">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-400">{desc}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
