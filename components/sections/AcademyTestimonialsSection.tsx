'use client'

/**
 * Widget Senja avec vidéos (même ID que la home / VSL).
 * L’ancien `dbb797c0…` était un mur texte sans vidéos - config Senja, pas le code.
 */
import { useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const SENJA_VIDEO_WIDGET_ID = 'a7bf7e4a-0f3b-4751-8190-849f83d16306'

export default function AcademyTestimonialsSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let script: HTMLScriptElement | null = null
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || script) return
        script = document.createElement('script')
        script.src = `https://widget.senja.io/widget/${SENJA_VIDEO_WIDGET_ID}/platform.js`
        script.async = true
        document.body.appendChild(script)
        observer.disconnect()
      },
      { rootMargin: '120px' },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (script?.parentNode) script.parentNode.removeChild(script)
    }
  }, [])

  return (
    <section ref={sectionRef} className="bg-transparent py-20 md:py-28 [content-visibility:auto] [contain-intrinsic-size:auto_640px]">
      <div className="container">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-academy">
            {fr ? "Ils l'ont fait" : 'They did it'}
          </p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {fr ? "Ce qu'en disent ceux qui sont passés par là" : 'What people who went through it say'}
          </h2>
        </div>

        <div
          className="senja-embed min-h-[20rem]"
          data-id={SENJA_VIDEO_WIDGET_ID}
          data-mode="shadow"
          data-lazyload="true"
          style={{ display: 'block', width: '100%' }}
        />
      </div>
    </section>
  )
}
