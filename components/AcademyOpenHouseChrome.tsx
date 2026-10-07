'use client'

import { WebinarJamBar } from '@/components/WebinarJamRegister'
import { useLanguage } from '@/contexts/LanguageContext'

/** Barre sticky WebinarJam (portes ouvertes) sur /academy. */
export default function AcademyOpenHouseChrome() {
  const { lang } = useLanguage()
  return <WebinarJamBar buttonText={lang === 'fr' ? "S'inscrire" : 'Register'} />
}
