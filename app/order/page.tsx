'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Crown, Zap, Shield, Users, ArrowRight, Lock, CreditCard, FileText, Mic, Bot } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { CostCalculator } from '@/components/ui/cost-calculator'

const pricingPlans = [
  {
    id: 'weekly',
    name: 'Weekly Plan',
    nameFr: 'Plan Hebdomadaire',
    price: PRICING.weekly,
    priceNormal: PRICING.weeklyNormal,
    period: 'week',
    periodFr: 'semaine',
    totalBilled: PRICING.weekly,
    billingCycle: 'Every week',
    billingCycleFr: 'Chaque semaine',
    recommended: false,
    popular: false,
    badge: null,
    savings: LAUNCH_OFFER_ACTIVE ? `Save €${PRICING.savingsWeekly}/week` : null,
    savingsFr: LAUNCH_OFFER_ACTIVE ? `Économisez €${PRICING.savingsWeekly}/semaine` : null,
    stripe_link: 'https://www.join.empire-internet.com/semaine-empire',
  },
  {
    id: 'monthly',
    name: 'Monthly Plan',
    nameFr: 'Plan Mensuel',
    price: PRICING.monthly,
    priceNormal: PRICING.monthlyNormal,
    period: 'month',
    periodFr: 'mois',
    totalBilled: PRICING.monthly,
    billingCycle: 'Every month',
    billingCycleFr: 'Chaque mois',
    recommended: false,
    popular: false,
    badge: null,
    savings: LAUNCH_OFFER_ACTIVE ? `Save €${PRICING.savingsMonthly}/month` : `Save €${(PRICING.weekly * 4) - PRICING.monthly}/month vs Weekly`,
    savingsFr: LAUNCH_OFFER_ACTIVE ? `Économisez €${PRICING.savingsMonthly}/mois` : `Économisez €${(PRICING.weekly * 4) - PRICING.monthly}/mois vs Hebdo`,
    stripe_link: 'https://www.join.empire-internet.com/mois-empire',
  },
  {
    id: 'quarterly',
    name: 'Quarterly Plan',
    nameFr: 'Plan Trimestriel',
    price: PRICING.quarterly,
    priceNormal: PRICING.quarterlyNormal,
    period: 'month',
    periodFr: 'mois',
    totalBilled: PRICING.quarterlyTotal,
    billingCycle: `Every 3 months (€${PRICING.quarterlyTotal})`,
    billingCycleFr: `Tous les 3 mois (€${PRICING.quarterlyTotal})`,
    recommended: true,
    popular: true,
    badge: '70% CHOOSE THIS',
    badgeFr: '70% CHOISISSENT',
    savings: `Save €${PRICING.savingsQuarterly}`,
    savingsFr: `Économisez €${PRICING.savingsQuarterly}`,
    stripe_link: 'https://www.join.empire-internet.com/trimestre-empire',
  },
  {
    id: 'yearly',
    name: 'Yearly Plan',
    nameFr: 'Plan Annuel',
    price: PRICING.yearly,
    priceNormal: PRICING.yearlyNormal,
    period: 'month',
    periodFr: 'mois',
    totalBilled: PRICING.yearlyTotal,
    billingCycle: `Every year (€${PRICING.yearlyTotal})`,
    billingCycleFr: `Chaque année (€${PRICING.yearlyTotal})`,
    recommended: false,
    popular: false,
    badge: 'BEST VALUE',
    badgeFr: 'MEILLEURE VALEUR',
    savings: `Save €${PRICING.savingsYearly}`,
    savingsFr: `Économisez €${PRICING.savingsYearly}`,
    stripe_link: 'https://www.join.empire-internet.com/an-empire',
  },
]

const deliverables = [
  { item: '30 newsletters', value: 3000 },
  { item: '30 reels/shorts', value: 3000 },
  { item: '30 Instagram posts', value: 900 },
  { item: '4 carousels', value: 900 },
  { item: '4 MP3 podcasts', value: 900 },
  { item: '4 long-form MP4 videos', value: 360 },
  { item: '30 LinkedIn posts', value: 4500 },
  { item: 'LinkedIn AI setup', value: 2000 },
]

const bonuses = [
  'Personal human assistant',
  'Link tracking',
  'Deep links',
  'Entrepreneurs\' community (€5K+)',
  'Scheduling from the platform',
  'Auto-comment LinkedIn (N8n framework)',
  'Empire API',
  'Creators\' community',
  'My current and future systems',
  'LinkedIn pod',
  'Personal AI Interview Agent',
  'Social media integrations',
]

export default function OrderPage() {
  const [selectedPlan, setSelectedPlan] = useState('quarterly')
  const { lang } = useLanguage()

  const selectedPlanData = pricingPlans.find(p => p.id === selectedPlan)

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black via-[#0f0f0f] to-black pt-8 pb-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(218,252,104,0.1),transparent)] -z-10" />
      
      <div className="container py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-4 animate-pulse">
              <Users className="text-red-400" size={16} />
              <span className="text-sm font-bold text-red-400">
                {lang === 'fr' ? '83/100 Places Restantes' : '83/100 Spots Left'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {lang === 'fr' ? 'Rejoignez Empire Internet' : 'Join Empire Internet'}
            </h1>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              {lang === 'fr' 
                ? 'Choisissez votre plan et commencez dans les 30 prochaines minutes'
                : 'Choose your plan and start within the next 30 minutes'
              }
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  plan.recommended
                    ? 'bg-gradient-to-br from-empire/20 to-empire/5 border-empire shadow-[0_0_30px_rgba(218,252,104,0.3)] scale-105'
                    : selectedPlan === plan.id
                    ? 'bg-white/5 border-empire/50'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-empire text-black text-xs font-bold whitespace-nowrap">
                    {lang === 'fr' ? plan.badgeFr : plan.badge}
                  </div>
                )}

                {/* Recommended Crown */}
                {plan.recommended && (
                  <Crown className="absolute top-3 right-3 text-empire" size={24} />
                )}

                {/* Plan Name */}
                <h3 className="text-lg font-bold text-white mb-2">
                  {lang === 'fr' ? plan.nameFr : plan.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  {LAUNCH_OFFER_ACTIVE ? (
                    <div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xl font-bold text-neutral-500 line-through">€{plan.priceNormal}</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl md:text-4xl font-bold text-empire">€{plan.price}</span>
                          <span className="text-neutral-400">/{lang === 'fr' ? plan.periodFr : plan.period}</span>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        {lang === 'fr' ? plan.billingCycleFr : plan.billingCycle}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-empire">€{plan.price}</span>
                        <span className="text-neutral-400">/{lang === 'fr' ? plan.periodFr : plan.period}</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        {lang === 'fr' ? plan.billingCycleFr : plan.billingCycle}
                      </p>
                    </div>
                  )}
                </div>

                {/* Savings */}
                {plan.savings && (
                  <div className="mb-4 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
                    <p className="text-sm font-semibold text-green-400">
                      {lang === 'fr' ? plan.savingsFr : plan.savings}
                    </p>
                  </div>
                )}

                {/* CTA Button */}
                <a
                  href={plan.stripe_link}
                  className={`block w-full text-center px-4 py-3 rounded-lg font-bold transition-all ${
                    plan.recommended
                      ? 'bg-empire text-black hover:scale-105 shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {lang === 'fr' ? 'Choisir ce Plan' : 'Choose Plan'} →
                </a>

                {/* Selected Indicator */}
                {selectedPlan === plan.id && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 rounded-full bg-empire flex items-center justify-center">
                      <Check className="text-black" size={16} />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mb-12 p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <Lock className="text-green-400" size={20} />
                <span className="text-sm text-neutral-300">
                  {lang === 'fr' ? 'Paiement sécurisé SSL' : 'Secure SSL Payment'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="text-blue-400" size={20} />
                <span className="text-sm text-neutral-300">
                  {lang === 'fr' ? 'Annulation possible' : 'Cancel anytime'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="text-purple-400" size={20} />
                <span className="text-sm text-neutral-300">Stripe · PayPal · CB</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="text-empire" size={20} />
                <span className="text-sm text-neutral-300">
                  {lang === 'fr' ? 'Accès immédiat' : 'Instant access'}
                </span>
              </div>
            </div>
          </div>

          {/* What Happens Next - CRITICAL! */}
          <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-empire/10 to-transparent border-2 border-empire/30">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
              🚀 {lang === 'fr' ? 'Ce qui se passe après votre paiement' : 'What happens after your payment'}
            </h3>
            <p className="text-center text-empire font-semibold mb-8">
              {lang === 'fr' 
                ? '⚡ Démarrez dans les 30 prochaines minutes' 
                : '⚡ Start within the next 30 minutes'
              }
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-black/40 border border-white/10">
                <div className="w-16 h-16 rounded-full bg-empire/20 border-2 border-empire flex items-center justify-center mx-auto mb-3">
                  <FileText className="text-empire" size={28} />
                </div>
                <div className="text-2xl font-bold text-empire mb-2">1</div>
                <h4 className="font-bold text-white mb-2">
                  {lang === 'fr' ? 'Accès Immédiat' : 'Instant Access'}
                </h4>
                <p className="text-sm text-neutral-400">
                  {lang === 'fr' 
                    ? 'Email instantané avec votre document d\'onboarding complet'
                    : 'Instant email with your complete onboarding document'
                  }
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-black/40 border border-white/10">
                <div className="w-16 h-16 rounded-full bg-empire/20 border-2 border-empire flex items-center justify-center mx-auto mb-3">
                  <Mic className="text-empire" size={28} />
                </div>
                <div className="text-2xl font-bold text-empire mb-2">2</div>
                <h4 className="font-bold text-white mb-2">
                  {lang === 'fr' ? 'Première Interview (15 min)' : 'First Interview (15 min)'}
                </h4>
                <p className="text-sm text-neutral-400">
                  {lang === 'fr'
                    ? 'Cliquez et enregistrez votre première interview dans les 30 prochaines minutes'
                    : 'Click and record your first interview within the next 30 minutes'
                  }
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-black/40 border border-white/10">
                <div className="w-16 h-16 rounded-full bg-empire/20 border-2 border-empire flex items-center justify-center mx-auto mb-3">
                  <Bot className="text-empire" size={28} />
                </div>
                <div className="text-2xl font-bold text-empire mb-2">3</div>
                <h4 className="font-bold text-white mb-2">
                  {lang === 'fr' ? 'Bot LinkedIn Activé' : 'LinkedIn Bot Activated'}
                </h4>
                <p className="text-sm text-neutral-400">
                  {lang === 'fr'
                    ? 'Lancez votre bot IA LinkedIn dès la fin de l\'interview'
                    : 'Launch your AI LinkedIn bot right after the interview'
                  }
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-lg bg-empire/10 border border-empire/30 text-center">
              <p className="text-sm text-empire font-semibold">
                {lang === 'fr'
                  ? 'Premier contenu prêt 24h après votre interview · Bot actif en 30 minutes'
                  : 'First content ready 24h after your interview · Bot active in 30 minutes'
                }
              </p>
            </div>
          </div>

          {/* What You Get - 2 Columns */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Deliverables */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">
                {lang === 'fr' ? 'Ce que vous recevez chaque mois' : 'What you get every month'}
              </h3>
              <div className="space-y-3">
                {deliverables.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="text-empire flex-shrink-0" size={16} />
                      <span className="text-sm text-neutral-300">{item.item}</span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      (€{item.value.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')})
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm font-semibold text-neutral-400">
                  {lang === 'fr' ? 'Valeur totale contenu :' : 'Total content value:'}{' '}
                  <span className="text-empire text-lg">€21,560/{lang === 'fr' ? 'mois' : 'month'}</span>
                </p>
              </div>
            </div>

            {/* Bonuses */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30">
              <h3 className="text-xl font-bold text-white mb-4">
                {lang === 'fr' ? 'Bonus Inclus' : 'Bonuses Included'}
              </h3>
              <div className="space-y-2">
                {bonuses.map((bonus, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="text-empire flex-shrink-0" size={16} />
                    <span className="text-sm text-neutral-300">{bonus}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-empire/30">
                <p className="text-sm font-semibold text-neutral-400">
                  {lang === 'fr' ? 'Valeur bonus :' : 'Bonus value:'}{' '}
                  <span className="text-empire text-lg">€233,560/{lang === 'fr' ? 'an' : 'year'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Guarantees */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {lang === 'fr' ? 'Vos Garanties' : 'Your Guarantees'}
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-6 rounded-lg bg-white/5 border border-white/10 text-center">
                <Shield className="text-green-400 mx-auto mb-3" size={32} />
                <p className="text-sm font-semibold text-white mb-1">
                  {lang === 'fr' ? 'Annulation Possible' : 'Cancel Anytime'}
                </p>
                <p className="text-xs text-neutral-400">
                  {lang === 'fr' ? 'Préavis de 30 jours' : '30 days notice'}
                </p>
              </div>
              <div className="p-6 rounded-lg bg-white/5 border border-white/10 text-center">
                <Zap className="text-empire mx-auto mb-3" size={32} />
                <p className="text-sm font-semibold text-white mb-1">
                  {lang === 'fr' ? 'Démarrage Immédiat' : 'Instant Start'}
                </p>
                <p className="text-xs text-neutral-400">
                  {lang === 'fr' ? 'Contenu prêt en 24h' : 'Content ready in 24h'}
                </p>
              </div>
              <div className="p-6 rounded-lg bg-white/5 border border-white/10 text-center">
                <Users className="text-blue-400 mx-auto mb-3" size={32} />
                <p className="text-sm font-semibold text-white mb-1">
                  {lang === 'fr' ? 'Places Limitées' : 'Limited Spots'}
                </p>
                <p className="text-xs text-neutral-400">83/100 {lang === 'fr' ? 'disponibles' : 'available'}</p>
              </div>
            </div>
          </div>

          {/* FAQ Payment */}
          <div className="mb-12 p-8 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {lang === 'fr' ? 'Questions sur le paiement' : 'Payment Questions'}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-white mb-2">
                  {lang === 'fr' ? 'Quand serai-je facturé ?' : 'When will I be charged?'}
                </p>
                <p className="text-sm text-neutral-400">
                  {lang === 'fr'
                    ? 'Immédiatement, puis automatiquement à chaque cycle (semaine/mois/trimestre/an).'
                    : 'Immediately, then automatically at each cycle (week/month/quarter/year).'
                  }
                </p>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">
                  {lang === 'fr' ? 'Puis-je changer de plan ?' : 'Can I change my plan?'}
                </p>
                <p className="text-sm text-neutral-400">
                  {lang === 'fr'
                    ? 'Oui, à tout moment. Contactez-nous et on ajuste immédiatement.'
                    : 'Yes, anytime. Contact us and we\'ll adjust immediately.'
                  }
                </p>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">
                  {lang === 'fr' ? 'Modes de paiement acceptés ?' : 'Payment methods accepted?'}
                </p>
                <p className="text-sm text-neutral-400">
                  {lang === 'fr'
                    ? 'Carte bancaire (Stripe), PayPal, virement (plans annuels sur demande).'
                    : 'Credit card (Stripe), PayPal, wire transfer (annual plans on request).'
                  }
                </p>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">
                  {lang === 'fr' ? 'Comment annuler ?' : 'How to cancel?'}
                </p>
                <p className="text-sm text-neutral-400">
                  {lang === 'fr'
                    ? 'Email à contact@empire-internet.com avec préavis 30 jours.'
                    : 'Email contact@empire-internet.com with 30 days notice.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Urgency Section */}
          <div className="mb-12 p-6 rounded-xl bg-gradient-to-r from-empire/10 to-empire/5 border-2 border-empire">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              {lang === 'fr' ? 'Pourquoi rejoindre maintenant ?' : 'Why join now?'}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {LAUNCH_OFFER_ACTIVE && (
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-empire/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="text-empire" size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {lang === 'fr' ? '🔥 Prix de lancement' : '🔥 Launch pricing'}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {lang === 'fr' ? `${PRICING.monthly}€/mois au lieu de ${PRICING.monthlyNormal}€` : `€${PRICING.monthly}/mo instead of €${PRICING.monthlyNormal}`}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-empire/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="text-empire" size={14} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {lang === 'fr' ? 'Seulement 83 places disponibles' : 'Only 83 spots available'}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {lang === 'fr' ? 'Limité à 100 clients max' : 'Limited to 100 clients max'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="text-red-400" size={14} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {lang === 'fr' ? 'Bonus Early Bird (€1,500)' : 'Early Bird Bonus (€1,500)'}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {lang === 'fr' ? 'Expire dans 48h' : 'Expires in 48h'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="text-red-400" size={14} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {lang === 'fr' ? 'Prochaine cohorte dans 7 jours' : 'Next cohort in 7 days'}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {lang === 'fr' ? 'Démarrez maintenant' : 'Start now'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {lang === 'fr' ? 'Ce que disent nos clients' : 'What our clients say'}
            </h3>
            <p className="text-center text-neutral-300 mb-8">
              {lang === 'fr' ? 'Résultats réels de créateurs qui ont rejoint Empire' : 'Real results from creators who joined Empire'}
            </p>
            <div 
              className="senja-embed" 
              data-id="a7bf7e4a-0f3b-4751-8190-849f83d16306" 
              data-mode="shadow" 
              data-lazyload="false"
              style={{ display: 'block', width: '100%' }}
            />
          </div>

          {/* Cost Calculator - At the end before CTA */}
          <div className="mb-16">
            <CostCalculator />
          </div>

        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-black/95 backdrop-blur-md border-t-2 border-empire z-[100]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-xs text-neutral-400">
              {lang === 'fr' ? 'Plan sélectionné :' : 'Selected plan:'}
            </p>
            <p className="text-lg md:text-xl font-bold text-white">
              {lang === 'fr' ? selectedPlanData?.nameFr : selectedPlanData?.name} - 
              <span className="text-empire"> €{selectedPlanData?.price}/{lang === 'fr' ? selectedPlanData?.periodFr : selectedPlanData?.period}</span>
            </p>
          </div>
          <a
            href={selectedPlanData?.stripe_link}
            className="px-8 py-4 bg-empire text-black font-bold rounded-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(218,252,104,0.4)] flex items-center gap-2 whitespace-nowrap"
          >
            {lang === 'fr' ? 'Valider & Payer' : 'Proceed to Payment'} <ArrowRight size={20} />
          </a>
        </div>
      </div>

      {/* Spacer for sticky CTA */}
      <div className="h-24"></div>
    </main>
  )
}

