'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import CallbackButton from '@/components/CallbackButton'
import { CtaReassurance } from '@/components/ui/cta-reassurance'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

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

export default function FounderSection() {
  const { t, lang } = useLanguage()
  const { autopilot } = useAutopilot()

  // Load Senja widget script for French version
  useEffect(() => {
    if (lang === 'fr') {
      const existingScript = document.querySelector('script[src*="senja.io/widget/84aa0cc7"]')
      if (!existingScript) {
        const script = document.createElement('script')
        script.src = 'https://widget.senja.io/widget/84aa0cc7-bfa4-4108-9247-676e059134d8/platform.js'
        script.type = 'text/javascript'
        script.async = true
        document.body.appendChild(script)
      }
    }
  }, [lang])

  // Different credentials for FR vs EN
  const credentialsFr = [
    { stat: '#1', label: 'Lead Generation France' },
    { stat: '#55', label: 'LinkedIn Influence France' },
    { stat: '700M+', label: 'Vues générées pour nos clients' },
  ]

  const credentialsEn = [
    { stat: '#9', label: 'Lead Generation Worldwide' },
    { stat: '#55', label: 'LinkedIn Influence France' },
    { stat: '700M+', label: 'Views generated for our clients' },
  ]

  const credentials = lang === 'fr' ? credentialsFr : credentialsEn

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-black to-[#0a0a0a]">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgb(var(--empire-rgb)_/_0.05),transparent)]" />
      
      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          <FadeInBlock>
            <div className="text-center mb-12">
              <p className="text-xs text-empire uppercase tracking-widest mb-3">
                {t.founder?.badge || 'Meet the Creator'}
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {t.founder?.title || 'Built by Someone Who Gets It'}
              </h2>
              <p className="text-neutral-400 max-w-2xl mx-auto">
                {t.founder?.subtitle || 'Empire was built by a creator who generated €3M online - not by a tech team disconnected from the field.'}
              </p>
            </div>
          </FadeInBlock>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Photo */}
            <FadeInBlock delay={0.1}>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-empire/40 to-empire/20 rounded-2xl blur opacity-40" />
                <div className="relative rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src={lang === 'fr' 
                      ? "https://d1yei2z3i6k35z.cloudfront.net/3647172/68c9e9f667659_1.png"
                      : "https://d1yei2z3i6k35z.cloudfront.net/3647172/695b84b825207_Capturedecran2025-11-29a10.06.24.png"
                    }
                    alt={lang === 'fr' 
                      ? "Kevin Dufraisse - #1 Lead Generation France" 
                      : "Kevin Dufraisse - #9 Lead Generation Worldwide"
                    }
                    width={600}
                    height={800}
                    className="w-full h-auto"
                    unoptimized
                  />
                </div>
              </div>
            </FadeInBlock>

            {/* Right side - Content */}
            <FadeInBlock delay={0.2}>
              <div className="space-y-6">
                {/* Credentials */}
                <div className="flex divide-x divide-white/10 border-y border-white/10 py-5">
                  {credentials.map((cred) => (
                    <div key={cred.label} className="flex-1 px-3 first:pl-0 last:pr-0">
                      <p className="text-2xl md:text-3xl font-bold tracking-tight text-white tabular-nums">
                        {cred.stat}
                      </p>
                      <p className="mt-1.5 text-[11px] md:text-xs leading-snug text-neutral-500">
                        {cred.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Story text */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-lg text-white font-semibold mb-3">
                    {t.founder?.name || 'Kevin Dufraisse'}
                  </p>
                  <p className="text-neutral-300 leading-relaxed mb-4">
                    {autopilot ? (t.founder?.bioLegende || t.founder?.bio) : t.founder?.bio}
                  </p>
                  <p className="text-empire font-medium">
                    {t.founder?.tagline || '→ Empire is the system I wish I had when I started.'}
                  </p>
                </div>

                {/* Key message */}
                {t.founder?.keyMessage && (
                  <div className="p-4 rounded-xl bg-empire/10 border border-empire/30">
                    <p className="text-sm text-neutral-300">
                      {t.founder?.keyPoint && <span className="text-empire font-semibold">{t.founder.keyPoint} </span>}
                      {t.founder.keyMessage}
                    </p>
                  </div>
                )}
              </div>
            </FadeInBlock>
          </div>

          {/* Top 1% French Entrepreneurs - Senja Widget (FR only) */}
          {lang === 'fr' && (
            <FadeInBlock delay={0.3}>
              <div className="mt-16 text-center">
                <p className="text-xs text-empire uppercase tracking-widest mb-4">
                  {t.founder?.top1Badge || 'Mis en avant dans le Top 1% des meilleurs entrepreneurs FR'}
                </p>
                <div 
                  className="senja-embed" 
                  data-id="84aa0cc7-bfa4-4108-9247-676e059134d8" 
                  data-mode="shadow" 
                  data-lazyload="false" 
                  style={{ display: 'block', width: '100%' }}
                />
              </div>
            </FadeInBlock>
          )}

          {/* CTA - Talk to Kevin */}
          <FadeInBlock delay={0.4}>
            <div className="mt-12 text-center">
              {autopilot ? (
                <a
                  href="/join-us"
                  className="inline-flex flex-col items-center px-8 py-4 rounded-xl bg-autopilot text-black font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(212,165,116,0.3)]"
                >
                  <span className="text-lg">{t.autopilot.hero.cta1}</span>
                  <span className="text-[11px] font-semibold opacity-70">{t.autopilot.hero.ctaReassurance}</span>
                </a>
              ) : (
                <a
                  href="/postuler"
                  className="inline-flex flex-col items-center px-8 py-4 rounded-xl bg-empire text-black font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgb(var(--empire-rgb)_/_0.3)]"
                >
                  <span className="text-lg">{lang === 'fr' ? 'Demander un accès' : 'Request access'}</span>
                  <span className="text-[11px] font-semibold opacity-70">{lang === 'fr' ? 'Sur sélection' : 'By selection'}</span>
                </a>
              )}
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}
