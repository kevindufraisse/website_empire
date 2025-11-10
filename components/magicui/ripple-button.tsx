'use client'

import { useState, MouseEvent } from 'react'
import { cn } from '@/lib/utils'

interface RippleButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function RippleButton({ children, className, onClick }: RippleButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples([...ripples, { x, y, id }])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)

    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={cn('relative overflow-hidden', className)}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple {
          to {
            width: 500px;
            height: 500px;
            margin-left: -250px;
            margin-top: -250px;
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 0.6s ease-out;
        }
      `}</style>
    </button>
  )
}









