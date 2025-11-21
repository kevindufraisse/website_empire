'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Calendar, Share2, Users, Rocket, CalendarPlus } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DemoThankYouPage() {
  const { t } = useLanguage()
  
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0f0f0f] to-black pt-24 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(218,252,104,0.1),transparent)]" />
      
      <div className="container py-20 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="w-24 h-24 rounded-full bg-empire/20 border-4 border-empire flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(218,252,104,0.3)]"
          >
            <CheckCircle2 className="text-empire" size={48} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            {t.demoThankYou.title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-neutral-300 mb-8"
          >
            {t.demoThankYou.subtitle}
          </motion.p>

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-12"
          >
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-left">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-empire/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-empire" size={18} />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">{t.demoThankYou.checkEmail.title}</p>
                  <p className="text-sm text-neutral-400 mb-2">
                    {t.demoThankYou.checkEmail.desc}
                  </p>
                  <p className="text-sm text-empire font-semibold mb-1">
                    {t.demoThankYou.checkEmail.validateTitle}
                  </p>
                  <p className="text-sm text-neutral-400 mb-3">
                    {t.demoThankYou.checkEmail.validateDesc}
                  </p>
                  <div className="mt-3 p-3 rounded-lg bg-empire/10 border border-empire/30">
                    <p className="text-sm text-empire font-bold mb-2">{t.demoThankYou.checkEmail.addCalendarTitle}</p>
                    <a
                      href="https://addcal.co/c/c5mhw9u4u6a1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-empire/20 hover:bg-empire/30 text-white font-semibold hover:text-empire transition-all border border-empire/50"
                    >
                      <CalendarPlus className="text-empire" size={16} />
                      {t.demoThankYou.checkEmail.addCalendarLink}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-left">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-empire/20 flex items-center justify-center flex-shrink-0">
                  <Rocket className="text-empire" size={18} />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">{t.demoThankYou.prepareQuestions.title}</p>
                  <p className="text-sm text-neutral-400">
                    {t.demoThankYou.prepareQuestions.desc}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Fun CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6 mb-12"
          >
            <div className="p-8 rounded-xl bg-gradient-to-br from-empire/20 to-empire/5 border border-empire/30">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Share2 className="text-empire" size={24} />
                <h3 className="text-2xl font-bold text-white">{t.demoThankYou.share.title}</h3>
              </div>
              <p className="text-neutral-300 mb-6">
                {t.demoThankYou.share.desc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: t.demoThankYou.share.shareTitle,
                        text: t.demoThankYou.share.shareText,
                        url: window.location.origin + '/demo',
                      })
                    } else {
                      navigator.clipboard.writeText(window.location.origin + '/demo')
                      alert(t.demoThankYou.share.copied)
                    }
                  }}
                  className="px-6 py-3 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)]"
                >
                  {t.demoThankYou.share.button}
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 border-2 border-empire/50 text-white font-semibold rounded-xl hover:border-empire hover:bg-empire/10 transition-all"
                >
                  {t.demoThankYou.share.watchDemo}
                </Link>
              </div>
            </div>

            <div className="p-8 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="text-empire" size={24} />
                <h3 className="text-2xl font-bold text-white">{t.demoThankYou.community.title}</h3>
              </div>
              <p className="text-neutral-300 mb-6">
                {t.demoThankYou.community.desc}
              </p>
              <Link
                href="https://www.skool.com/tes-7483"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-gradient-to-r from-empire to-empire/80 text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)]"
              >
                {t.demoThankYou.community.button}
              </Link>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-neutral-500 mt-8"
          >
            {t.demoThankYou.footer}
          </motion.p>
        </div>
      </div>
    </main>
  )
}

