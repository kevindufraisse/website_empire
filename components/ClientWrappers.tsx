'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { HeroVideoDialog } from '@/components/magicui/hero-video-dialog'
import { ExitIntentPopup } from '@/components/ExitIntentPopup'
import { GlobalLumaCalendar } from '@/components/GlobalLumaCalendar'

export default function ClientWrappers() {
  const { t } = useLanguage()

  return (
    <>
      {/* Global Video Dialog - available on all pages (no thumbnail, just the dialog) */}
      <HeroVideoDialog
        animationStyle="from-center"
        thumbnailSrc=""
        thumbnailAlt=""
      />

      {/* Exit Intent Popup */}
      <ExitIntentPopup />

      {/* Global Luma Calendar */}
      <GlobalLumaCalendar />
    </>
  )
}


