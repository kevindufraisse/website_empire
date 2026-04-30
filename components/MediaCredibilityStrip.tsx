'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Marquee from '@/components/magicui/marquee'

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
    <div className={`relative z-10 ${className}`}>
      <div className="flex flex-col items-start gap-1.5">
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-500 whitespace-nowrap">
          {lang === 'fr' ? 'Vu sur' : 'Featured in'}
        </span>
        <Marquee className="max-w-[280px] sm:max-w-[350px]" pauseOnHover>
          {OUTLETS.map((outlet) => (
            <span
              key={outlet}
              className="text-sm font-bold tracking-wide uppercase text-neutral-300 whitespace-nowrap mx-4"
            >
              {outlet}
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  )
}
