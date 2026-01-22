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
      
      // Redirect to thank-you page after booking (for reliable tracking)
      cal("on", {
        action: "bookingSuccessful",
        callback: () => {
          console.log('Cal.com booking successful!')
          window.location.href = '/demo/thank-you'
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
