'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

const COUNTDOWN_SECONDS = 80
const STORAGE_KEY = 'giftCountdownDismissed'
const COMPLETED_KEY = 'giftCountdownCompleted'
const RESET_DAYS = 7
const LINKEDIN_UNLOCK_SECONDS = 300
export const GIFT_COUNT = 5

interface GiftState {
  countdown: number
  linkedinCountdown: number
  isReady: boolean
  isLinkedinReady: boolean
  showModal: boolean
  dismissed: boolean
  setShowModal: (v: boolean) => void
  handleDismiss: () => void
}

const GiftContext = createContext<GiftState | null>(null)

export function useGiftState() {
  const ctx = useContext(GiftContext)
  if (!ctx) throw new Error('useGiftState must be used inside GiftCountdownProvider')
  return ctx
}

function isCompletedAndFresh(): boolean {
  try {
    const ts = localStorage.getItem(COMPLETED_KEY)
    if (!ts) return false
    const elapsed = Date.now() - Number(ts)
    if (elapsed > RESET_DAYS * 86_400_000) {
      localStorage.removeItem(COMPLETED_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}

export function GiftCountdownProvider({ children }: { children: React.ReactNode }) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const [linkedinCountdown, setLinkedinCountdown] = useState(LINKEDIN_UNLOCK_SECONDS)
  const [isReady, setIsReady] = useState(false)
  const [isLinkedinReady, setIsLinkedinReady] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [dismissed, setDismissed] = useState(true)
  const pathname = usePathname()

  const isExcludedPage =
    pathname === '/candidature' ||
    pathname === '/decouverte' ||
    pathname === '/join-us' ||
    pathname === '/postuler' ||
    pathname === '/thank-you' ||
    pathname === '/vsl' ||
    pathname === '/academy' ||
    pathname === '/communaute' ||
    pathname === '/community'

  useEffect(() => {
    if (isExcludedPage) return
    if (isCompletedAndFresh()) {
      setCountdown(0)
      setLinkedinCountdown(0)
      setIsReady(true)
      setIsLinkedinReady(true)
      setDismissed(false)
      return
    }
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY)
    if (wasDismissed) return
    setDismissed(false)
  }, [isExcludedPage])

  useEffect(() => {
    if (isExcludedPage || dismissed) return
    if (countdown <= 0 && linkedinCountdown <= 0) return
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) return 0
        if (prev === 1) {
          setIsReady(true)
          try {
            localStorage.setItem(COMPLETED_KEY, String(Date.now()))
          } catch {}
          return 0
        }
        return prev - 1
      })
      setLinkedinCountdown((prev) => {
        if (prev <= 0) return 0
        if (prev === 1) {
          setIsLinkedinReady(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [countdown, linkedinCountdown, isExcludedPage, dismissed])

  const handleDismiss = useCallback(() => {
    setDismissed(true)
    setShowModal(false)
    sessionStorage.setItem(STORAGE_KEY, 'true')
  }, [])

  return (
    <GiftContext.Provider
      value={{
        countdown,
        linkedinCountdown,
        isReady,
        isLinkedinReady,
        showModal,
        dismissed: dismissed || isExcludedPage,
        setShowModal,
        handleDismiss,
      }}
    >
      {children}
    </GiftContext.Provider>
  )
}

export function GiftFooterLink() {
  const { lang } = useLanguage()
  const { countdown, isReady, dismissed, setShowModal } = useGiftState()

  if (dismissed && !isReady) return null

  const secs = String(countdown % 60).padStart(2, '0')
  const mins = Math.floor(countdown / 60)

  return (
    <button
      onClick={() => setShowModal(true)}
      className="text-sm text-neutral-400 hover:text-empire transition-colors text-left"
    >
      {isReady
        ? lang === 'fr'
          ? `${GIFT_COUNT} ressources débloquées`
          : `${GIFT_COUNT} resources unlocked`
        : lang === 'fr'
          ? `${GIFT_COUNT} ressources offertes dans ${mins}:${secs}`
          : `${GIFT_COUNT} free resources in ${mins}:${secs}`}
    </button>
  )
}
