'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import {
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
  Sparkles,
  Send,
  HeadphonesIcon,
  MessageCircle,
  GraduationCap,
  Share2,
  Globe,
  Palette,
  ArrowRight,
} from 'lucide-react'

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

type Feature = { icon: React.ComponentType<{ className?: string; size?: number }>; title: string; desc: string; badge?: string }

type Pillar = {
  id: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  label: string
  features: Feature[]
}

const pillars: Record<string, Pillar[]> = {
  fr: [
    {
      id: 'contenu',
      icon: Sparkles,
      label: 'Contenu',
      features: [
        { icon: FileText, title: 'Posts LinkedIn', desc: 'Rédigés, optimisés et planifiés. Ajout automatique de vos lead magnets.' },
        { icon: Video, title: 'Reels & Shorts', desc: 'Hooks, sous-titres et transitions. Option sans caméra.' },
        { icon: Mail, title: 'Newsletters', desc: 'Qui sonnent comme vous, en mieux.' },
        { icon: Palette, title: 'Personnalisation complète', desc: 'Sous-titres (45 styles), transitions, vos couleurs, vos b-rolls, votre branding.' },
        { icon: Globe, title: 'Multilingue : FR, EN, ES', desc: 'Tous vos contenus dans 3 langues.' },
        { icon: ImageIcon, title: 'Carrousels', desc: 'Générés depuis vos posts pour LinkedIn + Instagram.' },
        { icon: ImageIcon, title: 'Miniatures', desc: 'Création des miniatures pour Instagram, YouTube et LinkedIn.' },
        { icon: Bot, title: 'Cerveau Empire', desc: 'Nos agents IA trouvent les sujets les plus viraux pour votre niche.' },
      ],
    },
    {
      id: 'distribution',
      icon: Send,
      label: 'Distribution',
      features: [
        { icon: Share2, title: '7 réseaux en même temps', desc: 'LinkedIn, Instagram, TikTok, YouTube, X, Threads, Facebook.' },
        { icon: Calendar, title: 'Publiez en 1 clic', desc: 'Tout est prêt dans votre calendrier.' },
        { icon: Users, title: 'Employee Advocacy', desc: 'Faites publier vos employés automatiquement.' },
        { icon: MessageCircle, title: 'Idées via Telegram', desc: 'Ajoutez vos idées depuis Telegram et récupérez-les dans Empire.', badge: 'NEW' },
        { icon: Code2, title: 'Multi-comptes', desc: 'Compte perso + entreprise, plusieurs marques depuis la même plateforme.' },
        { icon: Zap, title: '+10 tunnels de conversion', desc: 'N8N, Make, ManyChat — prêts à dupliquer pour convertir votre audience.' },
        { icon: Mail, title: 'Substack automatique', desc: 'Vos notes publiées automatiquement sur Substack.' },
        { icon: Users, title: 'Diffusion Skool', desc: 'Contenu partagé automatiquement dans votre communauté Skool.' },
        { icon: Zap, title: 'Deeplinks de tracking', desc: 'Liens trackés pour mesurer la performance de chaque contenu.' },
        { icon: Code2, title: 'API & Automations', desc: 'Connectez Empire à vos outils (Notion, Airtable, Google Drive).' },
      ],
    },
    {
      id: 'accompagnement',
      icon: HeadphonesIcon,
      label: 'Accompagnement',
      features: [
        { icon: UserCheck, title: 'Équipe humaine dédiée', desc: 'De vrais humains créent et vérifient chaque contenu.' },
        { icon: GraduationCap, title: 'Coaching dédié', desc: 'Un coach comprend votre business et vous forme aux formats qui performent.', badge: 'OPTION' },
        { icon: GraduationCap, title: 'Bootcamp viralité', desc: '21 jours pour maîtriser la viralité et exécuter les formats qui performent.', badge: 'DÈS SCALE' },
        { icon: Users, title: 'Communauté privée', desc: 'Réseau de fondateurs et créateurs.', badge: 'DÈS GROWTH' },
        { icon: Mic, title: 'Lives de groupe', desc: 'Sessions collectives pour progresser ensemble.', badge: 'DÈS SCALE' },
      ],
    },
  ],
  en: [
    {
      id: 'contenu',
      icon: Sparkles,
      label: 'Content',
      features: [
        { icon: FileText, title: 'LinkedIn posts', desc: 'Written, optimized, scheduled. Auto-embed your lead magnets.' },
        { icon: Video, title: 'Reels & Shorts', desc: 'Hooks, subtitles and transitions. No-camera option.' },
        { icon: Mail, title: 'Newsletters', desc: 'Sound like you, but better.' },
        { icon: Palette, title: 'Full customization', desc: 'Subtitles (45 styles), transitions, your colors, your b-rolls, your branding.' },
        { icon: Globe, title: 'Multilingual: FR, EN, ES', desc: 'All your content in 3 languages.' },
        { icon: ImageIcon, title: 'Carousels', desc: 'Generated from your posts for LinkedIn + Instagram.' },
        { icon: ImageIcon, title: 'Thumbnails', desc: 'Custom thumbnails for Instagram, YouTube and LinkedIn.' },
        { icon: Bot, title: 'Empire Brain', desc: 'Our AI agents find the most viral topics for your niche.' },
      ],
    },
    {
      id: 'distribution',
      icon: Send,
      label: 'Distribution',
      features: [
        { icon: Share2, title: '7 platforms at once', desc: 'LinkedIn, Instagram, TikTok, YouTube, X, Threads, Facebook.' },
        { icon: Calendar, title: 'Publish in 1 click', desc: 'Everything ready in your calendar.' },
        { icon: Users, title: 'Employee Advocacy', desc: 'Get your employees publishing automatically.' },
        { icon: MessageCircle, title: 'Ideas via Telegram', desc: 'Add your ideas from Telegram and retrieve them in Empire.', badge: 'NEW' },
        { icon: Code2, title: 'Multi-account', desc: 'Personal + business, multiple brands from the same platform.' },
        { icon: Zap, title: '10+ conversion funnels', desc: 'N8N, Make, ManyChat — ready to duplicate and convert your audience.' },
        { icon: Mail, title: 'Auto Substack', desc: 'Your notes automatically published on Substack.' },
        { icon: Users, title: 'Skool distribution', desc: 'Content automatically shared in your Skool community.' },
        { icon: Zap, title: 'Tracking deeplinks', desc: 'Tracked links to measure each content performance.' },
        { icon: Code2, title: 'API & Automations', desc: 'Connect Empire to your tools (Notion, Airtable, Google Drive).' },
      ],
    },
    {
      id: 'accompagnement',
      icon: HeadphonesIcon,
      label: 'Support',
      features: [
        { icon: UserCheck, title: 'Dedicated human team', desc: 'Real humans create and review every piece of content.' },
        { icon: GraduationCap, title: 'Dedicated coaching', desc: 'A dedicated coach understands your business and trains you on performing formats.', badge: 'OPTION' },
        { icon: GraduationCap, title: 'Virality bootcamp', desc: '21 days to master virality and execute the formats that perform.', badge: 'FROM SCALE' },
        { icon: Users, title: 'Private community', desc: 'Founder & creator network.', badge: 'FROM GROWTH' },
        { icon: Mic, title: 'Group live sessions', desc: 'Collective sessions to grow together.', badge: 'FROM SCALE' },
      ],
    },
  ],
}

export default function WhyNowSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'

  if (autopilot) return null

  const currentPillars = pillars[fr ? 'fr' : 'en']

  return (
    <section id="features" className="relative w-full py-16 md:py-28 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgb(var(--empire-rgb)_/_0.06),transparent)]" />

      <div className="container relative z-10 max-w-6xl mx-auto">

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
              {fr
                ? '15 min de parole par semaine. Le reste est automatisé.'
                : '15 min of talking a week. The rest is automated.'}
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {currentPillars.map((pillar, pi) => {
            const PillarIcon = pillar.icon

            return (
              <FadeIn key={pillar.id} delay={pi * 0.1}>
                <div className="relative h-full rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                  <div className="p-5 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-empire/15 flex items-center justify-center">
                        <PillarIcon className="text-empire" size={16} />
                      </div>
                      <h3 className="text-lg font-bold text-white">{pillar.label}</h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    {pillar.features.map((f, i) => {
                      const Icon = f.icon
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-empire/5 border border-empire/15">
                          <div className="w-7 h-7 rounded-lg bg-empire/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon className="text-empire" size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-white">{f.title}</p>
                              {f.badge && (
                                <span className="px-1.5 py-0.5 rounded-full bg-empire text-black text-[9px] font-black tracking-wider uppercase leading-none">{f.badge}</span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-400 mt-0.5">{f.desc}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>

        <FadeIn delay={0.3}>
          <div className="text-center">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold hover:scale-105 transition-all bg-empire text-black shadow-[0_0_30px_rgb(var(--empire-rgb)_/_0.25)] text-lg"
            >
              {fr ? 'Voir les tarifs' : 'See pricing'}
              <ArrowRight size={20} />
            </a>
            <p className="mt-3 text-xs text-neutral-500">
              {fr ? '7 jours d\'essai gratuit · Sans engagement' : '7-day free trial · No commitment'}
            </p>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
