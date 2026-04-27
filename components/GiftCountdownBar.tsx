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
} from 'lucide-react'

const COUNTDOWN_SECONDS = 80
const STORAGE_KEY = 'giftCountdownDismissed'

const GIFT_COUNT = 5

const gifts = [
  {
    id: 'instagram-viral',
    icon: Instagram,
    color: 'from-pink-500 to-purple-600',
    borderColor: 'border-pink-500/30',
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-400',
    title: 'Trouver les Reels viraux',
    subtitle: "d'un compte Instagram",
    description: 'Identifiez instantanément les réels les plus viraux de n\'importe quel compte Instagram.',
    badge: 'Méthode Adley Kinsmann',
    free: true,
    link: 'https://join.empire-internet.com/instagram-scrapper',
  },
  {
    id: 'youtube-summarizer',
    icon: Youtube,
    color: 'from-red-500 to-red-700',
    borderColor: 'border-red-500/30',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400',
    title: 'Résumer des vidéos YouTube',
    subtitle: 'avec l\'IA',
    description: 'Transformez n\'importe quelle vidéo YouTube en résumé actionnable en quelques secondes.',
    badge: null,
    free: true,
    link: 'https://join.empire-internet.com/youtube-export',
  },
  {
    id: 'linkedin-autocomment',
    icon: Linkedin,
    color: 'from-blue-500 to-blue-700',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    title: 'Auto-commenter sur LinkedIn',
    subtitle: 'vos posts automatiquement',
    description: 'Commentez automatiquement les posts de votre réseau pour booster votre visibilité LinkedIn.',
    badge: 'Méthode Empire Internet',
    free: true,
    link: 'https://join.empire-internet.com/post-linkedin',
  },
  {
    id: 'personal-branding',
    icon: UserCircle,
    color: 'from-empire to-yellow-500',
    borderColor: 'border-empire/30',
    bgColor: 'bg-empire/10',
    textColor: 'text-empire',
    title: '60 min Personal Branding',
    subtitle: 'cheat sheet par Empire Internet',
    description: 'La méthode complète de Personal Branding par Empire Internet.',
    badge: '+1 milliard de vues/mois',
    free: true,
    link: 'https://join.empire-internet.com/branding',
  },
  {
    id: 'viral-copypaste',
    icon: Copy,
    color: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-500/30',
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-400',
    title: 'Copie-colle mes 3 templates',
    subtitle: 'les plus viraux sur LinkedIn',
    description: 'Télécharge les templates de 3 posts parmi les plus viraux que j\'ai jamais faits sur LinkedIn + adapte-les à ton business.',
    badge: '60 places dispos',
    free: true,
    link: 'https://join.empire-internet.com/3-templates-linkedin',
  },
]

/* ── Shared state via context ── */

interface GiftState {
  countdown: number
  isReady: boolean
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
  const [isReady, setIsReady] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [dismissed, setDismissed] = useState(true)
  const pathname = usePathname()

  const isExcludedPage =
    pathname === '/candidature' ||
    pathname === '/decouverte' ||
    pathname === '/join-us' ||
    pathname === '/thank-you'

  useEffect(() => {
    if (isExcludedPage) return
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY)
    if (wasDismissed) return
    setDismissed(false)
  }, [isExcludedPage])

  useEffect(() => {
    if (dismissed) return
    if (countdown <= 0) {
      setIsReady(true)
      return
    }
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { setIsReady(true); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [dismissed, countdown])

  const handleDismiss = useCallback(() => {
    setDismissed(true)
    setShowModal(false)
    sessionStorage.setItem(STORAGE_KEY, 'true')
  }, [])

  return (
    <GiftContext.Provider value={{ countdown, isReady, showModal, dismissed: dismissed || isExcludedPage, setShowModal, handleDismiss }}>
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
      onClick={() => isReady && setShowModal(true)}
      className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-bold transition-all whitespace-nowrap ${
        isReady
          ? 'bg-empire/15 border-empire/40 text-empire cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.3)]'
          : 'bg-white/5 border-white/10 text-neutral-400 cursor-default'
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
            <span className="text-neutral-300">{GIFT_COUNT} ressources dans </span>
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
  const { showModal, setShowModal, dismissed } = useGiftState()

  if (dismissed && !showModal) return null

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
            className="relative w-full max-w-4xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
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

            {/* Gift cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gifts.map((gift, i) => {
                const Icon = gift.icon
                return (
                  <motion.a
                    key={gift.id}
                    href={gift.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className={`group relative flex flex-col p-5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border ${gift.borderColor} hover:border-white/20 transition-all hover:scale-[1.02] hover:shadow-xl`}
                  >
                    {gift.free && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-empire/20 border border-empire/30">
                        <span className="text-[10px] font-bold text-empire">GRATUIT</span>
                      </div>
                    )}

                    <div className={`w-11 h-11 rounded-xl ${gift.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={gift.textColor} size={22} />
                    </div>

                    <h3 className="text-base font-bold text-white leading-tight mb-0.5">
                      {gift.title}
                    </h3>
                    <p className={`text-xs font-semibold ${gift.textColor} mb-2`}>
                      {gift.subtitle}
                    </p>

                    <p className="text-xs text-neutral-400 leading-relaxed mb-3 flex-1">
                      {gift.description}
                    </p>

                    {gift.badge && (
                      <div className="mb-3">
                        <span className={`inline-block text-[10px] font-semibold ${gift.textColor} px-2 py-1 rounded-full ${gift.bgColor} border ${gift.borderColor}`}>
                          {gift.badge}
                        </span>
                      </div>
                    )}

                    <div className={`flex items-center gap-1.5 text-xs font-bold ${gift.textColor} group-hover:underline`}>
                      <span>Récupérer</span>
                      <ExternalLink size={12} />
                    </div>
                  </motion.a>
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
