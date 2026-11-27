'use client'

import { Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { PlanId } from '@/lib/plans'
import glass from './pricing.module.css'
import { nbsp } from './typo'

/**
 * « Les 4 piliers d'Empire Club » : Onboarding 1-to-1 avec Kevin, coachings
 * live du lundi, groupe WhatsApp privé et Empire Academy. Empire Solo (199 €)
 * est 100 % autonome (vidéos courtes intégrées).
 */

const BONUSES: { titleFr: string; titleEn: string; lineFr: string; lineEn: string; plans: PlanId[] }[] = [
  {
    titleFr: 'Onboarding 1-to-1 (30 min avec Kevin)',
    titleEn: '1-to-1 Onboarding (30 min with Kevin)',
    lineFr: 'En tête-à-tête avec Kevin pour caler ton positionnement, ton offre et lancer tes premiers contenus.',
    lineEn: 'One-on-one with Kevin to lock in your positioning, your offer and launch your first content.',
    plans: ['growth', 'scale'],
  },
  {
    titleFr: 'Coachings live privés chaque lundi à 14 h',
    titleEn: 'Private live coaching every Monday at 2pm (Paris)',
    lineFr: '4 h par mois en direct avec Kevin pour corriger tes hooks, tes posts et ton tunnel.',
    lineEn: '4h a month live with Kevin to sharpen your hooks, your posts and your funnel.',
    plans: ['growth', 'scale'],
  },
  {
    titleFr: 'Le groupe WhatsApp privé Empire Club',
    titleEn: 'The private Empire Club WhatsApp group',
    lineFr: 'Le cercle des entrepreneurs actifs sur Empire + accès direct à Kevin au quotidien.',
    lineEn: 'The circle of active Empire founders + daily direct access to Kevin.',
    plans: ['growth', 'scale'],
  },
  {
    titleFr: 'Empire Academy intégrale (Bootcamp 21 jours + Replays)',
    titleEn: 'Full Empire Academy (21-day Bootcamp + Replays)',
    lineFr: 'Accès complet au bootcamp, aux formations et aux playbooks pour maîtriser la méthode.',
    lineEn: 'Full access to the bootcamp, trainings and playbooks to master the method.',
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
        return (
          <li key={b.titleFr} className={`p-5 sm:p-6 ${glass.panel}`}>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-empire">{`Pilier ${i + 1}`}</p>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${mine ? 'border-white/20 text-neutral-100' : 'border-white/10 text-neutral-500'}`}>
                {mine && <Check className="h-3 w-3 text-empire" strokeWidth={3} />}
                {'Empire Club'}
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
