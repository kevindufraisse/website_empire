'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import YtLeadForm from '@/components/YtLeadForm'
import { useLanguage } from '@/contexts/LanguageContext'

// Pages où le formulaire est déjà la page elle-même : le lien reste un lien.
const FORM_PAGES = ['/join-us', '/decouverte', '/candidature', '/postuler', '/legende']

/**
 * Un clic sur un lien vers /join-us (sans paramètre) ouvre le formulaire
 * « Réserve ton appel gratuit » dans une fenêtre, puis le calendrier, sans
 * quitter la page. Clic avec Cmd/Ctrl/Maj, clic milieu ou lien avec paramètres
 * (parcours Légende) : le lien garde son comportement normal.
 */
export default function DemoPopup() {
  const { lang } = useLanguage()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const fr = lang === 'fr'

  useEffect(() => {
    if (FORM_PAGES.includes(pathname || '')) return
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a')
      if (!a || a.target === '_blank') return
      let url: URL
      try { url = new URL(a.href, window.location.href) } catch { return }
      if (url.origin !== window.location.origin || url.pathname !== '/join-us' || url.search || url.hash) return
      e.preventDefault()
      setOpen(true)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!open) return null
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
    >
      <div role="dialog" aria-modal="true" className="relative max-h-[92svh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-white/10 bg-[#0d0d0d] p-5 sm:rounded-2xl">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={fr ? 'Fermer' : 'Close'}
          className="absolute right-3 top-3 rounded-full p-1.5 text-neutral-400 transition-colors hover:text-white"
        >
          <X size={18} />
        </button>
        <div className="mb-5 pr-8">
          <h2 className="text-lg font-bold text-white">{fr ? 'Réserve ton appel gratuit' : 'Book your free call'}</h2>
          <p className="mt-1 text-xs text-neutral-400">{fr ? '30 secondes - choisis ensuite ton créneau.' : '30 seconds - then pick your slot.'}</p>
        </div>
        <YtLeadForm eventName="demo_popup_lead_form" />
      </div>
    </div>,
    document.body,
  )
}
