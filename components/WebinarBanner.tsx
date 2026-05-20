'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'

const HIDDEN_ON = ['/webinar', '/webinar/merci', '/live']

export default function WebinarBanner() {
  const [dismissed, setDismissed] = useState(false)
  const pathname = usePathname()

  if (dismissed || HIDDEN_ON.some((p) => pathname.startsWith(p))) return null

  return (
    <div className="relative bg-neutral-900 border-b border-white/[0.06] py-2 px-4 z-[55]">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center text-xs">
        <span className="text-neutral-400">
          Webinar gratuit le <span className="text-white font-semibold">18 juin à 19h</span> -
          Les secrets psychologiques des gourous du web
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
  )
}
