'use client'

import { useLanguage } from '@/contexts/LanguageContext'

type CtaReassuranceProps = {
  className?: string
  /** Default: centered under hero-style CTAs. Use `start` / `end` for cards or header. */
  align?: 'center' | 'start' | 'end'
  /** `compact` = one line for header, sticky bar, banner */
  variant?: 'full' | 'compact'
}

export function CtaReassurance({
  className = '',
  align = 'center',
  variant = 'full',
}: CtaReassuranceProps) {
  const { t } = useLanguage()
  const alignClass =
    align === 'start'
      ? 'text-left max-w-lg'
      : align === 'end'
        ? 'text-right max-w-[14rem] ml-auto'
        : 'text-center max-w-md mx-auto'

  const copy =
    variant === 'compact' ? t.common.ctaReassuranceNav : t.common.ctaReassurance

  return (
    <p className={`text-xs text-neutral-500 leading-relaxed ${alignClass} ${className}`}>
      {copy}
    </p>
  )
}
