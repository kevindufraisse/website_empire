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

/** Barre sticky bas de page (WebinarJam embed-bar) — couleurs Academy (#fca5a5). */
export function webinarJamBarSrc(opts?: {
  buttonText?: string
}): string {
  const buttonText = encodeURIComponent(opts?.buttonText ?? 'Register')
  const buttonBg = encodeURIComponent('#fca5a5')
  const barBg = encodeURIComponent('#0a0a0a')
  return `https://event.webinarjam.com/register/${WEBINARJAM_ID}/embed-bar?buttonText=${buttonText}&buttonBgColor=${buttonBg}&buttonBgOpacity=1&barBgColor=${barBg}&barBgOpacity=0.96&formTemplate=2&formColor=1`
}

/** Formulaire embarqué (même session, thème sombre). */
export function webinarJamEmbedSrc(): string {
  return `https://event.webinarjam.com/register/${WEBINARJAM_ID}/embed?formTemplate=2&formColor=1`
}
