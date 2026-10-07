/**
 * Portes ouvertes Academy / Agences - WebinarJam.
 * Tous les jeudis 11h (Paris).
 *
 * Override via NEXT_PUBLIC_WEBINARJAM_ID / NEXT_PUBLIC_WEBINARJAM_LIVE.
 * LIVE=false pour couper les embeds si le webinar expire à nouveau.
 */
export const WEBINARJAM_ID =
  process.env.NEXT_PUBLIC_WEBINARJAM_ID?.trim() || 'k50r1oik'

/** true par défaut ; mettre NEXT_PUBLIC_WEBINARJAM_LIVE=false pour fallback email. */
export const WEBINARJAM_LIVE =
  process.env.NEXT_PUBLIC_WEBINARJAM_LIVE !== 'false'

export const WEBINARJAM_REGISTER_URL = `https://event.webinarjam.com/register/${WEBINARJAM_ID}`

/** Barre sticky bas de page (WebinarJam embed-bar). */
export function webinarJamBarSrc(opts?: {
  buttonText?: string
}): string {
  const buttonText = encodeURIComponent(opts?.buttonText ?? 'Register')
  // Snippet WebinarJam : button noir 50%, barre #29b6f6, form template 2 / color 3
  return `https://event.webinarjam.com/register/${WEBINARJAM_ID}/embed-bar?buttonText=${buttonText}&buttonBgColor=%23000000&buttonBgOpacity=0.5&barBgColor=%2329b6f6&barBgOpacity=0.95&formTemplate=2&formColor=3`
}

/** Formulaire embarqué (même session). */
export function webinarJamEmbedSrc(): string {
  return `https://event.webinarjam.com/register/${WEBINARJAM_ID}/embed?formTemplate=2&formColor=3`
}
