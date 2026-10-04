import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { COMPARISONS } from '@/components/sections/compare/comparisons'

export const metadata: Metadata = {
  title: 'Empire comparé : MagicPost, Taplio, Opus Clip, freelances, agences, ChatGPT',
  description:
    'Chaque solution couvre une partie de la formule de la visibilité. Empire couvre le message, le format et la diffusion sur 7 réseaux, pour 20 minutes à 1 heure par semaine.',
  alternates: { canonical: '/comparatif' },
}

export default function ComparatifPage() {
  const part = (t: string) => <span className="font-bold text-white">{t}</span>
  return (
    <main className="relative">
      <section className="w-full bg-gradient-to-b from-black to-[#0f0f0f] pb-12 pt-24 md:pt-32">
        <div className="container max-w-4xl text-center">
          <p className="mb-5 inline-block rounded-full border border-empire/30 bg-empire/10 px-4 py-1.5 text-sm font-semibold text-empire">Comparatifs</p>
          <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl">Empire comparé aux autres solutions</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-300">
            Chaque outil couvre un morceau de la formule. Empire couvre la formule entière, avec des formats testés sur le compte de Kevin Dufraisse.
          </p>
          <p className="mx-auto max-w-3xl rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm text-neutral-400 md:text-base">
            {part('Message')} × {part('Format')} × {part('Diffusion')} ÷ ({part('Temps')} + {part('Coût')}) ={' '}
            <span className="font-bold text-empire">Visibilité → Clients</span>
          </p>
        </div>
      </section>

      <section className="w-full pb-24 pt-6">
        <div className="container grid max-w-4xl gap-4 md:grid-cols-2">
          {COMPARISONS.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-empire/50"
            >
              <div>
                <p className="mb-2 text-xl font-bold text-white">Empire vs {c.competitor}</p>
                <p className="text-sm leading-relaxed text-neutral-400">{c.summary}</p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-empire">
                Comparer <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
