'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { User, Users, Check, ArrowRight } from 'lucide-react'
import BorderBeam from '@/components/magicui/border-beam'
import AcademyWaitlistCta from '@/components/AcademyWaitlistCta'
import { ACADEMY_ENTRY_PRICE } from '@/lib/cohort-config'
import { useLanguage } from '@/contexts/LanguageContext'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function AcademyTwoPathsSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const path1 = {
    icon: User,
    tag: fr ? 'Option 1 - Vous avez un projet' : 'Option 1 - You have a project',
    title: fr ? 'Vous communiquez pour vous' : 'You create content for yourself',
    desc: fr
      ? "Vous utilisez les compétences du bootcamp pour développer votre propre audience et générer vos clients."
      : "You use the bootcamp skills to grow your own audience and generate clients.",
    perks: fr
      ? [
          'Vous maîtrisez les mécaniques de la viralité',
          'Vous savez créer vos hooks, posts et shorts',
          'Vous construisez votre audience et générez vos clients',
          'Accès à vie aux replays',
        ]
      : [
          'You master the mechanics of virality',
          'You know how to create hooks, posts and shorts',
          'You build your audience and generate clients',
          'Lifetime access to replays',
        ],
  }

  const path2 = {
    icon: Users,
    tag: fr ? 'Option 2 - Pas de projet ?' : 'Option 2 - No project?',
    title: fr ? 'Vous communiquez pour Empire' : 'You create content for Empire',
    desc: fr
      ? "On vous trouve les clients. On vous crée le contenu. Vous coachez et vous êtes payé. Pas besoin d'avoir un projet à vous."
      : "We find the clients for you. We create the content. You coach and get paid. No need for your own project.",
    perks: fr
      ? [
          'On vous trouve les clients',
          'On vous crée votre contenu chaque jour',
          '500€ par mission - ~4h de coaching',
          'Objectif : 3 000€/mois en 4h/semaine',
        ]
      : [
          'We find clients for you',
          'We create your content every day',
          '€500 per mission - ~4h of coaching',
          'Goal: €3,000/month in 4h/week',
        ],
  }
  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-[#0f0f0f] to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(252, 165, 165,0.04),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">

          <FadeInBlock>
            <div className="text-center mb-14">
              <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">{fr ? 'Même sans projet' : 'Even without a project'}</p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                {fr ? '2 voies possibles.' : '2 possible paths.'}{' '}
                <span className="text-academy">{fr ? 'Vous choisissez.' : 'You choose.'}</span>
              </h2>
              <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto">
                {fr ? "Vous avez un projet ? Vous communiquez dessus. Vous n'en avez pas ? Vous communiquez pour Empire et on vous paye." : "Have a project? Create content for it. Don't have one? Create content for Empire and get paid."}
              </p>
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.1}>
            <div className="grid md:grid-cols-2 gap-6">

              {/* Option 1 - Solo */}
              <div className="relative h-full p-7 md:p-8 rounded-2xl bg-gradient-to-br from-white/8 to-white/[0.02] border border-white/10 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <path1.icon className="text-neutral-300" size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase block">{path1.tag}</span>
                    <h3 className="text-lg font-bold text-white">{path1.title}</h3>
                  </div>
                </div>
                <p className="text-neutral-400 text-sm mb-6 leading-relaxed">{path1.desc}</p>
                <div className="flex-1 space-y-2.5">
                  {path1.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="text-neutral-400 flex-shrink-0 mt-0.5" size={14} />
                      <span className="text-neutral-300 text-sm">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Option 2 - Partenaire Empire */}
              <div className="relative h-full p-7 md:p-8 rounded-2xl bg-gradient-to-br from-academy/15 to-academy/5 border border-academy/40 shadow-[0_0_40px_rgba(252, 165, 165,0.1)] flex flex-col overflow-hidden">
                <BorderBeam size={300} duration={9} />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-academy/20 border border-academy/40 flex items-center justify-center">
                        <path2.icon className="text-academy" size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-academy/70 tracking-widest uppercase block">{path2.tag}</span>
                        <h3 className="text-lg font-bold text-academy">{path2.title}</h3>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-black bg-academy rounded-full px-2.5 py-1 leading-none">
                      {fr ? 'RECOMMANDÉ' : 'RECOMMENDED'}
                    </span>
                  </div>
                  <p className="text-neutral-300 text-sm mb-6 leading-relaxed">{path2.desc}</p>
                  <div className="flex-1 space-y-2.5">
                    {path2.perks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Check className="text-academy flex-shrink-0 mt-0.5" size={14} />
                        <span className="text-white text-sm font-medium">{perk}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-black/30 border border-academy/20">
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      <span className="text-academy font-semibold">{fr ? 'Les missions :' : 'The missions:'}</span> {fr ? "4h de coaching/mois avec un client Empire. Vous lui apprenez le système qu'on vous a enseigné. On s'occupe du closing et de la delivery." : "4h of coaching/month with an Empire client. You teach them the system we taught you. We handle closing and delivery."}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.2}>
            <div className="mt-10 text-center">
              <AcademyWaitlistCta
                source="two-paths"
                className="inline-flex items-center gap-2 px-8 py-4 bg-academy text-black font-bold text-lg rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(252,165,165,0.3)]"
                sublabel={
                  <p className="text-xs text-neutral-400 mt-2">
                    {fr ? `Places limitées · à partir de ${ACADEMY_ENTRY_PRICE}€` : `Limited spots · from €${ACADEMY_ENTRY_PRICE}`}
                  </p>
                }
              >
                {fr ? 'Rejoindre la liste d\'attente' : 'Join the waitlist'} <ArrowRight size={18} />
              </AcademyWaitlistCta>
            </div>
          </FadeInBlock>

        </div>
      </div>
    </section>
  )
}
