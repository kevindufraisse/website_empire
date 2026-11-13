'use client'

import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from 'react'
import { CTA_PRIMARY } from '@/components/ui/cta'
import glass from '@/components/pricing/pricing.module.css'

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
const titles = ['Tes coordonnées', 'Ta situation', 'Ton expérience', 'Ton projet']

export default function ApplicationForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const confirmationRef = useRef<HTMLDivElement>(null)
  const busyRef = useRef(false)
  const submissionId = useRef<string | null>(null)
  const nextFocus = useRef<string | null>(null)
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState<string | null>(null)

  useEffect(() => {
    if (nextFocus.current === null) return
    const field = nextFocus.current
    nextFocus.current = null
    const target = field ? formRef.current?.elements.namedItem(field) : formRef.current?.querySelector(`[data-step="${step}"] input, [data-step="${step}"] select, [data-step="${step}"] textarea`)
    if (target instanceof HTMLElement) target.focus({ preventScroll: true })
    sectionRef.current?.scrollIntoView({ block: 'start' })
  }, [step])

  useEffect(() => {
    if (submitted === null) return
    confirmationRef.current?.focus({ preventScroll: true })
    sectionRef.current?.scrollIntoView({ block: 'start' })
  }, [submitted])

  function moveTo(index: number) {
    setError('')
    nextFocus.current = ''
    setStep(index)
  }

  function changeNetwork(event: ChangeEvent<HTMLFormElement>) {
    const input = event.target
    if (!(input instanceof HTMLInputElement) || input.name !== 'networks' || !input.checked) return
    formRef.current?.querySelectorAll<HTMLInputElement>('input[name="networks"]').forEach(other => {
      if (other !== input && (input.value === 'none' || other.value === 'none')) other.checked = false
    })
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = formRef.current
    if (!form || busyRef.current) return
    setError('')
    const controls = [...form.querySelectorAll<Control>('input, select, textarea')]
    const current = form.querySelector(`[data-step="${step}"]`)
    const invalid = controls.find(control => current?.contains(control) && !control.checkValidity())
    if (invalid) { invalid.reportValidity(); return }
    const values: Record<string, string | boolean | string[]> = Object.fromEntries(controls.filter(control => control.name && control.name !== 'networks').map(control => [control.name, control instanceof HTMLInputElement && control.type === 'checkbox' ? control.checked : control.value.trim()]))
    values.networks = [...form.querySelectorAll<HTMLInputElement>('input[name="networks"]:checked')].map(input => input.value)
    const reject = (message: string, field: string) => {
      setError(message)
      const target = form.elements.namedItem(field)
      if (target instanceof HTMLElement) target.focus()
      else if (target instanceof RadioNodeList && target[0] instanceof HTMLElement) target[0].focus()
    }
    if (step === 0 && !/^\d{8,15}$/.test(String(values.phone).replace(/\D/g, ''))) { reject('Vérifie ton téléphone, avec l’indicatif pour un numéro hors France.', 'phone'); return }
    if (step === 2 && values.networks.length === 0) { reject('Choisis au moins un réseau, ou « Aucun pour l’instant ».', 'networks'); return }
    if (step === 3 && String(values.favoriteCreator).length < 1) { reject('Indique le créateur que tu admires.', 'favoriteCreator'); return }
    if (step === 3 && String(values.project).length < 30) { reject('Présente ton projet en 30 caractères minimum.', 'project'); return }
    if (step < 3) { moveTo(step + 1); return }
    busyRef.current = true
    setBusy(true)
    submissionId.current ||= crypto.randomUUID()
    try {
      const response = await fetch('/api/head-of-content/apply', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, submissionId: submissionId.current, applicationVersion: 3 }),
        signal: AbortSignal.timeout(25000),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || result.success !== true) {
        if (typeof result.field === 'string') {
          const target = controls.find(control => control.name === result.field)
          const index = Number(target?.closest('fieldset')?.getAttribute('data-step'))
          if (target && Number.isInteger(index) && index >= 0 && index <= 3) {
            if (index !== step) { nextFocus.current = target.name; setStep(index) }
            else target.focus()
          }
        }
        throw new Error(result.error || 'L’envoi n’a pas abouti. Réessaie dans un instant.')
      }
      setSubmitted(String(values.firstName))
    } catch (caught) {
      const err = caught as Error
      setError(err.name === 'TimeoutError' || err.name === 'AbortError' ? 'La confirmation prend plus de temps que prévu. Réessaie dans un instant.' : err instanceof TypeError ? 'Vérifie ta connexion et réessaie. Tes réponses sont conservées.' : err.message)
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }

  return (
    <section ref={sectionRef} id="candidature" aria-labelledby="form-title" className={`${glass.panel} scroll-mt-24 p-5 sm:p-6`}>
      {submitted !== null ? (
        <div ref={confirmationRef} tabIndex={-1} className="outline-none">
          <h2 id="form-title" className="text-2xl font-bold text-white">Candidature envoyée.</h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-300">Notre équipe étudie ton profil et te répond sous 48h sur WhatsApp.</p>
          <div className="mt-6 border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white">Inscris-toi aux Portes Ouvertes</h3>
            <p className="my-4 text-sm text-neutral-400">En attendant la réponse de notre équipe.</p>
            <a href="https://event.webinarjam.com/register/r0w4xps2" target="_blank" rel="noopener noreferrer" className={CTA_PRIMARY}>S’inscrire aux Portes Ouvertes</a>

          </div>
        </div>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 id="form-title" className="text-2xl font-bold text-white">{titles[step]}</h2>
            <span className="text-xs tabular-nums text-neutral-400" aria-live="polite">{step + 1} / 4</span>
          </div>
          <div className="mb-5 h-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true"><div className="h-full bg-empire" style={{ width: `${(step + 1) * 25}%` }} /></div>
          <form ref={formRef} id="application-form" className="[&_fieldset]:m-0 [&_fieldset]:min-w-0 [&_fieldset]:border-0 [&_fieldset]:p-0 [&_.field]:mb-4 [&_.field]:flex [&_.field]:flex-col [&_.field]:gap-2 [&_label]:text-sm [&_.field-label]:text-sm [&_.field_input]:min-h-11 [&_.field_input]:w-full [&_.field_input]:rounded-lg [&_.field_input]:border [&_.field_input]:border-white/20 [&_.field_input]:bg-black [&_.field_input]:p-3 [&_select]:min-h-11 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-white/20 [&_select]:bg-black [&_select]:p-3 [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-white/20 [&_textarea]:bg-black [&_textarea]:p-3 [&_input:focus-visible]:outline-empire [&_select:focus-visible]:outline-empire [&_textarea:focus-visible]:outline-empire [&_.name-grid]:grid [&_.name-grid]:grid-cols-2 [&_.name-grid]:gap-3 [&_.choice-grid]:grid [&_.choice-grid]:grid-cols-2 [&_.choice-grid]:gap-2 [&_.choice-grid_label]:flex [&_.choice-grid_label]:min-h-11 [&_.choice-grid_label]:items-center [&_.choice-grid_label]:gap-2 [&_.choice-grid_label]:rounded-lg [&_.choice-grid_label]:border [&_.choice-grid_label]:border-white/20 [&_.choice-grid_label]:p-2 [&_.choice-grid_input]:h-4 [&_.choice-grid_input]:min-h-0 [&_.choice-grid_input]:w-4 [&_.choice-grid_input]:accent-empire [&_.help]:text-xs [&_.help]:text-neutral-400" noValidate onSubmit={submit} onChange={changeNetwork}>
            <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="company">Ne pas remplir ce champ</label><input id="company" name="company" tabIndex={-1} autoComplete="off" /></div>
            <fieldset data-step="0" hidden={step !== 0} disabled={step !== 0 || busy}>
              <legend className="sr-only">Tes coordonnées</legend>
              <div className="name-grid">
                <div className="field"><label htmlFor="firstName">Prénom</label><input id="firstName" name="firstName" autoComplete="given-name" required maxLength={60} placeholder="Ton prénom" /></div>
                <div className="field"><label htmlFor="lastName">Nom</label><input id="lastName" name="lastName" autoComplete="family-name" required maxLength={80} placeholder="Ton nom" /></div>
              </div>
              <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="toi@exemple.fr" /></div>
              <div className="field"><label htmlFor="phone">Numéro WhatsApp</label><input id="phone" name="phone" type="tel" autoComplete="tel" required maxLength={30} placeholder="06 12 34 56 78" aria-describedby="phone-help" /><span className="help" id="phone-help">Hors France, ajoute l’indicatif de ton pays.</span></div>
            </fieldset>
            <fieldset data-step="1" hidden={step !== 1} disabled={step !== 1 || busy}>
              <legend className="sr-only">Ta situation et tes objectifs</legend>
              <div className="field"><label htmlFor="situation">Quelle est ta situation actuelle ?</label><select id="situation" name="situation" required><option value="">Choisir ma situation</option><option value="cdi">CDI</option><option value="freelance">Freelance</option><option value="business">Entrepreneur</option><option value="student">Étudiant</option><option value="jobseeking">Sans emploi</option></select></div>
              <div className="field"><label htmlFor="availability">Combien d’heures par semaine peux-tu consacrer à cette activité ?</label><select id="availability" name="availability" required><option value="">Choisir mon temps disponible</option><option value="under3">Moins de 3 h / semaine</option><option value="3to5">3 à 5 h / semaine</option><option value="5to10">5 à 10 h / semaine</option><option value="over10">Plus de 10 h / semaine</option></select><span className="help">Pour te former, pratiquer et développer ton activité.</span></div>
              <div className="field"><label htmlFor="currentIncome">Quel est ton revenu mensuel actuel ?</label><select id="currentIncome" name="currentIncome" required><option value="">Choisir une tranche</option><option value="none">Aucun revenu actuellement</option><option value="under1000">Moins de 1 000 €</option><option value="1000to2000">1 000 à 1 999 €</option><option value="2000to3000">2 000 à 2 999 €</option><option value="3000to5000">3 000 à 4 999 €</option><option value="over5000">5 000 € ou plus</option><option value="private">Je préfère en parler lors de l’échange</option></select></div>
            </fieldset>
            <fieldset data-step="2" hidden={step !== 2} disabled={step !== 2 || busy}>
              <legend className="sr-only">Ton expérience du contenu</legend>
              <div className="field" role="group" aria-labelledby="networks-label" aria-describedby="networks-help"><span className="field-label" id="networks-label">Sur quels réseaux sociaux as-tu déjà publié ou travaillé ?</span><div className="choice-grid"><label><input type="checkbox" name="networks" value="instagram" />Instagram</label><label><input type="checkbox" name="networks" value="tiktok" />TikTok</label><label><input type="checkbox" name="networks" value="linkedin" />LinkedIn</label><label><input type="checkbox" name="networks" value="youtube" />YouTube</label><label><input type="checkbox" name="networks" value="facebook" />Facebook</label><label><input type="checkbox" name="networks" value="x" />X / Twitter</label><label><input type="checkbox" name="networks" value="other" />Un autre réseau</label><label><input type="checkbox" name="networks" value="none" />Aucun pour l’instant</label></div><span className="help" id="networks-help">Plusieurs réponses possibles, même si tu as peu d’abonnés.</span></div>
              <div className="field"><label htmlFor="strength">Es-tu plus à l’aise à l’écrit, à l’oral ou en vidéo ?</label><select id="strength" name="strength" required><option value="">Choisir mon point fort</option><option value="writing">À l’écrit : posts, textes, scripts</option><option value="speaking">À l’oral : échanges, interviews, audio</option><option value="video">En vidéo : parler face caméra</option></select></div>
            </fieldset>
            <fieldset data-step="3" hidden={step !== 3} disabled={step !== 3 || busy}>
              <legend className="sr-only">Ta motivation</legend>
              <div className="field"><label htmlFor="favoriteCreator">Quel est le créateur de contenu que tu admires le plus aujourd’hui ?</label><textarea id="favoriteCreator" name="favoriteCreator" rows={3} required minLength={1} maxLength={600} placeholder="Son nom ou son compte." aria-describedby="creator-help"></textarea><span className="help" id="creator-help"></span></div>
              <div className="field"><label htmlFor="project">Pourquoi doit-on te sélectionner toi parmi les 10 places de ce mois-ci ?</label><textarea id="project" name="project" rows={4} required minLength={30} maxLength={1000} placeholder="Quel projet veux-tu construire ? Pour quels entrepreneurs ? Quel temps as-tu réservé pour pratiquer ? Donne-nous des raisons concrètes de te retenir." aria-describedby="project-help"></textarea><span className="help" id="project-help">Une réponse personnelle et concrète. 30 à 1 000 caractères.</span></div>
            </fieldset>
            {error && <p role="alert" className="my-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
            <div className="mt-5 flex items-center gap-4">
              {step > 0 && <button type="button" disabled={busy} onClick={() => moveTo(step - 1)} className="min-h-11 text-sm text-neutral-300 disabled:opacity-50">Retour</button>}
              <button type="submit" disabled={busy} className={CTA_PRIMARY}>{busy ? 'Envoi en cours…' : step === 3 ? 'Envoyer ma candidature' : 'Continuer'}</button>
            </div>
            <p className="mt-4 text-center text-xs leading-relaxed text-neutral-400">En envoyant ta candidature, tu acceptes d’être recontacté par Empire sur WhatsApp sous 48h.</p>
          </form>
        </>
      )}
    </section>
  )
}
