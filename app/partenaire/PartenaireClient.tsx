'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Check, Play } from 'lucide-react'
import LoomEmbed from '@/components/LoomEmbed'
import VideoEmailGate, { adoptEmailFromUrl } from '@/components/VideoEmailGate'
import { trackAmplitude } from '@/lib/amplitude'

/** Même vidéo que la pub des portes ouvertes. */
const PARTNER_LOOM_ID = '5ac5b5502e104eb89db2f9ccd8485b9c'

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
  const [unlocked, setUnlocked] = useState(false)
  const [askEmail, setAskEmail] = useState(false)

  useEffect(() => {
    setUnlocked(adoptEmailFromUrl('academy'))
    trackAmplitude('partner_vsl_viewed')
  }, [])

  const play = () => {
    if (unlocked) return
    setAskEmail(true)
    trackAmplitude('vsl_email_gate_shown', { funnel: 'academy' })
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(252,165,165,0.12),transparent)]" />

      <section className="relative pb-12 pt-24 md:pb-16 md:pt-28">
        <div className="container mx-auto max-w-4xl px-4">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-academy">
            Devenir partenaire Empire · vidéo gratuite
          </p>
          <h1 className="mb-4 text-center text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Environ 4 h par mois et par client, <span className="text-academy">500 à 1 000 € facturés</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-center text-base text-neutral-400 md:text-lg">
            Le métier de partenaire Empire : tu accompagnes des entrepreneurs sur leur personal branding, Empire produit leurs contenus. Regarde comment ça marche.
          </p>

          <div className="relative w-full">
            {unlocked ? (
              <LoomEmbed id={PARTNER_LOOM_ID} title="Devenir partenaire Empire" />
            ) : (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/15 bg-[radial-gradient(ellipse_at_center,rgba(252,165,165,0.18),#0a0a0a_70%)]">
                <button
                  type="button"
                  onClick={play}
                  aria-label="Lancer la vidéo"
                  className="group absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-3"
                >
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-academy text-black shadow-xl transition-transform group-hover:scale-105">
                    <Play className="ml-1 h-9 w-9" fill="currentColor" />
                  </span>
                  <span className="text-sm text-neutral-300">Le métier de partenaire, expliqué par Kevin</span>
                </button>
                {askEmail && (
                  <VideoEmailGate
                    funnel="academy"
                    accent="academy"
                    title="Où on t’envoie la vidéo ?"
                    subtitle="Ton email, et la vidéo démarre tout de suite."
                    onUnlocked={() => {
                      setUnlocked(true)
                      setAskEmail(false)
                      trackAmplitude('partner_vsl_played')
                    }}
                  />
                )}
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <a
              href="/academy#portes-ouvertes"
              onClick={() => trackAmplitude('academy_open_house_clicked', { source: 'partner_vsl' })}
              className="inline-flex h-14 w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-academy px-6 text-base font-bold text-black transition hover:brightness-110"
            >
              Réserver ma place aux portes ouvertes
              <ArrowRight className="h-5 w-5" />
            </a>
            <p className="text-center text-xs text-neutral-400">Gratuit · chaque jeudi à 11h (Paris) · tu poses tes questions en direct</p>
            <a
              href="/academy"
              onClick={() => trackAmplitude('academy_program_clicked', { source: 'partner_vsl' })}
              className="text-sm text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-white"
            >
              Voir le programme et les prix
            </a>
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
    </main>
  )
}
