'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Check } from 'lucide-react'
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

const roles = [
  { en: 'LinkedIn Ghostwriter', fr: 'Ghostwriter LinkedIn' },
  { en: 'Community Manager', fr: 'Community Manager' },
  { en: 'LinkedIn Setter', fr: 'Setter LinkedIn' },
  { en: 'Copywriter', fr: 'Copywriter' },
  { en: 'Viral Writer', fr: 'Viral Writer' },
  { en: 'YouTube Writer', fr: 'YouTube Writer' },
  { en: 'Video Editor', fr: 'Monteur Vidéo' },
  { en: 'Social Media Manager', fr: 'Social Media Manager' },
  { en: 'Content Strategist', fr: 'Content Strategist' },
  { en: 'Graphic Designer', fr: 'Graphic Designer' },
  { en: 'SEO Writer', fr: 'SEO Writer' },
  { en: 'Script Writer', fr: 'Script Writer' },
  { en: 'Podcast Producer', fr: 'Podcast Producer' },
  { en: 'Brand Strategist', fr: 'Brand Strategist' },
  { en: 'Email Copywriter', fr: 'Email Copywriter' },
]

export default function RolesReplacedSection() {
  const { lang } = useLanguage()
  
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
    <section className="container py-20 md:py-32">
      <div className="max-w-6xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-empire/10 border border-empire/30">
              <p className="text-sm font-bold text-empire">
                {lang === 'fr' ? 'UNE ÉQUIPE COMPLÈTE' : 'A COMPLETE TEAM'}
              </p>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {lang === 'fr' 
                ? 'Empire remplace 15+ rôles' 
                : 'Empire replaces 15+ roles'}
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              {lang === 'fr'
                ? 'Pourquoi embaucher une équipe entière quand Empire fait tout ?'
                : 'Why hire an entire team when Empire does it all?'}
            </p>
          </div>
        </FadeInBlock>

        {/* Liste des rôles */}
        <FadeInBlock delay={0.4}>
          <div className="p-5 md:p-10 rounded-xl md:rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 text-center">
              {lang === 'fr' ? 'Tous ces rôles inclus' : 'All these roles included'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
              {roles.map((role, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-1.5 md:gap-2 p-2 md:p-3 rounded-lg bg-white/5 border border-white/10 hover:border-empire/30 transition-colors"
                >
                  <Check className="text-empire flex-shrink-0" size={14} />
                  <span className="text-neutral-300 text-xs md:text-sm font-medium leading-tight">
                    {lang === 'fr' ? role.fr : role.en}
                  </span>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-5 md:mt-8 text-center">
              <p className="text-neutral-400 text-xs md:text-sm">
                {lang === 'fr'
                  ? '+ tous les outils et logiciels nécessaires'
                  : '+ all necessary tools and software'}
              </p>
            </div>
          </div>
        </FadeInBlock>

        {/* CTA */}
        <FadeInBlock delay={0.5}>
          <div className="mt-8 md:mt-12 text-center px-4 md:px-0">
            <button
              data-cal-namespace={namespace}
              data-cal-link={calLink}
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-empire text-black font-bold text-base md:text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(218,252,104,0.3)]"
            >
              {lang === 'fr' ? 'Réserver une démo' : 'Book a demo'}
              <span>→</span>
            </button>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}
