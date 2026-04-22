'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getCalApi } from '@calcom/embed-react'
import {
  ArrowRight,
  FileText,
  Video,
  Mail,
  Calendar,
  Bot,
  UserCheck,
  Mic,
  Image as ImageIcon,
  Zap,
  BarChart3,
  Users,
  Code2,
} from 'lucide-react'
import { useCalLink } from '@/hooks/useCalLink'
import { CtaReassurance } from '@/components/ui/cta-reassurance'

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

const features = {
  fr: [
    { icon: Mic, title: '4 interviews de 15 min/mois', desc: 'Vous parlez, on fait le reste', highlight: false },
    { icon: FileText, title: '30+ posts LinkedIn', desc: 'Rédigés, optimisés et planifiés', highlight: false },
    { icon: Mail, title: '30 newsletters/mois', desc: 'Qui sonnent comme vous, en mieux', highlight: true },
    { icon: Video, title: '30+ vidéos courtes', desc: 'Reels, Shorts, TikTok montés', highlight: false },
    { icon: Video, title: 'Formats longs YouTube', desc: 'Scripts et montage inclus', highlight: false },
    { icon: ImageIcon, title: '30+ posts Instagram', desc: 'Visuels engageants créés pour vous', highlight: false },
    { icon: ImageIcon, title: 'Carrousels illimités', desc: 'LinkedIn + Instagram', highlight: false },
    { icon: Bot, title: '1 setter IA LinkedIn', desc: 'Prospection automatisée 24/7', highlight: true },
    { icon: Zap, title: 'Reels illimités scriptés', desc: 'Montés et prêts à publier', highlight: false },
    { icon: Calendar, title: 'Tout planifié', desc: 'Calendrier complet, rien à faire', highlight: false },
    { icon: UserCheck, title: '1 assistante humaine dédiée', desc: 'QA et suivi de chaque publication', highlight: true },
    { icon: Zap, title: '1 expert en viralité', desc: 'Trouve les sujets qui vont performer', highlight: true },
    { icon: Users, title: 'Communauté privée', desc: 'Réseau de fondateurs et créateurs', highlight: false },
    { icon: Code2, title: 'API Empire', desc: 'Intégrez Empire à vos outils existants', highlight: false },
    { icon: Users, title: 'Employee Advocacy', desc: 'Faites publier vos employés automatiquement', highlight: true },
  ],
  en: [
    { icon: Mic, title: '4 x 15-min interviews/mo', desc: 'You talk, we do the rest', highlight: false },
    { icon: FileText, title: '30+ LinkedIn posts', desc: 'Written, optimized, scheduled', highlight: false },
    { icon: Mail, title: '30 newsletters/mo', desc: 'Sound like you, but better', highlight: true },
    { icon: Video, title: '30+ short videos', desc: 'Reels, Shorts, TikTok edited', highlight: false },
    { icon: Video, title: 'Long-form YouTube', desc: 'Scripts and editing included', highlight: false },
    { icon: ImageIcon, title: '30+ Instagram posts', desc: 'Engaging visuals created for you', highlight: false },
    { icon: ImageIcon, title: 'Unlimited carousels', desc: 'LinkedIn + Instagram', highlight: false },
    { icon: Bot, title: '1 AI LinkedIn setter', desc: 'Automated outreach 24/7', highlight: true },
    { icon: Zap, title: 'Unlimited scripted Reels', desc: 'Edited and ready to post', highlight: false },
    { icon: Calendar, title: 'Everything scheduled', desc: 'Full calendar, zero effort', highlight: false },
    { icon: UserCheck, title: '1 dedicated human assistant', desc: 'QA and follow-up on every post', highlight: true },
    { icon: Zap, title: '1 virality expert', desc: 'Finds topics that will perform', highlight: true },
    { icon: Users, title: 'Private community', desc: 'Founder & creator network', highlight: false },
    { icon: Code2, title: 'Empire API', desc: 'Integrate Empire with your existing tools', highlight: false },
    { icon: Users, title: 'Employee Advocacy', desc: 'Get your employees publishing automatically', highlight: true },
  ],
}

export default function WhyNowSection() {
  const { lang, t } = useLanguage()
  const namespace = 'audit-empire'
  const calLink = useCalLink()
  const fr = lang === 'fr'

  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace })
      cal('ui', {
        layout: 'month_view',
        theme: 'dark',
        cssVarsPerTheme: {
          light: { 'cal-brand': '#dafc68' },
          dark: { 'cal-brand': '#dafc68' },
        },
      })
    })()
  }, [namespace])

  const currentFeatures = features[fr ? 'fr' : 'en']

  return (
    <section className="relative w-full py-16 md:py-28 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(218,252,104,0.06),transparent)]" />

      <div className="container relative z-10 max-w-5xl mx-auto">

        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-empire/10 border border-empire/20 text-empire text-xs font-semibold tracking-wider uppercase mb-4">
              {fr ? 'Fonctionnalités' : 'Features'}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {fr
                ? <>Tout ce qu&apos;Empire <span className="text-empire">crée pour vous</span> chaque mois</>
                : <>Everything Empire <span className="text-empire">creates for you</span> every month</>}
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              {fr
                ? '15 minutes d\'interview. Le reste est automatisé.'
                : '15 minutes of interview. The rest is automated.'}
            </p>
          </div>
        </FadeIn>

        {/* Features grid */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-12">
            {currentFeatures.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  viewport={{ once: true }}
                  className={`group flex items-start gap-3.5 p-4 rounded-xl border transition-all ${
                    f.highlight
                      ? 'bg-empire/5 border-empire/20 hover:border-empire/40'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    f.highlight ? 'bg-empire/20' : 'bg-white/5'
                  }`}>
                    <Icon className={f.highlight ? 'text-empire' : 'text-neutral-400'} size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.2}>
          <div className="text-center">
            <button
              data-cal-namespace={namespace}
              data-cal-link={calLink}
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-empire text-black font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(218,252,104,0.25)]"
            >
              {t.common.startNow}
              <ArrowRight size={18} />
            </button>
            <CtaReassurance className="mt-4 px-2" />
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
