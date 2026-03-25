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
  // Step 4
  money_project: string
  unpopular_opinion: string
  friends_say: string
  // Step 5
  social_link: string
  motivation: string
}

const initial: FormData = {
  first_name: '', last_name: '', email: '', phone: '',
  hours_per_week: '', budget: '',
  has_created_content: '', content_link: '', haunting_project: '',
  money_project: '', unpopular_opinion: '', friends_say: '',
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

// ─── Result Screen ─────────────────────────────────────────────────────────────

function ResultScreen({ color }: { color: 'red' | 'blue' | 'green' | null }) {
  const config = {
    green: {
      emoji: '🟢',
      title: 'Profil validé.',
      sub: 'Tu corresponds exactement à ce qu\'on cherche.',
      body: 'On revient vers toi dans les 24 prochaines heures avec la suite. Garde un œil sur ta boîte mail.',
      badge: 'Accès prioritaire',
      badgeColor: 'bg-empire/20 text-empire border-empire/40',
    },
    blue: {
      emoji: '🔵',
      title: 'Candidature reçue.',
      sub: 'Profil intéressant — on veut en savoir plus.',
      body: 'On analyse ta candidature et on revient vers toi sous 24h. Prépare-toi à une courte conversation.',
      badge: 'En cours d\'évaluation',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    },
    red: {
      emoji: '🔴',
      title: 'Candidature reçue.',
      sub: 'Le timing n\'est peut-être pas le bon.',
      body: 'On a bien reçu ta candidature. Si le profil ne correspond pas à la promo actuelle, on te le dira honnêtement et on te proposera une alternative.',
      badge: 'En cours d\'analyse',
      badgeColor: 'bg-neutral-700/50 text-neutral-400 border-neutral-600/40',
    },
  }

  const c = color ? config[color] : config.blue

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center py-6"
    >
      <div className="text-6xl mb-6">{c.emoji}</div>
      <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-4 ${c.badgeColor}`}>
        {c.badge}
      </span>
      <h2 className="text-2xl font-bold text-white mb-2">{c.title}</h2>
      <p className="text-empire font-semibold mb-4">{c.sub}</p>
      <p className="text-neutral-400 text-sm leading-relaxed max-w-sm mx-auto mb-8">{c.body}</p>

      <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-xs mx-auto">
        <div className="flex -space-x-2">
          {['11', '22', '33'].map(n => (
            <img key={n} src={`https://i.pravatar.cc/32?img=${n}`} className="w-8 h-8 rounded-full border-2 border-black" alt="" />
          ))}
        </div>
        <p className="text-xs text-neutral-400">
          <span className="text-white font-semibold">+31 candidatures</span> reçues cette semaine
        </p>
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
  const [resultColor, setResultColor] = useState<'red' | 'blue' | 'green' | null>(null)

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
        return form.money_project.trim().length > 10 && form.unpopular_opinion.trim().length > 5
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
          payload.money_project = form.money_project
          payload.unpopular_opinion = form.unpopular_opinion
          payload.friends_say = form.friends_say
        } else if (step === 5) {
          payload.social_link = form.social_link
          payload.motivation = form.motivation
          // Pass scoring fields for final calculation
          payload.hours_per_week = form.hours_per_week
          payload.budget = form.budget
          payload.has_created_content = form.has_created_content
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
          // Fetch the score color from the local utility
          const { calculateScore } = await import('@/lib/supabase')
          const { color } = calculateScore(form)
          if (color !== 'pending') setResultColor(color)
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

  if (done) return <ResultScreen color={resultColor} />

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

          {/* ── Step 4: Personnalité ── */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="mb-2">
                <h2 className="text-xl font-bold text-white mb-1">On apprend à te connaître.</h2>
                <p className="text-sm text-neutral-500">Pas de bonnes ou mauvaises réponses — on veut de l'honnêteté, pas du performatif.</p>
              </div>
              <Textarea
                label="Si t'avais 10 000€ et 1 mois pour lancer un projet, tu fais quoi ?"
                name="money_project"
                value={form.money_project}
                onChange={set('money_project')}
                placeholder="Sois concret — pas 'j investirais' ou 'je me formerais'"
                required
              />
              <Textarea
                label="C'est quoi ton opinion impopulaire ?"
                name="unpopular_opinion"
                value={form.unpopular_opinion}
                onChange={set('unpopular_opinion')}
                placeholder="Un avis que t'assumes même si ça plaît pas à tout le monde"
                required
              />
              <Textarea
                label="C'est quoi tes potes diraient sur toi quand tu quittes un dîner ?"
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
