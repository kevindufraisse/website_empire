'use client'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default function Header() {
  const { t } = useLanguage()
  const router = useRouter()

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

          {/* Right side - CTA Button */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => router.push('/demo')}
              className="px-5 py-2.5 rounded-lg bg-empire text-black font-semibold hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.2)]"
            >
              {t.header.joinQA}
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

