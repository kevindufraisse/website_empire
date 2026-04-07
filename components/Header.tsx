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

export default function Header() {
  const { t, lang } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [callbackOpen, setCallbackOpen] = useState(false)
  const pathname = usePathname()
  
  // Hide default CTA button on pricing, partners and academy pages
  const isCandidaturePage = pathname === '/candidature' || pathname === '/decouverte' || pathname === '/join-us'
  const hideCTA = pathname === '/pricing' || pathname === '/partners' || pathname === '/academy' || isCandidaturePage
  // Show partner CTA on partners page
  const isPartnersPage = pathname === '/partners'
  // Show academy-specific CTA
  const isAcademyPage = pathname === '/academy'

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
        <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-lg md:text-xl font-bold text-white group-hover:text-empire transition-colors">
              Empire Internet
            </span>
          </a>

          {/* Right side */}
          <div className="flex items-center justify-end gap-2 md:gap-3 min-w-0">
            {!hideCTA && (
              <button
                data-cal-namespace={namespace}
                data-cal-link={calLink}
                data-cal-config='{"layout":"month_view","theme":"dark"}'
                title={t.common.ctaReassurance}
                className="hidden sm:inline-flex sm:flex-col sm:items-end sm:justify-center gap-px shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-empire text-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.2)]"
              >
                <span className="font-semibold text-[11px] md:text-sm leading-none text-right whitespace-nowrap">
                  {t.header.joinQA}
                </span>
                <span className="text-[8px] md:text-[9px] font-medium leading-none text-right text-black/70 whitespace-nowrap">
                  {t.common.ctaReassuranceCompact}
                </span>
              </button>
            )}
            {isPartnersPage && (
              <button
                type="button"
                className="systeme-show-popup-5606340 hidden sm:block px-4 md:px-5 py-2 md:py-2.5 rounded-lg bg-empire text-black font-semibold hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.2)] text-sm md:text-base cursor-pointer"
              >
                {lang === 'fr' ? 'Obtenir mon lien' : 'Get my sharable link'}
              </button>
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
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  data-cal-namespace={namespace}
                  data-cal-link={calLink}
                  data-cal-config='{"layout":"month_view","theme":"dark"}'
                  title={t.common.ctaReassurance}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex flex-col items-center gap-1 py-3 rounded-lg bg-empire text-black font-bold hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(218,252,104,0.2)]"
                >
                  <span className="leading-tight px-2 text-center text-sm">{t.header.joinQA}</span>
                  <span className="text-[10px] font-medium text-black/70 leading-tight px-2 text-center">
                    {t.common.ctaReassuranceCompact}
                  </span>
                </motion.button>
              )}
              {isPartnersPage && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="systeme-show-popup-5606340 w-full py-3.5 rounded-lg bg-empire text-black font-bold hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(218,252,104,0.2)] cursor-pointer"
                >
                  {lang === 'fr' ? 'Obtenir mon lien' : 'Get my sharable link'}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CallbackFormModal isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </header>
  )
}
