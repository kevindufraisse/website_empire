'use client'

import { useState } from 'react'
import { ArrowRight, Play } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { PLANS, PLAN_DELIVERABLES, PLAN_LABELS } from '@/lib/plans'
import { startFreeTrial, TRIAL_TERMS_EN, TRIAL_TERMS_FR } from '@/lib/startTrial'
import { trackAmplitude } from '@/lib/amplitude'

/**
 * Les formules Empire sur l'accueil (ancre `#offres`). Le détail et le
 * comparatif vivent sur `/tarifs`. Le programme partenaire n'a qu'une ligne
 * discrète en bas : c'est une autre offre, elle ne se range pas à côté.
 */
export default function HomeOffersSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [opening, setOpening] = useState(false)

  if (autopilot) return null

  const onTrial = async () => {
    if (opening) return
    setOpening(true)
    trackAmplitude('home_offers_trial_clicked')
    await startFreeTrial()
  }

  return (
    <section id="offres" className="relative w-full scroll-mt-20 bg-black py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">{fr ? 'Tarifs' : 'Pricing'}</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
          {fr ? 'Choisis ton rythme de publication.' : 'Pick your publishing pace.'}
        </h2>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => {
            const d = PLAN_DELIVERABLES[plan.id]
            return (
              <div
                key={plan.id}
                className={`rounded-2xl border p-6 ${
                  plan.highlighted
                    ? 'border-white/25 bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset,0_30px_60px_-20px_rgba(0,0,0,0.9)]'
                    : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-white">{PLAN_LABELS[plan.id][fr ? 'fr' : 'en']}</p>
                  {plan.highlighted && (
                    <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-neutral-300">
                      {fr ? 'Recommandé' : 'Recommended'}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-neutral-500">{fr ? plan.rhythmFr : plan.rhythmEn}</p>
                <p className="mt-5 text-4xl font-bold tabular-nums tracking-tight text-white">
                  {plan.price} €<span className="ml-1 text-sm font-normal text-neutral-500">{fr ? '/mois' : '/mo'}</span>
                </p>
                <p className="mt-3 text-sm text-neutral-400">
                  {fr
                    ? `${d.reels} reels · ${d.posts} posts · ${d.newsletters} newsletters par mois`
                    : `${d.reels} reels · ${d.posts} posts · ${d.newsletters} newsletters a month`}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mx-auto mt-10 flex max-w-md flex-col items-center">
          <button
            type="button"
            onClick={onTrial}
            disabled={opening}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 text-base font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-60"
          >
            {opening ? (fr ? 'Ouverture…' : 'Opening…') : (fr ? 'Essayer 7 jours gratuits' : 'Try free for 7 days')}
            {!opening && <ArrowRight className="h-5 w-5" />}
          </button>
          <p className="mt-3 text-center text-xs leading-relaxed text-neutral-500">{fr ? TRIAL_TERMS_FR : TRIAL_TERMS_EN}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <a
              href="/tarifs"
              onClick={() => trackAmplitude('home_offers_compare_clicked')}
              className="inline-flex items-center gap-1 text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-white"
            >
              {fr ? 'Comparer les formules, ou payer à l’usage' : 'Compare plans, or pay as you go'}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="/vsl"
              onClick={() => trackAmplitude('home_offers_workshop_clicked')}
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white"
            >
              <Play className="h-3.5 w-3.5" />
              {fr ? 'Le workshop gratuit (1 h 26)' : 'The free workshop (1h26)'}
            </a>
          </div>
        </div>

        <p className="mt-16 text-center text-sm text-neutral-500">
          {fr ? 'Tu accompagnes des clients (freelance, consultant, agence) ? ' : 'You coach clients (freelancer, consultant, agency)? '}
          <a
            href="/academy"
            onClick={() => trackAmplitude('home_offers_partner_clicked')}
            className="text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-white"
          >
            {fr ? 'Le programme partenaire' : 'The partner program'}
          </a>
        </p>
      </div>
    </section>
  )
}
