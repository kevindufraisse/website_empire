'use client'
import Script from 'next/script'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AcademyTestimonialsSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  return (
    <section className="py-16 md:py-24 bg-[#0a0a0a]">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs font-bold text-academy tracking-widest uppercase mb-3">{fr ? "Ils l'ont fait" : 'They did it'}</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            {fr ? "Ce qu'en disent ceux qui sont passés par là." : 'What those who went through it have to say.'}
          </h2>
        </div>

        <div className="senja-embed" data-id="dbb797c0-9c9f-491d-8b35-7bb197153711" data-mode="shadow" data-lazyload="false" style={{ display: 'block', width: '100%' }} />

        <Script
          src="https://widget.senja.io/widget/dbb797c0-9c9f-491d-8b35-7bb197153711/platform.js"
          strategy="afterInteractive"
        />
      </div>
    </section>
  )
}
