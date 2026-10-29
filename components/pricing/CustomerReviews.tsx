'use client'

import { useState } from 'react'
import glass from './pricing.module.css'
import { Play, Star } from 'lucide-react'

/**
 * Avis clients de la page tarifs. Même liste que
 * `empire-tracking/src/components/pricing/CustomerReviews.tsx` (le pricing de
 * l'app) : les avis réels collectés sur Senja, mot pour mot - ne pas les
 * reformuler, c'est la parole du client.
 */

const SENJA = 'https://cdn.senja.io/public'

type VideoTestimonial = { name: string; role: string; poster: string; src: string; tag?: string }

/** Vidéo Mux d'un témoignage Senja : vignette prise à `time` secondes. */
const mux = (id: string, time: number) => ({
  poster: `https://image.mux.com/${id}/thumbnail.jpg?time=${time}`,
  src: `https://stream.mux.com/${id}/medium.mp4`,
})

/** Les témoignages vidéo du mur Senja, tous (miroir de l'app). Vignette quand le
 *  client parle. Sébastien et Amélie parlent du bootcamp, pas de l'abonnement. */
const VIDEOS: VideoTestimonial[] = [
  { name: 'Olivier Sarezinski', role: 'Gérant associé', ...mux('01shigG5pv5dcW02r00NJI8sYwALp64oqL29ZztP8ZraxU', 40) },
  { name: 'Sophie Guibaud', role: 'Board-Level Growth Advisor', ...mux('Ihbs1Ay3AMfsadLsUL3JaqBm01Sbt01Fk01KvbTatoMYsU', 30) },
  { name: 'Julien Guyard', role: 'Associé fondateur', ...mux('ISakJLHUhWKFVozK7yNojMMJkIUdWqDQBIAEj102ab6c', 4) },
  { name: 'Léa Marie', role: 'Consultante marketing digital & branding', ...mux('8k3Y2wvixY3wN02apY6lo2SQvWcwZDSZhC02LiCGthvFo', 20) },
  { name: 'Amélie Faligot', role: 'Growth marketeuse', tag: 'Bootcamp', ...mux('8fzR9Inuae1s3l4Z3NTt01OwiJktsvSUGuE5Lx78L9dI', 5) },
  { name: 'Sébastien Min', role: 'LeadGen Consulting', tag: 'Bootcamp', ...mux('ujvVeDFFJ3MaZm8bsHDd1dfDOZ5KgVm1GXXB7NSamOg', 10) },
]

const REVIEWS: Array<{ name: string; role: string; photo: string; text: string }> = [
  {
    name: 'Olivier Sarezinski',
    role: 'Gérant associé',
    photo: `${SENJA}/avatar/878666b7-ccb2-4480-b295-cadb7a02bbde_1000129171.jpg?width=80&height=80&format=webp`,
    text: "Avant de travailler avec Empire, mon activité sur les réseaux sociaux était irrégulière, amatrice et sans stratégie. Empire m'a permis de structurer ma stratégie, de poster quotidiennement des contenus que je n'aurais pas pu produire seul. Et cela en une heure de travail par semaine. Il m'aurait fallu faire appel à plusieurs freelances pour avoir un résultat équivalent.",
  },
  {
    name: 'Emmanuelle J.',
    role: 'Jazz Communication',
    photo: `${SENJA}/media/bfa693ba-3fb6-48c0-8e41-d8b1ae23adc7_d572083b-d1c5-4e02-ae8c-ef1b705f4999_1759355418647.jpeg?width=80&height=80&format=webp`,
    text: "En tournant une seule vidéo, j'ai obtenu une pluie de contenus quasi prêts. Le jour où j'ai vu mon calendrier se remplir tout seul, j'ai compris le potentiel.",
  },
  {
    name: 'Gaidig D.',
    role: 'Avocate',
    photo: `${SENJA}/media/7136b611-a541-455c-8ee1-ef638afe7a6f_688f247c-fdf9-448f-8a2d-c1bf240f3ae6_1762441666628.jpeg?width=80&height=80&format=webp`,
    text: "Ton système a fait sauter toutes mes excuses : plus besoin d'être designer ni monteur. Il m'oblige à oser me montrer et à dire vraiment ce que j'ai à dire.",
  },
  {
    name: 'Sophie Guibaud',
    role: 'Board-Level Growth Advisor',
    photo: `${SENJA}/media/0cda52ed-877f-4140-87b4-071fc072168b_1745464531125.jpeg?width=80&height=80&format=webp`,
    text: "Le système Empire est un game-changer : il me permet de partager mes idées et concepts de façon rapide, claire et systématique. Résultat ? Des heures gagnées chaque semaine, que je peux consacrer à ce qui compte vraiment : accompagner mes entrepreneurs.",
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-label="5 sur 5">
      {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
    </div>
  )
}

export default function CustomerReviews({ title }: { title: string }) {
  const [playing, setPlaying] = useState<string | null>(null)
  return (
    <section>
      <h2 className="text-center text-sm font-semibold text-white">{title}</h2>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
        {VIDEOS.map((v) => (
          <div key={v.name} className={`relative aspect-video overflow-hidden ${glass.panel}`}>
            {playing === v.name ? (
              <video src={v.src} poster={v.poster} controls autoPlay playsInline className="h-full w-full object-cover" />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(v.name)}
                aria-label={`Voir le témoignage ${/^[aeiouyhéèêàâîôû]/i.test(v.name) ? 'd’' : 'de '}${v.name}`}
                className="group absolute inset-0 cursor-pointer text-left"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.poster} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black transition group-hover:scale-105 md:left-1/2 md:right-auto md:top-1/2 md:h-10 md:w-10 md:-translate-x-1/2 md:-translate-y-1/2">
                  <Play className="h-4 w-4 fill-current" />
                </span>
                {v.tag && (
                  <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white/85">{v.tag}</span>
                )}
                <span className="absolute bottom-2 left-2.5 right-2.5">
                  <span className="block truncate text-[13px] font-semibold text-white">{v.name}</span>
                  <span className="block truncate text-[11px] text-neutral-300">{v.role}</span>
                </span>
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {REVIEWS.map((r) => (
          <figure key={r.name} className={`flex flex-col gap-3 p-5 ${glass.panel}`}>
            <Stars />
            <blockquote className="flex-1 text-sm leading-relaxed text-neutral-200">{r.text}</blockquote>
            <figcaption className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.photo} alt="" loading="lazy" className="h-8 w-8 rounded-full object-cover" />
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold text-white">{r.name}</span>
                <span className="block truncate text-[11px] text-neutral-300">{r.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
