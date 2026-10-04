'use client'

import { useEffect, useRef, useState, type VideoHTMLAttributes } from 'react'

/**
 * Vidéo en boucle qui ne télécharge rien tant qu'elle n'approche pas de
 * l'écran. Un <video autoPlay src=…> part dès le chargement de la page, même
 * tout en bas : sur l'accueil, c'était 1,1 Mo pris avant que le visiteur ait
 * scrollé. Le poster s'affiche à la place jusqu'au déclenchement.
 */
export default function LazyVideo({
  src,
  rootMargin = '400px',
  ...props
}: VideoHTMLAttributes<HTMLVideoElement> & { src: string; rootMargin?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || near) return
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [near, rootMargin])

  return <video ref={ref} src={near ? src : undefined} preload={near ? 'auto' : 'none'} {...props} />
}
