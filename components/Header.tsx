'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import CallbackFormModal from '@/components/CallbackFormModal'


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
      : (lang === 'fr' ? 'Quiz : quel créateur êtes-vous ?' : 'Quiz: what creator are you?')

  // Hide default CTA button on partners and academy pages
  const isCandidaturePage = pathname === '/candidature' || pathname === '/decouverte' || pathname === '/join-us' || pathname?.startsWith('/hire-our-team')
  const hideCTA = pathname === '/partners' || isCandidaturePage
  // Show partner CTA on partners page
  const isPartnersPage = pathname === '/partners'

  // Hide entirely on candidature page - after all hooks
  if (isCandidaturePage) return null

  // Hide header entirely on live page
  if (pathname === '/live') return null

  // Minimal header (logo only) on thank-you and webinar pages
  if (pathname === '/academy/merci' || pathname === '/webinar' || pathname === '/webinar/merci') {
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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-black/95 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 py-3.5">
        <div className="relative flex items-center justify-between gap-2 sm:gap-3 min-w-0">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-lg md:text-xl font-bold text-white group-hover:text-empire transition-colors">
              Empire
            </span>
          </a>


          {/* Right side */}
          <div className="flex items-center justify-end gap-2 lg:gap-3 min-w-0">
            {!hideCTA && (
              <a
                href="/quiz"
                className="hidden sm:inline-flex items-center gap-1.5 shrink-0 px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-empire text-black hover:scale-105 transition-all shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.2)]"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CallbackFormModal isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </header>
  )
}
