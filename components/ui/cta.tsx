import {
  TRIAL_REASSURANCE_BOOTCAMP_EN,
  TRIAL_REASSURANCE_BOOTCAMP_FR,
  TRIAL_REASSURANCE_EN,
  TRIAL_REASSURANCE_FR,
} from '@/lib/startTrial'

/*
 * Les deux boutons d'action du site, comme sur les pages tarifs et les
 * premiers écrans de Claude, Intercom, Semrush, Runway, HeyGen ou Opus Clip :
 * le bouton d'essai plein (lime), le bouton secondaire de la même hauteur, de
 * la même taille de texte et de la même largeur, avec un contour blanc bien
 * visible ; et une ligne de réassurance courte juste sous le bouton d'essai.
 */

const CTA_BASE =
  'inline-flex h-full min-h-[54px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 py-3 text-base font-bold leading-tight transition sm:text-[17px] disabled:cursor-wait disabled:opacity-70'

/** Le bouton d'essai : le plus visible de la page. */
export const CTA_PRIMARY = `group ${CTA_BASE} bg-empire text-black shadow-[0_0_30px_rgb(var(--empire-rgb)_/_0.3)] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-empire`

/** « Demander une démo » : même gabarit, fond très sombre, contour blanc 60 %. */
export const CTA_SECONDARY = `${CTA_BASE} border-[1.5px] border-white/60 bg-[#0a0a0a] text-white hover:border-white hover:bg-[#151515] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`

/**
 * « 0 € aujourd’hui · Onboarding 1-1 offert · Annulable depuis l’app ».
 * Sur une ligne dès 640 px ; en dessous (et partout avec `stacked`, pour les
 * colonnes étroites), en deux lignes nettes : jamais un « · » qui pend en fin
 * de ligne.
 */
export function TrialReassurance({ fr, bootcamp = false, stacked = false, className = '' }: { fr: boolean; bootcamp?: boolean; stacked?: boolean; className?: string }) {
  const text = bootcamp
    ? (fr ? TRIAL_REASSURANCE_BOOTCAMP_FR : TRIAL_REASSURANCE_BOOTCAMP_EN)
    : (fr ? TRIAL_REASSURANCE_FR : TRIAL_REASSURANCE_EN)
  const parts = text.split(' · ')
  const last = parts.length - 1
  const dot = <span aria-hidden className="text-neutral-500">{' · '}</span>
  return (
    <p className={`text-center text-[13px] leading-relaxed text-neutral-300 ${className}`}>
      {parts.map((part, i) => (
        <span key={part}>
          {i > 0 && i < last && dot}
          {i > 0 && i === last && (stacked
            ? <br />
            : <><br className="sm:hidden" /><span className="hidden sm:inline">{dot}</span></>)}
          <span className="whitespace-nowrap">{part}</span>
        </span>
      ))}
    </p>
  )
}

/**
 * Le duo essai + démo. Téléphone : empilés, pleine largeur, même hauteur, la
 * ligne de réassurance juste sous l'essai. Dès 640 px : côte à côte, même
 * largeur, la ligne centrée dessous.
 */
export function CtaPair({
  fr,
  primary,
  secondary,
  className = '',
  reassuranceClassName = '',
}: {
  fr: boolean
  primary: React.ReactNode
  secondary?: React.ReactNode
  className?: string
  /** Ex. un fond opaque dans le hero, où des réactions montent derrière. */
  reassuranceClassName?: string
}) {
  return (
    <div className={`mx-auto grid w-full gap-3 ${secondary ? 'max-w-[640px] sm:grid-cols-2' : 'max-w-[400px]'} ${className}`}>
      <div className="order-1">{primary}</div>
      <TrialReassurance fr={fr} className={`order-2 -mt-1 ${secondary ? 'sm:order-3 sm:col-span-2 sm:mt-0' : ''} ${reassuranceClassName}`} />
      {secondary && <div className="order-3 sm:order-2">{secondary}</div>}
    </div>
  )
}
