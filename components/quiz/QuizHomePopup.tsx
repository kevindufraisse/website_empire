'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import EmpireQuiz from './EmpireQuiz'

const COOKIE_KEY = 'empire_quiz_popup_dismissed'
const COOKIE_DAYS = 30
const DELAY_MS = 5_000

export default function QuizHomePopup() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [pulseHeader, setPulseHeader] = useState(false)

  const isAllowed = pathname === '/'

  useEffect(() => {
    if (!isAllowed) return
    const dismissed = readCookie(COOKIE_KEY)
    if (dismissed === '1') return
    // Don't show if quiz is already completed
    try {
      const raw = localStorage.getItem('empire_quiz_v1')
      if (raw) {
        const data = JSON.parse(raw)
        if (data?.stage === 'result' && data?.result) return
      }
    } catch { /* ignore */ }
    const t = setTimeout(() => setOpen(true), DELAY_MS)
    return () => clearTimeout(t)
  }, [isAllowed])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // After dismiss, flash the header quiz button so the user knows where to find it
  useEffect(() => {
    if (!pulseHeader) return
    const btn = document.querySelector('a[href="/quiz"]') as HTMLElement | null
    if (!btn) return
    btn.classList.add('animate-header-quiz-pulse')
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    const t = setTimeout(() => {
      btn.classList.remove('animate-header-quiz-pulse')
      setPulseHeader(false)
    }, 2000)
    return () => clearTimeout(t)
  }, [pulseHeader])

  function dismiss() {
    writeCookie(COOKIE_KEY, '1', COOKIE_DAYS)

    const btn = document.querySelector('a[href="/quiz"]') as HTMLElement | null
    if (btn) {
      const rect = btn.getBoundingClientRect()
      const overlay = document.getElementById('quiz-popup-overlay')
      if (overlay) {
        overlay.style.transformOrigin = `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`
        overlay.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease'
        overlay.style.transform = 'scale(0.01)'
        overlay.style.opacity = '0'
        setTimeout(() => {
          setOpen(false)
          setPulseHeader(true)
        }, 400)
        return
      }
    }
    setOpen(false)
    setPulseHeader(true)
  }

  if (!open) return (
    <>
      {/* CSS for the header button pulse animation */}
      <style jsx global>{`
        @keyframes header-quiz-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgb(var(--empire-rgb) / 0.2); }
          25% { transform: scale(1.12); box-shadow: 0 0 40px rgb(var(--empire-rgb) / 0.6); }
          50% { transform: scale(1.05); box-shadow: 0 0 30px rgb(var(--empire-rgb) / 0.4); }
          75% { transform: scale(1.1); box-shadow: 0 0 35px rgb(var(--empire-rgb) / 0.5); }
        }
        .animate-header-quiz-pulse {
          animation: header-quiz-pulse 0.8s ease-in-out 2;
        }
      `}</style>
    </>
  )

  return (
    <AnimatePresence>
      <motion.div
        id="quiz-popup-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9998] bg-black overflow-y-auto"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.10),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 min-h-screen flex items-stretch">
          <EmpireQuiz
            onCompleted={() => {
              writeCookie(COOKIE_KEY, '1', COOKIE_DAYS)
              setOpen(false)
            }}
            onDismiss={dismiss}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function writeCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 86400_000).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}
