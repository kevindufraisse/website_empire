'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import BorderBeam from '@/components/magicui/border-beam'
import { MessageSquare, Sparkles, TrendingUp } from 'lucide-react'
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

export default function StoryBreakthrough() {
  const { t, lang } = useLanguage()

  const namespace = lang === 'fr' ? 'empire-request-fr' : 'empire-request'
  const calLink = lang === 'fr' ? 'kevin-dufraisse-private/empire-request-fr' : 'kevin-dufraisse-private/empire-request'

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace })
      cal("ui", { 
        hideEventTypeDetails: false, 
        layout: "month_view",
        theme: "dark",
        cssVarsPerTheme: {
          dark: {
            "cal-brand": "#dafc68"
          }
        }
      })
    })()
  }, [namespace])
  
  return (
    <section className="container py-20 md:py-32 bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      <div className="max-w-6xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              {t.story.breakthrough.title}
            </h2>
          </div>
        </FadeInBlock>

        {/* The Process - Visual */}
        <FadeInBlock delay={0.2}>
          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-empire/5 to-transparent border-2 border-empire/20 overflow-hidden shadow-[0_0_50px_rgba(218,252,104,0.1)]">
            <BorderBeam size={300} duration={12} delay={0} colorFrom="#DAFC68" colorTo="#4ade80" />
            
            <div className="relative z-10">
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-500/10 border-2 border-blue-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all">
                    <MessageSquare className="text-blue-400" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.story.breakthrough.step1Title}</h3>
                  <p className="text-neutral-400">{t.story.breakthrough.step1Desc}</p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/30 to-purple-500/10 border-2 border-purple-400 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all">
                    <Sparkles className="text-purple-400" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.story.breakthrough.step2Title}</h3>
                  <p className="text-neutral-400">{t.story.breakthrough.step2Desc}</p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-empire/30 to-green-500/10 border-2 border-empire flex items-center justify-center shadow-[0_0_20px_rgba(218,252,104,0.3)] group-hover:shadow-[0_0_30px_rgba(218,252,104,0.5)] transition-all">
                    <TrendingUp className="text-empire" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.story.breakthrough.step3Title}</h3>
                  <p className="text-neutral-400">{t.story.breakthrough.step3Desc}</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {t.story.breakthrough.tagline}
                </p>
                <p className="text-lg text-neutral-300 mb-8">
                  {t.story.breakthrough.subtitle}
                </p>
                <button
                  data-cal-namespace={namespace}
                  data-cal-link={calLink}
                  data-cal-config='{"layout":"month_view","theme":"dark"}'
                  className="inline-block px-8 py-4 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)]"
                >
                  {t.story.breakthrough.cta}
                </button>
              </div>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

