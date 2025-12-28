'use client'
import { ArrowRight, Calendar } from 'lucide-react'

interface InlineCTAProps {
  title: string
  description?: string
  primaryText?: string
  secondaryText?: string
  urgencyLabel?: string
  variant?: 'default' | 'minimal' | 'urgency'
}

export function InlineCTA({ 
  title, 
  description, 
  primaryText = 'Start Now',
  secondaryText,
  urgencyLabel = 'Limited spots',
  variant = 'default' 
}: InlineCTAProps) {
  if (variant === 'minimal') {
    return (
      <div className="text-center py-8">
        <p className="text-xl font-bold text-white mb-4">{title}</p>
        <button
          onClick={() => openVideoDialog()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-empire/10 border border-empire/30 text-empire font-bold hover:bg-empire/20 hover:gap-3 transition-all"
        >
          {primaryText} <ArrowRight size={18} />
        </button>
      </div>
    )
  }

  if (variant === 'urgency') {
    return (
      <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/30 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 mb-3">
          <Calendar className="text-red-400" size={14} />
          <span className="text-xs font-bold text-red-400">{urgencyLabel}</span>
        </div>
        <p className="text-xl font-bold text-white mb-2">{title}</p>
        {description && <p className="text-neutral-300 mb-4">{description}</p>}
        <a
          href="/demo"
          className="px-6 py-3 bg-empire text-black font-bold rounded-lg hover:scale-105 transition-all"
        >
          {primaryText}
        </a>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30 text-center">
      <p className="text-xl md:text-2xl font-bold text-white mb-3">{title}</p>
      {description && <p className="text-neutral-300 mb-6">{description}</p>}
      <a
        href="/demo"
        className="px-6 py-3 bg-empire text-black font-bold rounded-lg hover:scale-105 transition-all"
      >
        {primaryText}
      </a>
    </div>
  )
}

