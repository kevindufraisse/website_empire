'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

const HIDDEN_PREFIXES = ['/quiz', '/candidature', '/decouverte', '/join-us', '/live', '/hire-our-team']

export default function QuizFloatingButton() {
  const { lang } = useLanguage()
  const pathname = usePathname()
  const [label, setLabel] = useState<'new' | 'started' | 'done'>('new')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('empire_quiz_v1')
      if (!raw) return
      const data = JSON.parse(raw)
      if (data?.stage === 'result' && data?.result) setLabel('done')
      else if (data?.stage && data.stage !== 'intro') setLabel('started')
    } catch {
      /* ignore */
    }
  }, [])

  const hidden = HIDDEN_PREFIXES.some((p) => pathname === p || pathname?.startsWith(`${p}/`))
  if (hidden) return null

  const text =
    label === 'done'
      ? lang === 'fr'
        ? 'Mon résultat'
        : 'My result'
      : label === 'started'
        ? lang === 'fr'
          ? 'Terminer'
          : 'Finish'
        : lang === 'fr'
          ? 'Quel créateur êtes-vous ?'
          : 'What creator are you?'

  return (
    <Link
      href="/quiz"
      aria-label={text}
      className="group fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 md:flex"
    >
      <span className="flex items-center gap-2 rounded-r-xl border border-l-0 border-white/10 bg-black/90 py-2.5 pl-2 pr-3.5 shadow-lg shadow-black/40 backdrop-blur-md transition-all hover:border-empire/40 hover:bg-black hover:pl-3">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-empire text-black">
          <span className="text-sm font-black leading-none">?</span>
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-empire ring-2 ring-black">
            <span className="absolute inset-0 animate-ping rounded-full bg-empire opacity-60" />
          </span>
        </span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold text-white opacity-0 transition-all duration-300 group-hover:max-w-[140px] group-hover:opacity-100">
          {text}
        </span>
      </span>
    </Link>
  )
}
