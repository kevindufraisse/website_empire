'use client'
import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Gift,
  Instagram,
  Youtube,
  Linkedin,
  UserCircle,
  Copy,
  ExternalLink,
  Sparkles,
  Lock,
} from 'lucide-react'

const COUNTDOWN_SECONDS = 80
const STORAGE_KEY = 'giftCountdownDismissed'

const GIFT_COUNT = 5

const LINKEDIN_UNLOCK_SECONDS = 300

const gifts = [
  {
    id: 'instagram-viral',
    icon: Instagram,
    borderColor: 'border-white/10',
    bgColor: 'bg-white/5',
    textColor: 'text-empire',
    title: 'Trouver les Reels viraux',
    subtitle: "d'un compte Instagram",
    description: 'Identifiez instantanément les réels les plus viraux de n\'importe quel compte Instagram.',
    badge: 'Méthode Adley Kinsmann',
    free: true,
    link: 'https://join.empire-internet.com/instagram-scrapper',
    unlockDelay: 0,
  },
  {
    id: 'youtube-summarizer',
    icon: Youtube,
    borderColor: 'border-white/10',
    bgColor: 'bg-white/5',
    textColor: 'text-empire',
    title: 'Résumer des vidéos YouTube',
    subtitle: 'avec l\'IA',
    description: 'Transformez n\'importe quelle vidéo YouTube en résumé actionnable en quelques secondes.',
    badge: null,
    free: true,
    link: 'https://join.empire-internet.com/youtube-export',
    unlockDelay: 0,
  },
  {
    id: 'linkedin-autocomment',
    icon: Linkedin,
    borderColor: 'border-white/10',
    bgColor: 'bg-white/5',
    textColor: 'text-empire',
    title: 'Auto-commenter sur LinkedIn',
    subtitle: 'vos posts automatiquement',
    description: 'Commentez automatiquement les posts de votre réseau pour booster votre visibilité LinkedIn.',
    badge: 'Méthode Empire Internet',
    free: true,
    link: 'https://join.empire-internet.com/post-linkedin',
    unlockDelay: LINKEDIN_UNLOCK_SECONDS,
  },
  {
    id: 'personal-branding',
    icon: UserCircle,
    borderColor: 'border-white/10',
    bgColor: 'bg-white/5',
    textColor: 'text-empire',
    title: '60 min Personal Branding',
    subtitle: 'cheat sheet par Empire Internet',
    description: 'La méthode complète de Personal Branding par Empire Internet.',
    badge: '+1 milliard de vues/mois',
    free: true,
    link: 'https://join.empire-internet.com/branding',
    unlockDelay: 0,
  },
  {
    id: 'viral-copypaste',
    icon: Copy,
    borderColor: 'border-white/10',
    bgColor: 'bg-white/5',
    textColor: 'text-empire',
    title: 'Copie-colle mes 3 templates',
    subtitle: 'les plus viraux sur LinkedIn',
    description: 'Télécharge les templates de 3 posts parmi les plus viraux que j\'ai jamais faits sur LinkedIn + adapte-les à ton business.',
    badge: '60 places dispos',
    free: true,
    link: 'https://join.empire-internet.com/3-templates-linkedin',
    unlockDelay: 0,
  },
]

/* ── Shared state via context ── */

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

function useGiftState() {
  const ctx = useContext(GiftContext)
  if (!ctx) throw new Error('useGiftState must be used inside GiftCountdownProvider')
  return ctx
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
    pathname === '/thank-you' ||
    pathname === '/vsl'

  useEffect(() => {
    if (isExcludedPage) return
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY)
    if (wasDismissed) return
    setDismissed(false)
  }, [isExcludedPage])

  useEffect(() => {
    if (dismissed) return
    if (countdown <= 0 && linkedinCountdown <= 0) return
    const interval = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prev) => {
          if (prev <= 1) { setIsReady(true); return 0 }
          return prev - 1
        })
      }
      if (linkedinCountdown > 0) {
        setLinkedinCountdown((prev) => {
          if (prev <= 1) { setIsLinkedinReady(true); return 0 }
          return prev - 1
        })
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [dismissed, countdown, linkedinCountdown])

  const handleDismiss = useCallback(() => {
    setDismissed(true)
    setShowModal(false)
    sessionStorage.setItem(STORAGE_KEY, 'true')
  }, [])

  return (
    <GiftContext.Provider value={{ countdown, linkedinCountdown, isReady, isLinkedinReady, showModal, dismissed: dismissed || isExcludedPage, setShowModal, handleDismiss }}>
      {children}
    </GiftContext.Provider>
  )
}

/* ── Header badge (compact, inline in the navbar) ── */

export function GiftHeaderBadge() {
  const { countdown, isReady, dismissed, setShowModal } = useGiftState()

  if (dismissed) return null

  const secs = String(countdown % 60).padStart(2, '0')
  const mins = Math.floor(countdown / 60)

  return (
    <button
      onClick={() => setShowModal(true)}
      className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-bold transition-all whitespace-nowrap cursor-pointer hover:scale-105 ${
        isReady
          ? 'bg-empire/15 border-empire/40 text-empire hover:shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.3)]'
          : 'bg-white/5 border-white/10 text-neutral-400 hover:border-white/20'
      }`}
    >
      <Gift size={14} className={isReady ? 'text-empire animate-bounce' : 'text-neutral-500'} />

      <AnimatePresence mode="wait">
        {!isReady ? (
          <motion.span
            key="timer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[11px]"
          >
            <span className="text-neutral-300">{GIFT_COUNT} ressources offertes dans </span>
            <span className="font-mono tabular-nums font-bold text-white">{mins}:{secs}</span>
          </motion.span>
        ) : (
          <motion.span
            key="ready"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[11px] md:text-xs"
          >
            {GIFT_COUNT} ressources débloquées
          </motion.span>
        )}
      </AnimatePresence>

      {isReady && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-empire opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-empire" />
        </span>
      )}
    </button>
  )
}

/* ── Modal (rendered once globally via ClientWrappers) ── */

export default function GiftCountdownModal() {
  const { showModal, setShowModal, dismissed, countdown, linkedinCountdown, isReady, isLinkedinReady } = useGiftState()

  if (dismissed && !showModal) return null

  const mins = Math.floor(countdown / 60)
  const secs = String(countdown % 60).padStart(2, '0')
  const liMins = Math.floor(linkedinCountdown / 60)
  const liSecs = String(linkedinCountdown % 60).padStart(2, '0')

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9995] flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`relative w-full ${isReady ? 'max-w-4xl' : 'max-w-lg'} my-8`}
            onClick={(e) => e.stopPropagation()}
          >
            {!isReady ? (
              <>
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-empire/10 border border-empire/20 mb-6">
                    <Gift className="text-empire" size={28} />
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                    Du contenu se débloque
                  </h2>
                  <p className="text-neutral-400 text-sm sm:text-base max-w-md mx-auto mb-8">
                    Restez sur la page pour accéder à des ressources exclusives.
                  </p>

                  <div className="space-y-4 max-w-sm mx-auto mb-8">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 shrink-0">
                        <Gift size={16} className="text-empire" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-semibold text-white">{GIFT_COUNT} ressources gratuites</p>
                        <p className="text-xs text-neutral-400">Outils, templates, méthodes</p>
                      </div>
                      <span className="font-mono tabular-nums text-sm font-bold text-empire">{mins}:{secs}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowModal(false)}
                    className="px-8 py-3 rounded-xl bg-empire text-black font-bold text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.3)]"
                  >
                    Continuer à naviguer
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-empire/20 border border-empire/30 mb-4"
                  >
                    <Sparkles className="text-empire" size={16} />
                    <span className="text-sm font-bold text-empire">100% GRATUIT</span>
                    <Sparkles className="text-empire" size={16} />
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
                    Vos {GIFT_COUNT} ressources offertes
                  </h2>
                  <p className="text-neutral-400 text-sm sm:text-base max-w-lg mx-auto">
                    Des outils utilisés par les plus gros créateurs. Récupérez-les avant de partir.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gifts.map((gift, i) => {
                    const Icon = gift.icon
                    const isLocked = gift.unlockDelay > 0 && !isLinkedinReady
                    const Wrapper = isLocked ? motion.div : motion.a
                    const wrapperProps = isLocked ? {} : { href: gift.link, target: '_blank', rel: 'noopener noreferrer' }
                    return (
                      <Wrapper
                        key={gift.id}
                        {...(wrapperProps as any)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className={`group relative flex flex-col p-5 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border ${gift.borderColor} transition-all ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-empire/30 hover:scale-[1.02] hover:shadow-[0_0_30px_rgb(var(--empire-rgb)_/_0.1)]'}`}
                      >
                        {isLocked ? (
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                            <Lock size={10} className="text-neutral-400" />
                            <span className="text-[10px] font-bold text-neutral-400 font-mono tabular-nums">{liMins}:{liSecs}</span>
                          </div>
                        ) : gift.free && (
                          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-empire/20 border border-empire/30">
                            <span className="text-[10px] font-bold text-empire">GRATUIT</span>
                          </div>
                        )}

                        <div className={`w-11 h-11 rounded-xl ${gift.bgColor} flex items-center justify-center mb-4`}>
                          <Icon className={isLocked ? 'text-neutral-500' : gift.textColor} size={22} />
                        </div>

                        <h3 className={`text-base font-bold leading-tight mb-0.5 ${isLocked ? 'text-neutral-400' : 'text-white'}`}>
                          {gift.title}
                        </h3>
                        <p className={`text-xs font-semibold mb-2 ${isLocked ? 'text-neutral-500' : gift.textColor}`}>
                          {gift.subtitle}
                        </p>

                        <p className="text-xs text-neutral-400 leading-relaxed mb-3 flex-1">
                          {gift.description}
                        </p>

                        {gift.badge && (
                          <div className="mb-3">
                            <span className={`inline-block text-[10px] font-semibold px-2 py-1 rounded-full ${isLocked ? 'text-neutral-500 bg-white/5 border border-white/10' : 'text-empire bg-empire/10 border border-empire/20'}`}>
                              {gift.badge}
                            </span>
                          </div>
                        )}

                        <div className={`flex items-center gap-1.5 text-xs font-bold ${isLocked ? 'text-neutral-500' : `${gift.textColor} group-hover:underline`}`}>
                          <span>{isLocked ? `Disponible dans ${liMins}:${liSecs}` : 'Récupérer'}</span>
                          {!isLocked && <ExternalLink size={12} />}
                        </div>
                      </Wrapper>
                    )
                  })}
                </div>

                <div className="text-center mt-8 space-y-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2.5 rounded-xl bg-white/10 border border-white/10 text-sm text-neutral-300 font-medium hover:bg-white/15 transition-all"
                  >
                    Continuer à naviguer
                  </button>
                  <p className="text-[11px] text-neutral-500">
                    Vous pourrez revenir à vos ressources depuis le header
                  </p>
                </div>
              </>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-2 -right-2 sm:top-0 sm:right-0 w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center hover:bg-neutral-700 transition-colors"
            >
              <X size={16} className="text-neutral-400" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
