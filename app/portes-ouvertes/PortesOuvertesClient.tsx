'use client'

import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import LoomEmbed from '@/components/LoomEmbed'
import { WebinarJamBar, WebinarJamButton } from '@/components/WebinarJamRegister'
import { trackAmplitude } from '@/lib/amplitude'

const AD_LOOM_ID = '5ac5b5502e104eb89db2f9ccd8485b9c'
const SOURCE = 'portes_ouvertes_ad'

export default function PortesOuvertesClient() {
  useEffect(() => {
    trackAmplitude('open_house_landing_viewed', { source: SOURCE })
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq
    if (typeof fbq === 'function') fbq('track', 'ViewContent', { content_name: 'portes_ouvertes' })
  }, [])

  return (
    <main className="min-h-screen bg-black px-4 pb-32 pt-24 text-white sm:pt-28">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-academy">
          Portes ouvertes · gratuit
        </p>
        <h1 className="mx-auto mt-3 max-w-2xl text-center text-2xl font-bold leading-tight sm:text-4xl">
          Regarde la vidéo, puis réserve ta place
        </h1>

        <LoomEmbed id={AD_LOOM_ID} className="mt-8" title="Portes ouvertes Empire" />

        <div className="mt-8 flex flex-col items-center gap-3">
          <WebinarJamButton
            onClick={() => trackAmplitude('academy_open_house_clicked', { source: SOURCE })}
            className="inline-flex h-14 w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-academy px-6 text-[16px] font-bold text-black transition hover:brightness-110"
          >
            Je participe aux portes ouvertes
            <ArrowRight className="h-5 w-5" />
          </WebinarJamButton>
          <p className="text-center text-[12px] text-neutral-400">
            Inscription en 10 secondes · tu reçois le lien par email
          </p>
        </div>
      </div>

      <WebinarJamBar buttonText="S'inscrire" source={SOURCE} />
    </main>
  )
}
