'use client'
import { motion } from 'framer-motion'
import RetroGrid from '@/components/magicui/retro-grid'
import { Meteors } from '@/components/magicui/meteors'
import NumberTicker from '@/components/magicui/number-ticker'
import { useLanguage } from '@/contexts/LanguageContext'

export default function StoryHero() {
  const { t } = useLanguage()
  
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      <RetroGrid />
      <Meteors number={20} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(218,252,104,0.2),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(123,224,255,0.1),transparent)]" />
      
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-2 rounded-full bg-empire/10 border border-empire/30 text-empire text-sm font-semibold mb-8">
              {t.story.hero.badge}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.15] mb-8"
          >
            {t.story.hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-neutral-300 max-w-3xl mx-auto mb-12"
          >
            {t.story.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
          >
            <div>
              <p className="text-4xl md:text-5xl font-bold text-empire mb-2">
                <NumberTicker value={700} />K+
              </p>
              <p className="text-sm text-neutral-400">{t.story.hero.stat1}</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <p className="text-4xl md:text-5xl font-bold text-empire mb-2">
                <NumberTicker value={1} />M+
              </p>
              <p className="text-sm text-neutral-400">{t.story.hero.stat2}</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <p className="text-4xl md:text-5xl font-bold text-empire mb-2">
                Top <NumberTicker value={50} />
              </p>
              <p className="text-sm text-neutral-400">{t.story.hero.stat3}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16"
          >
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-empire/50 to-empire/10">
              <div className="px-6 py-3 rounded-full bg-black">
                <p className="text-sm text-neutral-400">
                  {t.story.hero.scrollCta}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

