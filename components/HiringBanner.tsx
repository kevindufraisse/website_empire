'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function HiringBanner() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed top-[72px] left-0 right-0 z-40 bg-empire border-b border-empire/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4 relative">
          <div className="flex items-center gap-3 text-center">
            <span className="text-black font-bold text-sm whitespace-nowrap">
              {t.header.hiring || 'We are hiring'}
            </span>
            <span className="hidden sm:inline text-black/80 text-sm">
              {t.hiring?.bannerText || 'Rejoins Empire Internet — 2 postes ouverts'}
            </span>
            <Link
              href="/careers"
              className="text-black hover:text-black/80 underline text-sm font-medium transition-colors"
            >
              {t.hiring?.bannerButton || 'Voir les postes'}
            </Link>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-0 text-black/70 hover:text-black transition-colors p-1 flex-shrink-0"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
