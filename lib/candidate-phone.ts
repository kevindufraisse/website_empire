export function normalizeCandidatePhone(raw: string): string | null {
  if (/[^\d\s+().-]/.test(raw)) return null
  let phone = raw.replace(/[\s().-]/g, '')
  if (phone.startsWith('00')) phone = '+' + phone.slice(2)
  if (/^0\d{9}$/.test(phone)) phone = '+33' + phone.slice(1)
  if (/^\+330\d{9}$/.test(phone)) phone = '+33' + phone.slice(4)
  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : null
}
