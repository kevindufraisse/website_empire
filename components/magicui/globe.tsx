'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface GlobeProps {
  className?: string
}

export function Globe({ className }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let rotation = 0

    const drawGlobe = () => {
      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) / 2 - 20

      ctx.clearRect(0, 0, width, height)

      // Draw globe circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.strokeStyle = 'rgba(218, 252, 104, 0.2)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw latitude lines
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath()
        const y = centerY + (i * radius) / 3
        const width = Math.sqrt(radius * radius - ((i * radius) / 3) ** 2)
        ctx.ellipse(centerX, y, width, width / 4, 0, 0, 2 * Math.PI)
        ctx.strokeStyle = 'rgba(218, 252, 104, 0.15)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw longitude lines
      for (let i = 0; i < 6; i++) {
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate((rotation + (i * Math.PI) / 3))
        ctx.beginPath()
        ctx.ellipse(0, 0, radius / 4, radius, 0, 0, 2 * Math.PI)
        ctx.strokeStyle = 'rgba(218, 252, 104, 0.15)'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.restore()
      }

      // Draw dots (representing global reach)
      const dots = 30
      for (let i = 0; i < dots; i++) {
        const angle = (i / dots) * Math.PI * 2 + rotation
        const distance = radius * 0.7
        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance * 0.5

        ctx.beginPath()
        ctx.arc(x, y, 2, 0, 2 * Math.PI)
        ctx.fillStyle = 'rgba(218, 252, 104, 0.6)'
        ctx.fill()
      }

      rotation += 0.003
      animationFrameId = requestAnimationFrame(drawGlobe)
    }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    drawGlobe()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={cn('h-full w-full', className)}
      style={{ width: '100%', height: '100%' }}
    />
  )
}








