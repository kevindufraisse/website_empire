'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, Loader2, ChevronLeft } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1
  first_name: string
  last_name: string
  email: string
  phone: string
  // Step 2
  hours_per_week: string
  budget: string
  // Step 3
  has_created_content: string
  content_link: string
  haunting_project: string
  // Step 4 — DISC behavioral
  disc_role: string       // maps to D/I/S/C
  disc_obstacle: string   // maps to D/I/S/C
  friends_say: string
  // Step 5
  social_link: string
  motivation: string
}

const initial: FormData = {
  first_name: '', last_name: '', email: '', phone: '',
  hours_per_week: '', budget: '',
  has_created_content: '', content_link: '', haunting_project: '',
  disc_role: '', disc_obstacle: '', friends_say: '',
  social_link: '', motivation: '',
}

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  { num: 1, label: 'Contact' },
  { num: 2, label: 'Disponibilités' },
  { num: 3, label: 'Profil' },
  { num: 4, label: 'Personnalité' },
  { num: 5, label: 'Finalisation' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function Input({
  label, name, type = 'text', value, onChange, placeholder, required,
}: {
  label: string
  name: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-300">
        {label} {required && <span className="text-empire">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-empire/60 focus:bg-white/[0.07] transition-all"
      />
    </div>
  )
}

function Textarea({
  label, name, value, onChange, placeholder, required,
}: {
  label: string
  name: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-300">
        {label} {required && <span className="text-empire">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={3}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-empire/60 focus:bg-white/[0.07] transition-all resize-none"
      />
    </div>
  )
}

function OptionCard({
  value, selected, onClick, label, sub,
}: {
  value: string
  selected: boolean
  onClick: () => void
  label: string
  sub?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        selected
          ? 'bg-empire/15 border-empire/60 text-white'
          : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:border-white/25 hover:text-neutral-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
          selected ? 'border-empire bg-empire' : 'border-white/20'
        }`}>
          {selected && <div className="w-2 h-2 rounded-full bg-black" />}
        </div>
        <div>
          <span className="text-sm font-semibold">{label}</span>
          {sub && <p className="text-xs text-neutral-500 mt-0.5">{sub}</p>}
        </div>
      </div>
    </button>
  )
}

// ─── DISC Result Screen ────────────────────────────────────────────────────────

type DiscType = 'dominant' | 'influent' | 'stable' | 'conforme'

const discConfig: Record<DiscType, {
  color: string
  dot: string
  badge: string
  badgeStyle: string
  letter: string
  title: string
  sub: string
  traits: string[]
  forBootcamp: string
}> = {
  dominant: {
    color: '#ef4444',
    dot: 'bg-red-500',
    badge: 'Profil D — Dominant',
    badgeStyle: 'bg-red-500/15 text-red-400 border-red-500/40',
    letter: 'D',
    title: 'Tu avances. Sans attendre.',
    sub: 'Tu décides vite, tu assumes, tu fonces. C\'est exactement le profil qu\'on cherche.',
    traits: ['Orienté résultats', 'Décide vite', 'Compétitif', 'Aime les défis'],
    forBootcamp: 'Excellent fit — tu as le moteur pour créer chaque jour et ne pas lâcher.',
  },
  influent: {
    color: '#eab308',
    dot: 'bg-yellow-500',
    badge: 'Profil I — Influent',
    badgeStyle: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/40',
    letter: 'I',
    title: 'Tu crées, tu connectes, tu convaincs.',
    sub: 'Tu sais naturellement capter l\'attention. Le contenu, c\'est ton terrain.',
    traits: ['Enthousiaste', 'Persuasif', 'Créatif', 'Social, fédérateur'],
    forBootcamp: 'Profil idéal pour la viralité — tu as l\'instinct du créateur de contenu.',
  },
  stable: {
    color: '#22c55e',
    dot: 'bg-green-500',
    badge: 'Profil S — Stable',
    badgeStyle: 'bg-green-500/15 text-green-400 border-green-500/40',
    letter: 'S',
    title: 'Tu construis dans la durée.',
    sub: 'Tu es fiable, méthodique, patient. La régularité — ton super-pouvoir.',
    traits: ['Régulier', 'Fiable', 'Patient', 'Travail en profondeur'],
    forBootcamp: 'Bon fit — la régularité quotidienne du bootcamp est faite pour toi.',
  },
  conforme: {
    color: '#3b82f6',
    dot: 'bg-blue-500',
    badge: 'Profil C — Conforme',
    badgeStyle: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
    letter: 'C',
    title: 'Tu analyses avant d\'agir.',
    sub: 'Précis, structuré, logique. Tu veux comprendre avant de faire.',
    traits: ['Analytique', 'Précis', 'Qualité', 'Orienté données'],
    forBootcamp: 'Profil intéressant — tu apporteras de la rigueur, même si la création rapide sera ton défi.',
  },
}

function ResultScreen({ disc }: { disc: DiscType | null }) {
  const d = disc ? discConfig[disc] : discConfig.influent

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center py-4"
    >
      {/* DISC letter badge */}
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl font-black text-white"
        style={{ backgroundColor: `${d.color}25`, border: `2px solid ${d.color}60` }}
      >
        <span style={{ color: d.color }}>{d.letter}</span>
      </div>

      <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full border mb-4 tracking-wide ${d.badgeStyle}`}>
        {d.badge}
      </span>

      <h2 className="text-2xl font-bold text-white mb-2">{d.title}</h2>
      <p className="text-neutral-400 text-sm leading-relaxed max-w-xs mx-auto mb-6">{d.sub}</p>

      {/* Traits */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {d.traits.map(t => (
          <span key={t} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
            {t}
          </span>
        ))}
      </div>

      {/* For bootcamp */}
      <div className="p-4 rounded-2xl bg-empire/5 border border-empire/20 mb-6 max-w-sm mx-auto">
        <p className="text-xs text-empire font-semibold mb-1">Pour le bootcamp :</p>
        <p className="text-xs text-neutral-400 leading-relaxed">{d.forBootcamp}</p>
      </div>

      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-xs mx-auto">
        <p className="text-sm text-white font-semibold mb-1">Candidature reçue ✓</p>
        <p className="text-xs text-neutral-500">Kevin & Marc analysent ton profil. Réponse sous 24h.</p>
      </div>
    </motion.div>
  )
}

// ─── Main Form ─────────────────────────────────────────────────────────────────

export default function AcademyApplicationForm() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(initial)
  const [appId, setAppId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [resultDisc, setResultDisc] = useState<DiscType | null>(null)

  const set = (field: keyof FormData) => (v: string) =>
    setForm(prev => ({ ...prev, [field]: v }))

  // ── Validation per step ──────────────────────────────────────────────────

  function isStepValid() {
    switch (step) {
      case 1:
        return form.first_name.trim() && form.last_name.trim() && form.email.includes('@') && form.phone.trim().length >= 8
      case 2:
        return !!form.hours_per_week && !!form.budget
      case 3:
        return !!form.has_created_content
      case 4:
        return !!form.disc_role && !!form.disc_obstacle
      case 5:
        return form.motivation.trim().length > 10
      default:
        return true
    }
  }

  // ── Submit step ──────────────────────────────────────────────────────────

  async function handleNext() {
    if (!isStepValid()) return
    setLoading(true)
    setError(null)

    try {
      if (step === 1) {
        // Create record in DB — capture email immediately
        const res = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            phone: form.phone,
          }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error)
        setAppId(json.id)
      } else {
        // Update existing record
        const payload: Record<string, unknown> = { step_completed: step }

        if (step === 2) {
          payload.hours_per_week = form.hours_per_week
          payload.budget = form.budget
        } else if (step === 3) {
          payload.has_created_content = form.has_created_content
          payload.content_link = form.content_link
          payload.haunting_project = form.haunting_project
        } else if (step === 4) {
          payload.disc_role = form.disc_role
          payload.disc_obstacle = form.disc_obstacle
          payload.friends_say = form.friends_say
        } else if (step === 5) {
          payload.social_link = form.social_link
          payload.motivation = form.motivation
          // Pass all scoring fields for final calculation
          payload.hours_per_week = form.hours_per_week
          payload.budget = form.budget
          payload.has_created_content = form.has_created_content
          payload.disc_role = form.disc_role
          payload.disc_obstacle = form.disc_obstacle
          payload.step_completed = 5
        }

        const res = await fetch(`/api/applications/${appId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error)

        if (step === 5) {
          const { calculateScore } = await import('@/lib/supabase')
          const { disc } = calculateScore(form)
          if (disc !== 'pending') setResultDisc(disc)
          setDone(true)
          setLoading(false)
          return
        }
      }

      setStep(s => s + 1)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  // ── UI ────────────────────────────────────────────────────────────────────

  if (done) return <ResultScreen disc={resultDisc} />

  const progress = ((step - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
            Étape {step} / {STEPS.length}
          </p>
          <p className="text-xs text-neutral-600">{STEPS[step - 1].label}</p>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-empire rounded-full"
            animate={{ width: `${Math.max(progress, 5)}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {STEPS.map(s => (
            <div
              key={s.num}
              className={`w-2 h-2 rounded-full transition-all ${
                s.num < step ? 'bg-empire' : s.num === step ? 'bg-empire/60' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* ── Step 1: Contact ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">On commence par faire connaissance.</h2>
                <p className="text-sm text-neutral-500">On ne revend pas tes données. On t'envoie juste une réponse sous 24h.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Prénom" name="first_name" value={form.first_name} onChange={set('first_name')} placeholder="Kevin" required />
                <Input label="Nom" name="last_name" value={form.last_name} onChange={set('last_name')} placeholder="Dupont" required />
              </div>
              <Input label="Email" name="email" type="email" value={form.email} onChange={set('email')} placeholder="kevin@exemple.com" required />
              <Input label="Téléphone" name="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+33 6 12 34 56 78" required />
            </div>
          )}

          {/* ── Step 2: Disponibilités ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="mb-2">
                <h2 className="text-xl font-bold text-white mb-1">Parlons disponibilités.</h2>
                <p className="text-sm text-neutral-500">Le bootcamp demande de créer chaque jour. On veut savoir si tu as le temps.</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-300 mb-3">Combien d'heures par semaine tu peux y consacrer ? <span className="text-empire">*</span></p>
                <div className="space-y-2">
                  {[
                    { value: '<2h', label: 'Moins de 2h', sub: 'Difficile — le bootcamp demande de la régularité' },
                    { value: '2-5h', label: '2 à 5h', sub: 'Faisable avec de la discipline' },
                    { value: '5-10h', label: '5 à 10h', sub: 'Idéal pour progresser vite' },
                    { value: '10h+', label: '10h et plus', sub: 'Mode intensif — résultats rapides' },
                  ].map(opt => (
                    <OptionCard
                      key={opt.value}
                      value={opt.value}
                      label={opt.label}
                      sub={opt.sub}
                      selected={form.hours_per_week === opt.value}
                      onClick={() => set('hours_per_week')(opt.value)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-300 mb-3">Quel est ton budget pour te former ? <span className="text-empire">*</span></p>
                <div className="space-y-2">
                  {[
                    { value: '0-400', label: 'Moins de 400€', sub: '' },
                    { value: '400-1000', label: '400€ – 1 000€', sub: '' },
                    { value: '1000-2000', label: '1 000€ – 2 000€', sub: '' },
                    { value: '2000+', label: 'Plus de 2 000€', sub: 'Tu vises un résultat sérieux' },
                  ].map(opt => (
                    <OptionCard
                      key={opt.value}
                      value={opt.value}
                      label={opt.label}
                      sub={opt.sub}
                      selected={form.budget === opt.value}
                      onClick={() => set('budget')(opt.value)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Profil créatif ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="mb-2">
                <h2 className="text-xl font-bold text-white mb-1">Ton rapport au contenu.</h2>
                <p className="text-sm text-neutral-500">Pas besoin d'expérience — on veut juste savoir où tu en es.</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-300 mb-3">T'as déjà créé du contenu sur internet ? <span className="text-empire">*</span></p>
                <div className="space-y-2">
                  {[
                    { value: 'non', label: 'Non, jamais', sub: 'C\'est exactement le profil qu\'on prend' },
                    { value: 'oui_sans_preuve', label: 'Oui, un peu', sub: 'Quelques posts ou vidéos, sans vraie stratégie' },
                    { value: 'oui_preuve', label: 'Oui, régulièrement', sub: 'J\'ai des résultats à montrer' },
                  ].map(opt => (
                    <OptionCard
                      key={opt.value}
                      value={opt.value}
                      label={opt.label}
                      sub={opt.sub}
                      selected={form.has_created_content === opt.value}
                      onClick={() => set('has_created_content')(opt.value)}
                    />
                  ))}
                </div>
              </div>
              {form.has_created_content !== 'non' && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <Input
                    label="Un lien vers un contenu (optionnel)"
                    name="content_link"
                    value={form.content_link}
                    onChange={set('content_link')}
                    placeholder="https://..."
                  />
                </motion.div>
              )}
              <Textarea
                label="C'est quoi le projet que t'as jamais fini mais qui te hante encore ?"
                name="haunting_project"
                value={form.haunting_project}
                onChange={set('haunting_project')}
                placeholder="Un projet, une idée, un truc que t'aurais voulu lancer..."
              />
            </div>
          )}

          {/* ── Step 4: Profil DISC ── */}
          {step === 4 && (
            <div className="space-y-7">
              <div className="mb-2">
                <h2 className="text-xl font-bold text-white mb-1">Comment tu fonctionnes.</h2>
                <p className="text-sm text-neutral-500">Deux questions. Pas de bonne réponse — juste la plus honnête.</p>
              </div>

              {/* Q1 — Role */}
              <div>
                <p className="text-sm font-medium text-neutral-300 mb-3">
                  Dans un projet, tu es plutôt : <span className="text-empire">*</span>
                </p>
                <div className="space-y-2">
                  {[
                    { value: 'dominant',  label: 'Le moteur',      sub: 'Tu décides, tu diriges, tu avances — même sans avoir toutes les infos' },
                    { value: 'influent',  label: "L'ambassadeur",   sub: 'Tu convaincs, tu fédères, tu mets de l\'énergie dans le groupe' },
                    { value: 'stable',    label: 'Le pilier',       sub: 'Tu assures, tu soutiens, tu construis dans la durée sans te griller' },
                    { value: 'conforme',  label: "L'analyste",      sub: 'Tu structures, tu vérifies, tu veux que ce soit bien fait avant d\'agir' },
                  ].map(opt => (
                    <OptionCard
                      key={opt.value}
                      value={opt.value}
                      label={opt.label}
                      sub={opt.sub}
                      selected={form.disc_role === opt.value}
                      onClick={() => set('disc_role')(opt.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Q2 — Obstacle */}
              <div>
                <p className="text-sm font-medium text-neutral-300 mb-3">
                  Face à un obstacle, tu : <span className="text-empire">*</span>
                </p>
                <div className="space-y-2">
                  {[
                    { value: 'dominant', label: 'Tu fonces malgré tout',           sub: 'Quitte à ajuster en cours de route' },
                    { value: 'influent', label: 'Tu trouves une autre approche',    sub: 'Et tu t\'adaptes avec enthousiasme' },
                    { value: 'stable',   label: 'Tu prends le temps',               sub: 'Pour trouver la bonne solution sans te précipiter' },
                    { value: 'conforme', label: 'Tu analyses pourquoi ça a bloqué', sub: 'Avant de repartir avec une méthode solide' },
                  ].map(opt => (
                    <OptionCard
                      key={opt.value}
                      value={opt.value}
                      label={opt.label}
                      sub={opt.sub}
                      selected={form.disc_obstacle === opt.value}
                      onClick={() => set('disc_obstacle')(opt.value)}
                    />
                  ))}
                </div>
              </div>

              <Textarea
                label="C'est quoi tes potes diraient sur toi quand tu quittes un dîner ? (optionnel)"
                name="friends_say"
                value={form.friends_say}
                onChange={set('friends_say')}
                placeholder="Honnêtement. Pas en mode CV."
              />
            </div>
          )}

          {/* ── Step 5: Finalisation ── */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="mb-2">
                <h2 className="text-xl font-bold text-white mb-1">Dernier détail.</h2>
                <p className="text-sm text-neutral-500">Plus c'est spécifique, mieux c'est — ça nous aide à sélectionner les bons profils.</p>
              </div>
              <Input
                label="Un réseau social ou profil qu'on peut regarder (optionnel)"
                name="social_link"
                value={form.social_link}
                onChange={set('social_link')}
                placeholder="LinkedIn, Instagram, TikTok, site perso..."
              />
              <Textarea
                label="Pourquoi ce bootcamp maintenant — et pas dans 6 mois ?"
                name="motivation"
                value={form.motivation}
                onChange={set('motivation')}
                placeholder="Qu'est-ce qui se passe dans ta vie en ce moment qui rend ça urgent ?"
                required
              />
              <div className="p-4 rounded-xl bg-empire/5 border border-empire/20">
                <p className="text-xs text-neutral-400 leading-relaxed">
                  En soumettant, tu acceptes qu'on te contacte par email ou téléphone pour répondre à ta candidature.
                  Aucun engagement, aucune vente forcée.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className={`mt-8 flex items-center ${step > 1 ? 'justify-between' : 'justify-end'}`}>
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(s => s - 1)}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <ChevronLeft size={16} />
            Retour
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={!isStepValid() || loading}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            isStepValid() && !loading
              ? 'bg-empire text-black hover:scale-105 shadow-[0_0_20px_rgba(218,252,104,0.3)]'
              : 'bg-white/10 text-neutral-600 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> En cours...</>
          ) : step === 5 ? (
            <><Check size={16} /> Envoyer ma candidature</>
          ) : (
            <>Continuer <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  )
}
