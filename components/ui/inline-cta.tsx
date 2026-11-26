'use client'
import { ArrowRight, Calendar } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import OnboardingLink from '@/components/OnboardingLink'

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
  primaryText,
  secondaryText,
  urgencyLabel = 'Limited spots',
  variant = 'default' 
}: InlineCTAProps) {
  const { lang } = useLanguage()
  // Démo en principal, essai gratuit juste dessous (choix de Kevin, 25 novembre 2026).
  const resolvedPrimary = primaryText ?? (lang === 'fr' ? 'Réserver ma démo' : 'Book my demo')
  const trialLink = (
    <OnboardingLink className="mt-3 block text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
      {lang === 'fr' ? 'Ou tester 7 jours gratuitement' : 'Or start my 7-day free trial'}
    </OnboardingLink>
  )

  if (variant === 'minimal') {
    return (
      <div className="text-center py-8">
        <p className="text-xl font-bold text-white mb-4">{title}</p>
        <a href="/join-us" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-empire/10 border border-empire/30 text-empire font-bold hover:bg-empire/20 hover:gap-3 transition-all">
          {resolvedPrimary} <ArrowRight size={18} />
        </a>
        {trialLink}
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
        <a href="/join-us" className="inline-block px-6 py-3 bg-empire text-black font-bold rounded-lg hover:scale-105 transition-all">
          {resolvedPrimary}
        </a>
        {trialLink}
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30 text-center">
      <p className="text-xl md:text-2xl font-bold text-white mb-3">{title}</p>
      {description && <p className="text-neutral-300 mb-6">{description}</p>}
      <a href="/join-us" className="inline-block px-6 py-3 bg-empire text-black font-bold rounded-lg hover:scale-105 transition-all">
        {resolvedPrimary}
      </a>
      {trialLink}
    </div>
  )
}
