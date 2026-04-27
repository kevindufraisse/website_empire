'use client'

import { ExitIntentPopup } from '@/components/ExitIntentPopup'
import { GlobalLumaCalendar } from '@/components/GlobalLumaCalendar'
import GiftCountdownModal from '@/components/GiftCountdownBar'

export default function ClientWrappers() {
  return (
    <>
      <ExitIntentPopup />
      <GlobalLumaCalendar />
      <GiftCountdownModal />
    </>
  )
}


