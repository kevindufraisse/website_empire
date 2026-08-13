'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import AcademyWaitlistForm, { ACADEMY_WAITLIST_DONE_KEY } from '@/components/AcademyWaitlistForm'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'

const OPEN_COOLDOWN_MS = 450

/**
 * Every Academy CTA opens the waitlist instead of a checkout link: enrolment is
 * closed between cohorts, so a price + payment link would be a dead end.
 */
export default function AcademyWaitlistCta({
  children,
  className = '',
  source,
  sublabel,
}: {
  children: ReactNode
  className?: string
  /** Which CTA was clicked, for analytics. */
  source: string
  sublabel?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const closeAtRef = useRef(0)
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const close = useCallback(() => {
    closeAtRef.current = Date.now()
    setOpen(false)
  }, [])

  useEffect(() => {
    try {
      if (sessionStorage.getItem(ACADEMY_WAITLIST_DONE_KEY)) setDone(true)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)

    // `body` is the scrolling element here (globals.css sets height: 100%), so
    // `overflow: hidden` alone would reset it to the top. Pin it at its offset.
    const scrollY = window.scrollY
    const { style } = document.body
    const previous = {
      overflow: style.overflow,
      position: style.position,
      top: style.top,
      width: style.width,
    }
    style.overflow = 'hidden'
    style.position = 'fixed'
    style.top = `-${scrollY}px`
    style.width = '100%'

    return () => {
      document.removeEventListener('keydown', onKey)
      Object.assign(style, previous)
      window.scrollTo({ top: scrollY, behavior: 'instant' as ScrollBehavior })
    }
  }, [open, close])

  const handleOpen = () => {
    // Avoid click-through from closing the modal onto the sticky "Rejoindre" CTA
    if (Date.now() - closeAtRef.current < OPEN_COOLDOWN_MS) return
    setOpen(true)
    trackAmplitude('academy_waitlist_open', { source })
  }

  return (
    <>
      <button type="button" onClick={handleOpen} className={className}>
        {children}
      </button>
      {sublabel}

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
                onMouseDown={(e) => {
                  if (e.target === e.currentTarget) close()
                }}
                role="dialog"
                aria-modal="true"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="relative my-auto max-h-[min(92vh,720px)] w-full max-w-md overflow-y-auto rounded-2xl border border-academy/30 bg-[#0d0d0d] p-6 shadow-[0_0_60px_-15px_rgba(252,165,165,0.35)]"
                >
                  <button
                    type="button"
                    onClick={close}
                    aria-label={fr ? 'Fermer' : 'Close'}
                    className="absolute right-4 top-4 z-10 text-neutral-500 transition-colors hover:text-white"
                  >
                    <X size={18} />
                  </button>

                  {!done && (
                    <>
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-academy">
                        {fr ? 'Prochaine promo' : 'Next cohort'}
                      </p>
                      <h3 className="mt-2 pr-8 text-xl font-bold text-white">
                        {fr ? 'Candidater à la prochaine promotion' : 'Apply to the next cohort'}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                        {fr
                          ? '1 minute. 20 places sur sélection. On lit chaque candidature.'
                          : '1 minute. 20 spots by selection. We read every application.'}
                      </p>
                    </>
                  )}

                  <AcademyWaitlistForm
                    className={done ? '' : 'mt-5'}
                    onSuccess={() => setDone(true)}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}
