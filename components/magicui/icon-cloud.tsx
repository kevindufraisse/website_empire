'use client'

import { useEffect, useMemo, useState } from 'react'

export interface IconCloudProps {
  images: string[]
}

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

export function IconCloud({ images }: IconCloudProps) {
  const isMobile = useIsMobile()

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-visible px-8">
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        {images.map((url, index) => (
          <div
            key={index}
            className="group relative"
            style={{
              animation: `float ${3 + (index % 3)}s ease-in-out infinite`,
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <img
              src={url}
              alt=""
              className="h-8 w-8 md:h-12 md:w-12 opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}









