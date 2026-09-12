'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Translations } from '@/locales/en'
import { fr } from '@/locales/fr'

type Language = 'en' | 'fr'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Server and first client render must match to avoid hydration errors,
  // so we default to 'fr' (main audience) and resolve the real language after mount.
  const [lang, setLangState] = useState<Language>('fr')
  const [enDict, setEnDict] = useState<Translations | null>(null)

  useEffect(() => {
    const savedLang = window.localStorage.getItem('empire-lang') as Language | null
    const browserLang = (window.navigator.language || '').toLowerCase()
    const next: Language =
      savedLang === 'fr' || savedLang === 'en'
        ? savedLang
        : browserLang.startsWith('fr')
          ? 'fr'
          : 'en'
    if (next === 'en') {
      import('@/locales/en').then((m) => {
        setEnDict(m.en)
        setLangState('en')
      })
      return
    }
    if (next !== 'fr') setLangState(next)
  }, [])

  const setLang = (newLang: Language) => {
    if (newLang === 'en' && !enDict) {
      import('@/locales/en').then((m) => {
        setEnDict(m.en)
        setLangState('en')
        localStorage.setItem('empire-lang', 'en')
      })
      return
    }
    setLangState(newLang)
    localStorage.setItem('empire-lang', newLang)
  }

  const translations = (lang === 'en' && enDict ? enDict : fr) as Translations

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
