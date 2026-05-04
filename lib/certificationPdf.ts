import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const BG = rgb(0.04, 0.04, 0.04)
const EMPIRE = rgb(218 / 255, 252 / 255, 104 / 255)
const WHITE = rgb(0.96, 0.96, 0.96)
const MUTED = rgb(0.55, 0.55, 0.55)

const TIER_LABEL: Record<'bronze' | 'silver' | 'gold', string> = {
  bronze: 'Bronze',
  silver: 'Argent',
  gold: 'Or',
}

function centerX(
  text: string,
  size: number,
  font: { widthOfTextAtSize: (t: string, s: number) => number },
  pageWidth: number
) {
  const w = font.widthOfTextAtSize(text, size)
  return (pageWidth - w) / 2
}

export async function buildCertificationPdf(input: {
  firstName: string
  lastName: string
  tier: 'bronze' | 'silver' | 'gold'
  promotion: string
  issuedAtIso: string
  code: string
  verifyUrl: string
}): Promise<Uint8Array> {
  const W = 841.89 // A4 landscape width (pt)
  const H = 595.28 // A4 landscape height (pt)
  const pad = 48

  const doc = await PDFDocument.create()
  const page = doc.addPage([W, H])
  const { firstName, lastName, tier, promotion, issuedAtIso, code, verifyUrl } = input

  page.drawRectangle({
    x: 0,
    y: 0,
    width: W,
    height: H,
    color: BG,
  })

  page.drawRectangle({
    x: pad * 0.5,
    y: pad * 0.5,
    width: W - pad,
    height: H - pad,
    borderColor: EMPIRE,
    borderWidth: 1.5,
  })

  const helv = await doc.embedFont(StandardFonts.Helvetica)
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold)

  let y = H - pad - 8

  page.drawText('EMPIRE INTERNET', {
    x: centerX('EMPIRE INTERNET', 11, helvBold, W),
    y,
    size: 11,
    font: helvBold,
    color: EMPIRE,
  })

  y -= 42
  page.drawText('CERTIFICATION', {
    x: centerX('CERTIFICATION', 22, helvBold, W),
    y,
    size: 22,
    font: helvBold,
    color: WHITE,
  })

  y -= 28
  const fullName = `${firstName} ${lastName}`.trim()
  const nameSize = fullName.length > 34 ? 20 : 26
  page.drawText(fullName, {
    x: centerX(fullName, nameSize, helvBold, W),
    y,
    size: nameSize,
    font: helvBold,
    color: WHITE,
  })

  y -= 36
  const tierLine = `Niveau ${TIER_LABEL[tier]}`
  page.drawText(tierLine, {
    x: centerX(tierLine, 14, helvBold, W),
    y,
    size: 14,
    font: helvBold,
    color: EMPIRE,
  })

  y -= 52
  page.drawText('Promotion', {
    x: centerX('Promotion', 9, helv, W),
    y,
    size: 9,
    font: helv,
    color: MUTED,
  })
  y -= 18

  const promo =
    promotion.length > 52 ? `${promotion.slice(0, 49)}…` : promotion
  page.drawText(promo, {
    x: centerX(promo, 12, helv, W),
    y,
    size: 12,
    font: helv,
    color: WHITE,
  })

  y -= 44
  const issued = new Date(issuedAtIso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  page.drawText(`Délivrée le ${issued}`, {
    x: centerX(`Délivrée le ${issued}`, 11, helv, W),
    y,
    size: 11,
    font: helv,
    color: MUTED,
  })

  y -= 56
  page.drawText('Code de vérification', {
    x: centerX('Code de vérification', 9, helv, W),
    y,
    size: 9,
    font: helv,
    color: MUTED,
  })
  y -= 20
  page.drawText(code, {
    x: centerX(code, 16, helvBold, W),
    y,
    size: 16,
    font: helvBold,
    color: WHITE,
  })

  y -= 52
  page.drawText('Vérifier en ligne :', {
    x: centerX('Vérifier en ligne :', 9, helv, W),
    y,
    size: 9,
    font: helv,
    color: MUTED,
  })
  y -= 16
  const urlSize = verifyUrl.length > 70 ? 8 : 10
  page.drawText(verifyUrl, {
    x: centerX(verifyUrl, urlSize, helv, W),
    y,
    size: urlSize,
    font: helv,
    color: EMPIRE,
  })

  const foot = 'Document authentifié — tout employeur peut contrôler ce code sur la page de vérification.'
  const footSize = 8
  page.drawText(foot, {
    x: centerX(foot, footSize, helv, W),
    y: pad + 14,
    size: footSize,
    font: helv,
    color: rgb(0.35, 0.35, 0.35),
  })

  const bytes = await doc.save()
  return bytes
}
