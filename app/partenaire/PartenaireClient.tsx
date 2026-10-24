'use client'

import { useEffect, useRef } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import LoomEmbed from '@/components/LoomEmbed'
import { WebinarJamBar, WebinarJamButton } from '@/components/WebinarJamRegister'
import { OPEN_HOUSE_REPLAY_ID } from '@/lib/webinarjam'
import { trackAmplitude } from '@/lib/amplitude'
import { trackMeta } from '@/lib/meta'

/** Même vidéo que la pub des portes ouvertes. */
const PARTNER_LOOM_ID = '5ac5b5502e104eb89db2f9ccd8485b9c'
/** Moitié de la vidéo Loom (21 min 52 s). Loom ne publie pas la progression : on compte le temps onglet visible. */
const WATCH50_SECONDS = 656
const META_VIDEO = { content_name: 'video_partenaire', content_category: 'academy_partner' }

/**
 * Le lecteur Loom est un iframe : un clic dedans fait perdre le focus à la
 * page, c'est notre signal de lancement (ViewContent), puis JPO_Watch50.
 */
function useLoomWatchTracking() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined
    let watched = 0

    const onBlur = () => {
      window.setTimeout(() => {
        const active = document.activeElement
        if (timer || !active || active.tagName !== 'IFRAME' || !ref.current?.contains(active)) return
        trackAmplitude('partner_vsl_played')
        trackMeta('ViewContent', META_VIDEO)
        timer = setInterval(() => {
          if (document.visibilityState === 'visible') watched += 1
          if (watched >= WATCH50_SECONDS) {
            clearInterval(timer)
            trackMeta('JPO_Watch50', META_VIDEO)
          }
        }, 1000)
      }, 0)
    }

    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('blur', onBlur)
      if (timer) clearInterval(timer)
    }
  }, [])

  return ref
}

const FOR_WHO = [
  { t: 'Tu te reconvertis', d: 'Tu veux un nouveau métier, que tu apprends en lançant d’abord ta propre marque.' },
  { t: 'Tu es freelance ou consultant', d: 'Tu ajoutes une offre personal branding à ce que tu vends déjà.' },
  { t: 'Tu as une agence', d: 'Tu suis plus de clients sans recruter une équipe de production.' },
]

const HOW = [
  'Tu apprends la méthode et tu lances d’abord ta propre marque avec Empire.',
  'Tu accompagnes tes clients : sujets, priorités, relecture. Empire écrit, monte et publie.',
  'Tu fixes ton prix. Le client paie son abonnement Empire à part.',
]

export default function PartenaireClient() {
  const videoRef = useLoomWatchTracking()

  useEffect(() => {
    trackAmplitude('partner_vsl_viewed')
  }, [])

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(252,165,165,0.12),transparent)]" />

      <section className="relative pb-12 pt-6 md:pb-16 md:pt-8">
        <div className="container mx-auto max-w-4xl px-4">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-academy">
            Devenir partenaire Empire · vidéo gratuite
          </p>
          <h1 className="mb-5 text-center text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            Environ 4 h par mois et par client,
            <br />
            <span className="text-academy">500 à 1 000 € facturés</span>
          </h1>

          {/* La vidéo et le bouton tiennent dans l'écran : la largeur suit la hauteur disponible. */}
          <div ref={videoRef} className="relative mx-auto w-full max-w-[calc((100svh-17rem)*16/9)]">
            <LoomEmbed id={PARTNER_LOOM_ID} title="Devenir partenaire Empire" />
          </div>

          <div className="mt-5 flex flex-col items-center gap-2">
            <WebinarJamButton
              hash={OPEN_HOUSE_REPLAY_ID}
              onClick={() => trackAmplitude('academy_open_house_clicked', { source: 'partner_vsl', session: 'replay' })}
              className="inline-flex h-14 w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-academy px-6 text-base font-bold text-black transition hover:brightness-110"
            >
              Réserver ma place aux portes ouvertes
              <ArrowRight className="h-5 w-5" />
            </WebinarJamButton>
            <p className="text-center text-xs text-neutral-400">Gratuit · inscription en 10 secondes · tu choisis ton créneau</p>
          </div>
        </div>
      </section>

      <section className="relative py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">C’est pour toi si</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {FOR_WHO.map((item) => (
              <div key={item.t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="mb-2 font-bold text-white">{item.t}</h3>
                <p className="text-sm leading-relaxed text-neutral-400">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-20 pt-4">
        <div className="container mx-auto max-w-2xl px-4">
          <h2 className="mb-6 text-center text-2xl font-bold md:text-3xl">Comment ça marche</h2>
          <ul className="space-y-3">
            {HOW.map((line) => (
              <li key={line} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-neutral-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-academy" />
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-center text-xs text-neutral-600">
            Repères indicatifs tirés du programme partenaire. Les clients et les revenus ne sont pas garantis : ils dépendent de ton travail et de ta prospection.
          </p>
        </div>
      </section>
      <WebinarJamBar buttonText="S’inscrire" source="partner_vsl" hash={OPEN_HOUSE_REPLAY_ID} />
    </main>
  )
}
