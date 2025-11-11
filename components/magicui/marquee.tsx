'use client'
import { ReactNode } from 'react'

export default function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 2,
}: {
  children: ReactNode
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  vertical?: boolean
  repeat?: number
}) {
  return (
    <div
      className={`group flex overflow-hidden ${vertical ? 'flex-col' : 'flex-row'} ${className || ''}`}
      style={{
        maskImage: vertical
          ? 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
          : 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
      }}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={`flex shrink-0 justify-around gap-4 ${vertical ? 'flex-col animate-marquee-vertical' : 'animate-marquee'} ${
            reverse ? '[animation-direction:reverse]' : ''
          } ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}`}
        >
          {children}
        </div>
      ))}
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% - 1rem)); }
        }
        @keyframes marquee-vertical {
          from { transform: translateY(0); }
          to { transform: translateY(calc(-100% - 1rem)); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee-vertical {
          animation: marquee-vertical 20s linear infinite;
        }
      `}</style>
    </div>
  )
}











