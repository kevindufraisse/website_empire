'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react'
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

export default function ExpertAddonSection() {
  const { t } = useLanguage()

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
    <section className="container py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t.expertAddon.sectionTitle}
            </h2>
            <p className="text-lg text-neutral-400">
              {t.expertAddon.sectionSubtitle}
            </p>
          </div>
        </FadeInBlock>

        <FadeInBlock delay={0.1}>
          <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-empire/20 border border-empire/30">
              <span className="text-xs font-bold text-empire uppercase tracking-wider">
                {t.expertAddon.badge}
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-14 h-14 rounded-xl bg-empire/10 border border-empire/30 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="text-empire" size={28} />
              </div>

              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                  {t.expertAddon.title}
                </h3>
                <p className="text-neutral-300 leading-relaxed mb-5">
                  {t.expertAddon.description}
                </p>

                <div className="space-y-2.5 mb-6">
                  {t.expertAddon.bullets.map((bullet: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="text-empire flex-shrink-0" size={16} />
                      <span className="text-sm text-neutral-300">{bullet}</span>
                    </div>
                  ))}
                </div>

                <button
                  data-cal-namespace={namespace}
                  data-cal-link={calLink}
                  data-cal-config='{"layout":"month_view","theme":"dark"}'
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-empire/10 border border-empire/30 text-empire font-semibold text-sm hover:bg-empire/20 transition-colors"
                >
                  {t.expertAddon.cta}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}
