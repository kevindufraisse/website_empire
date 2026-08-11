'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { MessageSquare, GraduationCap, Compass, Check } from 'lucide-react'

const ZoomLogo = () => (
  <svg viewBox="0 0 32 32" className="h-5 w-5 flex-shrink-0" aria-label="Zoom" role="img">
    <circle cx="16" cy="16" r="16" fill="#2D8CFF" />
    <path
      d="M8.5 12.2c0-.66.54-1.2 1.2-1.2h7.4c1.1 0 2 .9 2 2v6.8c0 .66-.54 1.2-1.2 1.2h-7.4c-1.1 0-2-.9-2-2v-6.8zm12.1 2.6 2.6-1.9c.5-.37 1.2-.01 1.2.6v5c0 .61-.7.97-1.2.6l-2.6-1.9v-2.4z"
      fill="#fff"
    />
  </svg>
)

const MEMBERS = [
  { initials: 'ML', color: 'bg-blue-500/30 text-blue-300' },
  { initials: 'SB', color: 'bg-pink-500/30 text-pink-300' },
  { initials: 'JR', color: 'bg-purple-500/30 text-purple-300' },
  { initials: 'AC', color: 'bg-amber-500/30 text-amber-300' },
]

function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

/**
 * The accompaniment layer around the production machine. Lives are not where topics
 * come from — the Empire brain does that — they're where members get answers,
 * think out loud with experts and review what worked.
 */
export default function CommunitySection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()

  // Légende clients get a dedicated expert, not group sessions.
  if (autopilot) return null

  const fr = lang === 'fr'

  const cards = [
    {
      key: 'community',
      icon: MessageSquare,
      title: fr ? 'La communauté privée Slack' : 'The private Slack community',
      desc: fr
        ? 'Des fondateurs et des créateurs qui publient déjà. Une accroche à tester, un post qui ne décolle pas, un angle qui vous gêne : vous avez un avis dans l\'heure au lieu de tourner en rond pendant une semaine.'
        : 'Founders and creators who already publish. A hook to test, a post that flopped, an angle you\'re unsure about: you get an opinion within the hour instead of circling for a week.',
      badge: fr ? 'DÈS INTERMÉDIAIRE' : 'FROM INTERMEDIATE',
    },
    {
      key: 'replays',
      icon: GraduationCap,
      title: fr ? 'Les replays masterclass' : 'Masterclass replays',
      desc: fr
        ? 'Tout le système Empire en vidéo : accroches, structures, formats, distribution. Vous rattrapez ce que vous avez manqué et vous formez votre équipe avec (valeur 197 €).'
        : 'The whole Empire system on video: hooks, structures, formats, distribution. Catch up on what you missed and train your team with it (€197 value).',
      badge: fr ? 'DÈS INTERMÉDIAIRE' : 'FROM INTERMEDIATE',
    },
    {
      key: 'review',
      icon: Compass,
      title: fr ? 'La revue stratégique mensuelle' : 'Monthly strategy review',
      desc: fr
        ? 'Un expert reprend vos chiffres du mois en vidéo Loom : ce qui a marché, ce qu\'il faut arrêter, et les deux ou trois choses à changer le mois suivant.'
        : 'An expert walks through your month\'s numbers on Loom: what worked, what to stop, and the two or three things to change next month.',
      badge: fr ? 'DÈS EXPERT' : 'FROM EXPERT',
    },
  ]

  return (
    <section id="community" className="relative w-full py-16 md:py-24 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgb(var(--empire-rgb)_/_0.07),transparent)]" />

      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10 md:mb-12">
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-empire/10 border border-empire/30">
                <p className="text-sm font-bold text-empire">
                  {fr ? 'COMMUNAUTÉ & LIVES' : 'COMMUNITY & LIVES'}
                </p>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {fr ? (
                  <>Vous n'installez pas ce système <span className="text-empire">tout seul</span></>
                ) : (
                  <>You don't install this system <span className="text-empire">on your own</span></>
                )}
              </h2>
              <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto">
                {fr
                  ? 'La production, notre équipe s\'en charge. Le reste — vos questions, vos doutes, vos chiffres — se règle chaque semaine avec nos experts et les autres membres.'
                  : 'Our team handles production. Everything else — your questions, your doubts, your numbers — gets sorted every week with our experts and the other members.'}
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-5 lg:grid-cols-5">
            {/* Weekly live — the anchor of the section, so it gets the wide card. */}
            <FadeIn delay={0.1} className="lg:col-span-2">
              <div className="h-full flex flex-col rounded-2xl border border-empire/30 bg-gradient-to-br from-empire/10 to-white/[0.02] p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-red-400 tracking-wider uppercase">Live</span>
                  </div>
                  <span className="text-xs text-neutral-400 font-medium">
                    {fr ? '47 en ligne' : '47 online'}
                  </span>
                </div>

                <div className="flex -space-x-3 mb-5">
                  <img
                    src="/founders/kevin.jpg"
                    alt="Kevin Dufraisse"
                    className="w-11 h-11 rounded-full object-cover object-top border-2 border-empire ring-2 ring-black"
                    loading="lazy"
                  />
                  {MEMBERS.map((m) => (
                    <div
                      key={m.initials}
                      className={`w-11 h-11 rounded-full ${m.color} border-2 border-white/20 ring-2 ring-black flex items-center justify-center text-[11px] font-bold`}
                    >
                      {m.initials}
                    </div>
                  ))}
                  <div className="w-11 h-11 rounded-full bg-white/10 border-2 border-white/20 ring-2 ring-black flex items-center justify-center text-[11px] font-bold text-neutral-300">
                    +42
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.06] border border-white/15 mb-5 w-fit">
                  <ZoomLogo />
                  <p className="text-xs text-neutral-300 font-medium">
                    {fr ? 'Chaque semaine sur Zoom · 1h' : 'Every week on Zoom · 1h'}
                  </p>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  {fr ? 'Le live hebdomadaire' : 'The weekly live'}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {fr
                    ? 'Ce n\'est pas un cours. Vous arrivez avec vos questions et Kevin ou l\'un de nos experts est en face de vous, en direct.'
                    : 'It\'s not a lecture. You show up with your questions and Kevin or one of our experts is live in front of you.'}
                </p>
                <ul className="mt-4 space-y-2">
                  {(fr
                    ? [
                        'Vos questions traitées à chaud',
                        'Vos contenus de la semaine décortiqués',
                        'Vos prochains angles trouvés ensemble',
                      ]
                    : [
                        'Your questions answered on the spot',
                        'Your week\'s content pulled apart',
                        'Your next angles worked out together',
                      ]
                  ).map((line) => (
                    <li key={line} className="flex items-start gap-2 text-sm text-neutral-300">
                      <Check className="text-empire flex-shrink-0 mt-0.5" size={15} />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-4 text-[10px] font-bold uppercase tracking-wider text-empire/70">
                  {fr ? 'DÈS INTERMÉDIAIRE' : 'FROM INTERMEDIATE'}
                </p>
              </div>
            </FadeIn>

            <div className="lg:col-span-3 grid gap-5">
              {cards.map((c, i) => (
                <FadeIn key={c.key} delay={0.15 + i * 0.08} className="h-full">
                  <div className="h-full flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5 hover:border-empire/30 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-empire/15 border border-empire/30">
                        <c.icon className="text-empire" size={17} />
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug">{c.title}</h3>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">{c.desc}</p>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-empire/70">
                      {c.badge}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
