'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { Check, CalendarPlus, Mail, Phone, Share2, Linkedin, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react'
import Image from 'next/image'

const WEBINAR_DATE = '18 juin 2026'
const WEBINAR_DATE_SHORT = 'jeu. 18 juin'
const WEBINAR_TIME = '19h00'
const WEBINAR_DURATION = '90 min'

const CAL_TITLE = encodeURIComponent('Les secrets des gourous - Webinar Empire Internet')
const CAL_DESC = encodeURIComponent('Webinar gratuit avec Kevin & Marc Dufraisse.\nDécouvre les techniques des personnalités les plus visibles et comment les appliquer à ton business.\n\nLien : https://empire-internet.com/live')
const CAL_START = '20260618T170000Z'
const CAL_END = '20260618T183000Z'

const CALENDAR_LINKS = {
  google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${CAL_TITLE}&dates=${CAL_START}/${CAL_END}&details=${CAL_DESC}`,
  outlook: `https://outlook.live.com/calendar/0/action/compose?subject=${CAL_TITLE}&startdt=2026-06-18T17:00:00Z&enddt=2026-06-18T18:30:00Z&body=${CAL_DESC}`,
  yahoo: `https://calendar.yahoo.com/?v=60&title=${CAL_TITLE}&st=${CAL_START}&et=${CAL_END}&desc=${CAL_DESC}`,
}

const WEBINAR_BULLETS = [
  'Comment créer une armée de fans qui achètent TOUS vos produits',
  'Pourquoi il n\'a jamais été aussi simple d\'appliquer ces méthodes en 2026',
  'Pourquoi ces méthodes sont restées secrètes aussi longtemps',
  'Le mécanisme psychologique qui transforme un visiteur en fan (et en client)',
  'Les secrets des plus gros créateurs-entrepreneurs décortiqués en live',
  'Une démo en direct sur un cas que tu vas reconnaître',
]

const SHARE_URL = 'https://empire-internet.com/webinar'
const SHARE_TITLE = 'Les secrets des gourous du web - Webinar gratuit (Empire Internet)'
const SHARE_TEXT = 'Les secrets psychologiques qu\'utilisent les gourous du web pour avoir une audience qui achète sans poser de questions. Webinar gratuit le 18 juin, animé par Kevin & Marc Dufraisse.'

function generateICS(): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Empire Internet//Webinar//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'DTSTART:20260618T170000Z',
    'DTEND:20260618T183000Z',
    'SUMMARY:Les secrets des gourous - Webinar Empire Internet',
    'DESCRIPTION:Webinar gratuit avec Kevin & Marc Dufraisse.\\nDécouvre les techniques des personnalités les plus visibles et comment les appliquer à ton business.\\n\\nLien : https://empire-internet.com/webinar',
    'URL:https://empire-internet.com/webinar',
    'ORGANIZER;CN=Empire Internet:mailto:contact@empire-internet.com',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\r\n')
}

function downloadICS() {
  const content = generateICS()
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'webinar-empire-internet.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function GmailIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="12" viewBox="0 0 24 18" fill="none" className={className}>
      <path d="M1.636 18h4.364V8.727L0 5.727V16.364C0 17.267.733 18 1.636 18Z" fill="#4285F4" />
      <path d="M18 18h4.364c.905 0 1.636-.733 1.636-1.636V5.727L18 8.727" fill="#34A853" />
      <path d="M18 1.636V8.727l6-3V3.273c0-2.017-2.303-3.166-3.927-1.964" fill="#FBBC04" />
      <path d="M6 8.727V1.636L12 6l6-4.364V8.727L12 12" fill="#EA4335" />
      <path d="M0 3.273v2.454l6 3V1.636L3.927 1.309C2.303.107 0 1.256 0 3.273" fill="#C5221F" />
    </svg>
  )
}

function OutlookIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M24 7.387v10.478c0 .914-.742 1.656-1.656 1.656H8.22a1.656 1.656 0 0 1-1.656-1.656V7.387l8.718 5.06L24 7.386Z" fill="#0078D4" />
      <path d="M16.29 4.48H24v2.906l-8.718 5.06-8.718-5.06V6.135c0-.914.742-1.656 1.656-1.656Z" fill="#0078D4" />
      <path opacity=".5" d="M24 7.387v.544l-8.718 5.06-8.718-5.06v-.544L16.29 4.48H24v2.906Z" fill="#000" />
      <rect x="0" y="4.5" width="7" height="12.5" rx="1" fill="#0078D4" />
    </svg>
  )
}

const COUNTRY_CODES = [
  { code: '+33', flag: '🇫🇷' },
  { code: '+32', flag: '🇧🇪' },
  { code: '+41', flag: '🇨🇭' },
  { code: '+1',  flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+352', flag: '🇱🇺' },
  { code: '+377', flag: '🇲🇨' },
]

function PhoneBlock({ email }: { email: string }) {
  const [countryCode, setCountryCode] = useState('+33')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) return
    setLoading(true)
    try {
      await fetch('/api/webinar/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, telephone: `${countryCode}${phone.trim()}` }),
      })
    } catch { /* best effort */ }
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 md:p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <Check size={16} className="text-white" strokeWidth={3} />
          </div>
          <p className="text-sm font-bold text-emerald-800">Numéro enregistré, tu recevras les rappels SMS.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-5 md:p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
          <Phone size={14} className="text-white" />
        </div>
        <div>
          <p className="text-base font-bold text-black">Recevoir les rappels par SMS</p>
          <p className="text-xs text-neutral-500">+ le template de funnel offert</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="pl-11">
        <div className="flex gap-2 mb-2">
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="w-[90px] px-2 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm focus:outline-none focus:border-neutral-400 cursor-pointer"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
            ))}
          </select>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ton numéro"
            className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black placeholder:text-neutral-400 text-sm focus:outline-none focus:border-neutral-400 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !phone.trim()}
          className="w-full py-2.5 rounded-xl bg-black text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <>Activer les rappels SMS <ArrowRight size={14} /></>}
        </button>
      </form>
    </div>
  )
}

export default function WebinarMerciClient() {
  const [email, setEmail] = useState('')
  const [hasPhone, setHasPhone] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setEmail(params.get('e') || '')
    setHasPhone(params.get('p') === '1')
  }, [])

  return (
    <main className="min-h-screen bg-neutral-50 text-black">
      {/* ═══ HERO CONFIRMATION + 3 STEPS ═══ */}
      <section className="pt-24 md:pt-28 pb-12 md:pb-16">
        <div className="container max-w-2xl mx-auto text-center px-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-4">
            <Check size={28} className="text-emerald-600" strokeWidth={3} />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            C&apos;est confirmé.
          </h1>
          <p className="text-neutral-600 text-base mb-1.5">
            Ta place est réservée pour le <span className="text-black font-semibold">{WEBINAR_DATE_SHORT} à {WEBINAR_TIME}</span>.
          </p>

          {/* Hosts inline */}
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="flex -space-x-1.5 flex-shrink-0">
              <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white z-10 shadow-sm">
                <Image src="/founders/kevin.jpg" alt="Kevin" width={28} height={28} className="w-full h-full object-cover" />
              </div>
              <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <Image src="/founders/marc.jpg" alt="Marc" width={28} height={28} className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-xs text-neutral-500">Kevin & Marc Dufraisse · {WEBINAR_DURATION} en live</span>
          </div>

          <p className="text-red-600 text-sm font-bold mb-6">
            Fais ces 3 étapes maintenant pour ne rien rater.
          </p>

          {/* Steps */}
          <div className="space-y-3 text-left">

          {/* Step 1: Calendar */}
          <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-5 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-black text-white">1</span>
              </div>
              <p className="text-base font-bold text-black">Bloque la date dans ton calendrier</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a
                href={CALENDAR_LINKS.google}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.07l3.66-2.98Z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
                </svg>
                <span className="text-xs font-semibold text-black">Google</span>
              </a>
              <button
                onClick={downloadICS}
                className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 transition-all cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83Z" fill="#333" />
                  <path d="M15.47 3.55c.74-.9 1.23-2.14 1.1-3.39-1.06.05-2.33.71-3.09 1.6-.68.78-1.27 2.05-1.11 3.26 1.17.09 2.37-.6 3.1-1.47Z" fill="#333" />
                </svg>
                <span className="text-xs font-semibold text-black">Apple</span>
              </button>
              <a
                href={CALENDAR_LINKS.outlook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M24 7.387v10.478c0 .914-.742 1.656-1.656 1.656H8.22a1.656 1.656 0 0 1-1.656-1.656V7.387l8.718 5.06L24 7.387Z" fill="#0078D4" />
                  <path d="M16.29 4.48H24v2.906l-8.718 5.06-8.718-5.06V6.135c0-.914.742-1.656 1.656-1.656Z" fill="#0078D4" />
                  <rect x="0" y="4.5" width="7" height="12.5" rx="1" fill="#0078D4" />
                </svg>
                <span className="text-xs font-semibold text-black">Outlook</span>
              </a>
              <a
                href={CALENDAR_LINKS.yahoo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M13.622 12.002 18.5 2.4h-3.56l-2.903 6.088L9.07 2.4H5.5l4.908 9.61v6.83h3.214v-6.838Z" fill="#6001D2" />
                  <circle cx="11.8" cy="21" r="1.8" fill="#6001D2" />
                </svg>
                <span className="text-xs font-semibold text-black">Yahoo</span>
              </a>
            </div>
          </div>

          {/* Step 2: Email warming */}
          <div className="rounded-2xl p-5 md:p-6 bg-white border border-neutral-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-black text-white">2</span>
              </div>
              <p className="text-base font-bold text-black">Envoie-moi un &quot;OK&quot; pour recevoir tes rappels</p>
            </div>
            <p className="text-neutral-600 text-sm mb-4 leading-relaxed pl-11">
              Je vais t&apos;envoyer le lien du live et 2 rappels. Pour qu&apos;ils arrivent bien (et pas en spam), envoie-moi juste <span className="text-emerald-600 font-bold">&quot;OK&quot;</span> par email.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pl-11">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=kevin@empire-internet.com&su=OK%20Kevin&body=OK"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-neutral-200 text-sm font-semibold text-black hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm"
              >
                <GmailIcon className="flex-shrink-0" />
                Gmail
              </a>
              <a
                href="https://outlook.office.com/mail/deeplink/compose?to=kevin@empire-internet.com&subject=OK%20Kevin&body=OK"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-neutral-200 text-sm font-semibold text-black hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm"
              >
                <OutlookIcon className="flex-shrink-0" />
                Outlook
              </a>
            </div>
            <p className="text-[10px] text-neutral-500 mt-2 pl-11">
              Ou envoie &quot;OK&quot; à <span className="text-neutral-700 font-semibold">kevin@empire-internet.com</span>
            </p>
          </div>

          {/* Step 3: Check email */}
          <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-5 md:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-black text-white">3</span>
              </div>
              <p className="text-base font-bold text-black">Check ta boîte mail</p>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed pl-11">
              Tu vas recevoir un email de confirmation avec le lien pour le jour J. Pense à vérifier tes spams.
            </p>
          </div>

          {email && !hasPhone && <PhoneBlock email={email} />}
          </div>
        </div>
      </section>

      {/* ═══ WHAT TO EXPECT (teaser) ═══ */}
      <section className="py-10 md:py-14 border-t border-neutral-200">
        <div className="container max-w-2xl mx-auto px-4">
          <p className="text-xs text-red-600 tracking-widest uppercase font-bold mb-5">
            Ce qui t&apos;attend le {WEBINAR_DATE_SHORT}
          </p>
          <ul className="space-y-2.5 mb-6">
            {WEBINAR_BULLETS.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <ArrowRight size={14} className="text-red-500 flex-shrink-0 mt-1" />
                <span className="text-sm text-neutral-700 leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-red-200 bg-red-50">
            <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-neutral-700 leading-relaxed">
              <span className="font-bold text-red-600">Pas de replay public.</span> Si tu veux ce contenu, sois là le {WEBINAR_DATE_SHORT} à {WEBINAR_TIME}.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ OPTIONAL SECTIONS ═══ */}
      <section className="pb-16 md:pb-24 border-t border-neutral-200">
        <div className="container max-w-2xl mx-auto px-4 pt-10 md:pt-14">
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-6">Optionnel</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Book a call */}
            <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-5">
              <CalendarPlus size={18} className="text-black mb-3" />
              <p className="font-bold text-black text-sm mb-1.5">
                On installe le système pour toi ?
              </p>
              <p className="text-neutral-500 text-xs leading-relaxed mb-4">
                Appel découverte gratuit avec l&apos;équipe. On regarde si on peut t&apos;aider à créer ta marque personnelle.
              </p>
              <a
                href="https://cal.com/team/empire-internet/audit-empire"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-red-600 text-xs font-bold hover:underline"
              >
                Réserver un appel <ArrowRight size={12} />
              </a>
            </div>

            {/* Share */}
            <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-5">
              <Share2 size={18} className="text-black mb-3" />
              <p className="font-bold text-black text-sm mb-1.5">
                Tu connais quelqu&apos;un que ça intéresserait ?
              </p>
              <p className="text-neutral-500 text-xs leading-relaxed mb-4">
                Partage le lien à un entrepreneur qui galère à se faire connaître malgré un bon produit.
              </p>
              <div className="flex gap-2">
                <a
                  href={`mailto:?subject=${encodeURIComponent(SHARE_TITLE)}&body=${encodeURIComponent(SHARE_TEXT + '\n\n' + SHARE_URL)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-semibold text-black hover:bg-neutral-100 transition-all"
                >
                  <Mail size={12} />
                  Email
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-semibold text-black hover:bg-neutral-100 transition-all"
                >
                  <Linkedin size={12} />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
