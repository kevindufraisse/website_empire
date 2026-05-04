import type { Metadata } from 'next'
import VerifyClient from './VerifyClient'

export const metadata: Metadata = {
  title: 'Vérifier une certification — Empire Internet',
  description: 'Vérifiez l\'authenticité d\'une certification Empire Internet. Entrez le code unique pour confirmer le niveau d\'un ancien élève.',
}

export default function VerifyPage() {
  return <VerifyClient />
}
