'use client'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/** Muted, real footage. Only visible compositions decode the loop. */
export default function PreviewVideo({ src, poster, className, label, still = false }: { src: string; poster: string; className?: string; label: string; still?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const video = ref.current
    if (!video || reduced || still) return
    let visible = false
    const sync = () => {
      if (visible && !video.closest('[aria-hidden="true"]')) video.play().catch(() => {})
      else video.pause()
    }
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() }, { threshold: .2 })
    const mutations = new MutationObserver(sync)
    let ancestor = video.parentElement
    while (ancestor) {
      if (ancestor.hasAttribute('aria-hidden')) mutations.observe(ancestor, { attributes: true, attributeFilter: ['aria-hidden'] })
      ancestor = ancestor.parentElement
    }
    intersection.observe(video)
    return () => { intersection.disconnect(); mutations.disconnect(); video.pause() }
  }, [reduced, still])
  if (still || reduced) return <img src={poster} alt={label} className={className}/>
  return <video ref={ref} src={src} poster={poster} className={className} muted loop playsInline preload="metadata" aria-label={label}/>
}
