'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Scissors, Film, PenLine, Share2, Bot, ShieldCheck } from 'lucide-react'

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
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

export default function ContentMachineSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const services = [
    {
      icon: Scissors,
      title: fr ? 'On découpe vos interviews' : 'We cut your interviews',
      desc: fr
        ? 'Vos interviews caméra sont découpées en clips viraux, prêts à publier.'
        : 'Your camera interviews are cut into viral clips, ready to publish.',
    },
    {
      icon: Film,
      title: fr ? 'On monte vos Reels' : 'We edit your Reels',
      desc: fr
        ? "Montage pro avec hooks, sous-titres et transitions qui captent l'attention."
        : 'Pro editing with hooks, subtitles and transitions that grab attention.',
    },
    {
      icon: PenLine,
      title: fr ? 'On écrit vos posts & newsletters' : 'We write your posts & newsletters',
      desc: fr
        ? 'Posts LinkedIn, newsletters… rédigés avec votre voix, votre style. On trouve les sujets viraux pour vous.'
        : 'LinkedIn posts, newsletters… written in your voice, your style. We find viral topics for you.',
    },
    {
      icon: Share2,
      title: fr ? 'On multiplie sur tous les réseaux' : 'We multiply across all platforms',
      desc: fr
        ? 'Un contenu = LinkedIn, Instagram, TikTok, YouTube, X, Threads, Facebook. Partout, en même temps.'
        : 'One piece of content = LinkedIn, Instagram, TikTok, YouTube, X, Threads, Facebook. Everywhere, at the same time.',
    },
    {
      icon: Bot,
      title: 'Cerveau Empire',
      desc: fr
        ? 'Nos agents IA trouvent les sujets les plus viraux pour votre niche. Le format le plus simple pour créer du contenu.'
        : 'Our AI agents find the most viral topics for your niche. The simplest format to create content.',
    },
  ]

  return (
    <section className="relative w-full section-spacing bg-gradient-to-b from-black via-[#0a0a0a] to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgb(var(--empire-rgb)_/_0.06),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-3">
                {fr ? 'Votre content machine' : 'Your content machine'}
              </h2>
              <p className="text-lg md:text-xl text-neutral-400">
                {fr
                  ? "On s'occupe de tout. Vous, vous parlez."
                  : 'We handle everything. You just talk.'}
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.map((s, i) => (
              <FadeIn key={s.title} delay={0.05 * i}>
                <div
                  className={`group relative h-full p-5 sm:p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:border-empire/20 transition-all ${
                    i === services.length - 1 && services.length % 3 === 2
                      ? 'sm:col-span-2 lg:col-span-1'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-empire/10 border border-empire/20">
                      <s.icon size={18} className="text-empire" />
                    </div>
                    <h3 className="font-semibold text-white text-sm">{s.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-neutral-400">
              <ShieldCheck size={16} className="text-empire flex-shrink-0" />
              <span>
                {fr
                  ? 'Tous les contenus sont vérifiés et validés par des humains avant publication.'
                  : 'All content is verified and validated by humans before publishing.'}
              </span>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
