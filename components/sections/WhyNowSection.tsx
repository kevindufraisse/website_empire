'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
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
  MessageCircle,
  GraduationCap,
  Share2,
  Globe,
  Palette,
} from 'lucide-react'
import { CtaReassurance } from '@/components/ui/cta-reassurance'
import OnboardingLink from '@/components/OnboardingLink'

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

type Feature = { icon: React.ComponentType<{ className?: string; size?: number }>; title: string; desc: string; value?: string; badge?: string }

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
        { icon: FileText, title: '30+ posts LinkedIn', desc: 'Rédigés, optimisés et planifiés. Ajout automatique de vos lead magnets.', value: '1 500€' },
        { icon: Mail, title: '30 newsletters/mois', desc: 'Qui sonnent comme vous, en mieux.', value: '1 200€' },
        { icon: Video, title: '30+ Reels & Shorts', desc: 'Vos vidéos découpées aux meilleurs moments. Montage pro : hooks, sous-titres, transitions. Option sans caméra.', value: '3 000€' },
        { icon: Palette, title: 'Personnalisation complète', desc: 'Sous-titres (45 styles), transitions, vos couleurs, vos b-rolls, votre photo, votre branding — chaque contenu à votre image.' },
        { icon: Globe, title: 'Multilingue : FR, EN, ES', desc: 'Tous vos contenus dans 3 langues — même pipeline, même qualité.' },
      ],
      moreFeatures: [
        { icon: Video, title: 'Vidéos longues YouTube', desc: 'On crée vos vidéos longues de A à Z. Personnalisation des couleurs, textes et format.', value: '2 000€' },
        { icon: ImageIcon, title: 'Carrousels automatiques', desc: 'Générés depuis vos posts pour LinkedIn + Instagram.', value: '800€' },
        { icon: ImageIcon, title: 'Miniatures', desc: 'Création des miniatures pour Instagram, YouTube et LinkedIn', value: '500€' },
        { icon: Bot, title: 'Cerveau Empire', desc: 'Nos agents IA trouvent les sujets les plus viraux pour votre niche', value: '1 000€' },
      ],
    },
    {
      id: 'distribution',
      icon: Send,
      label: 'Distribution',
      keyFeatures: [
        { icon: Share2, title: 'Un contenu → tous les réseaux', desc: 'LinkedIn, Instagram, TikTok, YouTube, X, Threads, Facebook. Partout, en même temps.', value: '1 000€' },
        { icon: Calendar, title: 'Publiez depuis la plateforme', desc: 'Tout est prêt dans votre calendrier, vous publiez en 1 clic', value: '500€' },
        { icon: Users, title: 'Employee Advocacy', desc: 'Faites publier vos employés automatiquement', value: '800€' },
        { icon: MessageCircle, title: 'Idées via Telegram', desc: 'Ajoutez vos idées (reels, posts, captures...) depuis Telegram et récupérez-les dans Empire', badge: 'NEW' },
      ],
      moreFeatures: [
        { icon: Code2, title: 'Multi-comptes', desc: 'Publiez sur plusieurs comptes depuis la même plateforme', value: '300€' },
        { icon: Mail, title: 'Substack automatique', desc: 'Vos notes publiées automatiquement sur Substack', value: '200€' },
        { icon: Users, title: 'Diffusion Skool', desc: 'Contenu partagé automatiquement dans votre communauté Skool', value: '200€' },
        { icon: Zap, title: 'Deeplinks de tracking', desc: 'Liens trackés pour mesurer la performance de chaque contenu', value: '300€' },
        { icon: Code2, title: 'API & Automations', desc: 'Connectez Empire à vos outils (Notion, Airtable, Google Drive). Automatisez vos workflows.', value: '500€' },
      ],
    },
    {
      id: 'accompagnement',
      icon: HeadphonesIcon,
      label: 'Accompagnement',
      keyFeatures: [
        { icon: UserCheck, title: 'Équipe humaine dédiée', desc: 'De vrais humains créent et vérifient chaque contenu', value: '2 000€' },
        { icon: GraduationCap, title: 'Coaching dédié', desc: 'Un coach dédié comprend votre business et vous forme aux formats qui performent dans votre niche', badge: 'OPTION' },
        { icon: GraduationCap, title: 'Bootcamp viralité', desc: '21 jours pour maîtriser la viralité et exécuter les formats qui performent dans votre niche', badge: 'OPTION' },
        { icon: Users, title: 'Communauté privée', desc: 'Réseau de fondateurs et créateurs', badge: 'OPTION' },
        { icon: Mic, title: 'Lives de groupe', desc: 'Sessions collectives pour progresser ensemble', badge: 'OPTION' },
      ],
      moreFeatures: [
        // (intentionally empty — all support options are visible by default)
      ],
    },
  ],
  en: [
    {
      id: 'contenu',
      icon: Sparkles,
      label: 'Content',
      keyFeatures: [
        { icon: FileText, title: '30+ LinkedIn posts', desc: 'Written, optimized, scheduled. Auto-embed your lead magnets.' },
        { icon: Mail, title: '30 newsletters/mo', desc: 'Sound like you, but better.' },
        { icon: Video, title: '30+ Reels & Shorts', desc: 'Your videos cut at their best moments. Pro editing: hooks, subtitles, transitions. No-camera option.' },
        { icon: Palette, title: 'Full customization', desc: 'Subtitles (45 styles), transitions, your colors, your b-rolls, your photo, your branding — every piece of content in your image.' },
        { icon: Globe, title: 'Multilingual: FR, EN, ES', desc: 'All your content in 3 languages — same pipeline, same quality.' },
      ],
      moreFeatures: [
        { icon: Video, title: 'Long-form YouTube videos', desc: 'We create your long videos from A to Z. Custom colors, text and format.' },
        { icon: ImageIcon, title: 'Auto carousels', desc: 'Generated from your posts for LinkedIn + Instagram.' },
        { icon: ImageIcon, title: 'Thumbnails', desc: 'Custom thumbnails for Instagram, YouTube and LinkedIn' },
        { icon: Bot, title: 'Empire Brain', desc: 'Our AI agents find the most viral topics for your niche' },
      ],
    },
    {
      id: 'distribution',
      icon: Send,
      label: 'Distribution',
      keyFeatures: [
        { icon: Share2, title: 'One piece of content → every platform', desc: 'LinkedIn, Instagram, TikTok, YouTube, X, Threads, Facebook. Everywhere, at the same time.' },
        { icon: Calendar, title: 'Publish from the platform', desc: 'Everything ready in your calendar, publish in 1 click' },
        { icon: Users, title: 'Employee Advocacy', desc: 'Get your employees publishing automatically' },
        { icon: MessageCircle, title: 'Ideas via Telegram', desc: 'Add your ideas (reels, posts, screenshots...) from Telegram and retrieve them in Empire', badge: 'NEW' },
      ],
      moreFeatures: [
        { icon: Code2, title: 'Multi-account', desc: 'Publish on multiple accounts from the same platform' },
        { icon: Mail, title: 'Auto Substack', desc: 'Your notes automatically published on Substack' },
        { icon: Users, title: 'Skool distribution', desc: 'Content automatically shared in your Skool community' },
        { icon: Zap, title: 'Tracking deeplinks', desc: 'Tracked links to measure each content performance' },
        { icon: Code2, title: 'API & Automations', desc: 'Connect Empire to your tools (Notion, Airtable, Google Drive). Automate your workflows.' },
      ],
    },
    {
      id: 'accompagnement',
      icon: HeadphonesIcon,
      label: 'Support',
      keyFeatures: [
        { icon: UserCheck, title: 'Dedicated human team', desc: 'Real humans create and review every piece of content' },
        { icon: GraduationCap, title: 'Dedicated coaching', desc: 'A dedicated coach understands your business and trains you on the formats that perform in your niche', badge: 'OPTION' },
        { icon: GraduationCap, title: 'Virality bootcamp', desc: '21 days to master virality and execute the formats that perform in your niche', badge: 'OPTION' },
        { icon: Users, title: 'Private community', desc: 'Founder & creator network', badge: 'OPTION' },
        { icon: Mic, title: 'Group live sessions', desc: 'Collective sessions to grow together', badge: 'OPTION' },
      ],
      moreFeatures: [
        // (intentionally empty — all support options are visible by default)
      ],
    },
  ],
}

export default function WhyNowSection() {
  const { lang, t } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null)

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
                ? <>Ce qu&apos;Empire <span className="text-empire">crée pour vous</span> chaque mois</>
                : <>What Empire <span className="text-empire">creates for you</span> every month</>}
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              {autopilot
                ? t.autopilot.whyNow.subtitle
                : (fr
                    ? '15 min de parole par semaine. Le reste est automatisé.'
                    : '15 min of talking a week. The rest is automated.')}
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
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${f.badge ? 'bg-empire/8 border-empire/30 ring-1 ring-empire/20' : 'bg-empire/5 border-empire/15'}`}>
                          <div className="w-8 h-8 rounded-lg bg-empire/15 flex items-center justify-center flex-shrink-0">
                            <Icon className="text-empire" size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-white">{f.title}</p>
                              {f.badge && (
                                <span className="px-1.5 py-0.5 rounded-full bg-empire text-black text-[9px] font-black tracking-wider uppercase leading-none">{f.badge}</span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-400 mt-0.5">{f.desc}</p>
                          </div>
                          {f.value && (
                            <span className="text-xs font-bold text-neutral-500 line-through whitespace-nowrap">{f.value}</span>
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
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-semibold text-white">{f.title}</p>
                                      {f.badge && (
                                        <span className="px-1.5 py-0.5 rounded-full bg-empire text-black text-[9px] font-black tracking-wider uppercase leading-none">{f.badge}</span>
                                      )}
                                    </div>
                                    <p className="text-xs text-neutral-400 mt-0.5">{f.desc}</p>
                                  </div>
                                  {f.value && (
                                    <span className="text-xs font-bold text-neutral-500 line-through whitespace-nowrap">{f.value}</span>
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
                {fr ? '15 800€/mois' : '€15,800/mo'}
              </p>
            </div>
            <OnboardingLink
              className={`inline-flex flex-col items-center px-7 py-3.5 rounded-xl font-bold hover:scale-105 transition-all ${
                autopilot
                  ? 'bg-gradient-to-r from-autopilot to-autopilot text-black shadow-[0_0_30px_rgba(212,165,116,0.35)]'
                  : 'bg-empire text-black shadow-[0_0_30px_rgb(var(--empire-rgb)_/_0.25)]'
              }`}
            >
              <span className="text-lg">{autopilot
                ? t.autopilot.hero.cta1
                : (fr ? 'Essai gratuit 7 jours' : '7-day free trial')}</span>
              <span className="text-[11px] font-semibold opacity-70">{fr ? 'Sans engagement · Annulez en 1 clic' : 'No commitment · Cancel in 1 click'}</span>
            </OnboardingLink>

            {/* Creators strip */}
            <div className="mt-8">
              <p className="text-sm text-neutral-400 mb-2">
                {fr ? 'Un système inspiré des méthodes des créateurs qui dominent' : 'A system inspired by the methods of the creators who dominate'}
              </p>
              <p className="text-xs text-empire font-semibold mb-4">
                {fr ? 'Ils paient des équipes entières. Vous, non.' : 'They pay entire teams. You don\'t.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
                {(fr
                  ? [
                      { name: 'Yomi Denzel', revenue: '~€60K/mo', src: 'https://unavatar.io/x/YomiDenzel96' },
                      { name: 'Pauline Laigneau', revenue: '~€25K/mo', src: 'https://unavatar.io/x/plaigneau' },
                      { name: 'Stan Leloup', revenue: '~€30K/mo', src: 'https://unavatar.io/x/marketingstan' },
                      { name: 'Oussama Ammar', revenue: '~€35K/mo', src: 'https://unavatar.io/x/daedalium' },
                      { name: 'Antoine BM', revenue: '~€15K/mo', src: 'https://unavatar.io/x/antoinebm' },
                    ]
                  : [
                      { name: 'Grant Cardone', revenue: '~€100K/mo', src: '/creators/cardone.webp' },
                      { name: 'Alex Hormozi', revenue: '~€80K/mo', src: '/creators/hormozi.jpg' },
                      { name: 'Ali Abdaal', revenue: '~€75K/mo', src: '/creators/abdaal.webp' },
                      { name: 'Matt Gray', revenue: '~€60K/mo', src: '/creators/gray.jpg' },
                      { name: 'Chris Williamson', revenue: '~€70K/mo', src: '/creators/williamson.webp' },
                    ]
                ).map((creator) => (
                  <div
                    key={creator.name}
                    className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral-800 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={creator.src}
                        alt={creator.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] md:text-xs font-bold text-white group-hover:text-empire transition-colors whitespace-nowrap">{creator.name}</p>
                      <p className="text-[9px] md:text-[10px] text-neutral-400">{creator.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
