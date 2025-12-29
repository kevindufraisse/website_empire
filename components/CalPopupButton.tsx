'use client'
import { getCalApi } from "@calcom/embed-react"
import { useEffect } from "react"
import { useLanguage } from '@/contexts/LanguageContext'

interface CalPopupButtonProps {
  children: React.ReactNode
  className?: string
}

export default function CalPopupButton({ children, className }: CalPopupButtonProps) {
  const { lang } = useLanguage()
  
  const namespace = lang === 'fr' ? 'empire-request-fr' : 'empire-request'
  const calLink = lang === 'fr' ? 'kevin-dufraisse-private/empire-request-fr' : 'kevin-dufraisse-private/empire-request'

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace })
      cal("ui", { 
        hideEventTypeDetails: false, 
        layout: "month_view",
        theme: "dark",
        cssVarsPerTheme: {
          dark: {
            "cal-brand": "#dafc68"
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
