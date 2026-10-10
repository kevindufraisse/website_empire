'use client'

import { useState } from 'react'
import Image from 'next/image'

const screens = [
  { file: 'choose-topics', fr: 'Choisissez les sujets', en: 'Choose topics', textFr: 'Empire propose les idées. Vous sélectionnez celles qui correspondent à votre client.', textEn: 'Empire suggests ideas. Select the ones that suit your client.' },
  { file: 'client-link', fr: 'Envoyez son lien', en: 'Send their link', textFr: 'Choisissez le client et préparez sa liste de sujets. Il reçoit un lien pour vous rejoindre.', textEn: 'Choose the client and prepare their list of topics. Send a link to join you.' },
  { file: 'client-session', fr: 'Guidez la session', en: 'Guide the session', textFr: 'Vous voyez votre client, vous lui parlez et vous pilotez les prises depuis Empire.', textEn: 'See your client, talk with them and guide the recordings from Empire.' },
  { file: 'record-answer', fr: 'Il partage son expertise', en: 'They share their expertise', textFr: 'Les sujets s’affichent à l’écran. Le client répond et passe à la prise suivante.', textEn: 'Topics appear on screen. Your client responds and moves to the next recording.' },
  { file: 'content-calendar', fr: 'Validez et publiez', en: 'Review and publish', textFr: 'Retrouvez les contenus préparés dans le calendrier du client. Vous vérifiez, ajustez et programmez.', textEn: 'Find the prepared content in the client’s calendar. Review, adjust and schedule it.' },
]

export default function AcademyProductDemo({ fr }: { fr: boolean }) {
  const [active, setActive] = useState(0)
  const screen = screens[active]

  return (
    <div className="mt-9 overflow-hidden rounded-2xl border border-white/10 bg-[#101310]">
      <div
        className="grid grid-cols-2 gap-2 border-b border-white/10 p-3 sm:grid-cols-5"
        aria-label={fr ? 'Étapes de la démonstration' : 'Demo steps'}
      >
        {screens.map((item, index) => (
          <button
            key={item.file}
            type="button"
            aria-pressed={index === active}
            aria-controls="academy-product-screen"
            onClick={() => setActive(index)}
            className={`rounded-xl px-3 py-3 text-left text-xs leading-relaxed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-academy ${
              index === active ? 'bg-academy text-black' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="mb-1 block text-[10px] opacity-60">0{index + 1}</span>
            {fr ? item.fr : item.en}
          </button>
        ))}
      </div>
      <figure id="academy-product-screen">
        <div className="relative h-[300px] bg-[#090b0a] sm:h-[460px] lg:h-[540px]">
          <Image
            key={screen.file}
            src={`/academy/${screen.file}.png`}
            alt={fr ? screen.fr : screen.en}
            fill
            sizes="(max-width: 768px) 100vw, 1100px"
            className="object-contain p-2 sm:p-5"
          />
        </div>
        <figcaption className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 p-5" aria-live="polite">
          <div>
            <p className="text-sm text-neutral-200">{fr ? screen.textFr : screen.textEn}</p>
            <p className="mt-2 text-[11px] text-neutral-500">
              {fr ? 'Captures réelles de la plateforme · démonstration du parcours' : 'Actual platform screenshots · workflow demonstration'} ·{' '}
              <a href={`/academy/${screen.file}.png`} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                {fr ? 'Agrandir la capture' : 'Enlarge screenshot'}
              </a>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActive((active + 1) % screens.length)}
            className="shrink-0 text-sm font-semibold text-academy"
          >
            {active === screens.length - 1
              ? (fr ? 'Revoir le parcours' : 'Start again')
              : (fr ? 'Étape suivante' : 'Next step')} →
          </button>
        </figcaption>
      </figure>
    </div>
  )
}
