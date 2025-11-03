'use client'

import { CSSProperties, ReactElement, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface SparklesTextProps {
  children: string
  className?: string
  sparklesCount?: number
  colors?: {
    first: string
    second: string
  }
}

interface Sparkle {
  id: number
  x: string
  y: string
  color: string
  delay: number
  scale: number
  lifespan: number
}

export function SparklesText({
  children,
  className,
  sparklesCount = 10,
  colors = {
    first: '#DAFC68',
    second: '#7be0ff',
  },
}: SparklesTextProps): ReactElement {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    const generateStar = (): Sparkle => {
      return {
        id: Math.random(),
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        color: Math.random() > 0.5 ? colors.first : colors.second,
        delay: Math.random() * 2,
        scale: Math.random() * 1 + 0.3,
        lifespan: Math.random() * 10 + 5,
      }
    }

    const initializeStars = () => {
      return Array.from({ length: sparklesCount }, generateStar)
    }

    setSparkles(initializeStars())

    const interval = setInterval(() => {
      setSparkles((currentSparkles) => {
        return currentSparkles.map((sparkle) => {
          if (sparkle.lifespan <= 0) {
            return generateStar()
          }
          return {
            ...sparkle,
            lifespan: sparkle.lifespan - 0.1,
          }
        })
      })
    }, 100)

    return () => clearInterval(interval)
  }, [sparklesCount, colors.first, colors.second])

  return (
    <div className={cn('relative inline-block', className)}>
      <span className="relative z-10 inline-block">{children}</span>
      <span className="pointer-events-none absolute inset-0">
        {sparkles.map((sparkle) => (
          <Sparkle key={sparkle.id} {...sparkle} />
        ))}
      </span>
    </div>
  )
}

function Sparkle({ x, y, color, delay, scale }: Sparkle) {
  return (
    <span
      className="pointer-events-none absolute animate-sparkle"
      style={
        {
          left: x,
          top: y,
          '--sparkle-delay': `${delay}s`,
          '--sparkle-scale': scale,
          transform: 'translate(-50%, -50%)',
        } as CSSProperties
      }
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-sparkle-rotate"
        style={
          {
            animationDelay: `${delay}s`,
          } as CSSProperties
        }
      >
        <path
          d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 13.3461 5.48847 14.5997 6.46745L15.5758 7.1413C16.1346 7.54549 16.1346 8.45451 15.5758 8.8587L14.5997 9.53255C13.3461 10.5115 12.4006 11.8077 11.8618 13.2797L11.1746 15.1562C10.9446 15.7848 10.0553 15.7848 9.82531 15.1562L9.13812 13.2797C8.59935 11.8077 7.65385 10.5115 6.40026 9.53255L5.42415 8.8587C4.86538 8.45451 4.86538 7.54549 5.42415 7.1413L6.40026 6.46745C7.65385 5.48847 8.59935 4.19229 9.13812 2.72026L9.82531 0.843845Z"
          fill={color}
        />
      </svg>
    </span>
  )
}

