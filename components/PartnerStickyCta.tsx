'use client'

import { useEffect, useState, type RefObject } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { WebinarJamButton } from '@/components/WebinarJamRegister'
import { readConsent, CONSENT_EVENT } from '@/lib/marketingConsent'

/**
 * Rappel discret en bas de page, à la place de la barre WebinarJam (compte à
 * rebours, date, fuseau : trop lourd sur mobile). Une ligne, un bouton.
 *
 * Elle n'apparaît que lorsque le bouton du hero a quitté l'écran, et jamais
 * par-dessus quelque chose qui demande déjà l'attention : la popup
 * d'inscription WebinarJam (body `wj_body_reset`) ou le bandeau cookies
 * (aucun consentement enregistré). Fermable pour la session.
 */
export default function PartnerStickyCta({
  anchorRef,
  hash,
  onClick,
}: {
  /** Élément dont la sortie de l'écran déclenche l'affichage (le CTA du hero). */
  anchorRef: RefObject<HTMLElement | null>
  hash: string
  onClick?: () => void
}) {
  const [anchorOffscreen, setAnchorOffscreen] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const [consentPending, setConsentPending] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        // Sous le hero seulement : au-dessus (scroll en haut), rien.
        setAnchorOffscreen(!entry.isIntersecting && entry.boundingClientRect.top < 0)
      },
      { threshold: 0 },
    )
    observer.observe(anchor)
    return () => observer.disconnect()
  }, [anchorRef])

  useEffect(() => {
    const sync = () => setPopupOpen(document.body.classList.contains('wj_body_reset'))
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const sync = () => setConsentPending(!readConsent())
    sync()
    window.addEventListener(CONSENT_EVENT, sync)
    return () => window.removeEventListener(CONSENT_EVENT, sync)
  }, [])

  const visible = anchorOffscreen && !popupOpen && !consentPending && !dismissed

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-[90] transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="border-t border-white/10 bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-2.5">
          <p className="min-w-0 flex-1 truncate text-xs text-neutral-300 sm:text-sm">
            <span className="font-semibold text-white">Portes ouvertes</span>
            <span className="hidden sm:inline"> · gratuit, replay immédiat ou séance programmée</span>
          </p>
          <WebinarJamButton
            hash={hash}
            onClick={onClick}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-academy px-4 text-sm font-bold text-black transition hover:brightness-110"
          >
            Réserver ma place
            <ArrowRight className="h-4 w-4" />
          </WebinarJamButton>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Fermer ce rappel"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-500 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
