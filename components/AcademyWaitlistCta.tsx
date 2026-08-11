'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import AcademyWaitlistForm from '@/components/AcademyWaitlistForm'
import { useLanguage } from '@/contexts/LanguageContext'
import { ACADEMY_ENTRY_PRICE, ACADEMY_NEXT_PRICE_EN, ACADEMY_NEXT_PRICE_FR } from '@/lib/cohort-config'
import { trackAmplitude } from '@/lib/amplitude'

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
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const close = useCallback(() => setOpen(false), [])

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
                onClick={close}
                role="dialog"
                aria-modal="true"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative my-auto w-full max-w-md rounded-2xl border border-academy/30 bg-[#0d0d0d] p-6 shadow-[0_0_60px_-15px_rgba(252,165,165,0.35)]"
                >
                  <button
                    type="button"
                    onClick={close}
                    aria-label={fr ? 'Fermer' : 'Close'}
                    className="absolute right-4 top-4 text-neutral-500 transition-colors hover:text-white"
                  >
                    <X size={18} />
                  </button>

                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-academy">
                    {fr ? 'Prochaine promo' : 'Next cohort'}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-white">
                    {fr ? 'Candidater à la prochaine promotion' : 'Apply to the next cohort'}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    {fr
                      ? `30 secondes. 20 places sur sélection. ${ACADEMY_ENTRY_PRICE}\u202F€ pour cette promotion (puis ${ACADEMY_NEXT_PRICE_FR}\u202F€). On lit chaque candidature.`
                      : `30 seconds. 20 spots by selection. €${ACADEMY_ENTRY_PRICE} for this cohort (then €${ACADEMY_NEXT_PRICE_EN}). We read every application.`}
                  </p>

                  <AcademyWaitlistForm className="mt-5" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}
