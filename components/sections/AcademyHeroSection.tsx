'use client'
import { motion } from 'framer-motion'
import RetroGrid from '@/components/magicui/retro-grid'
import { Meteors } from '@/components/magicui/meteors'
import { SparklesText } from '@/components/magicui/sparkles-text'

import AcademyWaitlistCta from '@/components/AcademyWaitlistCta'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AcademyHeroSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  return (
    <section className="relative w-full pt-20 md:pt-24 pb-20 md:pb-28 overflow-hidden bg-gradient-to-b from-black via-transparent to-[#0f0f0f]">
      <RetroGrid />
      <Meteors number={12} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(252, 165, 165,0.12),transparent)]" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center mb-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-academy/10 border border-academy/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-academy opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-academy" />
              </span>
              <span className="text-xs text-academy font-bold">
                {fr
                  ? '21 jours · 1 défi par jour · Une certification'
                  : '21 days · 1 challenge a day · One certification'}
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5"
          >
            {fr ? 'Devenez ' : 'Become '}{' '}
            <SparklesText className="text-academy" sparklesCount={7} colors={{ first: '#fca5a5', second: '#f87171' }}>
              {fr ? 'Head of Viralité' : 'Head of Virality'}
            </SparklesText>
            {fr ? ' en 21 jours.' : ' in 21 days.'}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl mx-auto mb-6 space-y-3"
          >
            <p className="text-lg sm:text-xl text-neutral-200 leading-relaxed">
              {fr
                ? "Apprenez à transformer l'expertise d'une marque en contenus qui attirent l'attention - puis faites de cette compétence votre nouveau métier."
                : 'Learn to turn a brand\'s expertise into content that earns attention - then make that skill your new craft.'}
            </p>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              {fr
                ? '21 jours pour apprendre la méthode, obtenir votre certification et décrocher vos premières missions. Même sans avoir votre propre projet.'
                : '21 days to learn the method, earn your certification and land your first missions. Even without your own project.'}
            </p>
          </motion.div>

          <motion.div
            id="academy-waitlist"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-sm mx-auto mb-6 scroll-mt-24 flex flex-col items-center gap-4"
          >
            <AcademyWaitlistCta
              source="academy-hero"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-academy px-8 py-4 text-base font-bold text-black transition-all hover:brightness-110 hover:scale-[1.02] flex-col"
            >
              <span>{fr ? 'Candidater à la prochaine promotion →' : 'Apply to the next cohort →'}</span>
              <span className="text-[11px] font-semibold opacity-70">
                {fr ? '20 places · Sur sélection' : '20 spots · By selection'}
              </span>
            </AcademyWaitlistCta>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-[11px] text-neutral-500"
          >
            {fr ? '30 secondes · On vous répond après lecture de votre candidature' : '30 seconds · We reply after reviewing your application'}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
