'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, CheckCircle2, XCircle, Loader2, Award, Calendar, Users, ExternalLink, Copy, Check, Download } from 'lucide-react'

interface CertificationData {
  valid: boolean
  first_name: string
  last_name: string
  tier: 'bronze' | 'silver' | 'gold'
  promotion: string
  issued_at: string
  linkedin_url?: string
  photo_url?: string
}

const TIER_CONFIG = {
  bronze: {
    label: 'Bronze',
    color: 'from-amber-700 to-amber-900',
    bg: 'bg-amber-900/20',
    border: 'border-amber-700/40',
    text: 'text-amber-400',
    ring: 'ring-amber-700/30',
    glow: 'rgba(180, 83, 9, 0.15)',
    icon: '🥉',
    description: 'Fondamentaux acquis — l\'élève maîtrise les bases de la création de contenu et du personal branding.',
  },
  silver: {
    label: 'Argent',
    color: 'from-slate-300 to-slate-500',
    bg: 'bg-slate-400/10',
    border: 'border-slate-400/40',
    text: 'text-slate-300',
    ring: 'ring-slate-400/30',
    glow: 'rgba(148, 163, 184, 0.15)',
    icon: '🥈',
    description: 'Niveau avancé — maîtrise opérationnelle complète, capable de produire et déployer du contenu de qualité de façon autonome.',
  },
  gold: {
    label: 'Or',
    color: 'from-yellow-400 to-amber-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/40',
    text: 'text-yellow-400',
    ring: 'ring-yellow-500/30',
    glow: 'rgba(234, 179, 8, 0.2)',
    icon: '🥇',
    description: 'Excellence — résultats exceptionnels, stratégie maîtrisée, leadership démontré. Top de la promotion.',
  },
} as const

/** Caractères par segment après « EMP- » (ex. EMP-ABC-XYZ). */
const SEG_LEN = 3

export default function VerifyClient() {
  const [segments, setSegments] = useState(['', '', ''])
  const [result, setResult] = useState<CertificationData | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [verifiedCode, setVerifiedCode] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [fromUrl, setFromUrl] = useState(false)

  const verify = useCallback(async (code: string) => {
    setLoading(true)
    setResult(null)
    setNotFound(false)
    setVerifiedCode(null)
    const normalized = code.toUpperCase().trim()
    try {
      const res = await fetch(`/api/certifications/verify?code=${encodeURIComponent(normalized)}`)
      const data = await res.json()
      if (data.valid) {
        setResult(data)
        setVerifiedCode(normalized)
      } else {
        setNotFound(true)
      }
    } catch {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const raw = params.get('code')
    if (!raw) return
    const text = raw.toUpperCase().replace(/\s/g, '')
    const m3 = text.match(/^EMP-([A-Z0-9]{3})-([A-Z0-9]{3})$/i)
    const m4 = text.match(/^EMP-([A-Z0-9]{4})-([A-Z0-9]{4})$/i)
    if (m3) {
      setSegments(['EMP', m3[1], m3[2]])
      setFromUrl(true)
    } else if (m4) {
      verify(`EMP-${m4[1]}-${m4[2]}`)
    }
  }, [verify])

  useEffect(() => {
    if (fromUrl && segments[1].length === SEG_LEN && segments[2].length === SEG_LEN) {
      setFromUrl(false)
      verify(`EMP-${segments[1]}-${segments[2]}`)
    }
  }, [fromUrl, segments, verify])

  const handleSegmentChange = (index: number, value: string) => {
    const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, SEG_LEN)
    const next = [...segments]
    next[index] = clean
    setSegments(next)

    if (clean.length === SEG_LEN && index < 2) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !segments[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').toUpperCase().replace(/\s/g, '')
    const m3 = text.match(/^EMP-?([A-Z0-9]{3})-?([A-Z0-9]{3})$/)
    const m4 = text.match(/^EMP-?([A-Z0-9]{4})-?([A-Z0-9]{4})$/)
    if (m3) {
      setSegments(['EMP', m3[1], m3[2]])
      verify(`EMP-${m3[1]}-${m3[2]}`)
    } else if (m4) {
      verify(`EMP-${m4[1]}-${m4[2]}`)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (segments[1].length === SEG_LEN && segments[2].length === SEG_LEN) {
      verify(`EMP-${segments[1]}-${segments[2]}`)
    }
  }

  const fullCode = verifiedCode ?? `EMP-${segments[1]}-${segments[2]}`
  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify?code=${encodeURIComponent(fullCode)}`
    : ''
  const pdfUrl =
    typeof window !== 'undefined' && verifiedCode
      ? `${window.location.origin}/api/certifications/pdf?code=${encodeURIComponent(verifiedCode)}`
      : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(verifyUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tierConfig = result ? TIER_CONFIG[result.tier] : null

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6">
              <Shield className="w-8 h-8 text-empire" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Vérifier une certification
            </h1>
            <p className="text-white/50 text-lg">
              Entrez le code unique pour vérifier l&apos;authenticité d&apos;une certification Empire Internet
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            onPaste={handlePaste}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-6">
              <div className="px-3 py-3 md:px-4 md:py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/40 font-mono text-lg md:text-xl font-bold tracking-widest select-none">
                EMP
              </div>
              <span className="text-white/20 text-2xl font-light">—</span>
              {[1, 2].map((i) => (
                <span key={i} className="contents">
                  <input
                    ref={(el) => { inputRefs.current[i] = el }}
                    type="text"
                    maxLength={SEG_LEN}
                    value={segments[i]}
                    onChange={(e) => handleSegmentChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    placeholder="···"
                    className="w-[60px] md:w-[72px] px-2 py-3 md:px-3 md:py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-lg md:text-xl font-bold tracking-[0.2em] text-center placeholder:text-white/15 focus:outline-none focus:border-empire/50 focus:ring-2 focus:ring-empire/20 transition-all"
                  />
                  {i === 1 && <span className="text-white/20 text-2xl font-light">—</span>}
                </span>
              ))}
            </div>

            <button
              type="submit"
              disabled={segments[1].length < SEG_LEN || segments[2].length < SEG_LEN || loading}
              className="w-full py-3.5 rounded-xl bg-empire text-black font-semibold text-lg transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Vérifier
                </>
              )}
            </button>
          </motion.form>

          <AnimatePresence mode="wait">
            {notFound && (
              <motion.div
                key="not-found"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-center"
              >
                <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-white mb-1">Code invalide</h2>
                <p className="text-white/50">
                  Ce code de certification n&apos;existe pas. Vérifiez qu&apos;il est correctement saisi.
                </p>
              </motion.div>
            )}

            {result && tierConfig && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]"
              >
                <div
                  className="absolute inset-0 opacity-30 pointer-events-none"
                  style={{
                    background: `radial-gradient(600px 300px at 50% 0%, ${tierConfig.glow}, transparent 70%)`,
                  }}
                />

                <div className="relative p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium text-sm uppercase tracking-wider">
                      Certification vérifiée
                    </span>
                  </div>

                  <div className="flex items-start gap-5 mb-6">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${tierConfig.bg} ${tierConfig.border} border flex items-center justify-center text-3xl`}>
                      {tierConfig.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {result.first_name} {result.last_name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${tierConfig.bg} ${tierConfig.text} ${tierConfig.border} border`}>
                          <Award className="w-3.5 h-3.5" />
                          Niveau {tierConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-xl ${tierConfig.bg} ${tierConfig.border} border p-4 mb-6`}>
                    <p className={`text-sm ${tierConfig.text}`}>
                      {tierConfig.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                      <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-wider mb-1">
                        <Users className="w-3.5 h-3.5" />
                        Promotion
                      </div>
                      <div className="text-white font-semibold">{result.promotion}</div>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                      <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-wider mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Délivrée le
                      </div>
                      <div className="text-white font-semibold">
                        {new Date(result.issued_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-4">
                    <div className="text-white/40 text-xs uppercase tracking-wider mb-2">
                      Code de vérification
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-white font-mono text-lg tracking-widest">{fullCode}</code>
                      <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {pdfUrl ? (
                    <div className="mb-4 space-y-2">
                      <a
                        href={pdfUrl}
                        download
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/10 border border-white/15 text-white font-medium hover:bg-white/15 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Télécharger le certificat (PDF)
                      </a>
                      <p className="text-center text-white/35 text-xs px-1 leading-relaxed">
                        Sur LinkedIn : profil →{' '}
                        <span className="text-white/50">À la une</span> (média) ou section{' '}
                        <span className="text-white/50">Licences et certifications</span> — joindre ce PDF ou coller le lien
                        de vérification.
                      </p>
                    </div>
                  ) : null}

                  {result.linkedin_url && (
                    <a
                      href={result.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-[#0A66C2] font-medium hover:bg-[#0A66C2]/20 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Voir le profil LinkedIn
                    </a>
                  )}
                </div>

                <div className="border-t border-white/5 px-6 md:px-8 py-4 flex items-center justify-between">
                  <span className="text-white/30 text-xs">
                    Délivré par Empire Internet
                  </span>
                  <div className="flex items-center gap-1.5 text-white/30 text-xs">
                    <Shield className="w-3 h-3" />
                    Authentique
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <footer className="text-center py-6 text-white/20 text-sm">
        © {new Date().getFullYear()} Empire Internet — Toutes les certifications sont vérifiables
      </footer>
    </div>
  )
}
