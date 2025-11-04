'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export interface ScrollProgressProps {
  className?: string
}

export function ScrollProgress({ className }: ScrollProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (window.scrollY / scrollHeight) * 100
      setProgress(scrolled)
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div
      className={cn(
        'fixed top-[64px] left-0 right-0 h-1 bg-white/10 z-50',
        className
      )}
    >
      <div
        className="h-full bg-gradient-to-r from-empire to-blue-400 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}




