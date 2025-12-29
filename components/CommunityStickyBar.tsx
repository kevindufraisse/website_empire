'use client'
import { useEffect, useState, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { X, Users, Zap, FileCode, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CommunityStickyBar() {
  const { lang } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const scriptContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroHeight = window.innerHeight * 0.5
      
      if (scrollY > heroHeight) {
        setIsVisible(true)
      } else if (scrollY < 100) {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Load Systeme.io script when modal opens
  useEffect(() => {
    if (isModalOpen && scriptContainerRef.current) {
      // Clear previous content
      scriptContainerRef.current.innerHTML = ''
      
      // Create and append the script
      const script = document.createElement('script')
      script.id = 'form-script-tag-22090907'
      script.src = 'https://www.join.empire-internet.com/public/remote/page/3637777627559af498e066585d240ec44e2df68b.js'
      script.async = true
      scriptContainerRef.current.appendChild(script)
    }
  }, [isModalOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isModalOpen])

  const content = {
    fr: {
      badge: '🎁 Offre Spéciale',
      title: 'Rejoignez +700 entrepreneurs',
      cta: 'Accéder gratuitement',
      modalTitle: 'Accès Communauté Empire',
      modalSubtitle: 'Rejoignez +700 entrepreneurs et récupérez :',
      benefit1: 'Templates N8N',
      benefit1Desc: 'Automatisations prêtes à l\'emploi',
      benefit2: 'Prompts de contenu',
      benefit2Desc: 'Nos meilleurs prompts IA',
      benefit3: 'Automatisations',
      benefit3Desc: 'Les dernières techniques',
    },
    en: {
      badge: '🎁 Special Offer',
      title: 'Join 700+ entrepreneurs',
      cta: 'Get free access',
      modalTitle: 'Empire Community Access',
      modalSubtitle: 'Join 700+ entrepreneurs and get:',
      benefit1: 'N8N Templates',
      benefit1Desc: 'Ready-to-use automations',
      benefit2: 'Content Prompts',
      benefit2Desc: 'Our best AI prompts',
      benefit3: 'Automations',
      benefit3Desc: 'Latest techniques',
    }
  }

  const t = content[lang as keyof typeof content] || content.en

  return (
    <>
      {/* Sticky Bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isVisible && !isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black backdrop-blur-md border-t border-empire/40" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Left - Desktop */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-empire/20 border border-empire/30">
                <span className="text-sm font-semibold text-empire">{t.badge}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-empire" size={18} />
                <p className="text-white font-medium text-sm">
                  {t.title}
                </p>
              </div>
            </div>

            {/* Left - Mobile */}
            <div className="sm:hidden flex items-center gap-2">
              <span className="text-sm">{t.badge}</span>
              <Users className="text-empire" size={16} />
              <span className="text-white text-sm font-medium">+700</span>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-empire to-[#c8e860] text-black font-bold rounded-lg hover:scale-105 transition-all shadow-[0_0_25px_rgba(218,252,104,0.4)] text-sm sm:text-base whitespace-nowrap"
            >
              <Sparkles size={18} />
              {t.cta}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-neutral-900 via-black to-neutral-900 border border-empire/30 rounded-2xl shadow-[0_0_60px_rgba(218,252,104,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>

              {/* Header */}
              <div className="p-6 pb-4 border-b border-white/10">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {t.modalTitle}
                </h3>
                <p className="text-neutral-300">
                  {t.modalSubtitle}
                </p>
              </div>

              {/* Benefits */}
              <div className="px-6 py-4 grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                  <FileCode className="text-empire mx-auto mb-2" size={24} />
                  <p className="text-white font-semibold text-sm">{t.benefit1}</p>
                  <p className="text-neutral-400 text-xs mt-1">{t.benefit1Desc}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                  <Zap className="text-empire mx-auto mb-2" size={24} />
                  <p className="text-white font-semibold text-sm">{t.benefit2}</p>
                  <p className="text-neutral-400 text-xs mt-1">{t.benefit2Desc}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                  <Sparkles className="text-empire mx-auto mb-2" size={24} />
                  <p className="text-white font-semibold text-sm">{t.benefit3}</p>
                  <p className="text-neutral-400 text-xs mt-1">{t.benefit3Desc}</p>
                </div>
              </div>

              {/* Systeme.io Form */}
              <div className="p-6 pt-2">
                <div 
                  ref={scriptContainerRef}
                  className="min-h-[200px] flex items-center justify-center"
                >
                  {/* Loading state */}
                  <div className="text-neutral-400 text-sm">
                    {lang === 'fr' ? 'Chargement du formulaire...' : 'Loading form...'}
                  </div>
                </div>
              </div>

              {/* Social proof */}
              <div className="px-6 pb-6">
                <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
                  <Users size={16} className="text-empire" />
                  <span>
                    {lang === 'fr' 
                      ? '+700 entrepreneurs nous font confiance' 
                      : '700+ entrepreneurs trust us'}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
