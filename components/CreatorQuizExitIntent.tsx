'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { X, ArrowRight } from 'lucide-react'
import {
  ARCHETYPES,
  getArchetypeIcons,
  iconAvatarUrl,
  type ArchetypeId,
} from '@/lib/quiz-data'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'
import posthog from 'posthog-js'

/** Même clé que EmpireQuiz : sert à ne pas relancer un quiz déjà terminé. */
const QUIZ_STORAGE_KEY = 'empire_quiz_v1'
const SESSION_KEY = 'creator-quiz-exit'

/** Pages où proposer le quiz serait redondant ou intrusif. */
const EXCLUDED_PREFIXES = ['/quiz', '/candidature', '/thank-you', '/academy/merci', '/webinar/merci', '/verify']

const TEASER_IDS: ArchetypeId[] = ['storyteller', 'builder', 'educator', 'provocateur']

function alreadyAnswered(): boolean {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw) as { stage?: string; result?: unknown }
    return parsed?.stage === 'result' || !!parsed?.result
  } catch {
    return false
  }
}

/**
 * Exit intent = petite popup teaser, pas le quiz en plein écran.
 * Le quiz complet vit sur /quiz.
 */
export default function CreatorQuizExitIntent() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (EXCLUDED_PREFIXES.some(p => pathname?.startsWith(p))) return

    let timer: ReturnType<typeof setTimeout>
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 0) return
      if (sessionStorage.getItem(SESSION_KEY)) return
      if (alreadyAnswered()) return
      timer = setTimeout(() => {
        sessionStorage.setItem(SESSION_KEY, '1')
        setOpen(true)
        trackAmplitude('creator_quiz_opened', { source: 'exit_intent' })
        if (posthog.__loaded) posthog.capture('creator_quiz_opened', { source: 'exit_intent' })
      }, 100)
    }

    document.addEventListener('mouseleave', onMouseLeave)
    return () => {
      document.removeEventListener('mouseleave', onMouseLeave)
      clearTimeout(timer)
    }
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const crisp = (window as unknown as { $crisp?: { push: (cmd: unknown[]) => void } }).$crisp
    crisp?.push(['do', 'chat:hide'])
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      crisp?.push(['do', 'chat:show'])
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  if (!mounted) return null

  const faces = TEASER_IDS.map((id) => {
    const icon = getArchetypeIcons(ARCHETYPES[id], lang)[0]
    return { id, name: icon.name, src: iconAvatarUrl(icon) }
  })

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={fr ? 'Avant de partir' : 'Before you go'}
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative w-full max-w-md rounded-2xl border-2 border-empire bg-[#0c0c0c] p-6 shadow-[0_0_80px_rgb(var(--empire-rgb)_/_0.45),0_0_0_1px_rgb(var(--empire-rgb)_/_0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-[radial-gradient(ellipse_at_top,rgb(var(--empire-rgb)_/_0.18),transparent_55%)]" />

            <button
              type="button"
              onClick={close}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition"
              aria-label={fr ? 'Fermer' : 'Close'}
            >
              <X size={16} />
            </button>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-empire/15 border border-empire/40 mb-4">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-empire opacity-70" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-empire" />
                </span>
                <span className="text-[10px] uppercase tracking-wider text-empire font-bold">
                  {fr ? 'Avant de partir · 90 sec' : 'Before you go · 90 sec'}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white leading-snug pr-6">
                {fr
                  ? 'Attendez. Découvrez d\'abord le type de créateur que vous êtes.'
                  : 'Wait. First discover what type of creator you are.'}
              </h2>
              <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                {fr
                  ? 'Plan d\'action 30 jours pour transformer vos lecteurs en clients.'
                  : '30-day action plan to turn readers into clients.'}
              </p>

              <div className="mt-5 flex items-center gap-2">
                {faces.map((f) => (
                  <div
                    key={f.id}
                    className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-empire/40 bg-neutral-800"
                    title={f.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.src} alt={f.name} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>

              <ul className="mt-5 space-y-2 text-sm text-neutral-200">
                <li className="flex gap-2">
                  <span className="text-empire shrink-0 font-bold">✓</span>
                  {fr ? '10 sujets à poster cette semaine' : '10 topics to post this week'}
                </li>
                <li className="flex gap-2">
                  <span className="text-empire shrink-0 font-bold">✓</span>
                  {fr ? 'Pourquoi vos posts ne convertissent pas' : 'Why your posts don\'t convert'}
                </li>
              </ul>

              <a
                href="/quiz"
                onClick={() => {
                  trackAmplitude('creator_quiz_cta_clicked', { source: 'exit_intent' })
                  if (posthog.__loaded) posthog.capture('creator_quiz_cta_clicked', { source: 'exit_intent' })
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-empire px-5 py-3.5 text-sm font-bold text-black shadow-[0_0_30px_rgb(var(--empire-rgb)_/_0.4)] hover:scale-[1.02] transition-transform"
              >
                {fr ? 'Rester et faire le quiz' : 'Stay and take the quiz'}
                <ArrowRight size={16} />
              </a>
              <button
                type="button"
                onClick={close}
                className="mt-3 w-full text-center text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {fr ? 'Non merci, je pars' : 'No thanks, I\'m leaving'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
