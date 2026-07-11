import * as amplitude from '@amplitude/analytics-browser'

// Same Amplitude project as the app (app.empire-internet.com) so the full
// funnel (variant viewed -> plan click -> signup -> trial -> paid) joins up.
const AMPLITUDE_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY

let initialized = false

// Super properties merged into every event (Mixpanel-style), same pattern as the app.
const superProperties: Record<string, unknown> = { site: 'marketing' }

const superPropertiesPlugin: amplitude.Types.EnrichmentPlugin = {
  name: 'super-properties',
  type: 'enrichment',
  execute: async (event) => {
    event.event_properties = { ...superProperties, ...event.event_properties }
    return event
  },
}

export function initAmplitude() {
  if (initialized || !AMPLITUDE_KEY || typeof window === 'undefined') return
  amplitude.add(superPropertiesPlugin)
  amplitude.init(AMPLITUDE_KEY, {
    serverZone: 'EU',
    autocapture: {
      attribution: true,
      pageViews: true,
      sessions: true,
      formInteractions: false,
      fileDownloads: false,
      elementInteractions: false,
    },
  })
  initialized = true
}

export function setAmplitudeSuperProperties(props: Record<string, unknown>) {
  Object.assign(superProperties, props)
}

export function trackAmplitude(name: string, props?: Record<string, unknown>) {
  if (!initialized) return
  amplitude.track(name, props)
}

export function getAmplitudeDeviceId(): string | undefined {
  if (!initialized) return undefined
  return amplitude.getDeviceId()
}

// Appends the Amplitude device id to an app URL so the app session is merged
// with the website session in Amplitude (cross-domain tracking).
export function withAmplitudeDeviceId(url: string): string {
  if (!initialized) return url
  const deviceId = amplitude.getDeviceId()
  if (!deviceId) return url
  const u = new URL(url)
  u.searchParams.set('amp_device_id', deviceId)
  return u.toString()
}
