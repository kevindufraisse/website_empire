'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import CallbackFormModal from './CallbackFormModal'

interface CallbackButtonProps {
  className?: string
  variant?: 'default' | 'subtle'
}

export default function CallbackButton({ className = '', variant = 'default' }: CallbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { lang } = useLanguage()

  const label = lang === 'fr' ? 'Voir si je suis éligible' : 'Check my eligibility'

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={
          variant === 'subtle'
            ? `inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-empire transition-colors ${className}`
            : `inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 text-sm font-medium hover:border-empire/30 hover:text-empire transition-all ${className}`
        }
      >
        <Phone size={14} />
        {label}
      </button>
      <CallbackFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
