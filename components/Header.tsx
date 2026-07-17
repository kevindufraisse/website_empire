'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import CallbackFormModal from '@/components/CallbackFormModal'
import { fetchFlashPromo, formatCountdown } from '@/lib/flash-promo'


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

  const showPromoBanner = !!promoCountdown && !!promoInfo && !promoDismissed

  const isCandidaturePage = pathname === '/candidature' || pathname === '/decouverte' || pathname === '/join-us' || pathname?.startsWith('/hire-our-team')
  const isPartnersPage = pathname === '/partners'

  // Hide entirely on candidature page - after all hooks
  if (isCandidaturePage) return null

  // Hide header entirely on live page
  if (pathname === '/live') return null

  // Minimal header (logo only) on thank-you and webinar pages
  if (pathname === '/academy/merci' || pathname === '/webinar' || pathname === '/webinar/merci' || pathname === '/final-offer') {
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

            {/* Webinar banner */}
            <a
              href="https://join.empire-internet.com/masterclass-empire-internet"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-empire/10 border border-empire/30 px-4 py-1.5 text-sm font-semibold text-empire hover:bg-empire/20 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-empire opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-empire" />
              </span>
              {fr ? 'Webinar : devenir une référence en partant de zéro' : 'Webinar: become a reference starting from zero'}
            </a>

            <div className="flex-1" />

            {/* Right side */}
            <div className="flex items-center justify-end gap-2 lg:gap-3 min-w-0">
              {isPartnersPage && (
                <button
                  type="button"
                  className="systeme-show-popup-5606340 hidden sm:block px-4 md:px-5 py-2 md:py-2.5 rounded-lg bg-empire text-black font-semibold hover:scale-105 transition-all shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.2)] text-sm md:text-base cursor-pointer"
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
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  href="https://join.empire-internet.com/masterclass-empire-internet"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-empire/30 bg-empire/10 text-empire font-semibold text-sm"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-empire opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-empire" />
                  </span>
                  {fr ? 'Webinar : devenir une référence en partant de zéro' : 'Webinar: become a reference from zero'}
                </motion.a>
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <CallbackFormModal isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />
      </header>
    </>
  )
}
