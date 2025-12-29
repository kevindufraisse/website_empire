'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { Award, Newspaper } from 'lucide-react'
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

export default function StoryResults() {
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
          light: { "cal-brand": "#dafc68" },
          dark: { "cal-brand": "#dafc68" }
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
              {t.story.results.title}
            </h2>
            <p className="text-xl text-neutral-300">
              {t.story.results.subtitle}
            </p>
          </div>
        </FadeInBlock>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Top 50 LinkedIn France */}
          <FadeInBlock delay={0.1}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-empire to-green-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000" />
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-empire/5 to-transparent border-2 border-empire/20 overflow-hidden shadow-[0_0_30px_rgba(218,252,104,0.15)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-empire/30 border-2 border-empire flex items-center justify-center shadow-[0_0_15px_rgba(218,252,104,0.4)]">
                    <Award className="text-empire" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t.story.results.card1Title}</h3>
                    <p className="text-sm text-neutral-400">{t.story.results.card1Desc}</p>
                  </div>
                </div>
                
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src="https://d1yei2z3i6k35z.cloudfront.net/3647172/68c9e9f667659_1.png"
                    alt="Kevin Dufraisse - Top 50 LinkedIn France"
                    width={600}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </FadeInBlock>

          {/* Media Coverage */}
          <FadeInBlock delay={0.2}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000" />
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent border-2 border-blue-400/20 overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/30 border-2 border-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                    <Newspaper className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t.story.results.card2Title}</h3>
                    <p className="text-sm text-neutral-400">{t.story.results.card2Desc}</p>
                  </div>
                </div>
                
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src="https://d1yei2z3i6k35z.cloudfront.net/3647172/67406b1e63374_KEVINDUFRAISSE1.png"
                    alt="Kevin Dufraisse - Media Coverage"
                    width={600}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </FadeInBlock>
        </div>

        {/* Final Message */}
        <FadeInBlock delay={0.3}>
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-empire via-green-400 to-empire rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-1000" />
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-empire/10 to-transparent border-2 border-empire/30 shadow-[0_0_40px_rgba(218,252,104,0.2)]">
                <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {t.story.results.finalTitle}
                </p>
                <p className="text-lg text-neutral-300 mb-6">
                  {t.story.results.finalSubtitle}
                </p>
                <p className="text-empire font-semibold text-xl mb-8 drop-shadow-[0_0_10px_rgba(218,252,104,0.5)]">
                  {t.story.results.finalWelcome}
                </p>
                <button
                  data-cal-namespace={namespace}
                  data-cal-link={calLink}
                  data-cal-config='{"layout":"month_view","theme":"dark"}'
                  className="inline-block px-8 py-4 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(218,252,104,0.5)] hover:shadow-[0_0_40px_rgba(218,252,104,0.7)]"
                >
                  {t.story.results.finalCta}
                </button>
              </div>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

