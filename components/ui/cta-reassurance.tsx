'use client'

import { useLanguage } from '@/contexts/LanguageContext'

type CtaReassuranceProps = {
  className?: string
  /** `end` = header CTA column (right-aligned). */
  align?: 'center' | 'start' | 'end'
}

export function CtaReassurance({ className = '', align = 'center' }: CtaReassuranceProps) {
  const { t } = useLanguage()
  const alignClass =
    align === 'start'
      ? 'text-left max-w-lg'
      : align === 'end'
        ? 'text-right max-w-[14rem] ml-auto'
        : 'text-center max-w-md mx-auto'

  return (
    <p className={`text-xs text-neutral-500 leading-relaxed ${alignClass} ${className}`}>
      {t.common.ctaReassurance}
    </p>
  )
}
