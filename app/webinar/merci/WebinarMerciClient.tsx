'use client'

import { Check, CalendarPlus, Mail, Clock, Users, Share2, Linkedin, AlertTriangle } from 'lucide-react'
import Image from 'next/image'

const WEBINAR_DATE = '10 juin 2026'
const WEBINAR_DATE_SHORT = 'mer. 10 juin'
const WEBINAR_TIME = '19h00'
const WEBINAR_DURATION = '90 min'

const TEASER_VIDEO_URL = process.env.NEXT_PUBLIC_WEBINAR_TEASER_VIDEO_URL

const CAL_TITLE = encodeURIComponent('La Méthode Gourou - Webinar Empire Internet')
const CAL_DESC = encodeURIComponent('Webinar gratuit avec Kevin & Marc Dufraisse.\nDécouvre les techniques des personnalités les plus visibles et comment les appliquer à ton business.\n\nLien : https://empire-internet.com/live')
const CAL_START = '20260610T170000Z'
const CAL_END = '20260610T183000Z'

const CALENDAR_LINKS = {
  google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${CAL_TITLE}&dates=${CAL_START}/${CAL_END}&details=${CAL_DESC}`,
  outlook: `https://outlook.live.com/calendar/0/action/compose?subject=${CAL_TITLE}&startdt=2026-06-10T17:00:00Z&enddt=2026-06-10T18:30:00Z&body=${CAL_DESC}`,
  yahoo: `https://calendar.yahoo.com/?v=60&title=${CAL_TITLE}&st=${CAL_START}&et=${CAL_END}&desc=${CAL_DESC}`,
}

const WEBINAR_BULLETS = [
  'Pourquoi certaines personnes deviennent des phénomènes - et pourquoi 99% des entrepreneurs restent invisibles',
  'Le décryptage des techniques exactes d\'Idriss Aberkane, Anthony Bourbon, Oussama Ammar (et Kevin Dufraisse)',
  'Le mécanisme psychologique qui transforme un lecteur en fan (et en client)',
  'L\'erreur fatale que font les entrepreneurs qui essayent de plaire à tout le monde',
  'Le cas Lorraine Vallery-Radot : de zéro à France 2 avec un seul post LinkedIn',
  'Comment appliquer La Méthode Gourou à ton business sans devenir un imposteur',
  'Une démo en direct sur un cas que tu vas reconnaître',
]

const SHARE_URL = 'https://empire-internet.com/webinar'
const SHARE_TITLE = 'La Méthode Gourou - Webinar gratuit (Empire Internet)'
const SHARE_TEXT = 'Le décryptage des techniques que les personnalités les plus visibles utilisent pour dominer leur marché - et comment les appliquer à ton business. Webinar gratuit le 10 juin, animé par Kevin & Marc Dufraisse.'

function generateICS(): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Empire Internet//Webinar//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'DTSTART:20260610T170000Z',
    'DTEND:20260610T183000Z',
    'SUMMARY:La Méthode Gourou - Webinar Empire Internet',
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
  a.download = 'webinar-methode-gourou.ics'
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
      <path d="M6.563 7.5H0v9.375l6.563-1.875V7.5Z" fill="#0078D4" />
      <path d="M6.563 7.5H0V5.625L6.563 4.5V7.5Z" fill="#00BCF2" />
    </svg>
  )
}

export default function WebinarMerciClient() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="pt-24 md:pt-28 pb-12 md:pb-20">
        <div className="container max-w-2xl mx-auto text-center px-4">
          {/* Success badge */}
          <div className="w-16 h-16 rounded-full bg-empire/20 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-empire" />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Place réservée !
          </h1>
          <p className="text-neutral-400 text-lg mb-10">
            Tu es inscrit(e) au webinar <span className="text-white font-semibold">La Méthode Gourou</span>.
          </p>

          {/* Info card */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.1] p-6 md:p-8 mb-6 text-left">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="flex -space-x-3 flex-shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-empire/40 z-10">
                  <Image src="/founders/kevin.jpg" alt="Kevin Dufraisse" width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-empire/40">
                  <Image src="/founders/marc.jpg" alt="Marc Dufraisse" width={64} height={64} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <p className="font-bold text-white text-lg mb-1">Kevin & Marc Dufraisse</p>
                <p className="text-neutral-400 text-sm mb-4">Co-fondateurs Empire Internet</p>

                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-sm">
                    <CalendarPlus size={14} className="text-empire" />
                    {WEBINAR_DATE}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-sm">
                    <Clock size={14} className="text-empire" />
                    {WEBINAR_TIME}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-sm">
                    <Users size={14} className="text-empire" />
                    {WEBINAR_DURATION} en live
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Step 1: Add to Calendar ── */}
          <div className="mb-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 md:p-6 text-left">
            <p className="text-xs text-neutral-500 mb-4 tracking-widest uppercase font-bold">
              <span className="text-empire">Étape 1</span> · Bloque la date
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a
                href={CALENDAR_LINKS.google}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] hover:border-empire/30 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.07l3.66-2.98Z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
                </svg>
                <span className="text-xs font-semibold text-white">Google</span>
              </a>
              <button
                onClick={downloadICS}
                className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] hover:border-empire/30 transition-all cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83Z" fill="#fff" />
                  <path d="M15.47 3.55c.74-.9 1.23-2.14 1.1-3.39-1.06.05-2.33.71-3.09 1.6-.68.78-1.27 2.05-1.11 3.26 1.17.09 2.37-.6 3.1-1.47Z" fill="#fff" />
                </svg>
                <span className="text-xs font-semibold text-white">Apple</span>
              </button>
              <a
                href={CALENDAR_LINKS.outlook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] hover:border-empire/30 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M24 7.387v10.478c0 .914-.742 1.656-1.656 1.656H8.22a1.656 1.656 0 0 1-1.656-1.656V7.387l8.718 5.06L24 7.387Z" fill="#0078D4" />
                  <path d="M16.29 4.48H24v2.906l-8.718 5.06-8.718-5.06V6.135c0-.914.742-1.656 1.656-1.656Z" fill="#0078D4" />
                  <path opacity=".5" d="M24 7.387v.544l-8.718 5.06-8.718-5.06v-.544L16.29 4.48H24v2.906Z" fill="#000" />
                  <rect x="0" y="4.5" width="7" height="12.5" rx="1" fill="#0078D4" />
                </svg>
                <span className="text-xs font-semibold text-white">Outlook</span>
              </a>
              <a
                href={CALENDAR_LINKS.yahoo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] hover:border-empire/30 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M13.622 12.002 18.5 2.4h-3.56l-2.903 6.088L9.07 2.4H5.5l4.908 9.61v6.83h3.214v-6.838Z" fill="#6001D2" />
                  <circle cx="11.8" cy="21" r="1.8" fill="#6001D2" />
                </svg>
                <span className="text-xs font-semibold text-white">Yahoo</span>
              </a>
            </div>
          </div>

          {/* ── Step 2: Email warming (avoid spam) ── */}
          <div className="mb-8 rounded-2xl p-5 md:p-6 bg-gradient-to-br from-empire/10 via-empire/5 to-transparent border border-empire/30 text-left">
            <p className="text-xs text-empire mb-3 tracking-widest uppercase font-bold">
              <span className="text-empire">Étape 2</span> · Évite que mes emails tombent en spam
            </p>

            <div className="flex items-center gap-3 mb-2">
              <Mail className="text-empire flex-shrink-0" size={20} />
              <p className="text-white font-bold text-base sm:text-lg leading-tight">
                Envoie-moi un "OK" pour recevoir tes rappels
              </p>
            </div>
            <p className="text-neutral-300 text-sm mb-4 leading-relaxed">
              Je vais t'envoyer le lien du live et 2 rappels avant le webinar. Pour être sûr(e) qu'ils arrivent bien (et pas en spam), envoie-moi juste <span className="text-empire font-semibold">"OK"</span> par email - ça suffit pour que Gmail et Outlook nous identifient comme une vraie conversation.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=kevin@empire-internet.com&su=OK%20Kevin&body=OK"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm font-semibold text-white hover:bg-white/[0.1] hover:border-empire/30 transition-all"
              >
                <GmailIcon className="flex-shrink-0" />
                Envoyer via Gmail
              </a>
              <a
                href="https://outlook.office.com/mail/deeplink/compose?to=kevin@empire-internet.com&subject=OK%20Kevin&body=OK"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm font-semibold text-white hover:bg-white/[0.1] hover:border-empire/30 transition-all"
              >
                <OutlookIcon className="flex-shrink-0" />
                Envoyer via Outlook
              </a>
            </div>
            <p className="text-[10px] text-neutral-500 mt-2.5 text-center">
              Ou copie : <span className="text-neutral-400">kevin@empire-internet.com</span>
            </p>
          </div>

          {/* ── Step 3: Check mail ── */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 md:p-6 text-left">
            <p className="text-xs text-neutral-500 mb-3 tracking-widest uppercase font-bold">
              <span className="text-empire">Étape 3</span> · Check ta boîte mail
            </p>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-empire/10 flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-empire" />
              </div>
              <div>
                <p className="font-bold text-white mb-1">Email de confirmation envoyé</p>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Tu vas recevoir un email avec le lien pour rejoindre le webinar le jour J.
                  Pense à vérifier tes spams si rien dans les prochaines minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Teaser video + recap ─── */}
      <section className="pt-4 pb-12 md:pb-20">
        <div className="container max-w-3xl mx-auto px-4">
          {TEASER_VIDEO_URL && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black mb-8">
              <iframe
                src={TEASER_VIDEO_URL}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          )}

          {/* What to expect */}
          <div className="mt-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 md:p-8">
            <p className="text-xs text-empire tracking-widest uppercase font-bold mb-5">
              Ce qui t'attend dans le webinar
            </p>
            <ul className="space-y-3">
              {WEBINAR_BULLETS.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-empire/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-empire" strokeWidth={3} />
                  </div>
                  <span className="text-sm md:text-base text-neutral-200 leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-start gap-3 px-4 py-3 rounded-xl border border-red-500/30 bg-red-950/20">
              <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-neutral-200 leading-relaxed">
                <span className="font-bold text-red-400">Rappel :</span> pas de replay public. Si tu veux ce contenu, sois là le {WEBINAR_DATE_SHORT} à {WEBINAR_TIME}.
              </p>
            </div>
          </div>

          {/* Share section */}
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-empire/10 via-empire/5 to-transparent border border-empire/30 p-6 md:p-8 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Share2 size={16} className="text-empire" />
              <p className="text-xs text-empire tracking-widest uppercase font-bold">
                Un dernier truc
              </p>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3 leading-snug">
              Tu connais quelqu'un que ça intéresserait ?
            </h2>
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-5">
              Si tu connais un entrepreneur, consultant ou expert qui galère à se faire connaître <span className="text-white font-semibold">malgré un bon produit</span>, partage-lui le lien. C'est exactement pour ces personnes-là qu'on fait ce webinar.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={`mailto:?subject=${encodeURIComponent(SHARE_TITLE)}&body=${encodeURIComponent(SHARE_TEXT + '\n\n' + SHARE_URL)}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.08] border border-white/10 text-sm font-semibold text-white hover:bg-white/[0.12] hover:border-empire/30 transition-all"
              >
                <Mail size={16} />
                Partager par email
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.08] border border-white/10 text-sm font-semibold text-white hover:bg-white/[0.12] hover:border-empire/30 transition-all"
              >
                <Linkedin size={16} />
                Partager sur LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
