'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import OnboardingLink from '@/components/OnboardingLink'
import { ArrowRight, Clock, FlaskConical, GraduationCap, Cpu, Users, Layers } from 'lucide-react'

export default function WhyEmpireSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const cascadeSteps = fr
    ? [
        { icon: Layers, stat: '1 an', label: 'pour créer le système de cascade', desc: 'Une action de votre part se transforme en dizaines de contenus sur 7 réseaux. Cet effet de levier a nécessité 1 an de développement.' },
        { icon: Users, stat: '8 mois', label: 'pour former les équipes production', desc: 'Nos monteurs, rédacteurs et community managers sont formés aux formats viraux. Pas des freelances génériques.' },
        { icon: FlaskConical, stat: '+10 000', label: 'posts testés avant de trouver les formats', desc: 'Des milliers de contenus analysés, optimisés, jetés. Chaque format dans Empire est le résultat de tests massifs.' },
        { icon: GraduationCap, stat: '+20 000€', label: 'investis en formation algorithmes', desc: 'Suivi par Kevin Dufraisse (48e influenceur LinkedIn France). Notre compréhension des algorithmes n\'est pas théorique.' },
        { icon: Cpu, stat: 'En continu', label: 'nouveaux formats détectés et intégrés', desc: 'Les formats qui marchent changent chaque mois. Nos agents IA et notre équipe identifient et intègrent les tendances en temps réel.' },
        { icon: Clock, stat: '1h/mois', label: 'c\'est tout ce qu\'on vous demande', desc: 'Vous parlez, on transforme. Le système fait le reste : rédaction, montage, sous-titrage, planification, publication.' },
      ]
    : [
        { icon: Layers, stat: '1 year', label: 'to build the cascade system', desc: 'One action from you turns into dozens of content pieces on 7 platforms. This leverage took 1 year to develop.' },
        { icon: Users, stat: '8 months', label: 'to train the production teams', desc: 'Our editors, writers and community managers are trained on viral formats. Not generic freelancers.' },
        { icon: FlaskConical, stat: '10,000+', label: 'posts tested to find the right formats', desc: 'Thousands of contents analyzed, optimized, discarded. Every format in Empire is the result of massive testing.' },
        { icon: GraduationCap, stat: '€20,000+', label: 'invested in algorithm training', desc: 'Led by Kevin Dufraisse (48th LinkedIn influencer in France). Our understanding of algorithms isn\'t theoretical.' },
        { icon: Cpu, stat: 'Ongoing', label: 'new formats detected and integrated', desc: 'Winning formats change every month. Our AI agents and team identify and integrate trends in real time.' },
        { icon: Clock, stat: '1h/mo', label: 'that\'s all we ask from you', desc: 'You talk, we transform. The system handles the rest: writing, editing, subtitling, scheduling, publishing.' },
      ]

  return (
    <section className="relative w-full py-16 md:py-28 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.06),transparent)]" />

      <div ref={ref} className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-2 rounded-full bg-empire/10 border border-empire/30 mb-4">
            <p className="text-sm font-bold text-empire">
              {fr ? 'POURQUOI EMPIRE' : 'WHY EMPIRE'}
            </p>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-3xl mx-auto mb-3">
            {fr ? (
              <>
                ChatGPT ecrit un post en 30 secondes.{' '}
                <span className="text-empire">Empire transforme 1h de parole en un mois de contenus sur 7 reseaux.</span>
              </>
            ) : (
              <>
                ChatGPT writes a post in 30 seconds.{' '}
                <span className="text-empire">Empire turns 1h of talking into a month of content on 7 platforms.</span>
              </>
            )}
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            {fr
              ? 'L\'IA generative resout 20% du probleme. Voici ce qu\'il a fallu construire pour les 80% restants :'
              : 'Generative AI solves 20% of the problem. Here\'s what it took to build the other 80%:'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {cascadeSteps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-empire/15 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-empire" />
                  </div>
                  <span className="text-xl font-black text-empire">{step.stat}</span>
                </div>
                <p className="text-sm font-bold text-white mb-1">{step.label}</p>
                <p className="text-[13px] text-neutral-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-12"
        >
          <p className="text-center text-sm font-bold text-neutral-500 uppercase tracking-wider mb-6">
            {fr ? 'Votre équipe dédiée' : 'Your dedicated team'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { name: 'Manon', seed: 'ManonEmpireCOO', role: 'COO', desc: fr ? 'Opérations et coordination de votre production' : 'Operations and production coordination' },
              { name: 'Pierre', seed: 'PierreEmpireContent', role: 'Head of Content', desc: fr ? 'Rédaction, positionnement et stratégie éditoriale' : 'Writing, positioning and editorial strategy' },
              { name: 'Chloé', seed: 'ChloeEmpireProd', role: 'Head of Production', desc: fr ? 'Montage, sous-titrage et qualité visuelle' : 'Editing, subtitling and visual quality' },
              { name: 'Marc', seed: 'MarcEmpireViral', role: fr ? 'Head of Viralité' : 'Head of Virality', desc: fr ? 'Formats, hooks et optimisation algorithmique' : 'Formats, hooks and algorithm optimization' },
              { name: 'Stan', seed: 'StanEmpireVirality', role: 'Virality Expert', desc: fr ? 'Analyse des tendances et formats performants' : 'Trend analysis and high-performing formats' },
              { name: 'Sébastien', seed: 'SebastienEmpireProd', role: fr ? 'Équipe Production' : 'Production Team', desc: fr ? 'Montage vidéo et post-production' : 'Video editing and post-production' },
              { name: 'Zahia', seed: 'ZahiaEmpireProd', role: fr ? 'Équipe Production' : 'Production Team', desc: fr ? 'Création de contenus et adaptation multi-plateformes' : 'Content creation and multi-platform adaptation' },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.08 }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.dicebear.com/9.x/notionists/svg?seed=${member.seed}&backgroundColor=transparent`}
                  alt={member.name}
                  className="w-14 h-14 rounded-full mx-auto mb-2 bg-empire/10"
                  loading="lazy"
                />
                <p className="text-sm font-bold text-white">{member.name}</p>
                <p className="text-[11px] font-semibold text-empire mb-1">{member.role}</p>
                <p className="text-[11px] text-neutral-500 leading-snug">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center"
        >
          <p className="text-[13px] text-neutral-500 italic max-w-2xl mx-auto mb-8">
            {fr
              ? 'Pas besoin de recruter, former ou manager une équipe contenu. La nôtre est déjà formée, déjà rodée, et travaille sur votre marque dès le premier jour.'
              : 'No need to hire, train or manage a content team. Ours is already trained, already battle-tested, and works on your brand from day one.'}
          </p>

          <OnboardingLink className="inline-flex flex-col items-center px-8 py-4 rounded-2xl bg-empire text-black font-bold text-base md:text-lg hover:scale-[1.03] active:scale-100 transition-all shadow-[0_0_40px_rgb(var(--empire-rgb)_/_0.4)]">
            <span className="flex items-center gap-2">
              {fr ? 'Commencer gratuitement' : 'Start for free'}
              <ArrowRight size={20} />
            </span>
            <span className="text-[11px] font-semibold opacity-70">{fr ? 'Sans engagement · Annulez en 1 clic' : 'No commitment · Cancel in 1 click'}</span>
          </OnboardingLink>
        </motion.div>

      </div>
    </section>
  )
}
