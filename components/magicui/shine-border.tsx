'use client'
import { ReactNode } from 'react'

export default function ShineBorder({
  children,
  className,
  color = '#DAFC68',
}: {
  children: ReactNode
  className?: string
  color?: string
}) {
  return (
    <div className={`relative inline-flex overflow-hidden rounded-xl p-[1px] ${className || ''}`}>
      <span
        className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--shine-color)_50%,transparent_100%)]"
        style={{ '--shine-color': color } as React.CSSProperties}
      />
      <div className="relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-black">
        {children}
      </div>
    </div>
  )
}




