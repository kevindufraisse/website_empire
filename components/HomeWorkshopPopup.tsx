'use client'

/**
 * Fenêtre « Workshop gratuit » de la home. Remplace l'ancienne porte email
 * (`HomeEmailGate`), qui bloquait le scroll et ramenait la page en arrière :
 * l'email se demande maintenant dans la vidéo (/vsl, à 5 min).
 *
 * Elle apparaît une fois que le visiteur a passé les logos presse et les avis
 * (même sentinelle `#home-gate-trigger`), ne bloque rien, et ne revient plus
 * une fois fermée ou cliquée (localStorage).
 */

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ArrowRight, Play, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'

const TRIGGER_ID = 'home-gate-trigger'
const STORAGE_KEY = 'home-workshop-popup-v1'
const VIDEO_THUMB = 'https://i.ytimg.com/vi/AKfoDblGUNs/mqdefault.jpg'

function alreadySeen(): boolean {
  try {
    return !!localStorage.getItem(STORAGE_KEY)
  } catch {
    return false
  }
}

function markSeen(value: string) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // navigation privée
  }
}

export default function HomeWorkshopPopup() {
  const pathname = usePathname()
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  // Contrôle au scroll plutôt qu'IntersectionObserver : la sentinelle fait
  // 1 px, et un scroll rapide la fait passer de « sous l'écran » à « au-dessus »
  // sans jamais l'intersecter, donc sans aucun événement.
  useEffect(() => {
    if (pathname !== '/' || alreadySeen()) return
    let raf = 0
    const check = () => {
      raf = 0
      const el = document.getElementById(TRIGGER_ID)
      if (!el || el.getBoundingClientRect().top > window.innerHeight * 0.5) return
      window.removeEventListener('scroll', onScroll)
      setOpen(true)
      trackAmplitude('home_workshop_popup_shown')
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [pathname])

  const close = () => {
    markSeen('dismissed')
    setOpen(false)
    trackAmplitude('home_workshop_popup_dismissed')
  }

  const go = () => {
    markSeen('clicked')
    trackAmplitude('home_workshop_popup_clicked')
  }

  if (!mounted || pathname !== '/') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="home-workshop-popup"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-label={fr ? 'Workshop gratuit' : 'Free workshop'}
          className="fixed z-[70] bottom-20 left-3 right-3 sm:right-auto sm:left-4 sm:bottom-4 sm:w-[360px]"
        >
          <div className="relative rounded-2xl border border-empire/30 bg-[#111]/95 backdrop-blur-xl p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]">
            <button
              type="button"
              onClick={close}
              aria-label={fr ? 'Fermer' : 'Close'}
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <a href="/vsl" onClick={go} className="flex gap-3 pr-6">
              <span className="relative shrink-0 w-24 aspect-video rounded-lg overflow-hidden bg-neutral-800">
                <img src={VIDEO_THUMB} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-empire text-black">
                    <Play className="h-3.5 w-3.5 ml-0.5" fill="currentColor" />
                  </span>
                </span>
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-empire">
                  {fr ? 'Workshop gratuit' : 'Free workshop'}
                </span>
                <span className="block text-sm font-bold leading-snug text-white">
                  {fr ? 'La formule du million de vues' : 'The million-views formula'}
                </span>
                <span className="block text-xs text-neutral-400 mt-0.5">
                  {fr ? '1 h 26 en vidéo, accélérable en x2' : '1h26 video, up to 2x speed'}
                </span>
              </span>
            </a>
            <a
              href="/vsl"
              onClick={go}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-empire px-4 py-2.5 text-sm font-bold text-black hover:brightness-110 transition"
            >
              {fr ? 'Voir le workshop' : 'Watch the workshop'}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
