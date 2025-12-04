'use client'

import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import CalCalendar from '@/components/CalCalendar'

export default function DemoPage() {
  const { t } = useLanguage()

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black via-[#0f0f0f] to-black pt-24 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(218,252,104,0.1),transparent)]" />
      
      <div className="container py-12 md:py-20 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-empire/30">
                <Image
                  src="https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/event-covers/ze/cc3ea0bd-f389-48b2-af3e-87f8dacdc687.png"
                  alt="Kevin Dufraisse"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t.demo.title}
              <br />
              <span className="text-empire">{t.demo.titleWith}</span>
            </h1>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              {t.demo.subtitle}
            </p>
          </motion.div>

          {/* Calendrier Cal.com */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-empire/5 via-transparent to-blue-500/5 pointer-events-none" />
            
            <div className="relative z-10">
              <div>
                <label className="flex items-center gap-2 text-white font-semibold mb-4">
                  <Calendar className="text-empire" size={20} />
                  {t.demo.dateLabel}
                </label>
                <p className="text-neutral-300 text-sm mb-4">
                  {t.demo.calendarDescription}
                </p>
                <CalCalendar />
              </div>
            </div>
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 p-6 rounded-xl bg-white/5 border border-white/10"
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
      </div>
    </main>
  )
}
