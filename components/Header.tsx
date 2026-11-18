'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { ChevronDown, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { postitJoinUrl } from '@/lib/postit'
import { partnerPayHref } from '@/lib/partner-festival-pricing'
import JoinPartnersLabel from '@/components/JoinPartnersLabel'
import { startFreeTrial, TRIAL_URL } from '@/lib/startTrial'
import { trackAmplitude } from '@/lib/amplitude'

// Programme d'affiliation : un second compte Instagram qui publie les reels
// d'Empire, 15 % du premier paiement de chaque client venu du lien en bio.
const AFFILIATE_URL = 'https://app.empire-internet.com/affiliate/join/434a8db1'

type MenuItem = { href: string; name: string; what: string; external?: boolean }
type MenuKey = 'resources'
type NavLink = { key: string; href: string; label: string; external?: boolean }

/**
 * En-tête du site, dans cet ordre (Kevin, 18 novembre 2026) : « Empire » en
 * texte (pas de logo E),
 * « Travailler en 1-to-1 » (la page /legende, qui a aussi ce header),
 * « Devenir affilié », « Contenus gratuits » (menu), puis « Se connecter » et
 * un seul bouton. Pas de menu Produit ni de prix (ni lien Tarifs, ni prix
 * barré) ; la page /tarifs reste joignable directement. Les pages Academy
 * gardent leur propre bouton.
 */
export default function Header() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!openMenu) return
    const close = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null)
    }
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenMenu(null) }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', escape) }
  }, [openMenu])

  const isCandidaturePage = pathname === '/candidature' || pathname === '/decouverte' || pathname === '/join-us' || pathname === '/postuler' || pathname?.startsWith('/hire-our-team')
  const isPartnersPage = pathname === '/partners'
  const isAcademyPage = pathname === '/academy' || pathname?.startsWith('/academy/')

  if (isCandidaturePage) return null
  if (pathname === '/live' || pathname === '/tarifs') return null

  if (pathname === '/academy/merci' || pathname === '/thank-you' || pathname === '/webinar' || pathname === '/webinar/merci' || pathname === '/final-offer' || pathname === '/vsl' || pathname === '/partenaire') {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-black/95 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-4 py-3.5">
          <a href="/" className="group flex w-fit shrink-0 items-center gap-2" aria-label="Empire">
            <span className="text-lg font-bold tracking-tight text-white md:text-xl">Empire</span>
          </a>
        </nav>
      </header>
    )
  }

  const menus: { key: MenuKey; label: string; active: boolean; items: MenuItem[] }[] = [
    {
      key: 'resources', label: fr ? 'Contenus gratuits' : 'Free content', active: false, items: [
        { href: '/vsl', name: fr ? 'Masterclass Empire' : 'Empire masterclass', what: fr ? 'La méthode expliquée pas à pas, 1 h 26. Gratuit.' : 'The method, step by step, 1h26. Free.' },
        { href: postitJoinUrl('header'), name: 'Post it like it’s hot', what: fr ? 'En direct le lundi à 14 h : on trouve ton prochain contenu viral.' : 'Live on Mondays at 2pm: we find your next viral piece.', external: true },
        { href: 'https://join.empire-internet.com/instagram-scrapper', name: fr ? 'Trouver les Reels viraux' : 'Find viral Reels', what: fr ? 'D’un compte Instagram. Gratuit.' : 'From any Instagram account. Free.', external: true },
        { href: 'https://join.empire-internet.com/3-templates-linkedin', name: fr ? 'Mes 3 templates LinkedIn' : 'My 3 LinkedIn templates', what: fr ? 'Les plus viraux, à copier-coller. Gratuit.' : 'The most viral ones, copy-paste. Free.', external: true },
      ],
    },
  ]

  const links: NavLink[] = [
    { key: 'one-to-one', href: '/legende', label: fr ? 'Travailler en 1-to-1' : 'Work 1-to-1' },
    { key: 'affiliate', href: AFFILIATE_URL, label: fr ? 'Devenir affilié' : 'Become an affiliate', external: true },
  ]

  const onMenuItem = (menu: MenuKey, item: MenuItem) => {
    trackAmplitude('header_menu_clicked', { menu, item: item.name, path: pathname })
    setOpenMenu(null)
    setIsMenuOpen(false)
  }
  const onLink = (link: NavLink) => {
    trackAmplitude('header_menu_clicked', { menu: link.key, item: link.label, path: pathname })
    setOpenMenu(null)
    setIsMenuOpen(false)
  }

  const onTrial = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    trackAmplitude('header_trial_clicked', { path: pathname })
    setIsMenuOpen(false)
    startFreeTrial()
  }

  const loginHref = `https://app.empire-internet.com/login${fr ? '?lang=fr' : ''}`
  const onLogin = () => {
    trackAmplitude('header_login_clicked', { path: pathname })
    setIsMenuOpen(false)
  }

  const cta = isPartnersPage ? (
    <button
      type="button"
      className="systeme-show-popup-5606340 cursor-pointer rounded-lg bg-empire px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
    >
      {fr ? 'Obtenir mon lien' : 'Get my sharable link'}
    </button>
  ) : pathname === '/academy' ? (
    <a href="#candidature" onClick={() => setIsMenuOpen(false)} className="rounded-lg bg-empire px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110">
      {fr ? 'Candidater' : 'Apply'}
    </a>
  ) : pathname === '/academy/ancienne' ? (
    // Sur la page récit (PartnerProgramPage), le prix n'apparaît qu'à la porte
    // (dernière séquence) : le bouton y descend, sans montant.
    <a
      href="#porte"
      onClick={() => setIsMenuOpen(false)}
      className="rounded-lg bg-academy px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
    >
      {fr ? 'Rejoindre Empire Partners' : 'Join Empire Partners'}
    </a>
  ) : isAcademyPage ? (
    <a
      href={partnerPayHref()}
      onClick={() => setIsMenuOpen(false)}
      className="rounded-lg bg-academy px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
    >
      <JoinPartnersLabel fr={fr} />
    </a>
  ) : (
    <a
      href={TRIAL_URL}
      onClick={onTrial}
      className="inline-flex items-center justify-center cursor-pointer rounded-lg bg-empire px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
    >
      {fr ? 'Commencer gratuitement' : 'Get started for free'}
    </a>
  )

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 py-3" aria-label={fr ? 'Navigation principale' : 'Main navigation'}>
        <div className="flex min-w-0 items-center justify-between gap-3">
          <a href="/" className="group flex shrink-0 items-center gap-2" aria-label="Empire">
            <span className="text-lg font-bold tracking-tight text-white md:text-xl">Empire</span>
          </a>

          <div ref={navRef} className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <a
                key={l.key}
                href={l.href}
                aria-current={pathname === l.href ? 'page' : undefined}
                {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={() => onLink(l)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${pathname === l.href ? 'bg-white/[0.07] text-white' : 'text-neutral-300 hover:bg-white/[0.04] hover:text-white'}`}
              >
                {l.label}
              </a>
            ))}
            {menus.map((m) => (
              <div key={m.key} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMenu((o) => (o === m.key ? null : m.key))}
                  aria-expanded={openMenu === m.key}
                  aria-haspopup="true"
                  className={`flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition ${m.active || openMenu === m.key ? 'bg-white/[0.07] text-white' : 'text-neutral-300 hover:bg-white/[0.04] hover:text-white'}`}
                >
                  {m.label}
                  <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === m.key ? 'rotate-180' : ''}`} />
                </button>
                {openMenu === m.key && (
                  <div className="absolute left-1/2 top-full mt-2 w-[340px] -translate-x-1/2 rounded-xl border border-white/10 bg-[#0d0d0d] p-2 shadow-2xl" role="menu">
                    {m.items.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        role="menuitem"
                        {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        onClick={() => onMenuItem(m.key, item)}
                        className="block rounded-lg px-3 py-2.5 transition hover:bg-white/[0.05]"
                      >
                        <span className="block text-sm font-semibold text-white">{item.name}</span>
                        <span className="mt-0.5 block text-[12px] leading-snug text-neutral-400">{item.what}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex min-w-0 items-center justify-end gap-2">
            <a
              href={loginHref}
              onClick={onLogin}
              className="hidden whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-neutral-300 transition hover:bg-white/[0.04] hover:text-white sm:block"
            >
              {fr ? 'Se connecter' : 'Log in'}
            </a>
            <div className="hidden sm:block">{cta}</div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white transition-colors hover:text-empire lg:hidden"
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
            className="border-t border-white/10 bg-black/98 lg:hidden"
          >
            <div className="max-h-[calc(100svh-64px)] space-y-1 overflow-y-auto px-4 py-5">
              {links.map((l) => (
                <a
                  key={l.key}
                  href={l.href}
                  {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  onClick={() => onLink(l)}
                  className="block rounded-lg px-3 py-3 text-base font-semibold text-white"
                >
                  {l.label}
                </a>
              ))}
              {menus.map((m) => (
                <div key={m.key} className="pb-2">
                  <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-600">{m.label}</p>
                  {m.items.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      onClick={() => onMenuItem(m.key, item)}
                      className="block rounded-lg px-3 py-2.5"
                    >
                      <span className="block text-[15px] font-semibold text-white">{item.name}</span>
                      <span className="mt-0.5 block text-[12px] leading-snug text-neutral-400">{item.what}</span>
                    </a>
                  ))}
                </div>
              ))}
              <a
                href={loginHref}
                onClick={onLogin}
                className="mt-3 block rounded-lg border border-white/15 px-3 py-3 text-center text-base font-semibold text-white"
              >
                {fr ? 'Se connecter' : 'Log in'}
              </a>
              <div className="pt-4 [&>*]:block [&>*]:w-full [&>*]:py-3.5 [&>*]:text-center [&>*]:text-base">{cta}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
