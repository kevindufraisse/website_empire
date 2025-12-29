'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import CalCalendar from '@/components/CalCalendar'

export default function DemoPage() {
  const { t } = useLanguage()

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black via-[#0f0f0f] to-black pt-20 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(218,252,104,0.1),transparent)]" />
      
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-20 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4 md:mb-6">
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-empire/30">
              <Image
                src="https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/event-covers/ze/cc3ea0bd-f389-48b2-af3e-87f8dacdc687.png"
                alt="Kevin Dufraisse"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 md:mb-4">
            {t.demo.title}
            <br />
            <span className="text-empire">{t.demo.titleWith}</span>
          </h1>
          <p className="text-base md:text-lg text-neutral-300">
            {t.demo.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Calendrier - Direct sans container */}
      <div className="px-4 md:px-8 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CalCalendar />
        </motion.div>
      </div>

      {/* About */}
      <div className="max-w-3xl mx-auto px-4 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="p-6 rounded-xl bg-white/5 border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-3">{t.demo.aboutTitle}</h3>
          <p className="text-neutral-300 leading-relaxed mb-4">
            {t.demo.aboutText1}
          </p>
          <p className="text-neutral-300 leading-relaxed">
            {t.demo.aboutText2}
          </p>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-sm text-neutral-400">{t.demo.aboutPresentedBy}</p>
            <p className="text-empire font-bold">empire</p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
