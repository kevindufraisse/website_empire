'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { HeroVideoDialog, openVideoDialog } from '@/components/magicui/hero-video-dialog'
import { X } from 'lucide-react'
import { PRICING } from '@/lib/pricing-config'

export default function ClientWrappers() {
  const { t } = useLanguage()
  const [showSticky, setShowSticky] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Global Video Dialog - available on all pages (no thumbnail, just the dialog) */}
      <HeroVideoDialog
        animationStyle="from-center"
        thumbnailSrc=""
        thumbnailAlt=""
      />

      {/* Sticky CTA Bar */}
      {!dismissed && (
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300"
        style={{ transform: showSticky ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div className="bg-gradient-to-r from-black via-[#0a0a0a] to-black border-t-2 border-empire py-4 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-empire to-empire/50 flex items-center justify-center font-bold text-black hidden md:flex">
                  E
                </div>
                <div>
                  <p className="font-bold text-white text-sm md:text-base">Empire Internet</p>
                  <p className="text-xs text-empire font-semibold">
                    83 {t.stickyBar.spotsLeft} · €{PRICING.monthly}{t.common.perMonth}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openVideoDialog()}
                  className="px-4 md:px-6 py-2 md:py-3 bg-empire text-black font-bold rounded-lg hover:scale-105 transition-all text-sm md:text-base"
                >
                  {t.common.watchDemo} →
                </button>
                <button
                  onClick={() => setDismissed(true)}
                  className="p-2 text-neutral-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  )
}


