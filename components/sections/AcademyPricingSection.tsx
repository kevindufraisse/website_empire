'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Shield } from 'lucide-react'
import BorderBeam from '@/components/magicui/border-beam'
import AcademyWaitlistCta from '@/components/AcademyWaitlistCta'
import { ACADEMY_ENTRY_PRICE, ACADEMY_NEXT_PRICE_EN, ACADEMY_NEXT_PRICE_FR } from '@/lib/cohort-config'
import { useLanguage } from '@/contexts/LanguageContext'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function AcademyPricingSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const features = fr
    ? [
        '21 défis quotidiens - un par jour, vous postez, vous voyez ce qui marche',
        '6 masterclass lives - psychologie virale, LinkedIn, Instagram, YouTube, IA & automatisation funnel, monétisation 3K€/mois',
        'Pod LinkedIn - le groupe engage sur vos posts, vos stats décollent',
        'Certification officielle - Bronze, Argent ou Or selon vos résultats, ajoutable sur LinkedIn',
        'Accès à Empire Alpha - l\'outil où vous produisez vos posts et vos Shorts en parlant 15 min',
        'Replays, défis et groupe alumni à vie',
        'Premier client garanti après 3 mois*',
      ]
    : [
        '21 daily challenges - one per day, you post, you see what works',
        '6 live masterclasses - viral psychology, LinkedIn, Instagram, YouTube, AI & funnel automation, 3K€/month monetization',
        'LinkedIn Pod - the group engages on your posts, your stats take off',
        'Official certification - Bronze, Silver or Gold based on your results, addable to LinkedIn',
        'Access to Empire Alpha - the tool where you produce your posts and Shorts by talking for 15 min',
        'Replays, challenges and alumni group for life',
        'First client guaranteed after 3 months*',
      ]

  const comparison: {
    label: string
    sub: string
    price: string
    detail: string
    dim: boolean
    strike?: string
  }[] = [
    {
      label: fr ? 'Se former seul' : 'Learning alone',
      sub: fr ? 'Des mois à tester hooks, formats et algos' : 'Months testing hooks, formats and algos',
      price: fr ? 'Temps perdu' : 'Wasted time',
      detail: fr ? 'Sans savoir ce qui marche' : 'Without knowing what works',
      dim: true,
    },
    {
      label: fr ? 'Recruter une agence' : 'Hire an agency',
      sub: fr ? 'On produit pour vous' : 'They produce for you',
      price: '2-5K€/mois',
      detail: fr ? 'Sans forcément comprendre le système' : 'Without necessarily learning the system',
      dim: true,
    },
    {
      label: 'Empire Academy',
      sub: fr ? 'Méthode + acomp. + certification + réseau' : 'Method + coaching + cert + network',
      price: `${ACADEMY_ENTRY_PRICE}€`,
      detail: fr ? 'Paiement unique ou 3x 165€' : 'One-time payment or 3x €165',
      dim: false,
      strike: fr ? `${ACADEMY_NEXT_PRICE_FR}€` : `€${ACADEMY_NEXT_PRICE_EN}`,
    },
  ]

  return (
    <section id="pricing" className="relative w-full py-20 md:py-28 bg-gradient-to-b from-[#0f0f0f] via-black to-[#0f0f0f] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(252,165,165,0.08),transparent)]" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">

          <FadeInBlock>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                {fr ? 'Le vrai coût, c\'est d\'apprendre seul.' : 'The real cost is learning alone.'}
              </h2>
              <p className="text-neutral-400 max-w-xl mx-auto">
                {fr
                  ? `21 jours pour apprendre la méthode, obtenir votre certification et accéder au réseau Empire. ${ACADEMY_ENTRY_PRICE}\u202F€ pour cette promotion.`
                  : `21 days to learn the method, get certified and join the Empire network. €${ACADEMY_ENTRY_PRICE} for this cohort.`}
              </p>
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.1}>
            <div className="relative rounded-3xl border border-academy/40 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 md:p-12 overflow-hidden shadow-[0_0_80px_-20px_rgba(252,165,165,0.2)]">
              <BorderBeam size={400} duration={10} />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-academy to-transparent" />

              <div className="grid md:grid-cols-2 gap-10 md:gap-14">

                {/* Left - features */}
                <div>
                  <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase mb-5">{fr ? 'Ce que vous obtenez' : 'What you get'}</p>
                  <div className="space-y-3.5">
                    {features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-5 h-5 rounded-full bg-academy/15 border border-academy/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-academy" />
                        </div>
                        <p className="text-sm text-neutral-200 leading-relaxed">{feature}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right - pricing */}
                <div className="flex flex-col">
                  <div className="flex-1">
                    {/* Comparison block */}
                    <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase mb-3">{fr ? 'Comparer les chemins' : 'Compare the paths'}</p>
                    <div className="space-y-2 mb-6">
                      {comparison.map((item, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-3 rounded-xl border ${
                            item.dim
                              ? 'bg-white/[0.02] border-white/5'
                              : 'bg-academy/10 border-academy/40'
                          }`}
                        >
                          <div>
                            <p className={`text-sm font-bold ${item.dim ? 'text-neutral-400' : 'text-white'}`}>{item.label}</p>
                            <p className="text-[11px] text-neutral-500 leading-tight">{item.sub}</p>
                          </div>
                          <div className="text-right">
                            <p className={`flex items-baseline justify-end gap-1.5 text-base font-black ${item.dim ? 'text-neutral-500' : 'text-academy'}`}>
                              {item.strike && (
                                <span className="text-xs font-semibold text-neutral-600 line-through">{item.strike}</span>
                              )}
                              {item.price}
                            </p>
                            <p className="text-[10px] text-neutral-500">{item.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ancre de prix : le tarif actuel est celui des premières sessions */}
                  <div className="mb-4 rounded-xl border border-academy/30 bg-academy/[0.07] p-3">
                    <p className="text-[11px] leading-relaxed text-neutral-300">
                      <span className="font-bold text-academy">
                        {fr
                          ? `Le prix passe à ${ACADEMY_NEXT_PRICE_FR}\u202F€`
                          : `The price goes to €${ACADEMY_NEXT_PRICE_EN}`}
                      </span>
                      {fr
                        ? ` aux prochaines sessions. ${ACADEMY_ENTRY_PRICE}\u202F€ est le tarif des premières promos, le temps que la certification s'installe.`
                        : ` for the next cohorts. €${ACADEMY_ENTRY_PRICE} is the price for the first groups, while the certification builds up.`}
                    </p>
                  </div>

                  {/* CTA */}
                  <AcademyWaitlistCta
                    source="pricing"
                    className="block w-full text-center px-8 py-4 bg-academy text-black font-bold text-lg rounded-xl hover:scale-[1.02] transition-all shadow-[0_0_40px_rgba(252,165,165,0.35)] hover:shadow-[0_0_60px_rgba(252,165,165,0.5)]"
                  >
                    {fr ? 'Candidater à la prochaine promotion' : 'Apply to the next cohort'}
                  </AcademyWaitlistCta>

                  {/* Trust badges */}
                  <div className="mt-4 flex items-center justify-center gap-3 text-xs text-neutral-500">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      <span>{fr ? 'Sans engagement' : 'No commitment'}</span>
                    </div>
                    <span>·</span>
                    <span>{fr ? 'Certification ajoutable sur LinkedIn' : 'Certification you can add to LinkedIn'}</span>
                  </div>
                  <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      <span className="font-semibold text-neutral-200">{fr ? 'En option :' : 'Optional:'}</span>{' '}
                      {fr
                        ? "faire produire vos contenus par notre équipe, via un abonnement Empire. Le bootcamp vous apprend à les créer vous-même - sur la voie partenaire, la production des missions clients est prise en charge."
                        : "have our team produce your content, through an Empire subscription. The bootcamp teaches you to create it yourself - on the partner path, production for client missions is covered."}
                    </p>
                  </div>
                  <p className="mt-3 text-[10px] text-neutral-600 text-center leading-relaxed">
                    {fr
                      ? "*Premier client garanti : réservé au chemin Empire (option 2). Si vous suivez la méthode et que vous n'avez pas de client après 3 mois, on continue avec vous gratuitement jusqu'à ce que ça arrive."
                      : "*First client guaranteed: reserved for the Empire path (option 2). If you follow the method and don't have a client after 3 months, we continue with you for free until it happens."}
                  </p>
                </div>

              </div>
            </div>
          </FadeInBlock>

        </div>
      </div>
    </section>
  )
}
