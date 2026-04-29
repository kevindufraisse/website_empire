'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
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
  Users,
  Code2,
  ChevronDown,
  Sparkles,
  Send,
  HeadphonesIcon,
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

type Feature = { icon: React.ComponentType<{ className?: string; size?: number }>; title: string; desc: string }

type Pillar = {
  id: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  label: string
  keyFeatures: Feature[]
  moreFeatures: Feature[]
}

const pillars: Record<string, Pillar[]> = {
  fr: [
    {
      id: 'contenu',
      icon: Sparkles,
      label: 'Contenu',
      keyFeatures: [
        { icon: FileText, title: '30+ posts LinkedIn', desc: 'Rédigés, optimisés et planifiés', value: '1 500€' },
        { icon: Mail, title: '30 newsletters/mois', desc: 'Qui sonnent comme vous, en mieux', value: '1 200€' },
        { icon: Video, title: '30+ Reels & Shorts', desc: 'Option sans caméra - pas besoin de montrer votre visage', value: '3 000€' },
      ],
      moreFeatures: [
        { icon: Video, title: 'Vidéos longues YouTube', desc: 'On crée vos vidéos longues de A à Z', value: '2 000€' },
        { icon: ImageIcon, title: 'Carrousels illimités', desc: 'LinkedIn + Instagram', value: '800€' },
      ],
    },
    {
      id: 'distribution',
      icon: Send,
      label: 'Distribution',
      keyFeatures: [
        { icon: Calendar, title: 'Publiez depuis la plateforme', desc: 'Tout est prêt dans votre calendrier, vous publiez en 1 clic', value: '500€' },
        { icon: Bot, title: '1 setter IA LinkedIn', desc: 'Prospection automatisée 24/7', value: '1 500€' },
        { icon: Users, title: 'Employee Advocacy', desc: 'Faites publier vos employés automatiquement', value: '800€' },
      ],
      moreFeatures: [
        { icon: Code2, title: 'Multi-comptes', desc: 'Publiez sur plusieurs comptes depuis la même plateforme', value: '300€' },
        { icon: Mail, title: 'Substack automatique', desc: 'Vos newsletters publiées automatiquement sur Substack', value: '200€' },
        { icon: Users, title: 'Diffusion Skool', desc: 'Contenu partagé automatiquement dans votre communauté Skool', value: '200€' },
        { icon: Zap, title: 'Deeplinks de tracking', desc: 'Liens trackés pour mesurer la performance de chaque contenu', value: '300€' },
      ],
    },
    {
      id: 'accompagnement',
      icon: HeadphonesIcon,
      label: 'Accompagnement',
      keyFeatures: [
        { icon: Mic, title: 'Interview humain ou IA', desc: 'Choisissez : un coach vous interview ou notre IA le fait', value: '2 000€' },
        { icon: Zap, title: '1 expert en viralité dédié', desc: 'Trouve les sujets qui vont performer dans votre niche', value: '3 000€' },
        { icon: UserCheck, title: 'Équipe humaine dédiée', desc: 'De vrais humains créent et vérifient chaque contenu', value: '2 000€' },
      ],
      moreFeatures: [
        { icon: Users, title: 'Communauté privée', desc: 'Réseau de fondateurs et créateurs', value: '500€' },
        { icon: Mic, title: 'Lives de groupe', desc: 'Sessions collectives pour progresser ensemble', value: '500€' },
      ],
    },
  ],
  en: [
    {
      id: 'contenu',
      icon: Sparkles,
      label: 'Content',
      keyFeatures: [
        { icon: FileText, title: '30+ LinkedIn posts', desc: 'Written, optimized, scheduled' },
        { icon: Mail, title: '30 newsletters/mo', desc: 'Sound like you, but better' },
        { icon: Video, title: '30+ Reels & Shorts', desc: 'No-camera option - no need to show your face' },
      ],
      moreFeatures: [
        { icon: Video, title: 'Long-form YouTube scripts', desc: 'Optimized scripts for your long videos' },
        { icon: ImageIcon, title: 'Unlimited carousels', desc: 'LinkedIn + Instagram' },
      ],
    },
    {
      id: 'distribution',
      icon: Send,
      label: 'Distribution',
      keyFeatures: [
        { icon: Calendar, title: 'Publish from the platform', desc: 'Everything ready in your calendar, publish in 1 click' },
        { icon: Bot, title: '1 AI LinkedIn setter', desc: 'Automated outreach 24/7' },
        { icon: Users, title: 'Employee Advocacy', desc: 'Get your employees publishing automatically' },
      ],
      moreFeatures: [
        { icon: Code2, title: 'Multi-account', desc: 'Publish on multiple accounts from the same platform' },
        { icon: Mail, title: 'Auto Substack', desc: 'Your newsletters automatically published on Substack' },
        { icon: Users, title: 'Skool distribution', desc: 'Content automatically shared in your Skool community' },
        { icon: Zap, title: 'Tracking deeplinks', desc: 'Tracked links to measure each content performance' },
      ],
    },
    {
      id: 'accompagnement',
      icon: HeadphonesIcon,
      label: 'Support',
      keyFeatures: [
        { icon: Mic, title: 'Human or AI interview', desc: 'Choose: a coach interviews you or our AI does it' },
        { icon: Zap, title: '1 virality expert', desc: 'Finds topics that will perform in your niche' },
        { icon: UserCheck, title: 'Dedicated human team', desc: 'Real humans create and review every piece of content' },
      ],
      moreFeatures: [
        { icon: Users, title: 'Private community', desc: 'Founder & creator network' },
        { icon: Mic, title: 'Group live sessions', desc: 'Collective sessions to grow together' },
      ],
    },
  ],
}

export default function WhyNowSection() {
  const { lang, t } = useLanguage()
  const { autopilot } = useAutopilot()
  const namespace = 'audit-empire'
  const calLink = useCalLink()
  const fr = lang === 'fr'
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null)

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

  if (autopilot) return null

  const currentPillars = pillars[fr ? 'fr' : 'en']

  return (
    <section className="relative w-full py-16 md:py-28 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgb(var(--empire-rgb)_/_0.06),transparent)]" />

      <div className="container relative z-10 max-w-5xl mx-auto">

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
              {autopilot
                ? t.autopilot.whyNow.subtitle
                : (fr
                    ? '15 minutes d\'interview. Le reste est automatisé.'
                    : '15 minutes of interview. The rest is automated.')}
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {currentPillars.map((pillar, pi) => {
            const PillarIcon = pillar.icon
            const isExpanded = expandedPillar === pillar.id
            const hasMore = pillar.moreFeatures.length > 0
            const highlighted = autopilot && pillar.id === 'accompagnement'

            return (
              <FadeIn key={pillar.id} delay={pi * 0.1}>
                <div className={`relative rounded-2xl border overflow-hidden transition-all ${
                  highlighted
                    ? 'border-autopilot/60 bg-gradient-to-br from-autopilot/10 to-white/[0.02] shadow-[0_0_30px_rgba(212,165,116,0.15)]'
                    : 'border-white/10 bg-white/[0.02]'
                }`}>
                  {highlighted && (
                    <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-full bg-autopilot text-black text-[10px] font-bold tracking-wider uppercase shadow-md">
                      {fr ? 'Autopilot' : 'Autopilot'}
                    </div>
                  )}
                  <div className="p-5 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3 mb-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${highlighted ? 'bg-autopilot/20' : 'bg-empire/15'}`}>
                        <PillarIcon className={highlighted ? 'text-autopilot' : 'text-empire'} size={16} />
                      </div>
                      <h3 className="text-lg font-bold text-white">{pillar.label}</h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    {pillar.keyFeatures.map((f, i) => {
                      const Icon = f.icon
                      return (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-empire/5 border border-empire/15">
                          <div className="w-8 h-8 rounded-lg bg-empire/15 flex items-center justify-center flex-shrink-0">
                            <Icon className="text-empire" size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white">{f.title}</p>
                            <p className="text-xs text-neutral-400 mt-0.5">{f.desc}</p>
                          </div>
                          {(f as any).value && (
                            <span className="text-xs font-bold text-neutral-500 line-through whitespace-nowrap">{(f as any).value}</span>
                          )}
                        </div>
                      )
                    })}

                    {hasMore && (
                      <>
                        <motion.div
                          initial={false}
                          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-2.5 pt-1">
                            {pillar.moreFeatures.map((f, i) => {
                              const Icon = f.icon
                              return (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.08] border border-white/15">
                                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <Icon className="text-neutral-400" size={15} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white">{f.title}</p>
                                    <p className="text-xs text-neutral-400 mt-0.5">{f.desc}</p>
                                  </div>
                                  {(f as any).value && (
                                    <span className="text-xs font-bold text-neutral-500 line-through whitespace-nowrap">{(f as any).value}</span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </motion.div>

                        <button
                          onClick={() => setExpandedPillar(isExpanded ? null : pillar.id)}
                          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-neutral-400 hover:text-empire transition-colors"
                        >
                          {isExpanded
                            ? (fr ? 'Réduire' : 'Show less')
                            : (fr ? `Voir tout (+${pillar.moreFeatures.length})` : `See all (+${pillar.moreFeatures.length})`)}
                          <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>

        <FadeIn delay={0.3}>
          <div className="text-center">
            <div className="mb-4">
              <p className="text-sm text-neutral-500 mb-1">
                {fr ? 'Valeur totale en agence :' : 'Total agency value:'}
              </p>
              <p className="text-2xl font-black text-neutral-400 line-through">
                {fr ? '20 300€/mois' : '€20,300/mo'}
              </p>
              <p className="text-sm text-empire font-bold mt-1">
                {fr ? 'En moyenne, nos clients économisent 146 000€/an.' : 'On average, our clients save €146,000/year.'}
              </p>
            </div>
            <button
              data-cal-namespace={namespace}
              data-cal-link={calLink}
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold hover:scale-105 transition-all ${
                autopilot
                  ? 'bg-gradient-to-r from-autopilot to-autopilot text-black shadow-[0_0_30px_rgba(212,165,116,0.35)]'
                  : 'bg-empire text-black shadow-[0_0_30px_rgb(var(--empire-rgb)_/_0.25)]'
              }`}
            >
              {autopilot
                ? t.autopilot.hero.cta1
                : (fr ? 'Je veux en savoir plus sur le système Empire' : 'I want to learn more about the Empire system')}
              <ArrowRight size={18} />
            </button>
            <CtaReassurance className="mt-4 px-2" />
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
