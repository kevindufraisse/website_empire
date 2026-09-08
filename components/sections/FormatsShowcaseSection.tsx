'use client'

/**
 * FormatsShowcaseSection — les formats qui font des vues, montrés tels qu'ils
 * sortent de l'app.
 *
 * Les visuels vidéo (`/public/formats/*.webp`) ne sont pas des maquettes :
 * ce sont les rendus réels du moteur de montage (flou → net, tier list et
 * sticker FAQ posés sur une vraie prise, citation et réaction sortis tels
 * quels d'un compose). Seul `podcast.webp` est un habillage illustratif sur
 * une vraie prise - l'interview n'a pas de rendu serveur, c'est un écran.
 * Si le rendu change côté app, il faut les régénérer, sinon la page promet
 * un visuel que le produit ne fait plus.
 *
 * Slider horizontal à la Apple : scroll-snap natif (le doigt sur mobile, la
 * molette/trackpad sur desktop), flèches en repli, la carte au centre est
 * mise en avant. Pas de lib carousel : le snap CSS suffit et il reste fluide
 * sur un téléphone d'entrée de gamme, ce qu'aucune lib JS ne garantit.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { useReveal } from '@/hooks/useReveal'

type Format = {
  id: string
  image?: string
  titleFr: string
  titleEn: string
  descFr: string
  descEn: string
  tagFr: string
  tagEn: string
}

const FORMATS: Format[] = [
  {
    id: 'blur-reveal',
    image: '/formats/blur-reveal.webp',
    titleFr: 'Flou → net',
    titleEn: 'Blur → reveal',
    descFr: 'Vous nommez 8 personnes ou produits, on trouve les visuels, ils se dévoilent au fil de votre commentaire.',
    descEn: 'You name 8 people or products, we find the visuals, they unblur as you comment.',
    tagFr: 'Le format qui retient jusqu\'au bout',
    tagEn: 'The format people watch to the end',
  },
  {
    id: 'tierlist',
    image: '/formats/tierlist.webp',
    titleFr: 'Tier list',
    titleEn: 'Tier list',
    descFr: 'Un classement S → F sur votre sujet. Vous parlez, la grille se remplit, le montage est fait.',
    descEn: 'An S → F ranking on your topic. You talk, the grid fills in, the edit is done.',
    tagFr: 'Le format qui fait commenter',
    tagEn: 'The format that gets comments',
  },
  {
    id: 'quote',
    image: '/formats/quote.webp',
    titleFr: 'Citation',
    titleEn: 'Quote',
    descFr: 'Une phrase forte, son auteur, votre lecture en 30 secondes. Rien à écrire, rien à monter.',
    descEn: 'A strong line, its author, your take in 30 seconds. Nothing to write, nothing to edit.',
    tagFr: 'Le format le plus rapide à tourner',
    tagEn: 'The fastest format to shoot',
  },
  {
    id: 'reaction',
    image: '/formats/reaction.webp',
    titleFr: 'Réaction à un viral',
    titleEn: 'Viral reaction',
    descFr: 'On vous propose les vidéos qui explosent dans votre domaine. Vous réagissez, la vidéo passe au-dessus de vous.',
    descEn: 'We surface the videos blowing up in your field. You react, the clip plays above you.',
    tagFr: 'Le format qui emprunte l\'audience',
    tagEn: 'The format that borrows an audience',
  },
  {
    id: 'faq',
    image: '/formats/faq.webp',
    titleFr: 'Fausse FAQ',
    titleEn: 'Fake Q&A',
    descFr: 'Le sticker « Posez-moi une question », avec les questions que vos clients posent vraiment. Vous répondez, on habille.',
    descEn: 'The “Ask me a question” sticker, with the questions your clients actually ask. You answer, we dress it up.',
    tagFr: 'Le format qui vend sans vendre',
    tagEn: 'The format that sells without selling',
  },
  {
    id: 'podcast',
    image: '/formats/podcast.webp',
    titleFr: 'Podcast / interview',
    titleEn: 'Podcast / interview',
    descFr: 'On vous pose les questions, vous répondez 1 h. On découpe en reels, posts et newsletters pour le mois.',
    descEn: 'We ask the questions, you answer for 1 hour. We cut it into reels, posts and newsletters for the month.',
    tagFr: 'Le format qui nourrit tout le reste',
    tagEn: 'The format that feeds everything else',
  },
  {
    id: 'written',
    titleFr: 'Post LinkedIn & newsletter',
    titleEn: 'LinkedIn post & newsletter',
    descFr: 'Chaque vidéo devient aussi un post et une newsletter, relus par un humain avant publication.',
    descEn: 'Every video also becomes a post and a newsletter, proofread by a human before it goes out.',
    tagFr: 'La cascade : 1 prise, 10+ contenus',
    tagEn: 'The cascade: 1 take, 10+ pieces',
  },
]

/**
 * Carte écrite : le début d'un post LinkedIn réel de Kevin, écrit par le
 * writer depuis une prise vidéo et publié le 2 septembre 2026
 * (`user_content` de `ws_a6F0cdnK1`). Texte repris tel quel, pas de chiffres
 * d'engagement : on n'en a pas de fiables pour LinkedIn, on n'en invente pas.
 */
const REAL_POST_FR = [
  'Les entrepreneurs ne décident pas d\'entreprendre.',
  'Ils n\'arrivent pas à faire autrement.',
  'Quand j\'entends des gens qui doutent, qui ont peur de se lancer ou même peur d\'échouer, je me fais tout le temps la même réflexion.',
  'Je n\'ai aucun doute sur le fait qu\'ils réussiront.',
  'Pas parce qu\'ils sont plus malins ou mieux préparés, mais parce que l\'envie de réussir est tellement ancrée en eux qu\'elle tourne en arrière-plan, même quand tout le reste dit stop.',
]
const REAL_POST_EN = [
  'Entrepreneurs don\'t decide to start a business.',
  'They can\'t do otherwise.',
  'When I hear people who doubt, who are afraid to start or even afraid to fail, I always have the same thought.',
  'I have no doubt they will succeed.',
  'Not because they are smarter or better prepared, but because the urge to succeed is so deeply rooted that it keeps running in the background, even when everything else says stop.',
]

function WrittenCard({ fr }: { fr: boolean }) {
  const [hook, ...rest] = fr ? REAL_POST_FR : REAL_POST_EN
  return (
    <div className="absolute inset-0 flex flex-col bg-[#0b0b0b] p-5 text-left">
      <div className="flex items-center gap-3">
        <img src="/founders/kevin.jpg" alt="" className="h-10 w-10 rounded-full object-cover" loading="lazy" />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-white">Kevin Dufraisse</p>
          <p className="truncate text-[11px] text-neutral-500">{fr ? 'Écrit depuis une prise de 40 s' : 'Written from a 40-second take'}</p>
        </div>
      </div>
      <p className="mt-4 text-[15px] font-semibold leading-snug text-white">{hook}</p>
      <div className="mt-3 space-y-2.5 text-[12.5px] leading-relaxed text-neutral-300">
        {rest.map((p) => <p key={p}>{p}</p>)}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/80 to-transparent" />
    </div>
  )
}

export default function FormatsShowcaseSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [ref, inView] = useReveal('-80px')
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  // La carte "active" est celle dont le centre est le plus proche du centre
  // de la piste : c'est elle qui est à l'échelle 1, les autres reculent.
  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const mid = track.scrollLeft + track.clientWidth / 2
    let best = 0
    let bestDist = Infinity
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement
      const c = el.offsetLeft + el.offsetWidth / 2
      const d = Math.abs(c - mid)
      if (d < bestDist) { bestDist = d; best = i }
    })
    setActive(best)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    measure()
    track.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      track.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  const scrollTo = (i: number) => {
    const track = trackRef.current
    if (!track) return
    const el = track.children[Math.max(0, Math.min(FORMATS.length - 1, i))] as HTMLElement | undefined
    if (!el) return
    track.scrollTo({ left: el.offsetLeft + el.offsetWidth / 2 - track.clientWidth / 2, behavior: 'smooth' })
  }

  if (autopilot) return null

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-black py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgb(var(--empire-rgb)_/_0.10),transparent)]" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-empire">
            {fr ? 'La viralité n\'est pas de la chance' : 'Virality is not luck'}
          </p>
          <h2 className="text-3xl font-extrabold leading-[1.1] text-white md:text-5xl">
            {fr ? 'Les formats qui font des vues, prêts à filmer.' : 'The formats that get views, ready to shoot.'}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg">
            {fr
              ? 'Chaque semaine, notre équipe mesure ce qui monte sur les réseaux, garde les formats qui tiennent et retire les autres. Vous ouvrez l\'app, vous parlez : le montage est déjà fait.'
              : 'Every week our team measures what is rising on social, keeps the formats that hold up and drops the rest. You open the app and talk: the edit is already done.'}
          </p>
        </motion.div>
      </div>

      {/* Piste : pleine largeur, gouttières calculées pour que la première et la
          dernière carte puissent se centrer (padding = 50vw - demi-carte). */}
      <div className="relative mt-12 md:mt-16">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-black to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-black to-transparent sm:w-24" />

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-[calc(50vw-125px)] pb-4 sm:gap-8 sm:px-[calc(50vw-150px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {FORMATS.map((f, i) => {
            const isActive = i === active
            return (
              <div key={f.id} className="snap-center shrink-0">
                <motion.button
                  type="button"
                  onClick={() => scrollTo(i)}
                  animate={{ scale: isActive ? 1 : 0.9, opacity: isActive ? 1 : 0.55 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  className="group relative block w-[250px] sm:w-[300px] focus:outline-none"
                  aria-label={fr ? f.titleFr : f.titleEn}
                >
                  {/* Cadre téléphone */}
                  <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#0b0b0b] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/5">
                    {f.image ? (
                      <img
                        src={f.image}
                        alt={fr ? f.titleFr : f.titleEn}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading={i < 2 ? 'eager' : 'lazy'}
                        draggable={false}
                      />
                    ) : (
                      <WrittenCard fr={fr} />
                    )}
                    {/* Encoche */}
                    <div className="absolute left-1/2 top-2.5 h-5 w-24 -translate-x-1/2 rounded-full bg-black/90" />
                    {/* Étiquette */}
                    <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                      <div className="rounded-2xl border border-white/10 bg-black/55 px-3.5 py-2.5 backdrop-blur-md">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-empire">
                          {fr ? f.tagFr : f.tagEn}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.button>

                <motion.div
                  animate={{ opacity: isActive ? 1 : 0.35, y: isActive ? 0 : 4 }}
                  transition={{ duration: 0.3 }}
                  className="mx-auto mt-5 w-[250px] text-center sm:w-[300px]"
                >
                  <p className="text-lg font-bold text-white">{fr ? f.titleFr : f.titleEn}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">{fr ? f.descFr : f.descEn}</p>
                </motion.div>
              </div>
            )
          })}
        </div>

        {/* Flèches + points : desktop surtout, le doigt fait le reste sur mobile */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => scrollTo(active - 1)}
            disabled={active === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 disabled:opacity-30"
            aria-label={fr ? 'Format précédent' : 'Previous format'}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            {FORMATS.map((f, i) => (
              <button
                key={f.id}
                type="button"
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all ${i === active ? 'w-6 bg-empire' : 'w-1.5 bg-white/25 hover:bg-white/50'}`}
                aria-label={fr ? f.titleFr : f.titleEn}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollTo(active + 1)}
            disabled={active === FORMATS.length - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 disabled:opacity-30"
            aria-label={fr ? 'Format suivant' : 'Next format'}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Méthode : trois temps, pas de chiffre inventé. */}
      <div className="container relative mt-14">
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            {
              fr: ['On mesure', 'Chaque semaine, les formats qui montent sur 7 réseaux, tous secteurs.'],
              en: ['We measure', 'Every week, the formats rising across 7 networks, all sectors.'],
            },
            {
              fr: ['On garde ce qui tient', 'Un format entre dans l\'app quand il fait des vues chez plusieurs clients, pas chez un seul.'],
              en: ['We keep what holds', 'A format enters the app when it gets views for several clients, not just one.'],
            },
            {
              fr: ['On retire le reste', 'Ce qui s\'essouffle sort du catalogue. Vous ne filmez jamais un format mort.'],
              en: ['We drop the rest', 'What fades leaves the catalog. You never shoot a dead format.'],
            },
          ].map((step, i) => {
            const [title, desc] = fr ? step.fr : step.en
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <p className="text-xs font-bold text-empire">0{i + 1}</p>
                <p className="mt-1.5 text-base font-bold text-white">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">{desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
