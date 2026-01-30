'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCalApi } from "@calcom/embed-react"

export default function Header() {
  const { t, lang } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Hide default CTA button on pricing and partners pages
  const hideCTA = pathname === '/pricing' || pathname === '/partners'
  // Show partner CTA on partners page
  const isPartnersPage = pathname === '/partners'

  const namespace = 'audit-empire'
  const calLink = 'team/empire-internet/audit-empire'

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-black/95 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-empire to-empire/50 flex items-center justify-center font-bold text-black text-sm">
              E
            </div>
            <span className="text-lg md:text-xl font-bold text-white group-hover:text-empire transition-colors">
              Empire Internet
            </span>
          </a>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:block">
            <LanguageSwitcher />
            </div>
            {/* Partner link - shown on all pages except /partners */}
            {!isPartnersPage && (
              <a
                href="/partners"
                className="hidden sm:block px-3 md:px-4 py-2 md:py-2.5 rounded-lg border border-empire/50 text-empire font-semibold hover:bg-empire/10 hover:border-empire transition-all text-sm md:text-base"
              >
                {lang === 'fr' ? 'Devenir Partenaire' : 'Become a Partner'}
              </a>
            )}
            {!hideCTA && (
              <button
                data-cal-namespace={namespace}
                data-cal-link={calLink}
                data-cal-config='{"layout":"month_view","theme":"dark"}'
                className="hidden sm:block px-4 md:px-5 py-2 md:py-2.5 rounded-lg bg-empire text-black font-semibold hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.2)] text-sm md:text-base"
              >
                {t.header.joinQA}
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
              {/* Language Switcher Mobile */}
              <div className="py-2">
                <p className="text-xs text-neutral-500 mb-2">{lang === 'fr' ? 'Langue' : 'Language'}</p>
                <LanguageSwitcher />
              </div>

              {/* Partner link mobile - shown on all pages except /partners */}
              {!isPartnersPage && (
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  href="/partners"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-3 rounded-lg border border-empire/50 text-empire font-bold text-center hover:bg-empire/10 transition-all"
                >
                  {lang === 'fr' ? 'Devenir Partenaire' : 'Become a Partner'}
                </motion.a>
              )}
              
              {/* CTA Button Mobile */}
              {!hideCTA && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  data-cal-namespace={namespace}
                  data-cal-link={calLink}
                  data-cal-config='{"layout":"month_view","theme":"dark"}'
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-3.5 rounded-lg bg-empire text-black font-bold hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(218,252,104,0.2)]"
                >
                  {t.header.joinQA}
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
    </header>
  )
}
