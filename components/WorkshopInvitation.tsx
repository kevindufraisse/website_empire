'use client'

import { Play, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'

export default function WorkshopInvitation({ source }: { source: string }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  return (
    <section data-workshop-invitation={source} className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <div className="rounded-2xl border border-white/15 bg-white/[0.035] p-6 sm:p-8 md:flex md:items-center md:gap-10">
        <div className="flex-1">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-empire"><Play size={16} aria-hidden />{fr ? 'Workshop gratuit · replay' : 'Free workshop · replay in French'}</p>
          <h2 className="text-2xl font-bold text-white">{fr ? 'Comprends la méthode derrière Empire.' : 'Understand the method behind Empire.'}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-neutral-400">{fr ? 'Quels messages publier, dans quels formats, et comment les diffuser ? Kevin te présente la méthode complète dans le workshop.' : 'What should you publish, in which formats, and how should you distribute it? Kevin walks you through the full method in the workshop.'}</p>
        </div>
        <div className="mt-6 shrink-0 md:mt-0">
          <a href="/vsl" onClick={() => trackAmplitude('empire_workshop_clicked', { source })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 font-semibold text-white transition hover:bg-white/10">{fr ? 'Voir le workshop gratuit' : 'Watch the free workshop'}<ArrowRight size={17} aria-hidden /></a>
          <p className="mt-2 text-xs text-neutral-500">{fr ? 'Accès par email · à ton rythme' : 'Email access · at your own pace'}</p>
        </div>
      </div>
    </section>
  )
}
