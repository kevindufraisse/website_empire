/**
 * Portes ouvertes Academy / Agences - EverWebinar (r0w4xps2), le live
 * rejoué à la demande. L'ancien live WebinarJam du jeudi 11h est k50r1oik.
 *
 * Override via NEXT_PUBLIC_WEBINARJAM_ID / NEXT_PUBLIC_WEBINARJAM_LIVE.
 * LIVE=false pour couper les embeds si le webinar expire à nouveau.
 */
export const WEBINARJAM_ID =
  process.env.NEXT_PUBLIC_WEBINARJAM_ID?.trim() || 'r0w4xps2'

/** Le même live rejoué à la demande (EverWebinar) : l'inscrit regarde tout de suite. */
export const OPEN_HOUSE_REPLAY_ID =
  process.env.NEXT_PUBLIC_EVERWEBINAR_ID?.trim() || 'r0w4xps2'

/** true par défaut ; mettre NEXT_PUBLIC_WEBINARJAM_LIVE=false pour fallback email. */
export const WEBINARJAM_LIVE =
  process.env.NEXT_PUBLIC_WEBINARJAM_LIVE !== 'false'

export const WEBINARJAM_REGISTER_URL = `https://event.webinarjam.com/register/${WEBINARJAM_ID}`

/** Barre sticky bas de page (WebinarJam embed-bar) — couleurs Academy (#fca5a5). */
export function webinarJamBarSrc(opts?: {
  buttonText?: string
  id?: string
}): string {
  const buttonText = encodeURIComponent(opts?.buttonText ?? 'Register')
  const buttonBg = encodeURIComponent('#fca5a5')
  const barBg = encodeURIComponent('#0a0a0a')
  return `https://event.webinarjam.com/register/${opts?.id || WEBINARJAM_ID}/embed-bar?buttonText=${buttonText}&buttonBgColor=${buttonBg}&buttonBgOpacity=1&barBgColor=${barBg}&barBgOpacity=0.96&formTemplate=2&formColor=1`
}

/** Bouton d'inscription (WebinarJam embed-button) : ouvre la popup au clic sur un `data-webinarhash`. */
export function webinarJamButtonSrc(opts?: {
  buttonText?: string
  id?: string
}): string {
  const buttonText = encodeURIComponent(opts?.buttonText ?? 'Register')
  return `https://event.webinarjam.com/register/${opts?.id || WEBINARJAM_ID}/embed-button?formTemplate=2&formColor=1&buttonText=${buttonText}`
}

/** Formulaire embarqué (même session, thème sombre). */
export function webinarJamEmbedSrc(): string {
  return `https://event.webinarjam.com/register/${WEBINARJAM_ID}/embed?formTemplate=2&formColor=1`
}
