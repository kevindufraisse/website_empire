'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { postitJoinUrl } from '@/lib/postit'

/**
 * Header : logo + les 2 lives récurrents (pas de CTA Workshop).
 * - Portes ouvertes → /academy · chaque jeudi 11h
 * - Post it like it’s hot → inscription · chaque mercredi 12h
 */
export default function Header() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isCandidaturePage = pathname === '/candidature' || pathname === '/decouverte' || pathname === '/join-us' || pathname === '/postuler' || pathname?.startsWith('/hire-our-team')
  const isPartnersPage = pathname === '/partners'
  const isAcademyPage = pathname === '/academy' || pathname?.startsWith('/academy/')

  if (isCandidaturePage) return null
  if (pathname === '/live') return null

  if (pathname === '/academy/merci' || pathname === '/thank-you' || pathname === '/webinar' || pathname === '/webinar/merci' || pathname === '/final-offer' || pathname === '/vsl') {
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

  const liveLinks = (
    <>
      <a
        href="/academy"
        className={`group flex min-w-0 flex-col rounded-xl px-3 py-2 transition ${
          isAcademyPage ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'
        }`}
      >
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-white">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-academy opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-academy" />
          </span>
          {fr ? 'Portes ouvertes' : 'Open house'}
        </span>
        <span className="mt-0.5 pl-3 text-[11px] text-neutral-500 group-hover:text-neutral-400">
          {fr ? 'Tous les jeudis · 11h Paris' : 'Every Thursday · 11am Paris'}
        </span>
      </a>
      <a
        href={postitJoinUrl('header')}
        className="group flex min-w-0 flex-col rounded-xl px-3 py-2 transition hover:bg-white/[0.04]"
      >
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-white">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff7ec8] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ff7ec8]" />
          </span>
          Post it like it’s hot
        </span>
        <span className="mt-0.5 pl-3 text-[11px] text-neutral-500 group-hover:text-neutral-400">
          {fr ? 'Tous les mercredis · 12h Paris' : 'Every Wednesday · 12pm Paris'}
        </span>
      </a>
    </>
  )

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/20 bg-black/95 backdrop-blur-md">
        <nav className="mx-auto max-w-7xl px-4 py-3">
          <div className="relative flex items-center justify-between gap-3 min-w-0">
            <a href="/" className="flex shrink-0 items-center gap-2 group">
              <span className="text-lg font-bold text-white transition-colors group-hover:text-empire md:text-xl">
                Empire
              </span>
            </a>

            {/* Desktop : les 2 lives */}
            <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-stretch gap-1 md:flex">
              <p className="mr-1 self-center text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
                Lives
              </p>
              {liveLinks}
            </div>

            <div className="flex min-w-0 items-center justify-end gap-2">
              {isPartnersPage && (
                <button
                  type="button"
                  className="systeme-show-popup-5606340 hidden cursor-pointer rounded-lg bg-empire px-4 py-2 text-sm font-semibold text-black shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.2)] transition-all hover:scale-105 sm:block md:px-5 md:py-2.5 md:text-base"
                >
                  {fr ? 'Obtenir mon lien' : 'Get my sharable link'}
                </button>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-white transition-colors hover:text-empire md:hidden"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-white/10 bg-black/98 md:hidden"
            >
              <div className="space-y-3 px-4 py-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
                  {fr ? 'Nos lives' : 'Our lives'}
                </p>
                <a
                  href="/academy"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex flex-col rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5"
                >
                  <span className="text-sm font-semibold text-white">
                    {fr ? 'Portes ouvertes' : 'Open house'}
                  </span>
                  <span className="mt-1 text-[12px] text-academy">
                    {fr ? 'Tous les jeudis · 11h Paris' : 'Every Thursday · 11am Paris'}
                  </span>
                  <span className="mt-1 text-[12px] text-neutral-500">
                    {fr ? 'Programme partenaire' : 'Partner program'}
                  </span>
                </a>
                <a
                  href={postitJoinUrl('header_mobile')}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex flex-col rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5"
                >
                  <span className="text-sm font-semibold text-white">Post it like it’s hot</span>
                  <span className="mt-1 text-[12px] text-[#ff7ec8]">
                    {fr ? 'Tous les mercredis · 12h Paris' : 'Every Wednesday · 12pm Paris'}
                  </span>
                </a>
                {isPartnersPage && (
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="systeme-show-popup-5606340 w-full cursor-pointer rounded-lg bg-empire py-3.5 font-bold text-black shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.2)] transition-all hover:scale-[1.02]"
                  >
                    {fr ? 'Obtenir mon lien' : 'Get my sharable link'}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
