'use client'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import RetroGrid from '@/components/magicui/retro-grid'
import { Mic, Video, FileText, Lightbulb, Zap, Code } from 'lucide-react'

export default function FormatsHero() {
  const { t } = useLanguage()

  const formats = [
    { icon: Mic, label: 'Interview' },
    { icon: FileText, label: 'Bulletpoint' },
    { icon: Video, label: 'Screenrecording' },
    { icon: Lightbulb, label: 'Inspirations' },
    { icon: Zap, label: 'Scripts' },
    { icon: Code, label: 'API' },
  ]

  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-b from-black via-transparent to-[#0f0f0f]">
      <div className="container">
        <RetroGrid />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(218,252,104,0.15),transparent)]" />
        
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-empire/10 border border-empire/30 text-empire text-sm font-semibold mb-6">
              {t.formats?.hero?.badge || '6 Ways to Create'}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
          >
            {t.formats?.hero?.title || 'Speak How'}{' '}
            <span className="text-empire">{t.formats?.hero?.titleHighlight || 'You Want'}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl md:text-2xl text-neutral-300 max-w-3xl mx-auto mb-12"
          >
            {t.formats?.hero?.subtitle || 'No scripts. No stress. Just choose your format and we handle the rest.'}
          </motion.p>

          {/* Format Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6"
          >
            {formats.map((format, i) => (
              <motion.div
                key={format.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-empire/50 transition-all"
              >
                <format.icon className="text-empire" size={24} />
                <span className="text-xs text-neutral-400">{format.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

