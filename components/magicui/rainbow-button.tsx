'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RainbowButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function RainbowButton({ children, className, onClick }: RainbowButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-8 py-4 font-bold text-black transition-all',
        'bg-[linear-gradient(90deg,#DAFC68,#7be0ff,#DAFC68,#7be0ff)] bg-[length:200%_100%]',
        'hover:scale-105 hover:shadow-[0_0_40px_rgba(218,252,104,0.4)]',
        'animate-rainbow',
        className
      )}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}












