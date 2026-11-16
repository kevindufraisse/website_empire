import { isSupportedCountry, parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js/min'

export function countryPhone(value: string, country: unknown) {
  const raw = value.trim()
  if (typeof country !== 'string' || !isSupportedCountry(country as CountryCode) || raw.length > 40 || !/^\+?[\d(][\d\s().-]*$/.test(raw)) return null
  const parsed = parsePhoneNumberFromString(raw.replace(/^00/, '+'), country as CountryCode)
  return parsed?.isPossible() ? parsed : null
}
