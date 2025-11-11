'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// Global state pour ouvrir le modal de n'importe où
let globalSetIsLumaOpen: ((value: boolean) => void) | null = null

// Fonction exportée pour ouvrir le modal Luma
export function openLumaCalendar() {
  if (globalSetIsLumaOpen) {
    globalSetIsLumaOpen(true)
  }
}

export function GlobalLumaCalendar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()

  // Exposer setIsOpen globalement
  globalSetIsLumaOpen = setIsOpen

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Force le header et autres éléments à passer derrière
      const header = document.querySelector('header')
      if (header) {
        (header as HTMLElement).style.zIndex = '40'
      }
    } else {
      document.body.style.overflow = 'unset'
      const header = document.querySelector('header')
      if (header) {
        (header as HTMLElement).style.zIndex = '50'
      }
    }
    
    return () => {
      document.body.style.overflow = 'unset'
      const header = document.querySelector('header')
      if (header) {
        (header as HTMLElement).style.zIndex = '50'
      }
    }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  const handleClose = () => {
    setIsOpen(false)
  }

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={handleClose}
      style={{ 
        zIndex: 2147483647,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div 
        className="relative max-w-2xl w-full bg-black border-2 border-empire/30 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(218,252,104,0.3)]"
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 2147483647 }}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white hover:text-empire hover:border-empire/50 transition-all flex items-center justify-center"
        >
          <X size={18} />
        </button>

        <div className="p-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
            {t.lumaModal.title}
          </h3>
          <p className="text-neutral-400 text-center mb-6">
            {t.lumaModal.subtitle}
          </p>
          
          <div className="relative w-full" style={{ paddingBottom: '75%' }}>
            <iframe
              src="https://luma.com/embed/calendar/cal-NLIw2Ga4dePqYoQ/events?lt=dark"
              className="absolute inset-0 w-full h-full rounded-xl"
              frameBorder="0"
              style={{ border: '1px solid rgba(191, 203, 218, 0.13)', borderRadius: '12px' }}
              allowFullScreen
              aria-hidden="false"
              tabIndex={0}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>,
    document.body
  )
}

