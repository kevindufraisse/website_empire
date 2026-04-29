'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { Zap } from 'lucide-react'
import { getCalApi } from "@calcom/embed-react"
import CallbackButton from '@/components/CallbackButton'
import { CtaReassurance } from '@/components/ui/cta-reassurance'
import { useCalLink } from '@/hooks/useCalLink'

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
  const { t } = useLanguage()
  const { autopilot } = useAutopilot()
  
  const namespace = 'audit-empire'
  const calLink = useCalLink()

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace })
      cal("ui", { 
        hideEventTypeDetails: false, 
        layout: "month_view",
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#dafc68" },
          dark: { "cal-brand": "#dafc68" }
        }
      })
    })()
  }, [namespace])
  
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

                <button
                  data-cal-namespace={namespace}
                  data-cal-link={calLink}
                  data-cal-config='{"layout":"month_view","theme":"dark"}'
                  className={`inline-block w-full sm:w-auto px-8 py-4 font-bold rounded-xl hover:scale-105 transition-all text-center ${
                    autopilot
                      ? 'bg-gradient-to-r from-autopilot to-autopilot text-black shadow-[0_0_30px_rgba(212,165,116,0.4)]'
                      : 'bg-empire text-black shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.3)]'
                  }`}
                >
                  {autopilot ? t.autopilot.finalCTA.cta : t.finalCTA.watchDemo}
                </button>
                <div className="mt-3">
                  <CallbackButton variant="subtle" />
                </div>
                <CtaReassurance className="mt-4 px-2" />
              </div>
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}

