'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { MessageCircle, Play } from 'lucide-react'
import CalCalendar from '@/components/CalCalendar'

export default function DemoPage() {
  const { t, lang } = useLanguage()

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black via-[#0f0f0f] to-black pt-20 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(218,252,104,0.1),transparent)]" />
      
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 relative z-10 text-center">
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

      {/* Video Demo Section */}
      <div className="max-w-4xl mx-auto px-4 pb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-empire/20 border border-empire/30 mb-4">
              <Play size={16} className="text-empire" />
              <span className="text-sm font-semibold text-empire">
                {lang === 'fr' ? 'Regardez la démo' : 'Watch the demo'}
              </span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black aspect-video">
            <iframe
              src="https://fast.vidalytics.com/embeds/ydq0TH7p/eC6wQ0IBC0XGwMad/"
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>

      {/* WhatsApp Contact */}
      <div className="max-w-3xl mx-auto px-4 pb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <a
            href="https://wa.me/33665427470"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 p-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
              <MessageCircle className="text-white" size={20} />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold group-hover:text-[#25D366] transition-colors">
                {lang === 'fr' ? 'Une question avant de réserver ?' : 'Have a question before booking?'}
              </p>
              <p className="text-sm text-neutral-400">
                {lang === 'fr' ? 'Contactez-nous sur WhatsApp' : 'Contact us on WhatsApp'}
              </p>
            </div>
          </a>
        </motion.div>
      </div>

      {/* Calendrier */}
      <div className="px-4 md:px-8 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {lang === 'fr' ? 'Réservez votre appel' : 'Book your call'}
            </h2>
            <p className="text-neutral-400">
              {lang === 'fr' ? 'Choisissez un créneau qui vous convient' : 'Choose a time that works for you'}
            </p>
          </div>
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
