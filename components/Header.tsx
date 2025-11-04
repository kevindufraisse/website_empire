'use client'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { openVideoDialog } from '@/components/magicui/hero-video-dialog'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  const navLinks = [
    { label: t.header.formats || 'Formats', href: '/formats' },
    { label: t.header.product || 'Product', href: '/how-it-works' },
    { label: t.header.pricing, href: '/pricing' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-empire to-empire/50 flex items-center justify-center font-bold text-black text-sm">
              E
            </div>
            <span className="text-xl font-bold text-white group-hover:text-empire transition-colors">
              Empire Internet
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-neutral-300 hover:text-empire transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <div className="hidden lg:block text-xs text-empire font-semibold px-2 py-1 rounded bg-empire/10 border border-empire/30">
                  {t.header.spots}
                </div>
                <a
                  href="/pricing"
                  className="px-5 py-2.5 rounded-lg bg-empire text-black font-semibold hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.2)]"
                >
                  {t.header.getAccess}
                </a>
              </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-white/10 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-neutral-300 hover:text-empire transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
            <div className="mb-4">
              <LanguageSwitcher />
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                openVideoDialog()
              }}
              className="block w-full text-center px-5 py-2.5 rounded-lg bg-empire text-black font-semibold"
            >
              {t.header.watchDemo}
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}

