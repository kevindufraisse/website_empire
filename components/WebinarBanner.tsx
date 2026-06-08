'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'

const HIDDEN_ON = ['/webinar', '/webinar/merci', '/live', '/pay-as-you-go']

export default function WebinarBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [headerH, setHeaderH] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const header = document.querySelector('header')
    if (header) setHeaderH(header.offsetHeight)
  }, [])

  if (dismissed || HIDDEN_ON.some((p) => pathname.startsWith(p))) return null

  return (
    <>
      {/* Spacer so page content isn't hidden behind fixed banner */}
      <div style={{ height: 44 }} />
      <div
        className="fixed left-0 right-0 bg-neutral-900/95 backdrop-blur-sm border-b border-white/[0.06] py-2 px-4 z-[45]"
        style={{ top: headerH || 52 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center text-xs pr-6">
          <span className="text-neutral-400">
            Webinar gratuit le <span className="text-white font-semibold">18 juin à 19h</span> -
            Créer une armée de fans qui achètent tous vos produits
          </span>
          <a
            href="/webinar"
            className="px-2.5 py-1 bg-empire text-black font-bold rounded text-[10px] tracking-wide uppercase hover:brightness-110 transition-all flex-shrink-0"
          >
            S&apos;inscrire
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-neutral-500 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </>
  )
}
