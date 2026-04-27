'use client'
import Script from 'next/script'

export default function AcademyTestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-[#0a0a0a]">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs font-bold text-academy tracking-widest uppercase mb-3">Ils l'ont fait</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Ce qu'en disent ceux qui sont passés par là.
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
