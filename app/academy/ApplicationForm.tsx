'use client'

import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from 'react'
import { CTA_PRIMARY } from '@/components/ui/cta'
import glass from '@/components/pricing/pricing.module.css'
import styles from './application.module.css'

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
    if (step === 3 && String(values.favoriteCreator).length < 20) { reject('Présente ton créateur préféré en 20 caractères minimum.', 'favoriteCreator'); return }
    if (step === 3 && String(values.project).length < 60) { reject('Présente ton projet en 60 caractères minimum.', 'project'); return }
    if (step < 3) { moveTo(step + 1); return }
    busyRef.current = true
    setBusy(true)
    submissionId.current ||= crypto.randomUUID()
    try {
      const response = await fetch('/api/head-of-content/apply', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, submissionId: submissionId.current, applicationVersion: 2 }),
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
          <h2 id="form-title" className="text-2xl font-bold text-white">Candidature reçue</h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-300">Merci {submitted}. L’équipe te contactera sous 48 heures si ton profil est retenu.</p>
          <div className="mt-6 border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white">Découvre les portes ouvertes</h3>
            <p className="my-4 text-sm text-neutral-400">Le replay est accessible gratuitement pendant l’étude de ta candidature.</p>
            <a href="https://event.webinarjam.com/register/r0w4xps2" target="_blank" rel="noopener noreferrer" className={CTA_PRIMARY}>Voir les portes ouvertes</a>
            <p className="mt-3 text-xs text-neutral-400">L’accès au replay ne vaut pas admission.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 id="form-title" className="text-2xl font-bold text-white">{titles[step]}</h2>
            <span className="text-xs tabular-nums text-neutral-400" aria-live="polite">{step + 1} / 4</span>
          </div>
          <div className="mb-5 h-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true"><div className="h-full bg-empire" style={{ width: `${(step + 1) * 25}%` }} /></div>
          <form ref={formRef} id="application-form" className={styles.form} noValidate onSubmit={submit} onChange={changeNetwork}>
            <div className={styles.honeypot} aria-hidden="true"><label htmlFor="company">Ne pas remplir ce champ</label><input id="company" name="company" tabIndex={-1} autoComplete="off" /></div>
            <fieldset data-step="0" hidden={step !== 0} disabled={step !== 0 || busy}>
              <legend className="sr-only">Tes coordonnées</legend>
              <div className="name-grid">
                <div className="field"><label htmlFor="firstName">Prénom</label><input id="firstName" name="firstName" autoComplete="given-name" required maxLength="60" placeholder="Ton prénom" /></div>
                <div className="field"><label htmlFor="lastName">Nom</label><input id="lastName" name="lastName" autoComplete="family-name" required maxLength="80" placeholder="Ton nom" /></div>
              </div>
              <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required maxLength="254" placeholder="toi@exemple.fr" /></div>
              <div className="field"><label htmlFor="phone">Téléphone / WhatsApp</label><input id="phone" name="phone" type="tel" autoComplete="tel" required maxLength="30" placeholder="06 12 34 56 78" aria-describedby="phone-help" /><span className="help" id="phone-help">Hors France, ajoute l’indicatif de ton pays.</span></div>
            </fieldset>
            <fieldset data-step="1" hidden={step !== 1} disabled={step !== 1 || busy}>
              <legend className="sr-only">Ta situation et tes objectifs</legend>
              <div className="field"><label htmlFor="situation">Quelle est ta situation professionnelle ?</label><select id="situation" name="situation" required><option value="">Choisir ma situation</option><option value="cdi">Salarié en CDI</option><option value="cdd">Salarié en CDD / intérim</option><option value="freelance">Freelance / consultant</option><option value="business">Entrepreneur / dirigeant d’agence</option><option value="student">Étudiant / alternant</option><option value="jobseeking">En recherche d’emploi / reconversion</option><option value="other">Autre situation</option></select></div>
              <div className="field"><label htmlFor="monthlyHours">Combien d’heures par mois peux-tu consacrer à ce projet ?</label><select id="monthlyHours" name="monthlyHours" required><option value="">Choisir mon temps disponible</option><option value="under10">Moins de 10 heures / mois</option><option value="10to20">10 à 20 heures / mois</option><option value="20to40">20 à 40 heures / mois</option><option value="40to80">40 à 80 heures / mois</option><option value="over80">Plus de 80 heures / mois</option></select><span className="help">Pour te former, pratiquer et développer ton activité.</span></div>
              <div className="field"><label htmlFor="currentIncome">Quels sont tes revenus personnels nets actuels, par mois ?</label><select id="currentIncome" name="currentIncome" required><option value="">Choisir une tranche</option><option value="none">Aucun revenu actuellement</option><option value="under1000">Moins de 1 000 €</option><option value="1000to2000">1 000 à 1 999 €</option><option value="2000to3000">2 000 à 2 999 €</option><option value="3000to5000">3 000 à 4 999 €</option><option value="over5000">5 000 € ou plus</option><option value="private">Je préfère en parler lors de l’échange</option></select></div>
              <div className="field"><label htmlFor="incomeGoal">Quel chiffre d’affaires mensuel aimerais-tu atteindre avec cette activité d’ici 6 mois ?</label><select id="incomeGoal" name="incomeGoal" required><option value="">Choisir mon objectif</option><option value="under1000">Un complément de moins de 1 000 €</option><option value="1000to3000">1 000 à 3 000 €</option><option value="3000to5000">3 000 à 5 000 €</option><option value="over5000">Plus de 5 000 €</option><option value="exploring">Je suis encore en train de le définir</option></select></div>
            </fieldset>
            <fieldset data-step="2" hidden={step !== 2} disabled={step !== 2 || busy}>
              <legend className="sr-only">Ton expérience du contenu</legend>
              <div className="field"><label htmlFor="experience">As-tu déjà créé du contenu ?</label><select id="experience" name="experience" required><option value="">Choisir ma réponse</option><option value="starting">Pas encore, je suis prêt à me lancer</option><option value="occasionally">Oui, de temps en temps pour moi</option><option value="regularly">Oui, régulièrement pour moi</option><option value="clients">Oui, pour des clients</option></select></div>
              <div className="field" role="group" aria-labelledby="networks-label" aria-describedby="networks-help"><span className="field-label" id="networks-label">Sur quels réseaux as-tu déjà publié du contenu ?</span><div className="choice-grid"><label><input type="checkbox" name="networks" value="instagram" />Instagram</label><label><input type="checkbox" name="networks" value="tiktok" />TikTok</label><label><input type="checkbox" name="networks" value="linkedin" />LinkedIn</label><label><input type="checkbox" name="networks" value="youtube" />YouTube</label><label><input type="checkbox" name="networks" value="facebook" />Facebook</label><label><input type="checkbox" name="networks" value="x" />X / Twitter</label><label><input type="checkbox" name="networks" value="other" />Un autre réseau</label><label><input type="checkbox" name="networks" value="none" />Aucun pour l’instant</label></div><span className="help" id="networks-help">Plusieurs réponses possibles, même si tu as peu d’abonnés.</span></div>
              <div className="field"><label htmlFor="strength">Comment es-tu le plus à l’aise pour t’exprimer ?</label><select id="strength" name="strength" required><option value="">Choisir mon point fort</option><option value="writing">À l’écrit : posts, textes, scripts</option><option value="speaking">À l’oral : échanges, interviews, audio</option><option value="video">En vidéo : parler face caméra</option><option value="versatile">À l’aise dans plusieurs formats</option><option value="learning">Je veux encore découvrir mes points forts</option></select></div>
              <div className="field"><label htmlFor="profileUrl">Ton profil ou un exemple de contenu <span className="optional">facultatif</span></label><input id="profileUrl" name="profileUrl" type="text" inputMode="url" maxLength="400" placeholder="linkedin.com/in/tonprofil" aria-describedby="profile-help" /><span className="help" id="profile-help">LinkedIn, Instagram, TikTok, portfolio… Si tu as déjà publié, montre-nous ton travail.</span></div>
            </fieldset>
            <fieldset data-step="3" hidden={step !== 3} disabled={step !== 3 || busy}>
              <legend className="sr-only">Ta motivation</legend>
              <div className="field"><label htmlFor="favoriteCreator">Quel créateur adores-tu suivre, et pourquoi ?</label><textarea id="favoriteCreator" name="favoriteCreator" rows="3" required minLength="20" maxLength="600" placeholder="Son nom ou son compte, et ce que tu trouves fort dans sa façon de créer du contenu." aria-describedby="creator-help"></textarea><span className="help" id="creator-help">Ton regard nous intéresse, quel que soit son domaine. 20 caractères minimum.</span></div>
              <div className="field"><label htmlFor="project">Pourquoi devrait-on te choisir parmi les 10 profils du mois ?</label><textarea id="project" name="project" rows="4" required minLength="60" maxLength="1200" placeholder="Quel projet veux-tu construire ? Pour quels entrepreneurs ? Quel temps as-tu réservé pour pratiquer ? Donne-nous des raisons concrètes de te retenir." aria-describedby="project-help"></textarea><span className="help" id="project-help">Une réponse personnelle et concrète. 60 à 1 200 caractères.</span></div>
              <div className="field"><label htmlFor="startWhen">Si tu es sélectionné, quand peux-tu commencer ?</label><select id="startWhen" name="startWhen" required><option value="">Choisir ma disponibilité</option><option value="now">Dès maintenant</option><option value="thismonth">Dans le mois</option><option value="later">Dans 1 à 3 mois</option></select></div>
              <label className="consent"><input name="consent" id="consent" type="checkbox" required /><span>J’accepte d’être recontacté par l’équipe Empire au sujet de ma candidature. <a href="/privacy" target="_blank" rel="noopener">Confidentialité</a></span></label>
            </fieldset>
            {error && <p role="alert" className="my-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
            <div className="mt-5 flex items-center gap-4">
              {step > 0 && <button type="button" disabled={busy} onClick={() => moveTo(step - 1)} className="min-h-11 text-sm text-neutral-300 disabled:opacity-50">Retour</button>}
              <button type="submit" disabled={busy} className={CTA_PRIMARY}>{busy ? 'Envoi en cours…' : step === 3 ? 'Envoyer ma candidature' : 'Continuer'}</button>
            </div>
            <p className="mt-4 text-center text-xs leading-relaxed text-neutral-400">Sur sélection. L’équipe te contacte sous 48 h si tu es retenu.</p>
          </form>
        </>
      )}
    </section>
  )
}
