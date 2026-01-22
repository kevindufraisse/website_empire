'use client'
import { getCalApi } from "@calcom/embed-react"
import { useEffect } from "react"
import { useLanguage } from '@/contexts/LanguageContext'

interface CalPopupButtonProps {
  children: React.ReactNode
  className?: string
}

export default function CalPopupButton({ children, className }: CalPopupButtonProps) {
  const namespace = 'empire-demo'
  const calLink = 'jules-bernard-g7tpow/empire-demo'

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace })
      cal("ui", { 
        hideEventTypeDetails: false, 
        layout: "month_view",
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#dafc68" },
          dark: { "cal-brand": "#dafc68" }
        }
      })
      
      // Facebook Pixel tracking for booking confirmation
      cal("on", {
        action: "bookingSuccessful",
        callback: () => {
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Schedule')
            console.log('Facebook Pixel: Schedule event fired')
          }
        }
      })
    })()
  }, [namespace])

  return (
    <button
      data-cal-namespace={namespace}
      data-cal-link={calLink}
      data-cal-config='{"layout":"month_view","theme":"dark"}'
      className={className}
    >
      {children}
    </button>
  )
}
