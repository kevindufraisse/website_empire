'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { Zap } from 'lucide-react'
import CallbackButton from '@/components/CallbackButton'
import { CtaReassurance } from '@/components/ui/cta-reassurance'
import OnboardingLink from '@/components/OnboardingLink'
import { LaunchOfferLine } from '@/components/ui/launch-offer-line'

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

export default function FinalBoostCTA() {
  const { t, lang } = useLanguage()
  const { autopilot } = useAutopilot()

  return (
    <section className="relative w-full pb-20 md:pb-32 bg-gradient-to-b from-black to-[#0f0f0f]">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <FadeInBlock>
            <div className={`relative p-8 md:p-12 rounded-2xl border overflow-hidden text-center transition-colors ${
              autopilot
                ? 'bg-gradient-to-br from-autopilot/10 to-transparent border-autopilot/40'
                : 'bg-gradient-to-br from-empire/10 to-transparent border-empire/30'
            }`}>
              <div className={`absolute inset-0 transition-opacity ${autopilot ? 'opacity-0' : 'opacity-100'} bg-[radial-gradient(circle_at_center,rgb(var(--empire-rgb)_/_0.15),transparent)]`} />
              <div className={`absolute inset-0 transition-opacity ${autopilot ? 'opacity-100' : 'opacity-0'} bg-[radial-gradient(circle_at_center,rgba(212,165,116,0.18),transparent)]`} />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  {autopilot ? t.autopilot.finalCTA.title : t.finalCTA.title}
                </h2>
                <p className="text-lg text-neutral-300 mb-8">
                  {autopilot ? t.autopilot.finalCTA.subtitle : t.finalCTA.subtitle}
                </p>

                {/* Ce qui se passe après le clic : désamorce l'onboarding long */}
                {!autopilot && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 mb-6 text-sm text-neutral-300">
                    {(lang === 'fr'
                      ? ['Créez votre compte (2 min)', 'Enregistrez votre 1ère session', 'Premier contenu sous 24h']
                      : ['Create your account (2 min)', 'Record your 1st session', 'First content within 24h']
                    ).map((step, i) => (
                      <span key={i} className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-empire/15 text-empire text-[11px] font-bold shrink-0">{i + 1}</span>
                        {step}
                        {i < 2 && <span className="hidden sm:inline text-neutral-600 ml-4">→</span>}
                      </span>
                    ))}
                  </div>
                )}

                {/* Ce qui se passe après l'onboarding : la boucle du système */}
                {!autopilot && (
                  <div className="mb-8">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 mb-2">
                      {lang === 'fr' ? 'Et ensuite ?' : 'And then?'}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-xs text-neutral-400 max-w-2xl mx-auto">
                      {(lang === 'fr'
                        ? ['Vous entrez votre positionnement et vos concurrents', 'Notre système trouve les sujets', 'Vous parlez', 'Notre équipe crée les contenus', 'Vous publiez partout']
                        : ['You enter your positioning and competitors', 'Our system finds the topics', 'You talk', 'Our team creates the content', 'You publish everywhere']
                      ).map((step, i, arr) => (
                        <span key={i} className="flex items-center gap-2">
                          {step}
                          {i < arr.length - 1 && <span className="text-empire/60">→</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <OnboardingLink
                  className={`inline-flex flex-col items-center w-full sm:w-auto px-8 py-4 font-bold rounded-xl hover:scale-105 transition-all text-center ${
                    autopilot
                      ? 'bg-gradient-to-r from-autopilot to-autopilot text-black shadow-[0_0_30px_rgba(212,165,116,0.4)]'
                      : 'bg-empire text-black shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.3)]'
                  }`}
                >
                  <span className="text-lg">
                    {autopilot
                      ? t.autopilot.finalCTA.cta
                      : (lang === 'fr' ? 'Lancer ma machine média' : 'Launch my media machine')}
                  </span>
                  <span className="text-[11px] font-semibold opacity-70">
                    {lang === 'fr'
                      ? 'Essai gratuit 7 jours · Sans engagement'
                      : '7-day free trial · No commitment'}
                  </span>
                </OnboardingLink>

                {!autopilot && <LaunchOfferLine className="mt-4" />}
              </div>
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}

