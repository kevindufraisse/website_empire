'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getCalApi } from "@calcom/embed-react"

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

export default function FormatsCTA() {
  const { t, lang } = useLanguage()

  const namespace = 'audit-empire'
  const calLink = 'team/empire-internet/audit-empire'

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
    <section className="container section-spacing">
      <div className="max-w-4xl mx-auto">
        <FadeInBlock>
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              {t.formats?.cta?.title || 'Choose Your Format'}
              <br />
              <span className="text-empire">{t.formats?.cta?.titleHighlight || 'We Handle Everything Else'}</span>
            </h2>
            
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              {t.formats?.cta?.subtitle || 'No matter how you create, Empire transforms it into 30+ pieces of content per week.'}
            </p>

            <div className="flex items-center justify-center pt-4">
              <button
                data-cal-namespace={namespace}
                data-cal-link={calLink}
                data-cal-config='{"layout":"month_view","theme":"dark"}'
                className="px-8 py-4 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)] text-center"
              >
                {t.finalCTA.watchDemo}
              </button>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}
