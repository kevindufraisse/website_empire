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
    tag: fr ? 'Voie 1' : 'Path 1',
    title: fr ? 'Votre propre projet' : 'Your own project',
    desc: fr
      ? 'Vous utilisez le système pour développer votre audience et générer vos propres clients.'
      : 'You use the system to grow your audience and generate your own clients.',
    perks: fr
      ? [
          'Vous maîtrisez les mécaniques de la viralité',
          'Vous savez créer hooks, posts et Reels',
          'Vous construisez votre audience',
          'Accès à vie aux replays',
        ]
      : [
          'You master the mechanics of virality',
          'You know how to create hooks, posts and Reels',
          'You build your own audience',
          'Lifetime access to replays',
        ],
  }

  const path2 = {
    icon: Users,
    tag: fr ? 'Voie 2' : 'Path 2',
    title: 'Empire Partners',
    desc: fr
      ? 'Vous travaillez avec des clients apportés par Empire. Notre équipe s\'occupe de la production. Vous vous concentrez sur l\'accompagnement stratégique.'
      : 'You work with clients brought by Empire. Our team handles production. You focus on strategic coaching.',
    perks: fr
      ? [
          'Empire vous apporte les missions',
          'Notre équipe prend en charge la production',
          '500\u202F€ / mission · ~4h de coaching',
          'Objectif : 3\u202F000\u202F€/mois avec 4h/semaine',
        ]
      : [
          'Empire brings you the missions',
          'Our team handles production',
          '€500 / mission · ~4h of coaching',
          'Goal: €3,000/month with 4h/week',
        ],
  }

  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-[#0f0f0f] to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(252, 165, 165,0.04),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">
          <FadeInBlock>
            <div className="text-center mb-6">
              <p className="text-sm text-academy mb-3 tracking-widest uppercase font-bold">
                {fr ? 'Monétisation' : 'Monetization'}
              </p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                {fr
                  ? 'Et si vous n\'aviez même pas besoin de trouver vos premiers clients ?'
                  : 'What if you didn\'t even need to find your first clients?'}
              </h2>
              <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto">
                {fr
                  ? 'Vous n\'avez pas encore de projet à communiquer ? Ce n\'est pas un problème. Deux façons de rentabiliser la compétence.'
                  : 'Don\'t have a project to communicate yet? That\'s fine. Two ways to monetize the skill.'}
              </p>
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.1}>
            <div className="grid md:grid-cols-2 gap-6">
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
                  {path1.perks.map((perk) => (
                    <div key={perk} className="flex items-start gap-2.5">
                      <Check className="text-neutral-400 flex-shrink-0 mt-0.5" size={14} />
                      <span className="text-neutral-300 text-sm">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

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
                      {fr ? 'DIFFÉRENCIANT' : 'DIFFERENTIATOR'}
                    </span>
                  </div>
                  <p className="text-neutral-300 text-sm mb-6 leading-relaxed">{path2.desc}</p>
                  <div className="flex-1 space-y-2.5">
                    {path2.perks.map((perk) => (
                      <div key={perk} className="flex items-start gap-2.5">
                        <Check className="text-academy flex-shrink-0 mt-0.5" size={14} />
                        <span className="text-white text-sm font-medium">{perk}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-black/30 border border-academy/20">
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {fr
                        ? 'Après votre certification, vous pouvez rejoindre le réseau Empire Partners. On trouve les clients. Vous accompagnez. On produit.'
                        : 'After certification, you can join the Empire Partners network. We find clients. You coach. We produce.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.2}>
            <p className="mt-8 text-center text-sm text-neutral-400 max-w-xl mx-auto">
              {fr
                ? 'Vous apprenez une compétence que vous pouvez utiliser immédiatement - avec ou sans audience.'
                : 'You learn a skill you can use immediately - with or without an audience.'}
            </p>
            <div className="mt-8 text-center">
              <AcademyWaitlistCta
                source="two-paths"
                className="inline-flex items-center gap-2 px-8 py-4 bg-academy text-black font-bold text-lg rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(252,165,165,0.3)]"
                sublabel={
                  <p className="text-xs text-neutral-400 mt-2">
                    {fr
                      ? `30 secondes · 20 places · Sur sélection · ${ACADEMY_ENTRY_PRICE}\u202F€`
                      : `30 seconds · 20 spots · By selection · €${ACADEMY_ENTRY_PRICE}`}
                  </p>
                }
              >
                {fr ? 'Candidater à la prochaine promotion' : 'Apply to the next cohort'} <ArrowRight size={18} />
              </AcademyWaitlistCta>
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}
