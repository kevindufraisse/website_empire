'use client'
import { useApplicationCount } from '@/hooks/useApplicationCount'

const MAX_SELECTED = 20

export default function CandidatureBadge() {
  const appCount = useApplicationCount()

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-academy/10 border border-academy/30 mb-6">
      <span className="w-2 h-2 rounded-full bg-academy animate-pulse" />
      <span className="text-xs font-bold text-academy tracking-widest uppercase">
        {appCount !== null
          ? `${appCount} candidatures · ${MAX_SELECTED} admis`
          : `Sur sélection · ${MAX_SELECTED} admis`}
      </span>
    </div>
  )
}
