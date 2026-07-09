'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { en, Translations } from '@/locales/en'
import { fr } from '@/locales/fr'

type Language = 'en' | 'fr'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize language on the first client render to avoid a visible "flash"
  // (default lang → then replaced after useEffect).
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en'
    const savedLang = window.localStorage.getItem('empire-lang') as Language | null
    if (savedLang === 'fr' || savedLang === 'en') return savedLang
    const browserLang = (window.navigator.language || '').toLowerCase()
    if (browserLang.startsWith('fr')) return 'fr'
    return 'en'
  })

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem('empire-lang', newLang)
  }

  const translations = (lang === 'fr' ? fr : en) as Translations

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}













