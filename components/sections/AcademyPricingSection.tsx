'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Shield } from 'lucide-react'
import BorderBeam from '@/components/magicui/border-beam'
import { useAcademyPricing } from '@/hooks/useAcademyPricing'
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
  const pricing = useAcademyPricing()

  const features = fr
    ? [
        'Accès à Empire Alpha - tes posts LinkedIn + Shorts générés. Rien à rédiger, rien à monter.',
        '21 défis quotidiens - un par jour, tu postes, tu vois ce qui marche',
        '6 masterclass lives - psychologie virale, LinkedIn, Instagram, YouTube, IA & automatisation funnel, monétisation 3K€/mois',
        'Pod LinkedIn - le groupe engage sur tes posts, tes stats décollent',
        'Certification officielle - Bronze, Argent ou Or selon tes résultats, ajoutable sur LinkedIn',
        'Premier client garanti après 3 mois*',
      ]
    : [
        'Access to Empire Alpha - your LinkedIn posts + Shorts generated. Nothing to write, nothing to edit.',
        '21 daily challenges - one per day, you post, you see what works',
        '6 live masterclasses - viral psychology, LinkedIn, Instagram, YouTube, AI & funnel automation, 3K€/month monetization',
        'LinkedIn Pod - the group engages on your posts, your stats take off',
        'Official certification - Bronze, Silver or Gold based on your results, addable to LinkedIn',
        'First client guaranteed after 3 months*',
      ]

  const comparison = [
    {
      label: fr ? 'Tout seul' : 'On your own',
      sub: fr ? '21 posts + 21 Shorts par un freelance' : '21 posts + 21 Shorts from a freelancer',
      price: '3 360€',
      detail: fr ? '160€/jour pendant 21 jours' : '160€/day for 21 days',
      dim: true,
    },
    {
      label: fr ? 'En agence' : 'With an agency',
      sub: fr ? 'Community manager junior' : 'Junior community manager',
      price: '2-5K€/mois',
      detail: fr ? 'Sans stratégie, sans contrôle' : 'No strategy, no control',
      dim: true,
    },
    {
      label: 'Empire Academy',
      sub: fr ? 'Tout inclus + accompagnement' : 'All-inclusive + expert guidance',
      price: '497€',
      detail: fr ? 'Paiement unique ou 3x 165€' : 'One-time payment or 3x 165€',
      dim: false,
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
                {fr ? 'Tout ce qui est inclus.' : 'Everything included.'}{' '}
                <span className="text-academy">{fr ? 'Un seul prix.' : 'One price.'}</span>
              </h2>
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.1}>
            <div className="relative rounded-3xl border border-academy/40 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 md:p-12 overflow-hidden shadow-[0_0_80px_-20px_rgba(252,165,165,0.2)]">
              <BorderBeam size={400} duration={10} />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-academy to-transparent" />

              <div className="grid md:grid-cols-2 gap-10 md:gap-14">

                {/* Left - features */}
                <div>
                  <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase mb-5">{fr ? 'Ce que tu obtiens' : 'What you get'}</p>
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
                    <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase mb-3">{fr ? 'Combien ça coûte ailleurs' : 'How much it costs elsewhere'}</p>
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
                            <p className={`text-base font-black ${item.dim ? 'text-neutral-500' : 'text-academy'}`}>{item.price}</p>
                            <p className="text-[10px] text-neutral-500">{item.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href={pricing.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-8 py-4 bg-academy text-black font-bold text-lg rounded-xl hover:scale-[1.02] transition-all shadow-[0_0_40px_rgba(252,165,165,0.35)] hover:shadow-[0_0_60px_rgba(252,165,165,0.5)]"
                  >
                    {fr ? 'Confirmer ma place' : 'Confirm my spot'} - {pricing.price}€
                  </a>
                  {pricing.isUrgent && (
                    <p className="text-center text-xs text-academy font-bold mt-2 animate-pulse">
                      {fr ? `Le prix augmente dans ${pricing.countdown}` : `Price increases in ${pricing.countdown}`}
                    </p>
                  )}

                  {/* Trust badges */}
                  <div className="mt-4 flex items-center justify-center gap-3 text-xs text-neutral-500">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      <span>{fr ? 'Paiement sécurisé' : 'Secure payment'}</span>
                    </div>
                    <span>·</span>
                    <span>{fr ? '+3 000€ de contenu inclus' : '+3,000€ of content included'}</span>
                  </div>
                  <p className="mt-3 text-[10px] text-neutral-600 text-center leading-relaxed">
                    {fr
                      ? "*Premier client garanti : réservé au chemin Empire (option 2). Si tu suis la méthode et que tu n'as pas de client après 3 mois, on continue avec toi gratuitement jusqu'à ce que ça arrive."
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
