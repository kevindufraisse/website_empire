'use client'

import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MissionClient() {
  const { t, lang } = useLanguage()
  const fr = lang === 'fr'
  const founder = t.founder

  return (
    <main className="min-h-screen bg-black pb-24 pt-28 text-white md:pt-32">
      <article className="mx-auto max-w-2xl px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-empire">
          {fr ? 'Ma mission' : 'My mission'}
        </p>
        <h1 className="mt-3 text-balance text-3xl font-bold leading-tight tracking-tight md:text-5xl">
          {founder.storyTitle}
        </h1>

        <div className="mt-8 flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-empire/40">
            <Image src="/founders/kevin.jpg" alt="Kevin Dufraisse" fill sizes="56px" className="object-cover" />
          </div>
          <div>
            <p className="text-[15px] font-semibold">Kevin Dufraisse</p>
            <p className="text-[13px] text-neutral-500">{fr ? 'Fondateur d’Empire Internet' : 'Founder of Empire Internet'}</p>
          </div>
        </div>

        <div className="mt-10 space-y-6 text-[17px] leading-relaxed text-neutral-300">
          {founder.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <p className="mt-10 border-l-2 border-empire pl-4 text-lg font-semibold text-white">
          {founder.storyTagline}
        </p>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <a
            href="/vsl"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-empire px-6 py-3.5 text-sm font-bold text-black transition hover:brightness-110"
          >
            {fr ? 'Voir le workshop gratuit · 1 h 26' : 'Watch the free workshop · 1h26'}
          </a>
          <a
            href="/tarifs"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            {fr ? 'Voir les tarifs' : 'See pricing'}
          </a>
        </div>
      </article>
    </main>
  )
}
