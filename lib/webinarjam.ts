/**
 * Portes ouvertes Academy / Agences - WebinarJam.
 * Tous les jeudis 11h (Paris).
 *
 * IMPORTANT : tant que `WEBINARJAM_LIVE` est false, on n’embarque pas
 * le widget (évite « CE WEBINAIRE A EXPIRÉ »). Remplace `WEBINARJAM_ID`
 * par l’ID du webinar récurrent du jeudi, puis passe `WEBINARJAM_LIVE` à true.
 */
export const WEBINARJAM_ID =
  process.env.NEXT_PUBLIC_WEBINARJAM_ID?.trim() || 'k50r1oik'

/** false = ID expiré / pas encore le récurrent jeudi. */
export const WEBINARJAM_LIVE =
  process.env.NEXT_PUBLIC_WEBINARJAM_LIVE === 'true'

export const WEBINARJAM_REGISTER_URL = `https://event.webinarjam.com/register/${WEBINARJAM_ID}`

/** Barre sticky bas de page (WebinarJam embed-bar). */
export function webinarJamBarSrc(opts?: {
  buttonText?: string
  buttonBg?: string
  barBg?: string
}): string {
  const buttonText = encodeURIComponent(opts?.buttonText ?? "S'inscrire")
  const buttonBg = encodeURIComponent(opts?.buttonBg ?? '#dafc68')
  const barBg = encodeURIComponent(opts?.barBg ?? '#0a0a0a')
  return `https://event.webinarjam.com/register/${WEBINARJAM_ID}/embed-bar?buttonText=${buttonText}&buttonBgColor=${buttonBg}&buttonBgOpacity=1&barBgColor=${barBg}&barBgOpacity=0.96&formTemplate=2&formColor=1`
}

/** Formulaire embarqué (même session). */
export function webinarJamEmbedSrc(): string {
  return `https://event.webinarjam.com/register/${WEBINARJAM_ID}/embed?formTemplate=2&formColor=1`
}
