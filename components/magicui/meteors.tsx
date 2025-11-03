'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface MeteorsProps {
  number?: number
  minDelay?: number
  maxDelay?: number
  minDuration?: number
  maxDuration?: number
  angle?: number
  className?: string
}

export function Meteors({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className,
}: MeteorsProps) {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([])

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      top: `${Math.floor(Math.random() * 100)}%`,
      left: `${Math.floor(Math.random() * 100)}%`,
      animationDelay: `${Math.random() * (maxDelay - minDelay) + minDelay}s`,
      animationDuration: `${Math.floor(Math.random() * (maxDuration - minDuration) + minDuration)}s`,
    }))
    setMeteorStyles(styles)
  }, [number, minDelay, maxDelay, minDuration, maxDuration])

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          className={cn(
            'pointer-events-none absolute size-1 animate-meteor rounded-full bg-empire/60 shadow-[0_0_0_1px_#ffffff20]',
            className
          )}
          style={style}
        >
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-12 -translate-y-1/2 bg-gradient-to-r from-empire/80 to-transparent" />
        </span>
      ))}
    </>
  )
}

