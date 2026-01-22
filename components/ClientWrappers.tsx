'use client'

import { ExitIntentPopup } from '@/components/ExitIntentPopup'
import { GlobalLumaCalendar } from '@/components/GlobalLumaCalendar'

export default function ClientWrappers() {
  return (
    <>
      {/* Exit Intent Popup */}
      <ExitIntentPopup />

      {/* Global Luma Calendar */}
      <GlobalLumaCalendar />
    </>
  )
}


