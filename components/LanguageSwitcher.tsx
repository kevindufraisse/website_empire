'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex items-center gap-0.5 p-0.5 bg-white/5 rounded-md border border-white/10">
      <button
        onClick={() => setLang('en')}
        className={`px-2 py-1 text-[10px] font-semibold rounded transition-all ${
          lang === 'en'
            ? 'bg-white/15 text-white'
            : 'text-neutral-500 hover:text-neutral-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('fr')}
        className={`px-2 py-1 text-[10px] font-semibold rounded transition-all ${
          lang === 'fr'
            ? 'bg-white/15 text-white'
            : 'text-neutral-500 hover:text-neutral-300'
        }`}
      >
        FR
      </button>
    </div>
  )
}













