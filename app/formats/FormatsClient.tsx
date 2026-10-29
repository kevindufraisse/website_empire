'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { FORMATS, FormatScreen, KIND_LABEL, NetworkRow, type Format } from '@/components/sections/FormatsShowcaseSection'
import { startFreeTrial, TRIAL_CREDITS } from '@/lib/startTrial'
import { trackAmplitude } from '@/lib/amplitude'

/**
 * Page /formats : les mêmes onze formats que le slider de l'accueil
 * (`FORMATS`, rendus réels du moteur de montage), en grille. Une seule liste
 * pour les deux : si un format change dans l'app, on le change à un endroit.
 */

const DEMO_URL = 'https://app.empire-internet.com/demo'

const GROUPS: Format['kind'][] = ['short', 'long', 'written']

export default function FormatsClient() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [opening, setOpening] = useState(false)

  const startTrial = async (location: string) => {
    if (opening) return
    setOpening(true)
    trackAmplitude('formats_page_trial_clicked', { location })
    await startFreeTrial('growth')
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black pb-24 pt-28 text-white md:pt-36">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">{fr ? 'Les formats' : 'Formats'}</p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">
            {fr ? 'Un format, c’est ce qui fait regarder.' : 'A format is what makes people watch.'}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-400 md:text-lg">
            {fr
              ? 'Des sous-titres rendent une vidéo lisible. Un format lui donne une raison d’être regardée jusqu’au bout. Voici ceux qu’Empire monte, tels qu’ils sortent de l’app.'
              : 'Captions make a video readable. A format gives people a reason to watch to the end. Here are the ones Empire edits, as they come out of the app.'}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span className="text-xs text-neutral-500">{fr ? 'Publiés sur' : 'Published to'}</span>
            <NetworkRow networks={['instagram', 'tiktok', 'youtube', 'linkedin', 'facebook', 'threads', 'twitter', 'newsletter']} size="md" />
          </div>
        </header>

        {GROUPS.map((kind) => {
          const items = FORMATS.filter((f) => f.kind === kind)
          if (!items.length) return null
          return (
            <section key={kind} className="mt-20">
              <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
                {fr ? KIND_LABEL[kind].fr : KIND_LABEL[kind].en}
                {kind === 'short' && <span className="ml-2 text-base font-medium text-neutral-500">· {items.length}</span>}
              </h2>
              <div className="mx-auto mt-10 grid max-w-5xl gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((f, i) => (
                  <article key={f.id} className="mx-auto w-full max-w-[300px]">
                    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#0b0b0b] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/5">
                      <FormatScreen f={f} fr={fr} eager={kind === 'short' && i < 3} />
                      <div className="absolute left-1/2 top-2.5 h-5 w-24 -translate-x-1/2 rounded-full bg-black/90" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="rounded-2xl border border-white/10 bg-black/55 px-3.5 py-2.5 backdrop-blur-md">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-empire">{fr ? f.tagFr : f.tagEn}</p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-5 text-lg font-bold">{fr ? f.titleFr : f.titleEn}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">{fr ? f.descFr : f.descEn}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[11px] text-neutral-500">{fr ? 'Reformaté pour' : 'Reformatted for'}</span>
                      <NetworkRow networks={f.networks} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}

        <section className="mx-auto mt-24 max-w-2xl rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.07] to-white/[0.02] px-6 py-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {fr ? 'Essaie-les sur tes propres sujets.' : 'Try them on your own topics.'}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
            {fr
              ? `7 jours ou ${TRIAL_CREDITS} crédits gratuits sur la formule Growth. Annule avant : 0 €.`
              : `7 days or ${TRIAL_CREDITS} credits free on the Growth plan. Cancel before: €0.`}
          </p>
          <button
            type="button"
            onClick={() => startTrial('footer')}
            disabled={opening}
            className="mt-6 inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-60"
          >
            {opening ? (fr ? 'Ouverture…' : 'Opening…') : (fr ? 'Tester 7 jours gratuitement' : 'Start my 7-day free trial')}
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-neutral-500">
            <a href="/tarifs" className="text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-white">
              {fr ? 'Voir les tarifs' : 'See pricing'}
            </a>
            <a
              href={DEMO_URL}
              onClick={() => trackAmplitude('formats_page_demo_clicked')}
              className="text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-white"
            >
              {fr ? 'Visiter un compte déjà rempli' : 'Tour a filled-in account'}
            </a>
          </p>
        </section>
      </div>
    </main>
  )
}
