'use client'
import { useEffect } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import CallbackButton from '@/components/CallbackButton'

const CAL_LINK = 'team/empire-internet/audit-empire'

export default function YtCalEmbed() {
  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({})
      cal('ui', {
        theme: 'dark',
        hideEventTypeDetails: false,
        layout: 'month_view',
        cssVarsPerTheme: {
          light: { 'cal-brand': '#dafc68' },
          dark: { 'cal-brand': '#dafc68' },
        },
      })
    })()
  }, [])

  return (
    <div className="space-y-4">
      <Cal
        calLink={CAL_LINK}
        style={{ width: '100%', height: '100%', overflow: 'scroll' }}
        config={{ layout: 'month_view', theme: 'dark' }}
      />
      <div className="flex items-center justify-center gap-3 pt-2">
        <span className="text-xs text-neutral-600">Tu préfères être rappelé ?</span>
        <CallbackButton variant="subtle" />
      </div>
    </div>
  )
}
