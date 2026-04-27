'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { Star } from 'lucide-react'

export function StarRating({ className }: { className?: string }) {
  const { t } = useLanguage()
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className="text-empire"
            size={16}
            fill="var(--empire-hex)"
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-neutral-300">
        4,9 <span className="text-neutral-400">/5</span>
      </span>
      <span className="text-xs text-neutral-400">
        · 53 avis
      </span>
    </div>
  )
}

