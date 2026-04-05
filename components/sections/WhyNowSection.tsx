'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { useCalLink } from '@/hooks/useCalLink'

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

export default function WhyNowSection() {
  const { lang } = useLanguage()
  const namespace = 'audit-empire'
  const calLink = useCalLink()

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

  const fr = lang === 'fr'

  return (
    <section className="relative w-full py-16 md:py-28 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(218,252,104,0.06),transparent)]" />

      <div className="container relative z-10 max-w-5xl mx-auto">

        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-empire/10 border border-empire/20 text-empire text-xs font-semibold tracking-wider uppercase mb-4">
              {fr ? 'Pourquoi maintenant ?' : 'Why now?'}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {fr
                ? <>L&apos;IA a rendu les compétences <span className="text-empire">ordinaires.</span><br />Votre marque, elle, est irremplaçable.</>
                : <>AI has made skills <span className="text-empire">ordinary.</span><br />Your personal brand is irreplaceable.</>}
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              {fr
                ? 'Quand tout le monde peut tout faire avec l\'IA, la seule chose qui différencie est la confiance que vous inspirez - et la communauté que vous avez construite.'
                : 'When anyone can do anything with AI, the only differentiator is the trust you inspire - and the community you\'ve built.'}
            </p>
          </div>
        </FadeIn>

        {/* 3-column argument */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">

            {/* Card 1 - Le problème */}
            <div className="rounded-xl p-6 bg-white/[0.03] border border-white/10">
              <span className="inline-flex w-7 h-7 rounded-md bg-white/10 items-center justify-center text-white font-bold text-sm mb-3">1</span>
              <h3 className="font-semibold text-white mb-2">
                {fr ? 'Les compétences se commoditisent' : 'Skills are being commoditized'}
              </h3>
              <p className="text-sm text-neutral-400">
                {fr
                  ? 'Un développeur, un designer, un copywriter - l\'IA fait tout ça. Ce qui compte maintenant, c\'est qui vous êtes, pas ce que vous savez faire.'
                  : 'A developer, designer, copywriter - AI does all of it. What matters now is who you are, not what you can do.'}
              </p>
            </div>

            {/* Card 2 - La vérité */}
            <div className="rounded-xl p-6 bg-empire/5 border border-empire/20">
              <span className="inline-flex w-7 h-7 rounded-md bg-empire items-center justify-center text-black font-bold text-sm mb-3">2</span>
              <h3 className="font-semibold text-white mb-2">
                {fr ? 'Confiance + Communauté = le seul moat' : 'Trust + Community = the only moat'}
              </h3>
              <p className="text-sm text-neutral-400">
                {fr
                  ? 'Les entrepreneurs qui vont dominer leur marché dans 3 ans sont ceux qui construisent leur audience et leur autorité aujourd\'hui.'
                  : 'The entrepreneurs who will dominate their market in 3 years are those building their audience and authority today.'}
              </p>
            </div>

            {/* Card 3 - L'urgence */}
            <div className="rounded-xl p-6 bg-white/[0.03] border border-white/10">
              <span className="inline-flex w-7 h-7 rounded-md bg-white/10 items-center justify-center text-white font-bold text-sm mb-3">3</span>
              <h3 className="font-semibold text-white mb-2">
                {fr ? 'Vos concurrents commencent déjà' : 'Your competitors are already starting'}
              </h3>
              <p className="text-sm text-neutral-400">
                {fr
                  ? 'Chaque semaine sans contenu est une semaine où quelqu\'un d\'autre prend votre place dans l\'esprit de vos prospects.'
                  : 'Every week without content is a week where someone else takes your place in your prospects\' minds.'}
              </p>
            </div>

          </div>
        </FadeIn>

        {/* CTA centré */}
        <FadeIn delay={0.2}>
          <div className="text-center">
            <p className="text-neutral-500 text-sm mb-4">
              {fr ? 'Plus vous attendez, plus c\'est long à rattraper.' : 'The longer you wait, the longer it takes to catch up.'}
            </p>
            <button
              data-cal-namespace={namespace}
              data-cal-link={calLink}
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-empire text-black font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(218,252,104,0.25)]"
            >
              {fr ? 'Commencer maintenant' : 'Start now'}
              <ArrowRight size={18} />
            </button>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
