'use client'

import AcademyWaitlistCta from '@/components/AcademyWaitlistCta'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AcademyHeroSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-[#0f0f0f] pb-20 pt-20 md:pb-28 md:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(252,165,165,0.1),transparent)]" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-academy/30 bg-academy/10 px-3 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-academy opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-academy" />
              </span>
              <span className="text-xs font-bold text-academy">
                {fr
                  ? '21 jours · 1 défi par jour · Une certification'
                  : '21 days · 1 challenge a day · One certification'}
              </span>
            </div>
          </div>

          <h1 className="mb-5 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {fr ? 'Devenez ' : 'Become '}
            <span className="text-academy">{fr ? 'Head of Viralité' : 'Head of Virality'}</span>
            {fr ? ' en 21 jours.' : ' in 21 days.'}
          </h1>

          <div className="mx-auto mb-6 max-w-2xl space-y-3">
            <p className="text-lg leading-relaxed text-neutral-200 sm:text-xl">
              {fr
                ? "Apprenez à transformer l'expertise d'une marque en contenus qui attirent l'attention - puis faites de cette compétence votre nouveau métier."
                : "Learn to turn a brand's expertise into content that earns attention - then make that skill your new craft."}
            </p>
            <p className="text-sm leading-relaxed text-neutral-400 sm:text-base">
              {fr
                ? '21 jours pour apprendre la méthode, obtenir votre certification et décrocher vos premières missions. Même sans avoir votre propre projet.'
                : '21 days to learn the method, earn your certification and land your first missions. Even without your own project.'}
            </p>
          </div>

          <div
            id="portes-ouvertes"
            className="mx-auto mb-6 flex max-w-sm scroll-mt-24 flex-col items-center gap-4"
          >
            <AcademyWaitlistCta
              source="academy-hero"
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl bg-academy px-8 py-4 text-base font-bold text-black transition-all hover:brightness-110"
            >
              <span>{fr ? 'Portes ouvertes - jeudi 11h →' : 'Open house - Thursday 11am →'}</span>
              <span className="text-[11px] font-semibold opacity-70">
                {fr ? 'Gratuit · 45 min · Questions en direct' : 'Free · 45 min · Live Q&A'}
              </span>
            </AcademyWaitlistCta>
          </div>

          <p className="text-[11px] text-neutral-500">
            {fr
              ? 'Découvrez le modèle partenariat avant de candidater'
              : 'See the partnership model before you apply'}
          </p>
        </div>
      </div>
    </section>
  )
}
