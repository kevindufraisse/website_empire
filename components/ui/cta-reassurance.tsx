'use client'

import { useLanguage } from '@/contexts/LanguageContext'

type CtaReassuranceProps = {
  className?: string
  /** Default: centered under hero-style CTAs. Use `start` for left-aligned blocks (e.g. cards). */
  align?: 'center' | 'start'
}

export function CtaReassurance({ className = '', align = 'center' }: CtaReassuranceProps) {
  const { t } = useLanguage()
  const alignClass =
    align === 'start' ? 'text-left max-w-lg' : 'text-center max-w-md mx-auto'

  return (
    <p className={`text-xs text-neutral-500 leading-relaxed ${alignClass} ${className}`}>
      {t.common.ctaReassurance}
    </p>
  )
}
