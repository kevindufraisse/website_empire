'use client'

import { Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { PLANS, type PlanId } from '@/lib/plans'
import glass from './pricing.module.css'
import { nbsp } from './typo'

/**
 * « Tes bonus » : quatre cartes nommées, sans valeur en euros (ils n'ont pas
 * de prix de marché). Même matrice qu'avant : l'onboarding dans toutes les
 * formules, comme le live du lundi (il est public) ; le Slack et la masterclass à partir de Growth.
 */

const BONUSES: { titleFr: string; titleEn: string; lineFr: string; lineEn: string; plans: PlanId[] }[] = [
  {
    titleFr: 'Ton onboarding 1-1 de démarrage',
    titleEn: 'Your 1-1 kickoff onboarding',
    lineFr: '30 min avec Kevin ou l’équipe, pour lancer tes premiers contenus.',
    lineEn: '30 min with Kevin or the team, to launch your first pieces of content.',
    plans: ['starter', 'growth', 'scale'],
  },
  {
    titleFr: 'Le live de Kevin, chaque lundi à 14 h',
    titleEn: 'Kevin’s live, every Monday at 2 pm (Paris)',
    lineFr: 'Pour savoir quoi filmer cette semaine.',
    lineEn: 'To know what to film this week.',
    plans: ['starter', 'growth', 'scale'],
  },
  {
    titleFr: 'La communauté privée sur Slack',
    titleEn: 'The private Slack community',
    lineFr: 'Pour ne jamais rester bloqué.',
    lineEn: 'So you never stay stuck.',
    plans: ['growth', 'scale'],
  },
  {
    titleFr: 'La masterclass Empire en replay',
    titleEn: 'The Empire masterclass replays',
    lineFr: 'Pour comprendre la méthode, à ton rythme.',
    lineEn: 'To learn the method, at your own pace.',
    plans: ['growth', 'scale'],
  },
]

export default function OfferBonuses({ plan }: { plan: PlanId }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  return (
    <ul className="mx-auto grid max-w-5xl gap-3 md:grid-cols-2 md:gap-4">
      {BONUSES.map((b, i) => {
        const mine = b.plans.includes(plan)
        const all = b.plans.length === PLANS.length
        return (
          <li key={b.titleFr} className={`p-5 sm:p-6 ${glass.panel}`}>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-empire">{`Bonus ${i + 1}`}</p>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${mine ? 'border-white/20 text-neutral-100' : 'border-white/10 text-neutral-500'}`}>
                {mine && <Check className="h-3 w-3 text-empire" strokeWidth={3} />}
                {all ? (fr ? 'Toutes les formules' : 'Every plan') : (fr ? 'Growth et Scale' : 'Growth and Scale')}
              </span>
            </div>
            <p className="mt-2.5 text-[17px] font-semibold leading-snug text-white">{fr ? nbsp(b.titleFr) : b.titleEn}</p>
            <p className="mt-1 text-[14.5px] leading-relaxed text-neutral-300">{fr ? nbsp(b.lineFr) : b.lineEn}</p>
          </li>
        )
      })}
    </ul>
  )
}
