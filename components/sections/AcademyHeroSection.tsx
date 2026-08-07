'use client'
import { motion } from 'framer-motion'
import RetroGrid from '@/components/magicui/retro-grid'
import { Meteors } from '@/components/magicui/meteors'
import { SparklesText } from '@/components/magicui/sparkles-text'

import AcademyWaitlistCta from '@/components/AcademyWaitlistCta'
import MediaCredibilityStrip from '@/components/MediaCredibilityStrip'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AcademyHeroSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const founders = [
    {
      name: 'Kevin Dufraisse',
      url: 'https://www.linkedin.com/in/kevin-dufraisse/',
      img: '/founders/kevin.jpg',
      stats: fr
        ? ['#55 influenceur LinkedIn France', '2M de vues / mois', '+4 000 clients accompagnés']
        : ['#55 LinkedIn influencer in France', '2M views / month', '+4,000 clients guided'],
    },
    {
      name: 'Marc Dufraisse',
      url: 'https://www.linkedin.com/in/marc-dufraisse/',
      img: '/founders/marc.jpg',
      stats: fr
        ? ['40K abonnés LinkedIn', '+4 000 leads en 1 post', 'Top 3 expert IA France']
        : ['40K LinkedIn followers', '+4,000 leads in 1 post', 'Top 3 AI expert in France'],
    },
  ]
  return (
    <section className="relative w-full pt-20 md:pt-24 pb-20 md:pb-28 overflow-hidden bg-gradient-to-b from-black via-transparent to-[#0f0f0f]">
      <RetroGrid />
      <Meteors number={12} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(252, 165, 165,0.12),transparent)]" />

      <div className="container relative z-10">

        {/* 3-column layout: Kevin | Center content | Marc */}
        <div className="relative flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-6">


          {/* Center content */}
          <div className="max-w-3xl text-center flex-1">

            {/* Tier kicker - positions Academy against Copilot/Autopilot */}
            {/* Date */}
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
                <span className="text-xs text-academy font-bold">{fr ? 'Pour ceux qui veulent se reconvertir dans le contenu' : 'For those who want to switch to content'}</span>
              </div>
            </motion.div>

            {/* H1 */}
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

            {/* Value prop - compact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-lg mx-auto mb-8"
            >
              <p className="text-lg sm:text-xl text-neutral-200 leading-relaxed">
                {fr
                  ? 'Apprenez le métier, obtenez votre certification, et gagnez vos premiers 3\u202F000\u202F€/mois. Même sans projet à vous.'
                  : 'Learn the craft, get certified, and earn your first €3,000/month. Even without your own project.'}
              </p>

            </motion.div>

            {/* Waitlist CTA button */}
            <motion.div
              id="academy-waitlist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="max-w-sm mx-auto mb-8 scroll-mt-24 flex flex-col items-center gap-4"
            >
              <AcademyWaitlistCta
                source="academy-hero"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-academy px-8 py-4 text-base font-bold text-black transition-all hover:brightness-110 hover:scale-[1.02] flex-col"
              >
                <span>{fr ? 'Rejoindre la liste d\'attente →' : 'Join the waitlist →'}</span>
                <span className="text-[11px] font-semibold opacity-70">{fr ? 'À partir de 497\u202F€ · 20 places sur sélection' : 'From €497 · 20 spots, application only'}</span>
              </AcademyWaitlistCta>
              <MediaCredibilityStrip />
            </motion.div>

            {/* Waitlist reassurance */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="max-w-md mx-auto mb-10"
            >
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-neutral-500">
                <span>{fr ? '✓ Pas besoin de projet' : '✓ No project needed'}</span>
                <span>·</span>
                <span>{fr ? '✓ Inscription sous réserve' : '✓ Subject to approval'}</span>
                <span>·</span>
                <span>{fr ? '✓ On vous contacte dès l\'ouverture' : '✓ We contact you when spots open'}</span>
              </div>
            </motion.div>


          </div>


        </div>



      </div>

    </section>
  )
}
