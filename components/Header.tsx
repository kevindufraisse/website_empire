'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { ChevronDown, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { postitJoinUrl } from '@/lib/postit'
import { startFreeTrial } from '@/lib/startTrial'
import { trackAmplitude } from '@/lib/amplitude'

/**
 * Deux portes et un prix : Empire (publier pour son business), Devenir
 * partenaire (en faire son métier), Tarifs. Les deux lives gratuits sont
 * rangés dans un menu où chacun dit ce qu'il est. Un seul bouton à droite :
 * l'essai gratuit, ou les portes ouvertes sur les pages partenaire.
 */
export default function Header() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [livesOpen, setLivesOpen] = useState(false)
  const livesRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!livesOpen) return
    const close = (e: MouseEvent) => {
      if (!livesRef.current?.contains(e.target as Node)) setLivesOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [livesOpen])

  const isCandidaturePage = pathname === '/candidature' || pathname === '/decouverte' || pathname === '/join-us' || pathname === '/postuler' || pathname?.startsWith('/hire-our-team')
  const isPartnersPage = pathname === '/partners'
  const isAcademyPage = pathname === '/academy' || pathname?.startsWith('/academy/')

  if (isCandidaturePage) return null
  if (pathname === '/live') return null

  if (pathname === '/academy/merci' || pathname === '/thank-you' || pathname === '/webinar' || pathname === '/webinar/merci' || pathname === '/final-offer' || pathname === '/vsl' || pathname === '/partenaire') {
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

  const doors = [
    { href: '/', label: 'Empire', active: pathname === '/' },
    { href: '/tarifs', label: fr ? 'Tarifs' : 'Pricing', active: pathname === '/tarifs' },
    { href: '/academy', label: fr ? 'Devenir partenaire' : 'Become a partner', active: isAcademyPage },
  ]

  const lives = [
    {
      href: postitJoinUrl('header'),
      name: 'Post it like it’s hot',
      when: fr ? 'Mercredi · 12h' : 'Wednesday · 12pm',
      what: fr ? 'On trouve ton prochain contenu viral, en direct, sur ton business.' : 'We find your next viral piece, live, on your business.',
      dot: 'bg-[#ff7ec8]',
    },
    {
      href: '/academy#portes-ouvertes',
      name: fr ? 'Portes ouvertes' : 'Open house',
      when: fr ? 'Jeudi · 11h' : 'Thursday · 11am',
      what: fr ? 'Découvrir le programme partenaire et poser tes questions.' : 'Discover the partner program and ask your questions.',
      dot: 'bg-academy',
    },
  ]

  const onTrial = () => {
    trackAmplitude('header_trial_clicked', { path: pathname })
    setIsMenuOpen(false)
    startFreeTrial()
  }

  const cta = isPartnersPage ? (
    <button
      type="button"
      className="systeme-show-popup-5606340 cursor-pointer rounded-lg bg-empire px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
    >
      {fr ? 'Obtenir mon lien' : 'Get my sharable link'}
    </button>
  ) : isAcademyPage ? (
    <a
      href="/academy#portes-ouvertes"
      onClick={() => setIsMenuOpen(false)}
      className="rounded-lg bg-academy px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
    >
      {fr ? 'Portes ouvertes · jeudi 11h' : 'Open house · Thu 11am'}
    </a>
  ) : (
    <button
      type="button"
      onClick={onTrial}
      className="cursor-pointer rounded-lg bg-empire px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
    >
      {fr ? 'Essai gratuit' : 'Free trial'}
    </button>
  )

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/20 bg-black/95 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <a href="/" className="group flex shrink-0 items-center gap-2">
            <span className="text-lg font-bold text-white transition-colors group-hover:text-empire md:text-xl">
              Empire
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {doors.map((d) => (
              <a
                key={d.href}
                href={d.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${d.active ? 'bg-white/[0.07] text-white' : 'text-neutral-300 hover:bg-white/[0.04] hover:text-white'}`}
              >
                {d.label}
              </a>
            ))}
            <div ref={livesRef} className="relative">
              <button
                type="button"
                onClick={() => setLivesOpen((o) => !o)}
                aria-expanded={livesOpen}
                className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-neutral-300 transition hover:bg-white/[0.04] hover:text-white"
              >
                {fr ? 'Lives gratuits' : 'Free lives'}
                <ChevronDown className={`h-4 w-4 transition-transform ${livesOpen ? 'rotate-180' : ''}`} />
              </button>
              {livesOpen && (
                <div className="absolute left-1/2 top-full mt-2 w-80 -translate-x-1/2 rounded-xl border border-white/10 bg-[#0d0d0d] p-2 shadow-2xl">
                  {lives.map((l) => (
                    <a
                      key={l.name}
                      href={l.href}
                      onClick={() => setLivesOpen(false)}
                      className="block rounded-lg px-3 py-2.5 transition hover:bg-white/[0.05]"
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold text-white">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${l.dot}`} />
                        {l.name}
                        <span className="ml-auto text-[11px] font-normal text-neutral-500">{l.when}</span>
                      </span>
                      <span className="mt-0.5 block pl-3.5 text-[12px] leading-snug text-neutral-400">{l.what}</span>
                    </a>
                  ))}
                  <p className="px-3 pb-1 pt-2 text-[11px] text-neutral-600">{fr ? 'Gratuit · heure de Paris' : 'Free · Paris time'}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex min-w-0 items-center justify-end gap-2">
            <div className="hidden sm:block">{cta}</div>
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
            <div className="space-y-1 px-4 py-5">
              {doors.map((d) => (
                <a
                  key={d.href}
                  href={d.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block rounded-lg px-3 py-3 text-base font-semibold ${d.active ? 'bg-white/[0.07] text-white' : 'text-neutral-200'}`}
                >
                  {d.label}
                </a>
              ))}
              <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
                {fr ? 'Lives gratuits' : 'Free lives'}
              </p>
              {lives.map((l) => (
                <a
                  key={l.name}
                  href={l.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${l.dot}`} />
                    {l.name}
                    <span className="ml-auto text-[11px] font-normal text-neutral-500">{l.when}</span>
                  </span>
                  <span className="mt-1 block text-[12px] text-neutral-400">{l.what}</span>
                </a>
              ))}
              <div className="pt-4 [&>*]:block [&>*]:w-full [&>*]:py-3.5 [&>*]:text-center [&>*]:text-base">{cta}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
