import type { Metadata } from 'next'
import { DataDeletionContent } from './DataDeletionContent'

export const metadata: Metadata = {
  title: 'Data Deletion Instructions — Empire Internet',
  description:
    'How to request deletion of your personal data and revoke Empire Internet access from Facebook, Instagram, YouTube, TikTok, LinkedIn and X.',
}

export default function DataDeletionPage() {
  return <DataDeletionContent />
}
