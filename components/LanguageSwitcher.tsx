'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
          lang === 'en'
            ? 'bg-empire text-black'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('fr')}
        className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
          lang === 'fr'
            ? 'bg-empire text-black'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        FR
      </button>
    </div>
  )
}



