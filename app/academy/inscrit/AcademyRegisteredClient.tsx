'use client'

import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'

/**
 * Page « place réservée », juste après l'inscription aux portes ouvertes.
 * WebinarJam poste sa redirection au parent ; `useWebinarJamConversion` nous
 * route ici avec la salle en `?next=` au lieu d'aller directement chez
 * WebinarJam. Pas de PDF ici : la page est vue AVANT la présentation, et le
 * PDF ne doit pas la remplacer (il n'est proposé que dans la FAQ de /academy).
 *
 * `next` n'est suivi que vers webinarjam.com (jamais un open redirect) ; sans
 * `next` valide, le lien de la salle arrive de toute façon par email.
 */
export default function AcademyRegisteredClient() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const params = useSearchParams()

  const watchUrl = useMemo(() => {
    const raw = params.get('next') || ''
    try {
      const url = new URL(raw)
      const host = url.hostname
      if (url.protocol === 'https:' && (host === 'webinarjam.com' || host.endsWith('.webinarjam.com'))) {
        return url.toString()
      }
    } catch { /* pas de next valide */ }
    return ''
  }, [params])

  useEffect(() => {
    trackAmplitude('open_house_registered_page_viewed', { has_watch_url: Boolean(watchUrl) })
  }, [watchUrl])

  return (
    <main className="relative min-h-screen bg-black pb-24 pt-28 text-white antialiased md:pt-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(218,252,104,0.10),transparent)]" />
      <div className="container relative">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-academy/40 bg-academy/15">
            <CheckCircle2 className="h-7 w-7 text-academy" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            {fr ? 'Votre place est réservée.' : 'Your spot is booked.'}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-400">
            {fr
              ? 'Vous recevez aussi le lien de la session par email.'
              : 'You’ll also get the session link by email.'}
          </p>

          {watchUrl ? (
            <a
              href={watchUrl}
              onClick={() => trackAmplitude('open_house_watch_clicked', { from: 'registered_page' })}
              className="mt-7 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-academy px-6 py-3.5 text-[15px] font-bold text-black transition hover:brightness-110"
            >
              {fr ? 'Accéder à la présentation en vidéo' : 'Watch the presentation now'}
              <ArrowRight className="h-4 w-4 shrink-0" />
            </a>
          ) : null}
        </div>
      </div>
    </main>
  )
}
