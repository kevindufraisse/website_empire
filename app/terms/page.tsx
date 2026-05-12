import type { Metadata } from 'next'
import { TermsContent } from './TermsContent'

export const metadata: Metadata = {
  title: 'Terms of Use / Conditions Générales d\'Utilisation — Empire Internet',
  description:
    'Terms governing the use of the Empire Internet platform, including connection to Meta, Google/YouTube, TikTok, LinkedIn and X APIs. Last updated May 12, 2026.',
}

export default function TermsPage() {
  return <TermsContent />
}
