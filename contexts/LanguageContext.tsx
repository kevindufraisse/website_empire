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
  // Server and first client render must match to avoid hydration errors,
  // so we default to 'fr' (main audience) and resolve the real language after mount.
  const [lang, setLangState] = useState<Language>('fr')

  useEffect(() => {
    const savedLang = window.localStorage.getItem('empire-lang') as Language | null
    if (savedLang === 'fr' || savedLang === 'en') {
      if (savedLang !== 'fr') setLangState(savedLang)
      return
    }
    const browserLang = (window.navigator.language || '').toLowerCase()
    if (!browserLang.startsWith('fr')) setLangState('en')
  }, [])

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













