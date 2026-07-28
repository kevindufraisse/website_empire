'use client'

import { GlobalLumaCalendar } from '@/components/GlobalLumaCalendar'
import GiftCountdownModal from '@/components/GiftCountdownBar'
import ViralPostsOverlay from '@/components/ViralPostsOverlay'

export default function ClientWrappers() {
  return (
    <>
      <GlobalLumaCalendar />
      <GiftCountdownModal />
      <ViralPostsOverlay />
    </>
  )
}


