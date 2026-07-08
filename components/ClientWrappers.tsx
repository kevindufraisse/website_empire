'use client'

import { GlobalLumaCalendar } from '@/components/GlobalLumaCalendar'
import GiftCountdownModal from '@/components/GiftCountdownBar'
import QuizFloatingButton from '@/components/quiz/QuizFloatingButton'
import ViralPostsOverlay from '@/components/ViralPostsOverlay'

export default function ClientWrappers() {
  return (
    <>
      <QuizFloatingButton />
      <GlobalLumaCalendar />
      <GiftCountdownModal />
      <ViralPostsOverlay />
    </>
  )
}


