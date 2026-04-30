'use client'

import { useLanguage } from '@/contexts/LanguageContext'

const OUTLETS = [
  'BIG MEDIA',
  'BFM BUSINESS',
  'NOUVEL OBS',
  'THE FAMILY',
]

interface MediaCredibilityStripProps {
  className?: string
}

export default function MediaCredibilityStrip({ className = '' }: MediaCredibilityStripProps) {
  const { lang } = useLanguage()

  return (
    <div className={`relative z-10 w-full ${className}`}>
      <div className="flex items-center justify-center gap-4 sm:gap-6">
        <span className="text-xs font-bold tracking-[0.15em] uppercase text-neutral-500 whitespace-nowrap">
          {lang === 'fr' ? 'Vu sur' : 'Featured in'}
        </span>
        <div className="h-px w-6 bg-white/10" />
        <div className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-8 gap-y-2">
          {OUTLETS.map((outlet) => (
            <span
              key={outlet}
              className="text-sm sm:text-base font-bold tracking-wide uppercase text-neutral-300 whitespace-nowrap"
            >
              {outlet}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
