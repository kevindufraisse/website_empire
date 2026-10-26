'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { PLANS, PLAN_LABELS } from '@/lib/plans'
import { startFreeTrial, TRIAL_TERMS_FR, TRIAL_TERMS_EN } from '@/lib/startTrial'
import { trackAmplitude } from '@/lib/amplitude'

export default function HomeApplySection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  if (autopilot) return null
  return (
    <section id="rejoindre" className="bg-black py-20 md:py-28">
      <div className="container mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-empire">{fr ? 'Choisissez votre rythme' : 'Choose your pace'}</p>
          <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">{fr ? 'Une présence régulière. Une offre adaptée à votre activité.' : 'A consistent presence. A plan that fits your business.'}</h2>
          <p className="mt-4 text-neutral-400">{fr ? 'Idées, création de contenus et publication sur vos 7 réseaux. Commencez avec 7 jours gratuits et 500 crédits.' : 'Ideas, content creation and publishing across 7 networks. Start with 7 days free and 500 credits.'}</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PLANS.map(plan => (
            <article key={plan.id} className={`flex flex-col rounded-2xl border p-6 ${plan.highlighted ? 'border-empire/60 bg-empire/[0.07]' : 'border-white/15 bg-white/[0.02]'}`}>
              <p className="text-lg font-bold text-white">{PLAN_LABELS[plan.id][fr ? 'fr' : 'en']}</p>
              <p className="mt-2 text-sm text-neutral-400">{fr ? plan.rhythmFr : plan.rhythmEn}</p>
              <p className="mt-6 text-4xl font-extrabold text-white">{plan.price} €<span className="text-sm font-normal text-neutral-400">{fr ? ' / mois' : ' / month'}</span></p>
              <p className="mt-2 text-xs text-neutral-400">{fr ? 'Après l’essai · facturation mensuelle' : 'After your trial · billed monthly'}</p>
              <p className="mt-6 text-sm text-neutral-300">{plan.credits.toLocaleString(fr ? 'fr-FR' : 'en-US')} {fr ? 'crédits par mois après l’essai' : 'credits per month after your trial'}</p>
              <button type="button" onClick={() => { trackAmplitude('home_plan_trial_clicked', { plan: plan.id }); startFreeTrial(plan.id) }} className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-bold transition hover:brightness-110 ${plan.highlighted ? 'bg-empire text-black' : 'bg-white text-black'}`}>
                {fr ? 'Tester 7 jours gratuitement' : 'Start my 7-day free trial'}
              </button>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-relaxed text-neutral-400">{fr ? TRIAL_TERMS_FR : TRIAL_TERMS_EN} {fr ? 'Carte bancaire requise.' : 'Card required.'}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold text-white">
          <a href="/tarifs" className="underline underline-offset-4">{fr ? 'Comparer toutes les offres' : 'Compare all plans'}</a>
          <a href="/demo" className="underline underline-offset-4">{fr ? 'Demander une démo' : 'Request a demo'}</a>
        </div>
      </div>
    </section>
  )
}
