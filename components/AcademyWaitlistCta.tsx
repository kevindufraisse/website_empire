'use client'

import type { ReactNode } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'
import { WEBINARJAM_LIVE, WEBINARJAM_REGISTER_URL } from '@/lib/webinarjam'

/**
 * CTA Academy → portes ouvertes WebinarJam (jeudi 11h Paris).
 * Garde le même API que l’ancienne waitlist pour ne pas toucher tous les call sites.
 */
export default function AcademyWaitlistCta({
  children,
  className = '',
  source,
  sublabel,
}: {
  children: ReactNode
  className?: string
  /** Which CTA was clicked, for analytics. */
  source: string
  sublabel?: ReactNode
}) {
  const { lang } = useLanguage()
  const href = WEBINARJAM_LIVE ? WEBINARJAM_REGISTER_URL : '#portes-ouvertes'

  return (
    <>
      <a
        href={href}
        target={WEBINARJAM_LIVE ? '_blank' : undefined}
        rel={WEBINARJAM_LIVE ? 'noopener noreferrer' : undefined}
        onClick={() => trackAmplitude('academy_open_house_clicked', { source, lang })}
        className={className}
      >
        {children}
      </a>
      {sublabel}
    </>
  )
}
