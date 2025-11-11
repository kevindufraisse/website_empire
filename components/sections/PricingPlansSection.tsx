'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Crown, Check } from 'lucide-react'
import BorderBeam from '@/components/magicui/border-beam'
import { PRICING, LAUNCH_OFFER_ACTIVE } from '@/lib/pricing-config'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

const pricingPlans = [
  {
    id: 'weekly',
    name: 'Weekly',
    nameFr: 'Hebdomadaire',
    price: PRICING.weekly,
    priceNormal: PRICING.weeklyNormal,
    period: 'week',
    periodFr: 'semaine',
    billingCycle: 'Billed weekly',
    billingCycleFr: 'Facturé chaque semaine',
    badge: null,
    savings: LAUNCH_OFFER_ACTIVE ? `Save €${PRICING.savingsWeekly} (launch)` : null,
    savingsFr: LAUNCH_OFFER_ACTIVE ? `Économisez €${PRICING.savingsWeekly} (lancement)` : null,
    link: 'https://www.join.empire-internet.com/semaine-empire',
  },
  {
    id: 'monthly',
    name: 'Monthly',
    nameFr: 'Mensuel',
    price: PRICING.monthly,
    priceNormal: PRICING.monthlyNormal,
    period: 'month',
    periodFr: 'mois',
    billingCycle: 'Billed monthly',
    billingCycleFr: 'Facturé chaque mois',
    badge: null,
    savings: LAUNCH_OFFER_ACTIVE ? `Save €${PRICING.savingsMonthly} (launch)` : null,
    savingsFr: LAUNCH_OFFER_ACTIVE ? `Économisez €${PRICING.savingsMonthly} (lancement)` : null,
    link: 'https://www.join.empire-internet.com/mois-empire',
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    nameFr: 'Trimestriel',
    price: PRICING.quarterly,
    priceNormal: PRICING.quarterlyNormal,
    period: 'month',
    periodFr: 'mois',
    totalBilled: PRICING.quarterlyTotal,
    billingCycle: 'Billed every 3 months',
    billingCycleFr: 'Facturé tous les 3 mois',
    badge: '70% CHOOSE THIS',
    badgeFr: '70% CHOISISSENT',
    savings: `Save €${PRICING.savingsQuarterly} (launch)`,
    savingsFr: `Économisez €${PRICING.savingsQuarterly} (lancement)`,
    popular: true,
    link: 'https://www.join.empire-internet.com/trimestre-empire',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    nameFr: 'Annuel',
    price: PRICING.yearly,
    priceNormal: PRICING.yearlyNormal,
    period: 'month',
    periodFr: 'mois',
    totalBilled: PRICING.yearlyTotal,
    billingCycle: 'Billed yearly',
    billingCycleFr: 'Facturé chaque année',
    badge: 'BEST VALUE',
    badgeFr: 'MEILLEURE VALEUR',
    savings: `Save €${PRICING.savingsYearly} (launch)`,
    savingsFr: `Économisez €${PRICING.savingsYearly} (lancement)`,
    link: 'https://www.join.empire-internet.com/an-empire',
  },
]

export default function PricingPlansSection() {
  const { lang } = useLanguage()

  return (
    <section id="pricing-plans" className="container py-20 md:py-32">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <FadeInBlock>
          <div className="text-center mb-16">
            {LAUNCH_OFFER_ACTIVE && (
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-empire/10 border border-empire/30">
                <p className="text-sm font-bold text-empire">
                  🔥 {lang === 'fr' ? `Prix de lancement : -${PRICING.monthlyNormal - PRICING.monthly}€/mois` : `Launch Pricing: Save €${PRICING.monthlyNormal - PRICING.monthly}/month`}
                </p>
              </div>
            )}
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {lang === 'fr' ? 'Choisissez Votre Plan' : 'Choose Your Plan'}
            </h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              {lang === 'fr' 
                ? 'Payez à la semaine, au mois, au trimestre ou à l\'année. Annulez quand vous voulez.'
                : 'Pay weekly, monthly, quarterly, or yearly. Cancel anytime.'}
            </p>
          </div>
        </FadeInBlock>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan, i) => (
            <FadeInBlock key={plan.id} delay={0.1 * i}>
              <div className={`relative h-full p-6 rounded-2xl border transition-all hover:scale-105 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-empire/20 to-empire/5 border-empire shadow-[0_0_30px_rgba(218,252,104,0.3)]' 
                  : 'bg-gradient-to-br from-white/10 to-white/[0.02] border-white/10 hover:border-empire/30'
              }`}>
                {plan.popular && <BorderBeam size={250} duration={12} delay={0} />}
                
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-empire text-black text-xs font-bold rounded-full whitespace-nowrap">
                    {lang === 'fr' ? plan.badgeFr : plan.badge}
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {lang === 'fr' ? plan.nameFr : plan.name}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {lang === 'fr' ? plan.billingCycleFr : plan.billingCycle}
                    </p>
                  </div>

                  <div className="mb-4">
                    {LAUNCH_OFFER_ACTIVE ? (
                      // Mode lancement : prix barré + nouveau prix
                      <div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xl font-bold text-neutral-500 line-through">€{plan.priceNormal}</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl md:text-4xl font-bold text-empire">€{plan.price}</span>
                            <span className="text-neutral-400">/{lang === 'fr' ? plan.periodFr : plan.period}</span>
                          </div>
                        </div>
                        {plan.totalBilled && (
                          <p className="text-sm text-neutral-400 mt-2">
                            €{plan.totalBilled} {lang === 'fr' ? 'facturé' : 'billed'}
                          </p>
                        )}
                      </div>
                    ) : (
                      // Mode normal : prix simple
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl md:text-4xl font-bold text-white">€{plan.price}</span>
                          <span className="text-neutral-400">/{lang === 'fr' ? plan.periodFr : plan.period}</span>
                        </div>
                        {plan.totalBilled && (
                          <p className="text-sm text-neutral-400 mt-2">
                            €{plan.totalBilled} {lang === 'fr' ? 'facturé' : 'billed'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {plan.savings && (
                    <div className="mb-4">
                      <div className="inline-block px-2 py-1 rounded bg-empire/20 border border-empire/30">
                        <p className="text-xs font-bold text-empire">
                          {lang === 'fr' ? plan.savingsFr : plan.savings}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex-1 mb-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="text-empire flex-shrink-0" size={16} />
                        <span className="text-neutral-300">30+ {lang === 'fr' ? 'contenus/mois' : 'content pieces/mo'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="text-empire flex-shrink-0" size={16} />
                        <span className="text-neutral-300">{lang === 'fr' ? 'Assistant humain QA' : 'Human QA assistant'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="text-empire flex-shrink-0" size={16} />
                        <span className="text-neutral-300">{lang === 'fr' ? 'LinkedIn AI Setter' : 'LinkedIn AI Setter'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="text-empire flex-shrink-0" size={16} />
                        <span className="text-neutral-300">{lang === 'fr' ? 'Accès API' : 'API access'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="text-empire flex-shrink-0" size={16} />
                        <span className="text-neutral-300">{lang === 'fr' ? 'Coaching personal branding' : 'Personal branding coaching'} <span className="text-neutral-500 text-xs">({lang === 'fr' ? 'optionnel' : 'optional'})</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="text-empire flex-shrink-0" size={16} />
                        <span className="text-neutral-300">{lang === 'fr' ? 'Annulation flexible' : 'Cancel anytime'}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={plan.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-center px-6 py-3 rounded-xl font-bold transition-all ${
                      plan.popular
                        ? 'bg-empire text-black hover:scale-105 shadow-[0_0_20px_rgba(218,252,104,0.3)]'
                        : 'bg-white/10 text-white hover:bg-empire hover:text-black'
                    }`}
                  >
                    {lang === 'fr' ? 'Commencer' : 'Get Started'}
                  </a>
                </div>
              </div>
            </FadeInBlock>
          ))}
        </div>

        {/* Bottom Note */}
        <FadeInBlock delay={0.5}>
          <div className="mt-12 text-center">
            <p className="text-sm text-neutral-400">
              {lang === 'fr' 
                ? '✓ Premier contenu en 24-48h · ✓ 15 min/semaine de votre temps · ✓ Aucun contrat long terme'
                : '✓ First content in 24-48h · ✓ 15 min/week of your time · ✓ No long-term contract'}
            </p>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

