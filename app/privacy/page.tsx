import type { Metadata } from 'next'
import { PrivacyContent } from './PrivacyContent'

export const metadata: Metadata = {
  title: 'Privacy Policy / Politique de Confidentialité — Empire Internet',
  description:
    'How Empire Internet collects, uses, stores, and protects personal data, including data obtained via Meta, Google/YouTube, TikTok, LinkedIn and X APIs. Last updated May 12, 2026.',
}

export default function PrivacyPage() {
  return <PrivacyContent />
}
