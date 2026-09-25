'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { postitJoinUrl } from '@/lib/postit'

const SOUND_BARS = [
  { h: 8, d: 0.7, delay: 0 },
  { h: 14, d: 0.9, delay: 0.12 },
  { h: 18, d: 0.62, delay: 0.28 },
  { h: 11, d: 1.05, delay: 0.08 },
  { h: 16, d: 0.76, delay: 0.2 },
]

function SoundBars() {
  return (
    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center gap-[2px] rounded-full bg-black/50" aria-hidden>
      {SOUND_BARS.map((bar, i) => (
        <span
          key={i}
          className={`voicebar block w-[2px] rounded-full ${i === SOUND_BARS.length - 1 ? 'bg-[#ff7ec8]' : 'bg-empire'}`}
          style={{ height: bar.h, animationDuration: `${bar.d}s`, animationDelay: `${bar.delay}s` }}
        />
      ))}
    </span>
  )
}

export default function Header() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

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
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/20 bg-black/95 backdrop-blur-md">
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
                    href={postitJoinUrl('header')}
                    className="group hidden items-center gap-2.5 rounded-full border border-empire/45 bg-empire/10 py-1.5 pl-2 pr-4 text-left shadow-[0_0_22px_rgb(var(--empire-rgb)/0.22)] transition hover:bg-empire/20 md:inline-flex"
                  >
                    <SoundBars />
                    <span className="leading-none">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                        {fr ? 'Rejoins l’événement' : 'Join the event'}
                      </span>
                      <span className="mt-1 block text-[13px] font-bold tracking-tight text-empire">
                        Post it like it’s <span className="text-[#ff7ec8]">hot</span>
                      </span>
                    </span>
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
                      href={postitJoinUrl('header_mobile')}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-empire/45 bg-empire/10 py-3.5 text-white shadow-[0_0_22px_rgb(var(--empire-rgb)/0.18)]"
                    >
                      <SoundBars />
                      <span className="text-left leading-none">
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                          {fr ? 'Rejoins l’événement' : 'Join the event'}
                        </span>
                        <span className="mt-1 block text-sm font-bold text-empire">
                          Post it like it’s <span className="text-[#ff7ec8]">hot</span>
                        </span>
                      </span>
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
      </header>

    </>
  )
}
