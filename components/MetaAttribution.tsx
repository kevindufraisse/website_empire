'use client'

import { useEffect } from 'react'
import { captureAttribution } from '@/lib/meta'

export default function MetaAttribution() {
  useEffect(() => {
    captureAttribution()
  }, [])
  return null
}
