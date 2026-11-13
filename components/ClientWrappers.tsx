'use client'

import { GlobalLumaCalendar } from '@/components/GlobalLumaCalendar'
import GiftCountdownModal from '@/components/GiftCountdownBar'
import ViralPostsOverlay from '@/components/ViralPostsOverlay'
import { OfferQuizGlobal } from '@/components/sections/OfferQuiz'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ClientWrappers() {
  const { lang } = useLanguage()
  const pathname = usePathname()
  // Free application flow: no paid-offer or workshop popups over the dossier.
  if (pathname === '/academy') return null
  return (
    <>
      <GlobalLumaCalendar />
      <GiftCountdownModal />
      <ViralPostsOverlay />
      <OfferQuizGlobal fr={lang === 'fr'} />
    </>
  )
}


