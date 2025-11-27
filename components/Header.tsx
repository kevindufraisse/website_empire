'use client'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()

  const navLinks = [
    { label: t.header.product || 'Product', href: '/formats' },
    { label: t.header.howItWorks, href: '/how-it-works' },
    { label: t.header.pricing, href: '/pricing' },
  ]
  
  const isActive = (href: string) => pathname === href

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-black/95 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 py-3.5">
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
                className={`text-sm font-medium transition-all relative group ${
                  isActive(link.href)
                    ? 'text-empire'
                    : 'text-neutral-300 hover:text-empire'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-empire rounded-full" />
                )}
                {!isActive(link.href) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-empire rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                )}
              </a>
            ))}
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <button
                  onClick={() => router.push('/demo')}
                  className="px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all text-sm whitespace-nowrap cursor-pointer"
                >
                  {t.header.joinQA}
                </button>
                <a
                  href="/pricing"
                  className="px-5 py-2.5 rounded-lg bg-empire text-black font-semibold hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.2)] flex items-center gap-2"
                >
                  <span className="hidden lg:inline text-xs text-black/70 font-semibold px-2 py-0.5 rounded bg-black/10">
                    {t.header.spots}
                  </span>
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
                className={`block text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-empire'
                    : 'text-neutral-300 hover:text-empire'
                }`}
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
                router.push('/demo')
              }}
              className="block w-full text-center px-5 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white font-semibold mb-3"
            >
              {t.header.joinQA}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                router.push('/demo')
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

