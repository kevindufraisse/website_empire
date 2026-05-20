'use client'

import { GlobalLumaCalendar } from '@/components/GlobalLumaCalendar'
import GiftCountdownModal from '@/components/GiftCountdownBar'
import QuizHomePopup from '@/components/quiz/QuizHomePopup'

export default function ClientWrappers() {
  return (
    <>
      <QuizHomePopup />
      <GlobalLumaCalendar />
      <GiftCountdownModal />
    </>
  )
}


