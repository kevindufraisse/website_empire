'use client'

import { GlobalLumaCalendar } from '@/components/GlobalLumaCalendar'
import GiftCountdownModal from '@/components/GiftCountdownBar'
import ViralPostsOverlay from '@/components/ViralPostsOverlay'
import { OfferQuizGlobal } from '@/components/sections/OfferQuiz'
import CreatorQuizExitIntent from '@/components/CreatorQuizExitIntent'
import HomeEmailGate from '@/components/HomeEmailGate'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ClientWrappers() {
  const { lang } = useLanguage()
  return (
    <>
      <GlobalLumaCalendar />
      <GiftCountdownModal />
      <ViralPostsOverlay />
      <OfferQuizGlobal fr={lang === 'fr'} />
      <CreatorQuizExitIntent />
      <HomeEmailGate />
    </>
  )
}


