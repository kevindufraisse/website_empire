'use client'

import { useState } from 'react'
import { ArrowRight, FileText, Loader2 } from 'lucide-react'
import { trackAmplitude } from '@/lib/amplitude'

/**
 * « Recevoir la présentation (PDF) », une seule fois sur /academy, dans la
 * section FAQ (jamais sous les boutons d'inscription : il concurrencerait
 * l'inscription). Au clic : prénom + email → POST /api/academy-presentation
 * (tag Systeme.io PRESENTATION_CO_DEMANDEE) → le PDF s'ouvre. Le pot de miel `company` est le même que les autres portes
 * email du site : un robot le remplit, rien ne part chez Systeme.io.
 */
// Une seule source, tenue à jour par Kevin sur Drive : jamais de copie dans /public.
export const PRESENTATION_PDF_URL = 'https://drive.google.com/file/d/1tgjzwaPui-V1bA8xeRkfAEsN5bZ9_a5q/view'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function AcademyPresentationCta({ fr, source }: { fr: boolean; source: string }) {
  const [open, setOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    setError('')
    const clean = email.trim().toLowerCase()
    if (!EMAIL_RE.test(clean)) {
      setError(fr ? 'Entrez un email valide.' : 'Enter a valid email.')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/academy-presentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: firstName.trim(), email: clean, company }),
      })
      if (!res.ok) throw new Error(String(res.status))
      trackAmplitude('presentation_pdf_requested', { source })
      // Redirection vers le PDF : le tag part en tâche de fond côté serveur.
      window.location.assign(PRESENTATION_PDF_URL)
    } catch {
      setBusy(false)
      setError(fr ? 'L’envoi a échoué. Réessayez.' : 'Something failed. Try again.')
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true)
          trackAmplitude('presentation_pdf_cta_clicked', { source })
        }}
        className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.14] bg-white/[0.03] px-6 py-3 text-[13px] font-semibold text-white/85 transition hover:border-white/30 hover:text-white"
      >
        <FileText className="h-4 w-4 shrink-0 text-academy" />
        {fr ? 'Recevoir la présentation (PDF)' : 'Get the presentation (PDF)'}
      </button>
    )
  }

  return (
    <form onSubmit={submit} className="mt-2.5 w-full rounded-2xl border border-white/[0.14] bg-white/[0.03] p-4 text-left">
      <p className="text-[13px] font-semibold text-white">
        {fr ? 'La présentation Content Operator (5 min)' : 'The Content Operator deck (5 min)'}
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={fr ? 'Prénom' : 'First name'}
          autoComplete="given-name"
          className="h-11 w-full rounded-xl border border-white/[0.12] bg-black/50 px-3 text-sm text-white placeholder:text-white/35 focus:border-academy focus:outline-none sm:w-32"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={fr ? 'votre@email.com' : 'you@email.com'}
          autoComplete="email"
          className="h-11 w-full flex-1 rounded-xl border border-white/[0.12] bg-black/50 px-3 text-sm text-white placeholder:text-white/35 focus:border-academy focus:outline-none"
        />
        {/* Pot de miel : invisible pour un humain. */}
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-academy px-4 text-[13px] font-bold text-black transition hover:brightness-110 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {fr ? 'Lire' : 'Read'}
        </button>
      </div>
      {error && <p className="mt-2 text-[12px] text-red-400">{error}</p>}
      <p className="mt-2 text-[11px] text-white/40">
        {fr ? 'Le PDF s’ouvre tout de suite. Zéro spam.' : 'The PDF opens right away. No spam.'}
      </p>
    </form>
  )
}
