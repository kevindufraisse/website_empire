'use client'

import { GlobalLumaCalendar } from '@/components/GlobalLumaCalendar'
import GiftCountdownModal from '@/components/GiftCountdownBar'
import QuizHomePopup from '@/components/quiz/QuizHomePopup'
import ViralPostsOverlay from '@/components/ViralPostsOverlay'

export default function ClientWrappers() {
  return (
    <>
      <QuizHomePopup />
      <GlobalLumaCalendar />
      <GiftCountdownModal />
      <ViralPostsOverlay />
    </>
  )
}


