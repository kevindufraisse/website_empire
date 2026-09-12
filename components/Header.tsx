'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import CallbackFormModal from '@/components/CallbackFormModal'
import { fetchFlashPromo, formatCountdown } from '@/lib/flash-promo'

/** Logo Slack officiel (4 couleurs), inline pour éviter un asset de plus. */
function SlackLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 122.8 122.8" className={className} aria-hidden="true">
      <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#E01E5A" />
      <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36C5F0" />
      <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2EB67D" />
      <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ECB22E" />
    </svg>
  )
}

export default function Header() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [callbackOpen, setCallbackOpen] = useState(false)
  const pathname = usePathname()

  const [promoDeadline, setPromoDeadline] = useState<number | null>(null)
  const [promoCountdown, setPromoCountdown] = useState<string | null>(null)
  const [promoInfo, setPromoInfo] = useState<{ promoMonthly: number; baseMonthly: number } | null>(null)
  const [promoDismissed, setPromoDismissed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchFlashPromo().then((status) => {
      if (cancelled || !status || status.expired) return
      setPromoDeadline(new Date(status.deadline).getTime())
      setPromoInfo({ promoMonthly: status.promo.promoMonthly, baseMonthly: status.promo.baseMonthly })
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!promoDeadline) return
    const tick = () => {
      const remaining = promoDeadline - Date.now()
      if (remaining <= 0) { setPromoDeadline(null); setPromoCountdown(null); return }
      setPromoCountdown(formatCountdown(remaining))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [promoDeadline])

  // Prices removed from marketing site - no flash promo banner.
  const showPromoBanner = false && !!promoCountdown && !!promoInfo && !promoDismissed

  const isCandidaturePage = pathname === '/candidature' || pathname === '/decouverte' || pathname === '/join-us' || pathname === '/postuler' || pathname?.startsWith('/hire-our-team')
  const isPartnersPage = pathname === '/partners'

  // Hide entirely on candidature page - after all hooks
  if (isCandidaturePage) return null

  // Hide header entirely on live page
  if (pathname === '/live') return null

  // Minimal header (logo only) on thank-you and webinar pages
  if (pathname === '/academy/merci' || pathname === '/thank-you' || pathname === '/webinar' || pathname === '/webinar/merci' || pathname === '/final-offer') {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-black/95 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-4 py-3.5">
          <a href="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-lg md:text-xl font-bold text-white group-hover:text-empire transition-colors">
              Empire
            </span>
          </a>
        </nav>
      </header>
    )
  }

  return (
    <>
      {showPromoBanner && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white">
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-center gap-3 text-center relative">
            <a href="#pricing" className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="text-sm sm:text-base font-bold">
                🔥 {fr
                  ? `Offre flash : ${promoInfo.promoMonthly}€/mois à vie au lieu de ${promoInfo.baseMonthly}€`
                  : `Flash deal: €${promoInfo.promoMonthly}/mo forever instead of €${promoInfo.baseMonthly}`}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">{fr ? 'Expire' : 'Ends'}</span>
                <span className="font-mono text-sm font-bold tabular-nums">{promoCountdown}</span>
              </span>
            </a>
            <button
              onClick={() => setPromoDismissed(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
      <header className={`fixed left-0 right-0 z-50 border-b border-white/20 bg-black/95 backdrop-blur-md ${showPromoBanner ? 'top-[36px]' : 'top-0'}`}>
        <nav className="max-w-7xl mx-auto px-4 py-3.5">
          <div className="relative flex items-center justify-between gap-2 sm:gap-3 min-w-0">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 group shrink-0">
              <span className="text-lg md:text-xl font-bold text-white group-hover:text-empire transition-colors">
                Empire
              </span>
            </a>

            {/* Right side */}
            <div className="flex items-center justify-end gap-1.5 lg:gap-2.5 min-w-0">
              {isPartnersPage && (
                <button
                  type="button"
                  className="systeme-show-popup-5606340 hidden sm:block px-4 md:px-5 py-2 md:py-2.5 rounded-lg bg-empire text-black font-semibold hover:scale-105 transition-all shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.2)] text-sm md:text-base cursor-pointer"
                >
                  {fr ? 'Obtenir mon lien' : 'Get my sharable link'}
                </button>
              )}
              {!isPartnersPage && (
                <>
                  <a
                    href="/communaute"
                    className="hidden md:inline-flex items-center gap-2 rounded-full border border-empire/45 bg-empire/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-empire/20"
                  >
                    <SlackLogo className="h-4 w-4 shrink-0" />
                    {fr ? 'Rejoindre la communauté gratuite' : 'Join the free community'}
                  </a>
                </>
              )}
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-white hover:text-empire transition-colors"
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
              className="md:hidden border-t border-white/10 bg-black/98"
            >
              <div className="px-4 py-5 space-y-4">
                {!isPartnersPage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-3"
                  >
                    <a
                      href="/communaute"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-empire/45 bg-empire/10 py-3.5 text-sm font-bold text-white"
                    >
                      <SlackLogo className="h-4 w-4 shrink-0" />
                      {fr ? 'Rejoindre la communauté gratuite' : 'Join the free community'}
                    </a>
                  </motion.div>
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
                    {fr ? 'Obtenir mon lien' : 'Get my sharable link'}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <CallbackFormModal isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />
      </header>

    </>
  )
}
