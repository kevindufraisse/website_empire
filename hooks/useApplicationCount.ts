'use client'
import { useEffect, useState } from 'react'

export function useApplicationCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/applications/count')
      .then((r) => r.json())
      .then((d) => setCount(d.count ?? 0))
      .catch(() => setCount(null))
  }, [])

  return count
}
