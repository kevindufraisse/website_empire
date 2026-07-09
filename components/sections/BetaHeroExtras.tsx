'use client'

import { useEffect } from 'react'
import MediaCredibilityStrip from '@/components/MediaCredibilityStrip'

const SENJA_WIDGET_ID = 'fab105b8-802a-4091-abe8-0e3bb2fbe15a'
const SENJA_SCRIPT = `https://widget.senja.io/widget/${SENJA_WIDGET_ID}/platform.js`

export default function BetaHeroExtras() {
  useEffect(() => {
    if (document.querySelector(`script[src="${SENJA_SCRIPT}"]`)) return

    const script = document.createElement('script')
    script.src = SENJA_SCRIPT
    script.type = 'text/javascript'
    script.async = true
    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return (
    <div className="container relative z-10 -mt-6 pb-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-10">
        <div className="flex w-full justify-center">
          <MediaCredibilityStrip />
        </div>
        <div
          className="senja-embed w-full"
          data-id={SENJA_WIDGET_ID}
          data-mode="shadow"
          data-lazyload="false"
          style={{ display: 'block', width: '100%' }}
        />
      </div>
    </div>
  )
}
