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
  const [lang, setLangState] = useState<Language>('en')

  useEffect(() => {
    // Check localStorage
    const savedLang = localStorage.getItem('empire-lang') as Language
    if (savedLang) {
      setLangState(savedLang)
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('fr')) {
        setLangState('fr')
      }
    }
  }, [])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem('empire-lang', newLang)
  }

  const translations = lang === 'fr' ? fr : en

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










