'use client'

import { Check, Minus, X } from 'lucide-react'
import EmpireSalesCta from '@/components/EmpireSalesCta'

// « Vous avez déjà essayé… » : chaque alternative comparée sur les cinq termes
// de la formule. Les autres en couvrent un morceau, Empire la formule entière.
type Mark = 'yes' | 'partial' | 'no'
const TERMS = ['Message', 'Format', 'Diffusion', 'Temps', 'Coût'] as const

const ROWS: { name: string; example: string; cells: [Mark, string][]; empire?: boolean }[] = [
  {
    name: 'Montage IA automatique',
    example: '« Un outil découpe mes vidéos »',
    cells: [
      ['no', 'Des extraits pris au hasard, sans angle'],
      ['partial', 'Un seul format : l’extrait découpé'],
      ['partial', 'Vidéo seulement, rien pour l’écrit'],
      ['no', '10 à 15 h par semaine'],
      ['yes', '20 à 100 € par mois'],
    ],
  },
  {
    name: 'Posts viraux + ChatGPT',
    example: '« Je copie ce qui marche et je le réécris »',
    cells: [
      ['no', 'Ça ne vous ressemble pas'],
      ['partial', 'Copié, jamais testé sur vous'],
      ['no', 'Un réseau, à la main'],
      ['no', '20 à 30 h par semaine'],
      ['yes', '20 € par mois, plus votre temps'],
    ],
  },
  {
    name: 'Podcast ou studio',
    example: '« J’enregistre un épisode »',
    cells: [
      ['yes', 'Votre parole'],
      ['partial', 'Un seul format, long'],
      ['partial', 'Une ou deux plateformes'],
      ['partial', 'Une demi-journée par épisode, le reste à la main'],
      ['no', '300 à 1 000 € la session'],
    ],
  },
  {
    name: 'Freelance ou agence',
    example: '« Je délègue tout »',
    cells: [
      ['partial', 'Souvent impersonnel'],
      ['partial', 'Un ou deux formats'],
      ['partial', 'Selon le contrat'],
      ['partial', '3 à 5 h de briefs et relectures'],
      ['no', '1 500 à 10 000 € par mois'],
    ],
  },
  {
    name: 'Empire',
    example: 'La formule entière',
    empire: true,
    cells: [
      ['yes', 'Vos notes, vos liens et les réseaux de vos concurrents'],
      ['yes', '10 formats testés et validés'],
      ['yes', '7 réseaux, adapté en écrit, vidéo et Threads'],
      ['yes', '1 h par semaine'],
      ['yes', 'À partir de 199 € par mois'],
    ],
  },
]

function Icon({ mark }: { mark: Mark }) {
  if (mark === 'yes') return <Check className="h-4 w-4 shrink-0 text-empire" aria-label="Oui" />
  if (mark === 'partial') return <Minus className="h-4 w-4 shrink-0 text-amber-300" aria-label="En partie" />
  return <X className="h-4 w-4 shrink-0 text-red-400" aria-label="Non" />
}

export default function FormulaCompareSection() {
  return (
    <section className="bg-[#090909] px-4 py-16 text-white md:py-24" aria-labelledby="formula-compare-title">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-empire">Vous avez sûrement déjà essayé</p>
          <h2 id="formula-compare-title" className="mt-3 text-3xl font-semibold leading-tight tracking-[-.04em] sm:text-4xl">
            Chaque solution couvre un morceau de la formule.<br className="hidden sm:block" />{' '}
            <span className="text-empire">Empire couvre la formule entière.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-400">
            Être vu demande les cinq à la fois. Il suffit qu’un seul manque pour que ça ne marche pas.
          </p>
        </div>

        {/* Ordinateur : un tableau */}
        <div className="mt-10 hidden overflow-hidden rounded-2xl border border-white/10 md:block">
          <div className="grid grid-cols-[1.3fr_repeat(5,minmax(0,1fr))] bg-white/[0.03] text-xs font-semibold uppercase tracking-wider text-neutral-400">
            <div className="px-5 py-4" />
            {TERMS.map((t) => <div key={t} className="px-4 py-4 text-center">{t}</div>)}
          </div>
          {ROWS.map((row) => (
            <div
              key={row.name}
              className={(row.empire ? 'bg-empire/[0.07] ring-1 ring-inset ring-empire/40 ' : 'border-t border-white/10 ') + 'grid grid-cols-[1.3fr_repeat(5,minmax(0,1fr))]'}
            >
              <div className="px-5 py-5">
                <b className={(row.empire ? 'text-empire ' : 'text-white ') + 'block text-base'}>{row.name}</b>
                <small className="mt-1 block text-xs text-neutral-500">{row.example}</small>
              </div>
              {row.cells.map(([mark, note], i) => (
                <div key={i} className="flex flex-col items-center gap-2 px-3 py-5 text-center">
                  <Icon mark={mark} />
                  <span className={(row.empire ? 'text-neutral-200 ' : 'text-neutral-400 ') + 'text-[11px] leading-snug'}>{note}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Mobile : une carte par solution */}
        <div className="mt-8 space-y-3 md:hidden">
          {ROWS.map((row) => (
            <div key={row.name} className={(row.empire ? 'border-empire/50 bg-empire/[0.07] ' : 'border-white/10 bg-white/[0.02] ') + 'rounded-2xl border p-4'}>
              <b className={(row.empire ? 'text-empire ' : 'text-white ') + 'block text-base'}>{row.name}</b>
              <small className="mt-0.5 block text-xs text-neutral-500">{row.example}</small>
              <ul className="mt-3 space-y-2">
                {row.cells.map(([mark, note], i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs">
                    <Icon mark={mark} />
                    <span className="w-16 shrink-0 font-semibold text-neutral-300">{TERMS[i]}</span>
                    <span className="text-neutral-400">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-3 text-center text-[11px] text-neutral-600">Temps estimés pour une semaine type : 5 posts, 2 posts illustrés, 3 à 5 vidéos et leurs miniatures, publiés sur 7 réseaux. Coûts moyens, variables selon les prestataires.</p>
        <p className="mx-auto mt-8 max-w-2xl text-center text-lg font-semibold leading-snug text-white">
          Montage IA, studio, freelance : c’est un format sur dix, et vous ne l’avez jamais testé sur votre audience.{' '}
          <span className="text-neutral-400">Si vous voulez continuer à y passer vos soirées ou à payer cher pour peu de résultats, continuez.</span>
        </p>
        <div className="mt-8">
          <EmpireSalesCta source="home-formula-compare" />
        </div>
        <p className="mt-4 text-center text-xs text-neutral-500">
          <a href="/comparatif" className="underline underline-offset-4 hover:text-neutral-300">Voir les comparatifs détaillés</a>
        </p>
      </div>
    </section>
  )
}
