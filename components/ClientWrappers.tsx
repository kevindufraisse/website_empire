'use client'

import { ExitIntentPopup } from '@/components/ExitIntentPopup'
import { GlobalLumaCalendar } from '@/components/GlobalLumaCalendar'
import GiftCountdownModal from '@/components/GiftCountdownBar'
import QuizHomePopup from '@/components/quiz/QuizHomePopup'

export default function ClientWrappers() {
  return (
    <>
      <QuizHomePopup />
      <ExitIntentPopup />
      <GlobalLumaCalendar />
      <GiftCountdownModal />
    </>
  )
}


