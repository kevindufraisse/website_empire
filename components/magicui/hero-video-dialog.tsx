'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { Play, X } from 'lucide-react'
import { VidalyticsPlayer } from '@/components/VidalyticsPlayer'
import { cn } from '@/lib/utils'

interface HeroVideoDialogProps {
  animationStyle?: 'from-center' | 'from-bottom' | 'from-top' | 'fade'
  thumbnailSrc: string
  thumbnailAlt?: string
  className?: string
}

// Global state pour ouvrir la popup de n'importe où
let globalSetIsOpen: ((value: boolean) => void) | null = null

// Fonction exportée pour ouvrir la popup
export function openVideoDialog() {
  if (globalSetIsOpen) {
    globalSetIsOpen(true)
  }
}

export function HeroVideoDialog({
  animationStyle = 'from-center',
  thumbnailSrc,
  thumbnailAlt = 'Video thumbnail',
  className,
}: HeroVideoDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()
  
  // Exposer setIsOpen globalement
  globalSetIsOpen = setIsOpen
  
  // Si pas de thumbnailSrc fourni, on rend juste le dialog (pour usage global)
  const showThumbnail = thumbnailSrc && thumbnailSrc.length > 0

  const animationVariants = {
    'from-center': {
      initial: { scale: 0.5, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.5, opacity: 0 },
    },
    'from-bottom': {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 100, opacity: 0 },
    },
    'from-top': {
      initial: { y: -100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -100, opacity: 0 },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
  }

  const selectedAnimation = animationVariants[animationStyle]

  return (
    <>
      {/* Thumbnail - only if thumbnailSrc provided */}
      {showThumbnail && (
        <div className={cn('relative cursor-pointer group', className)} onClick={() => setIsOpen(true)}>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={thumbnailSrc}
              alt={thumbnailAlt}
              className="w-full h-full object-cover"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-empire/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(218,252,104,0.4)]">
                <Play className="text-black ml-1" size={32} fill="black" />
              </div>
            </div>
            {/* Duration badge */}
            <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-sm">
              <p className="text-xs font-semibold text-white">20:00</p>
            </div>
          </div>
        </div>
      )}

      {/* Video Dialog - Using Portal to render at body level */}
      {typeof window !== 'undefined' && isOpen && createPortal(
        <AnimatePresence>
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto"
            style={{ zIndex: 99999 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              {...selectedAnimation}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors z-10"
              >
                <X size={32} />
              </button>
              
              <div className="relative rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                <VidalyticsPlayer />
              </div>

              {/* CTAs below video - Compact */}
              <div className="mt-3 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-empire/20 to-empire/5 border border-empire/30">
                <p className="text-white font-semibold mb-3 text-center text-sm sm:text-base">
                  {t.videoDialog.readyToJoin}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <a
                    href="/pricing"
                    className="py-3 px-4 rounded-lg bg-empire text-black font-bold hover:scale-105 transition-all text-center text-sm"
                  >
                    {t.videoDialog.startNow}
                  </a>
                  <a
                    href="https://us06web.zoom.us/meeting/register/_MDUpE-JSJmLRdqwh-OkTg#/registration"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-lg bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all text-center text-sm"
                  >
                    {t.videoDialog.joinQA}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

