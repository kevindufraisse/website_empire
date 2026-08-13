'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import OnboardingLink from '@/components/OnboardingLink'

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

  // Légende already closes on the founder section — repeating the pitch here adds nothing.
  if (autopilot) return null

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

                {!autopilot && (
                  <p className="mb-8 text-sm text-neutral-400 max-w-lg mx-auto">
                    {lang === 'fr'
                      ? 'Vous rejoignez la liste d\'attente. On lit chaque candidature et on sélectionne les profils les plus motivés.'
                      : 'You join the waitlist. We read every application and select the most motivated profiles.'}
                  </p>
                )}

                {autopilot ? (
                  <a
                    href="/join-us"
                    className="inline-flex flex-col items-center w-full sm:w-auto px-8 py-4 font-bold rounded-xl hover:scale-105 transition-all text-center bg-autopilot text-black shadow-[0_0_30px_rgba(212,165,116,0.4)]"
                  >
                    <span className="text-lg">{t.autopilot.finalCTA.cta}</span>
                    <span className="text-[11px] font-semibold opacity-70">
                      {t.autopilot.hero.ctaReassurance}
                    </span>
                  </a>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <OnboardingLink className="inline-flex flex-col items-center w-full sm:w-auto px-8 py-4 font-bold rounded-xl hover:scale-105 transition-all text-center bg-empire text-black shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.3)]">
                      <span className="text-lg">
                        {lang === 'fr' ? 'Rejoindre la liste d\'attente' : 'Join the waitlist'}
                      </span>
                      <span className="text-[11px] font-semibold opacity-70">
                        {lang === 'fr' ? 'On sélectionne les plus motivés' : 'We select the most motivated'}
                      </span>
                    </OnboardingLink>
                    <a
                      href="https://app.empire-internet.com/onboarding"
                      className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3.5 text-sm font-semibold rounded-xl border border-white/15 text-white hover:border-empire/40 transition-all"
                    >
                      {lang === 'fr' ? 'Installer le système' : 'Install the system'}
                    </a>
                  </div>
                )}

                {!autopilot && (
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event('open-offer-quiz'))}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-empire/50 bg-empire/10 px-5 py-2.5 text-sm font-semibold text-empire shadow-[0_0_24px_rgb(var(--empire-rgb)_/_0.25)] hover:bg-empire/20 hover:scale-[1.02] transition-all"
                  >
                    <span className="text-empire">✦</span>
                    {lang === 'fr' ? 'Pas sûr ? Quelle offre pour vous ?' : 'Not sure? Which offer for you?'}
                  </button>
                )}
              </div>
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}

