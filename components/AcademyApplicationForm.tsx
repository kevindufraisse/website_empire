'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, Loader2, ChevronLeft, RotateCcw, Copy, CheckCheck, ChevronDown } from 'lucide-react'

const STORAGE_KEY = 'empire_candidature'

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
  // Step 4 - DISC behavioral
  disc_role: string
  disc_obstacle: string
  friends_say: string
  // Step 5
  social_link: string
  motivation: string
  // Step 6 - referrals
  referral_1: string
  referral_2: string
  referral_3: string
}

const initial: FormData = {
  first_name: '', last_name: '', email: '', phone: '',
  hours_per_week: '', budget: '',
  has_created_content: '', content_link: '', haunting_project: '',
  disc_role: '', disc_obstacle: '', friends_say: '',
  social_link: '', motivation: '',
  referral_1: '', referral_2: '', referral_3: '',
}

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  { num: 1, label: 'Contact' },
  { num: 2, label: 'Disponibilités' },
  { num: 3, label: 'Profil' },
  { num: 4, label: 'Personnalité' },
  { num: 5, label: 'Finalisation' },
  { num: 6, label: 'Recommandation' },
]

const TOTAL_STEPS = 6
const COUNTDOWN_SECONDS = 15 * 60

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
        rows={3}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-empire/60 focus:bg-white/[0.07] transition-all resize-none"
      />
    </div>
  )
}

// ─── Country codes ────────────────────────────────────────────────────────────

const COUNTRIES = [
  // Favoris en premier
  { code: '+33',  flag: '🇫🇷', name: 'France' },
  { code: '+32',  flag: '🇧🇪', name: 'Belgique' },
  { code: '+41',  flag: '🇨🇭', name: 'Suisse' },
  { code: '+352', flag: '🇱🇺', name: 'Luxembourg' },
  // Afrique francophone
  { code: '+212', flag: '🇲🇦', name: 'Maroc' },
  { code: '+213', flag: '🇩🇿', name: 'Algérie' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisie' },
  { code: '+221', flag: '🇸🇳', name: 'Sénégal' },
  { code: '+225', flag: '🇨🇮', name: "Côte d'Ivoire" },
  { code: '+237', flag: '🇨🇲', name: 'Cameroun' },
  { code: '+223', flag: '🇲🇱', name: 'Mali' },
  { code: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: '+227', flag: '🇳🇪', name: 'Niger' },
  { code: '+228', flag: '🇹🇬', name: 'Togo' },
  { code: '+229', flag: '🇧🇯', name: 'Bénin' },
  { code: '+230', flag: '🇲🇺', name: 'Maurice' },
  { code: '+241', flag: '🇬🇦', name: 'Gabon' },
  { code: '+242', flag: '🇨🇬', name: 'Congo' },
  { code: '+243', flag: '🇨🇩', name: 'RD Congo' },
  { code: '+261', flag: '🇲🇬', name: 'Madagascar' },
  // Europe
  { code: '+1',   flag: '🇺🇸', name: 'États-Unis' },
  { code: '+1',   flag: '🇨🇦', name: 'Canada' },
  { code: '+44',  flag: '🇬🇧', name: 'Royaume-Uni' },
  { code: '+49',  flag: '🇩🇪', name: 'Allemagne' },
  { code: '+34',  flag: '🇪🇸', name: 'Espagne' },
  { code: '+39',  flag: '🇮🇹', name: 'Italie' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: '+31',  flag: '🇳🇱', name: 'Pays-Bas' },
  { code: '+46',  flag: '🇸🇪', name: 'Suède' },
  { code: '+47',  flag: '🇳🇴', name: 'Norvège' },
  { code: '+45',  flag: '🇩🇰', name: 'Danemark' },
  { code: '+358', flag: '🇫🇮', name: 'Finlande' },
  { code: '+43',  flag: '🇦🇹', name: 'Autriche' },
  { code: '+48',  flag: '🇵🇱', name: 'Pologne' },
  { code: '+420', flag: '🇨🇿', name: 'Tchéquie' },
  { code: '+36',  flag: '🇭🇺', name: 'Hongrie' },
  { code: '+40',  flag: '🇷🇴', name: 'Roumanie' },
  { code: '+30',  flag: '🇬🇷', name: 'Grèce' },
  { code: '+7',   flag: '🇷🇺', name: 'Russie' },
  { code: '+380', flag: '🇺🇦', name: 'Ukraine' },
  // Moyen-Orient
  { code: '+971', flag: '🇦🇪', name: 'Émirats Arabes Unis' },
  { code: '+966', flag: '🇸🇦', name: 'Arabie Saoudite' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+965', flag: '🇰🇼', name: 'Koweït' },
  { code: '+972', flag: '🇮🇱', name: 'Israël' },
  { code: '+90',  flag: '🇹🇷', name: 'Turquie' },
  // Asie
  { code: '+86',  flag: '🇨🇳', name: 'Chine' },
  { code: '+81',  flag: '🇯🇵', name: 'Japon' },
  { code: '+82',  flag: '🇰🇷', name: 'Corée du Sud' },
  { code: '+91',  flag: '🇮🇳', name: 'Inde' },
  { code: '+62',  flag: '🇮🇩', name: 'Indonésie' },
  { code: '+66',  flag: '🇹🇭', name: 'Thaïlande' },
  { code: '+84',  flag: '🇻🇳', name: 'Vietnam' },
  { code: '+63',  flag: '🇵🇭', name: 'Philippines' },
  { code: '+65',  flag: '🇸🇬', name: 'Singapour' },
  // Amériques
  { code: '+55',  flag: '🇧🇷', name: 'Brésil' },
  { code: '+52',  flag: '🇲🇽', name: 'Mexique' },
  { code: '+54',  flag: '🇦🇷', name: 'Argentine' },
  { code: '+57',  flag: '🇨🇴', name: 'Colombie' },
  { code: '+56',  flag: '🇨🇱', name: 'Chili' },
  { code: '+51',  flag: '🇵🇪', name: 'Pérou' },
  // Océanie
  { code: '+61',  flag: '🇦🇺', name: 'Australie' },
  { code: '+64',  flag: '🇳🇿', name: 'Nouvelle-Zélande' },
]

function PhoneInput({
  value, onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [dialCode, setDialCode] = useState('+33')
  const [localNumber, setLocalNumber] = useState('')
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Sync combined value
  useEffect(() => {
    const num = localNumber.replace(/^0/, '')
    onChange(`${dialCode}${num}`)
  }, [dialCode, localNumber]) // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-fill from existing value (resume)
  useEffect(() => {
    if (!value) return
    // Sort by code length desc to match longer codes first (+352 before +35)
    const sorted = [...COUNTRIES].sort((a, b) => b.code.length - a.code.length)
    const found = sorted.find(c => value.startsWith(c.code))
    if (found) {
      setDialCode(found.code)
      setLocalNumber(value.slice(found.code.length))
    } else {
      setLocalNumber(value)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  // Focus search when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50)
  }, [open])

  const selected = COUNTRIES.find(c => c.code === dialCode) ?? COUNTRIES[0]

  const filtered = search.trim()
    ? COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.includes(search)
      )
    : COUNTRIES

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-300">
        Téléphone <span className="text-empire">*</span>
      </label>
      <div className="flex gap-2" ref={ref}>
        {/* Dropdown trigger */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white hover:bg-white/[0.07] focus:outline-none focus:border-empire/60 transition-all h-full"
          >
            <span className="text-base leading-none">{selected.flag}</span>
            <span className="text-neutral-400 text-xs tabular-nums">{selected.code}</span>
            <ChevronDown size={12} className={`text-neutral-600 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute top-full left-0 mt-1 z-50 w-64 rounded-xl bg-[#111] border border-white/10 shadow-2xl overflow-hidden">
              {/* Search */}
              <div className="p-2 border-b border-white/10">
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Chercher un pays ou indicatif..."
                  className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-empire/50 transition-all"
                />
              </div>
              {/* List */}
              <div className="max-h-52 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="px-4 py-3 text-xs text-neutral-600 text-center">Aucun résultat</p>
                ) : filtered.map((c, i) => (
                  <button
                    key={`${c.code}-${i}`}
                    type="button"
                    onClick={() => { setDialCode(c.code); setOpen(false); setSearch('') }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors ${
                      c.code === dialCode && c.name === selected.name ? 'text-empire bg-empire/5' : 'text-neutral-300'
                    }`}
                  >
                    <span className="text-base leading-none">{c.flag}</span>
                    <span className="flex-1 truncate text-xs">{c.name}</span>
                    <span className="text-xs text-neutral-500 tabular-nums">{c.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Number input */}
        <input
          type="tel"
          value={localNumber}
          onChange={e => setLocalNumber(e.target.value.replace(/[^\d\s\-().]/g, ''))}
          placeholder="6 12 34 56 78"
          className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-empire/60 focus:bg-white/[0.07] transition-all"
        />
      </div>
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
    badge: 'Profil D - Dominant',
    badgeStyle: 'bg-red-500/15 text-red-400 border-red-500/40',
    letter: 'D',
    title: 'Tu avances. Sans attendre.',
    sub: 'Tu décides vite, tu assumes, tu fonces. C\'est exactement le profil qu\'on cherche.',
    traits: ['Orienté résultats', 'Décide vite', 'Compétitif', 'Aime les défis'],
    forBootcamp: 'Excellent fit - tu as le moteur pour créer chaque jour et ne pas lâcher.',
  },
  influent: {
    color: '#eab308',
    dot: 'bg-yellow-500',
    badge: 'Profil I - Influent',
    badgeStyle: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/40',
    letter: 'I',
    title: 'Tu crées, tu connectes, tu convaincs.',
    sub: 'Tu sais naturellement capter l\'attention. Le contenu, c\'est ton terrain.',
    traits: ['Enthousiaste', 'Persuasif', 'Créatif', 'Social, fédérateur'],
    forBootcamp: 'Profil idéal pour la viralité - tu as l\'instinct du créateur de contenu.',
  },
  stable: {
    color: '#22c55e',
    dot: 'bg-green-500',
    badge: 'Profil S - Stable',
    badgeStyle: 'bg-green-500/15 text-green-400 border-green-500/40',
    letter: 'S',
    title: 'Tu construis dans la durée.',
    sub: 'Tu es fiable, méthodique, patient. La régularité - ton super-pouvoir.',
    traits: ['Régulier', 'Fiable', 'Patient', 'Travail en profondeur'],
    forBootcamp: 'Bon fit - la régularité quotidienne du bootcamp est faite pour toi.',
  },
  conforme: {
    color: '#3b82f6',
    dot: 'bg-blue-500',
    badge: 'Profil C - Conforme',
    badgeStyle: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
    letter: 'C',
    title: 'Tu analyses avant d\'agir.',
    sub: 'Précis, structuré, logique. Tu veux comprendre avant de faire.',
    traits: ['Analytique', 'Précis', 'Qualité', 'Orienté données'],
    forBootcamp: 'Profil intéressant - tu apporteras de la rigueur, même si la création rapide sera ton défi.',
  },
}

const PAGE_URL = 'https://empire-internet.com/candidature'

const shareMessages: Record<DiscType, string> = {
  dominant: `Je viens de candidater au Bootcamp Head of Viralité d'Empire Internet.\n\nProfil DISC : Dominant - je fonce, je décide, j'avance.\n\n21 jours pour maîtriser la viralité et générer 3 000€/mois.\n\nTu veux tester ton éligibilité ?`,
  influent: `Je viens de candidater au Bootcamp Head of Viralité d'Empire Internet.\n\nProfil DISC : Influent - contenu, connexion, conviction.\n\n21 jours pour maîtriser la viralité et générer 3 000€/mois.\n\nTu veux tester ton éligibilité ?`,
  stable: `Je viens de candidater au Bootcamp Head of Viralité d'Empire Internet.\n\nProfil DISC : Stable - je construis dans la durée, sans me griller.\n\n21 jours pour maîtriser la viralité et générer 3 000€/mois.\n\nTu veux tester ton éligibilité ?`,
  conforme: `Je viens de candidater au Bootcamp Head of Viralité d'Empire Internet.\n\nProfil DISC : Conforme - j'analyse, je structure, je perfectionne.\n\n21 jours pour maîtriser la viralité et générer 3 000€/mois.\n\nTu veux tester ton éligibilité ?`,
}

function ShareButtons({ disc }: { disc: DiscType }) {
  const [copied, setCopied] = useState(false)
  const message = shareMessages[disc]
  const fullMessage = `${message}\n\n${PAGE_URL}`

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(PAGE_URL)}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(PAGE_URL)}`

  function copyLink() {
    navigator.clipboard.writeText(PAGE_URL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="mt-8 max-w-sm mx-auto">
      <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest text-center mb-4">
        Tu connais quelqu'un qui devrait postuler ?
      </p>
      <div className="grid grid-cols-2 gap-2 mb-2">
        {/* LinkedIn */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0A66C2]/15 border border-[#0A66C2]/40 text-[#5B9FE6] text-xs font-semibold hover:bg-[#0A66C2]/25 transition-all"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold hover:bg-[#25D366]/20 transition-all"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </a>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* X / Twitter */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-neutral-300 text-xs font-semibold hover:bg-white/10 transition-all"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Post sur X
        </a>

        {/* Copy link */}
        <button
          onClick={copyLink}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-neutral-300 text-xs font-semibold hover:bg-white/10 transition-all"
        >
          {copied
            ? <><CheckCheck size={14} className="text-empire" /> Copié !</>
            : <><Copy size={14} /> Copier le lien</>
          }
        </button>
      </div>
    </div>
  )
}

function ResultScreen({ disc }: { disc: DiscType | null }) {
  const d = disc ? discConfig[disc] : discConfig.influent
  const discType = disc ?? 'influent'

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

      {/* Share */}
      <ShareButtons disc={discType} />
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
  const [resumeData, setResumeData] = useState<{ id: string; step: number; name: string } | null>(null)
  const [resumeLoading, setResumeLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [timerStarted, setTimerStarted] = useState(false)

  // ── 15-min countdown - starts on step 1 first render ────────────────────
  useEffect(() => {
    if (timerStarted || resumeData) return
    setTimerStarted(true)
    setTimeLeft(COUNTDOWN_SECONDS)
  }, [timerStarted, resumeData])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || done) return
    const t = setTimeout(() => setTimeLeft(s => (s !== null ? s - 1 : null)), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, done])

  // ── Check for saved progress on mount ───────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return
      const parsed = JSON.parse(saved)
      if (parsed?.id && parsed?.step && parsed.step > 1 && parsed.step < 7) {
        setResumeData(parsed)
      }
    } catch {
      // ignore malformed data
    }
  }, [])

  // ── Persist progress to localStorage ────────────────────────────────────
  function saveProgress(id: string, currentStep: number, name: string) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ id, step: currentStep, name }))
    } catch { /* ignore */ }
  }

  function clearProgress() {
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }

  // ── Resume existing application ──────────────────────────────────────────
  async function handleResume() {
    if (!resumeData) return
    setResumeLoading(true)
    try {
      const res = await fetch(`/api/applications/${resumeData.id}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      // Restore form data from DB
      setForm({
        first_name: data.first_name ?? '',
        last_name: data.last_name ?? '',
        email: data.email ?? '',
        phone: data.phone ?? '',
        hours_per_week: data.hours_per_week ?? '',
        budget: data.budget ?? '',
        has_created_content: data.has_created_content ?? '',
        content_link: data.content_link ?? '',
        haunting_project: data.haunting_project ?? '',
        disc_role: data.disc_role ?? '',
        disc_obstacle: data.disc_obstacle ?? '',
        friends_say: data.friends_say ?? '',
        social_link: data.social_link ?? '',
        motivation: data.motivation ?? '',
        referral_1: data.referral_1 ?? '',
        referral_2: data.referral_2 ?? '',
        referral_3: data.referral_3 ?? '',
      })
      setAppId(resumeData.id)
      setStep(Math.min(resumeData.step + 1, TOTAL_STEPS))
      setResumeData(null)
    } catch {
      // If fetch fails, just start fresh
      clearProgress()
      setResumeData(null)
    } finally {
      setResumeLoading(false)
    }
  }

  function handleStartFresh() {
    clearProgress()
    setResumeData(null)
  }

  const set = (field: keyof FormData) => (v: string) =>
    setForm(prev => ({ ...prev, [field]: v }))

  // ── Validation per step ──────────────────────────────────────────────────

  function isStepValid() {
    switch (step) {
      case 1:
        return form.first_name.trim() && form.last_name.trim() && form.email.includes('@') && form.phone.replace(/\D/g, '').length >= 7
      case 2:
        return !!form.hours_per_week && !!form.budget
      case 3:
        return !!form.has_created_content
      case 4:
        return !!form.disc_role && !!form.disc_obstacle
      case 5:
        return form.motivation.trim().length > 0
      case 6:
        return true // all referral fields optional
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
        // Create record in DB - capture email immediately
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
        saveProgress(json.id, 1, form.first_name)

        // If server found an existing application for this email
        if (json.resumed) {
          // Already fully submitted → show result screen directly
          if (json.completed) {
            const disc = json.disc_profile as string | null
            const validDiscs: DiscType[] = ['dominant', 'influent', 'stable', 'conforme']
            if (disc && (validDiscs as string[]).includes(disc)) setResultDisc(disc as DiscType)
            setDone(true)
            setLoading(false)
            return
          }

          // Incomplete application → restore and resume
          if (json.step > 1) {
            try {
              const existing = await fetch(`/api/applications/${json.id}`)
              if (existing.ok) {
                const data = await existing.json()
                setForm(prev => ({
                  ...prev,
                  hours_per_week: data.hours_per_week ?? prev.hours_per_week,
                  budget: data.budget ?? prev.budget,
                  has_created_content: data.has_created_content ?? prev.has_created_content,
                  content_link: data.content_link ?? prev.content_link,
                  haunting_project: data.haunting_project ?? prev.haunting_project,
                  disc_role: data.disc_role ?? prev.disc_role,
                  disc_obstacle: data.disc_obstacle ?? prev.disc_obstacle,
                  friends_say: data.friends_say ?? prev.friends_say,
                  social_link: data.social_link ?? prev.social_link,
                  motivation: data.motivation ?? prev.motivation,
                  referral_1: data.referral_1 ?? prev.referral_1,
                  referral_2: data.referral_2 ?? prev.referral_2,
                  referral_3: data.referral_3 ?? prev.referral_3,
                }))
                saveProgress(json.id, json.step, form.first_name)
                setStep(Math.min(json.step + 1, TOTAL_STEPS))
                setLoading(false)
                return
              }
            } catch { /* fall through */ }
          }
        }
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
        } else if (step === 6) {
          payload.referral_1 = form.referral_1
          payload.referral_2 = form.referral_2
          payload.referral_3 = form.referral_3
          // Final step - pass all scoring fields
          payload.hours_per_week = form.hours_per_week
          payload.budget = form.budget
          payload.has_created_content = form.has_created_content
          payload.disc_role = form.disc_role
          payload.disc_obstacle = form.disc_obstacle
          payload.step_completed = 6
        }

        const res = await fetch(`/api/applications/${appId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error)

        if (step === 6) {
          const { calculateScore } = await import('@/lib/scoring')
          const { disc } = calculateScore(form)
          if (disc !== 'pending') setResultDisc(disc)
          clearProgress()
          setDone(true)
          setLoading(false)
          return
        }
        // Save progress after each successful PATCH
        if (appId) saveProgress(appId, step, form.first_name)
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

  // Resume prompt
  if (resumeData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="w-14 h-14 rounded-2xl bg-empire/10 border border-empire/30 flex items-center justify-center mx-auto mb-5">
          <RotateCcw className="text-empire" size={22} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          Tu avais commencé, {resumeData.name}.
        </h2>
        <p className="text-sm text-neutral-500 mb-8 max-w-xs mx-auto">
          On a gardé ta progression. Tu veux reprendre là où tu t'étais arrêté ?
        </p>
        <div className="space-y-3 max-w-xs mx-auto">
          <button
            onClick={handleResume}
            disabled={resumeLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-empire text-black font-bold text-sm rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.25)]"
          >
            {resumeLoading
              ? <><Loader2 size={16} className="animate-spin" /> Chargement...</>
              : <>Reprendre (étape {resumeData.step} / {TOTAL_STEPS}) →</>
            }
          </button>
          <button
            onClick={handleStartFresh}
            className="w-full px-6 py-3 text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Recommencer depuis le début
          </button>
        </div>
      </motion.div>
    )
  }

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100

  const mins = timeLeft !== null ? Math.floor(timeLeft / 60) : 15
  const secs = timeLeft !== null ? timeLeft % 60 : 0
  const isUrgent = timeLeft !== null && timeLeft <= 120

  return (
    <div className="w-full">
      {/* Countdown timer */}
      {timeLeft !== null && timeLeft > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center justify-between px-4 py-2.5 rounded-xl mb-6 border transition-all ${
            isUrgent
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-white/[0.03] border-white/10'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse flex-shrink-0 ${isUrgent ? 'bg-red-400' : 'bg-empire'}`} />
            <p className={`text-xs font-medium ${isUrgent ? 'text-red-400' : 'text-neutral-400'}`}>
              {isUrgent ? 'Plus que' : 'Ce créneau est réservé pour'}
            </p>
          </div>
          <span className={`text-sm font-black tabular-nums ${isUrgent ? 'text-red-400' : 'text-empire'}`}>
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
        </motion.div>
      )}
      {timeLeft === 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-6 bg-white/[0.03] border border-white/10">
          <span className="text-xs text-neutral-500">Créneau expiré - ta progression est sauvegardée, continue !</span>
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
            Étape {step} / {TOTAL_STEPS}
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
              <PhoneInput value={form.phone} onChange={set('phone')} />
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
                    { value: '<2h', label: 'Moins de 2h', sub: 'Difficile - le bootcamp demande de la régularité' },
                    { value: '2-5h', label: '2 à 5h', sub: 'Faisable avec de la discipline' },
                    { value: '5-10h', label: '5 à 10h', sub: 'Idéal pour progresser vite' },
                    { value: '10h+', label: '10h et plus', sub: 'Mode intensif - résultats rapides' },
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
                <p className="text-sm text-neutral-500">Pas besoin d'expérience - on veut juste savoir où tu en es.</p>
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
                label="C'est quoi le projet que t'as jamais fini mais qui te hante encore ? (optionnel)"
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
                <p className="text-sm text-neutral-500">Deux questions. Pas de bonne réponse - juste la plus honnête.</p>
              </div>

              {/* Q1 - Role */}
              <div>
                <p className="text-sm font-medium text-neutral-300 mb-3">
                  Dans un projet, tu es plutôt : <span className="text-empire">*</span>
                </p>
                <div className="space-y-2">
                  {[
                    { value: 'dominant',  label: 'Le moteur',      sub: 'Tu décides, tu diriges, tu avances - même sans avoir toutes les infos' },
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

              {/* Q2 - Obstacle */}
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
                <p className="text-sm text-neutral-500">Plus c'est spécifique, mieux c'est - ça nous aide à sélectionner les bons profils.</p>
              </div>
              <Input
                label="Un réseau social ou profil qu'on peut regarder (optionnel)"
                name="social_link"
                value={form.social_link}
                onChange={set('social_link')}
                placeholder="LinkedIn, Instagram, TikTok, site perso..."
              />
              <Textarea
                label="Pourquoi ce bootcamp maintenant - et pas dans 6 mois ?"
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

          {/* ── Step 6: Recommandation ── */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="mb-2">
                <h2 className="text-xl font-bold text-white mb-1">Tu connais des gens qui devraient postuler ?</h2>
                <p className="text-sm text-neutral-500">
                  Si tu penses à quelqu'un qui serait fait pour ça - salariés, freelances, entrepreneurs -
                  laisse leur profil LinkedIn. On les contacte de ta part.
                </p>
              </div>

              <div className="space-y-3">
                {([
                  { field: 'referral_1' as const, placeholder: 'linkedin.com/in/prénom-nom ou @profil' },
                  { field: 'referral_2' as const, placeholder: 'Un deuxième profil (optionnel)' },
                  { field: 'referral_3' as const, placeholder: 'Un troisième profil (optionnel)' },
                ] as const).map(({ field, placeholder }, i) => (
                  <div key={field} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#0A66C2]/15 border border-[#0A66C2]/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-black text-[#5B9FE6]">{i + 1}</span>
                    </div>
                    <input
                      type="text"
                      value={form[field]}
                      onChange={e => set(field)(e.target.value)}
                      placeholder={placeholder}
                      className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-[#0A66C2]/50 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Tous les champs sont optionnels. Si tu ne penses à personne maintenant, tu peux passer directement.
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
          ) : step === 6 ? (
            <><Check size={16} /> Envoyer ma candidature</>
          ) : (
            <>Continuer <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  )
}
