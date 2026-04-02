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

function normalizeCtaDuration(value: unknown): unknown {
  if (typeof value === 'string') {
    return value
      .replaceAll('60 min stratégique gratuite', '45 min stratégique gratuite')
      .replaceAll('Free 60 min strategy call', 'Free 45 min strategy call')
  }

  if (Array.isArray(value)) {
    return value.map(normalizeCtaDuration)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeCtaDuration(nestedValue)])
    )
  }

  return value
}

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
  const normalizedTranslations = normalizeCtaDuration(translations) as Translations

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: normalizedTranslations }}>
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













