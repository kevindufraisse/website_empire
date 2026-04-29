'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCalApi } from "@calcom/embed-react"
import { Phone } from 'lucide-react'
import CallbackFormModal from '@/components/CallbackFormModal'
import { useCalLink } from '@/hooks/useCalLink'
import TierNav from '@/components/TierNav'
import { GiftHeaderBadge } from '@/components/GiftCountdownBar'

export default function Header() {
  const { t, lang } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [callbackOpen, setCallbackOpen] = useState(false)
  const pathname = usePathname()
  
  // Quiz state: detect if started but not completed (client-only to avoid hydration mismatch)
  const [quizState, setQuizState] = useState<'new' | 'started' | 'done'>('new')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('empire_quiz_v1')
      if (!raw) return
      const data = JSON.parse(raw)
      if (data?.stage === 'result' && data?.result) setQuizState('done')
      else if (data?.stage && data.stage !== 'intro') setQuizState('started')
    } catch { /* ignore */ }
  }, [])

  const quizLabel = quizState === 'done'
    ? (lang === 'fr' ? 'Mon résultat' : 'My result')
    : quizState === 'started'
      ? (lang === 'fr' ? 'Terminer le quiz' : 'Finish quiz')
      : (lang === 'fr' ? 'Quiz gratuit' : 'Free quiz')

  // Hide default CTA button on partners and academy pages
  const isCandidaturePage = pathname === '/candidature' || pathname === '/decouverte' || pathname === '/join-us'
  const hideCTA = pathname === '/partners' || isCandidaturePage
  // Show partner CTA on partners page
  const isPartnersPage = pathname === '/partners'
  // Show academy-specific CTA
  const isAcademyPage = pathname === '/academy'
  // Tier nav shown on main landing and academy page (unified tier navigation)
  const showTierNav = pathname === '/' || pathname === '/academy'

  const namespace = 'audit-empire'
  const calLink = useCalLink()

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace })
      cal("ui", { 
        hideEventTypeDetails: false, 
        layout: "month_view",
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#dafc68" },
          dark: { "cal-brand": "#dafc68" }
        }
      })
      
      // Facebook Pixel tracking for booking confirmation
      cal("on", {
        action: "bookingSuccessful",
        callback: (e: any) => {
          console.log('Cal.com booking successful!', e)
          // Via GTM dataLayer
          if (typeof window !== 'undefined') {
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({
              'event': 'cal_booking_confirmed',
              'booking_data': e
            });
            // Direct fbq call (fallback)
            if ((window as any).fbq) {
              (window as any).fbq('track', 'Schedule')
            }
          }
        }
      })
    })()
  }, [namespace])

  // Hide entirely on candidature page - after all hooks
  if (isCandidaturePage) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-black/95 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 py-3.5">
        <div className="relative flex items-center justify-between gap-2 sm:gap-3 min-w-0">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-lg md:text-xl font-bold text-white group-hover:text-empire transition-colors">
              Empire
            </span>
          </a>

          {/* Center - absolutely positioned for true centering (lg+ to avoid iPad overlap) */}
          {showTierNav && (
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2.5">
              <GiftHeaderBadge />
              <TierNav />
            </div>
          )}
          {!showTierNav && (
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center">
              <GiftHeaderBadge />
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center justify-end gap-2 lg:gap-3 min-w-0">
            {!hideCTA && (
              <a
                href="/quiz"
                className="inline-flex items-center gap-1.5 shrink-0 px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-empire text-black hover:scale-105 transition-all shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.2)]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black/20" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-black/30" />
                </span>
                <span className="font-bold text-[11px] md:text-sm leading-none whitespace-nowrap">
                  {quizLabel}
                </span>
              </a>
            )}
            {isPartnersPage && (
              <button
                type="button"
                className="systeme-show-popup-5606340 hidden sm:block px-4 md:px-5 py-2 md:py-2.5 rounded-lg bg-empire text-black font-semibold hover:scale-105 transition-all shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.2)] text-sm md:text-base cursor-pointer"
              >
                {lang === 'fr' ? 'Obtenir mon lien' : 'Get my sharable link'}
              </button>
            )}
            {isAcademyPage && (
              <a
                href="https://join.empire-internet.com/academy"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-academy text-black font-semibold text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(252,165,165,0.2)]"
              >
                Rejoindre - 497€
              </a>
            )}

            <LanguageSwitcher />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 text-white hover:text-empire transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* TierNav second row (mobile + tablet, hidden on lg+ where it's in center) */}
        {showTierNav && (
          <div className="lg:hidden flex justify-center pt-3">
            <TierNav />
          </div>
        )}
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden border-t border-white/10 bg-black/98"
          >
            <div className="px-4 py-5 space-y-4">
              {/* CTA Button Mobile */}
              {!hideCTA && (
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  href="/quiz"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-empire text-black font-bold hover:scale-[1.02] transition-all shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.2)]"
                >
                  {quizLabel}
                </motion.a>
              )}
              {isPartnersPage && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="systeme-show-popup-5606340 w-full py-3.5 rounded-lg bg-empire text-black font-bold hover:scale-[1.02] transition-all shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.2)] cursor-pointer"
                >
                  {lang === 'fr' ? 'Obtenir mon lien' : 'Get my sharable link'}
                </motion.button>
              )}
              {isAcademyPage && (
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  href="https://join.empire-internet.com/academy"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-3.5 rounded-lg bg-academy text-black font-bold text-center hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(252,165,165,0.2)] block"
                >
                  Rejoindre - 497€
                </motion.a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CallbackFormModal isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </header>
  )
}
