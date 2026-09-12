'use client'

/**
 * TopCreatorsSection - mur de témoignages des plus gros créateurs FR.
 *
 * Widget Senja distinct de `TestimonialsSection` (clients Empire) : ici,
 * ce sont les créateurs à forte audience qui utilisent Empire. C'est le
 * même widget que sur `/pricing` et `/join/empire` côté app, pour qu'un
 * prospect qui traverse les deux funnels voie les mêmes noms des deux
 * côtés (cohérence de preuve).
 *
 * Le SDK Senja ne part qu'à l'approche de la section : le charger au
 * premier paint concurrence le hero.
 */

import { useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const SENJA_TOP_CREATORS_ID = '68885202-c416-4672-bd27-6b130d60d1a7'

export default function TopCreatorsSection({ compact = false }: { compact?: boolean }) {
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
        script.src = `https://widget.senja.io/widget/${SENJA_TOP_CREATORS_ID}/platform.js`
        script.async = true
        document.body.appendChild(script)
        observer.disconnect()
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      if (script?.parentNode) script.parentNode.removeChild(script)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black ${compact ? 'py-10 md:py-14' : 'py-20 md:py-28'}`}
    >
      <div className="container">
        <div className={`mx-auto max-w-3xl text-center ${compact ? 'mb-8' : 'mb-12'}`}>
          <p className="text-xs font-bold text-empire tracking-widest uppercase mb-3">
            {fr ? 'Ils recommandent' : 'They recommend'}
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            {fr
              ? "Ce qu'en disent les plus gros créateurs FR"
              : 'What top French creators say'}
          </h2>
          <p className="mt-3 text-base text-neutral-400 max-w-2xl mx-auto">
            {fr
              ? "Pas des noms qu'on a payés - des créateurs qui utilisent Empire au quotidien."
              : 'Not names we paid - creators who use Empire every day.'}
          </p>
        </div>

        <div
          className="senja-embed"
          data-id={SENJA_TOP_CREATORS_ID}
          data-mode="shadow"
          data-lazyload="true"
          style={{ display: 'block', width: '100%' }}
        />
      </div>
    </section>
  )
}
