'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Loader2, CheckCircle2, XCircle, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getEmpParam } from '@/hooks/useCalLink'

const COUNTRIES = [
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+32', flag: '🇧🇪', name: 'Belgique' },
  { code: '+41', flag: '🇨🇭', name: 'Suisse' },
  { code: '+352', flag: '🇱🇺', name: 'Luxembourg' },
  { code: '+377', flag: '🇲🇨', name: 'Monaco' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+49', flag: '🇩🇪', name: 'Deutschland' },
  { code: '+34', flag: '🇪🇸', name: 'España' },
  { code: '+39', flag: '🇮🇹', name: 'Italia' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: '+31', flag: '🇳🇱', name: 'Nederland' },
  { code: '+212', flag: '🇲🇦', name: 'Maroc' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisie' },
  { code: '+213', flag: '🇩🇿', name: 'Algérie' },
  { code: '+225', flag: '🇨🇮', name: 'Côte d\'Ivoire' },
  { code: '+221', flag: '🇸🇳', name: 'Sénégal' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+55', flag: '🇧🇷', name: 'Brasil' },
]

type Step = 'form' | 'success' | 'cancelled'

interface CallbackFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CallbackFormModal({ isOpen, onClose }: CallbackFormModalProps) {
  const { lang } = useLanguage()
  const [step, setStep] = useState<Step>('form')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ firstName: '', email: '', phone: '', budget: '' })
  const [countryIdx, setCountryIdx] = useState(0)
  const [countryOpen, setCountryOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const dropdownRef = useRef<HTMLDivElement>(null)

  const t = {
    fr: {
      title: 'Vérifier votre éligibilité',
      subtitle: 'Laissez vos coordonnées, on vérifie votre profil et on vous recontacte',
      firstName: 'Prénom',
      email: 'Email',
      phone: 'Téléphone',
      budgetLabel: 'Budget mensuel',
      budget1: '1 000€ - 5 000€',
      budget2: '+ 5 000€',
      noBudget: 'Pas de budget',
      submit: 'Envoyer',
      successTitle: 'Parfait !',
      successText: 'On vous recontacte très vite. Gardez votre téléphone à portée de main.',
      cancelledTitle: 'Pas de souci',
      cancelledText: 'N\'hésitez pas à revenir quand vous serez prêt.',
      close: 'Fermer',
    },
    en: {
      title: 'Check your eligibility',
      subtitle: 'Leave your details, we\'ll review your profile and get back to you',
      firstName: 'First name',
      email: 'Email',
      phone: 'Phone',
      budgetLabel: 'Monthly budget',
      budget1: '€1,000 - €5,000',
      budget2: '€5,000+',
      noBudget: 'No budget',
      submit: 'Submit',
      successTitle: 'Perfect!',
      successText: 'We\'ll get back to you very soon. Keep your phone close.',
      cancelledTitle: 'No worries',
      cancelledText: 'Feel free to come back when you\'re ready.',
      close: 'Close',
    },
  }

  const txt = lang === 'fr' ? t.fr : t.en

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCountryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleClose() {
    setStep('form')
    setForm({ firstName: '', email: '', phone: '', budget: '' })
    setErrors({})
    setLoading(false)
    setCountryOpen(false)
    onClose()
  }

  function validate() {
    const newErrors: Record<string, boolean> = {}
    if (!form.firstName.trim()) newErrors.firstName = true
    if (!form.email.trim() || !form.email.includes('@')) newErrors.email = true
    if (!form.phone.trim()) newErrors.phone = true
    if (!form.budget) newErrors.budget = true
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return

    if (form.budget === 'none') {
      setStep('cancelled')
      return
    }

    setLoading(true)
    const fullPhone = `${COUNTRIES[countryIdx].code}${form.phone}`
    try {
      await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          email: form.email,
          phone: fullPhone,
          budget: form.budget,
          emp: getEmpParam() || undefined,
        }),
      })
      setStep('success')
    } catch {
      setStep('success')
    } finally {
      setLoading(false)
    }
  }

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!isOpen || !mounted) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          {step === 'form' && (
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-empire/10 border border-empire/30 flex items-center justify-center">
                  <Phone className="text-empire" size={18} />
                </div>
                <h3 className="text-xl font-bold text-white">{txt.title}</h3>
              </div>
              <p className="text-sm text-neutral-400 mb-5 ml-[52px]">{txt.subtitle}</p>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder={txt.firstName}
                  value={form.firstName}
                  onChange={(e) => { setForm({ ...form, firstName: e.target.value }); setErrors({ ...errors, firstName: false }) }}
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-neutral-500 focus:outline-none focus:border-empire transition-colors ${errors.firstName ? 'border-red-500' : 'border-white/10'}`}
                />

                <input
                  type="email"
                  placeholder={txt.email}
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: false }) }}
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-neutral-500 focus:outline-none focus:border-empire transition-colors ${errors.email ? 'border-red-500' : 'border-white/10'}`}
                />

                {/* Phone with country selector */}
                <div className={`flex rounded-xl bg-white/5 border overflow-hidden transition-colors ${errors.phone ? 'border-red-500' : 'border-white/10'} focus-within:border-empire`}>
                  <div ref={dropdownRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setCountryOpen(!countryOpen)}
                      className="flex items-center gap-1 px-3 py-3 text-white hover:bg-white/5 transition-colors border-r border-white/10 whitespace-nowrap"
                    >
                      <span className="text-base">{COUNTRIES[countryIdx].flag}</span>
                      <span className="text-sm text-neutral-300">{COUNTRIES[countryIdx].code}</span>
                      <ChevronDown size={12} className="text-neutral-500" />
                    </button>
                    {countryOpen && (
                      <div className="absolute top-full left-0 mt-1 w-56 max-h-52 overflow-y-auto bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-10">
                        {COUNTRIES.map((c, i) => (
                          <button
                            key={`${c.code}-${c.name}`}
                            onClick={() => { setCountryIdx(i); setCountryOpen(false) }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/10 transition-colors ${i === countryIdx ? 'bg-empire/10 text-empire' : 'text-white'}`}
                          >
                            <span className="text-base">{c.flag}</span>
                            <span className="text-sm flex-1">{c.name}</span>
                            <span className="text-xs text-neutral-400">{c.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="tel"
                    placeholder={txt.phone}
                    value={form.phone}
                    onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: false }) }}
                    className="flex-1 px-3 py-3 bg-transparent text-white placeholder:text-neutral-500 focus:outline-none min-w-0"
                  />
                </div>

                {/* Budget */}
                <div>
                  <p className="text-xs text-neutral-400 mb-2">{txt.budgetLabel}</p>
                  <div className={`grid grid-cols-3 gap-2 ${errors.budget ? '[&>button]:border-red-500/50' : ''}`}>
                    <button
                      type="button"
                      onClick={() => { setForm({ ...form, budget: '1000-5000' }); setErrors({ ...errors, budget: false }) }}
                      className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        form.budget === '1000-5000'
                          ? 'bg-empire/15 border-empire/50 text-empire'
                          : 'bg-white/5 border-white/10 text-neutral-300 hover:border-empire/30'
                      }`}
                    >
                      {txt.budget1}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setForm({ ...form, budget: '5000+' }); setErrors({ ...errors, budget: false }) }}
                      className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        form.budget === '5000+'
                          ? 'bg-empire/15 border-empire/50 text-empire'
                          : 'bg-white/5 border-white/10 text-neutral-300 hover:border-empire/30'
                      }`}
                    >
                      {txt.budget2}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setForm({ ...form, budget: 'none' }); setErrors({ ...errors, budget: false }) }}
                      className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        form.budget === 'none'
                          ? 'bg-red-500/10 border-red-500/30 text-red-400'
                          : 'bg-white/5 border-white/10 text-neutral-400 hover:border-white/20'
                      }`}
                    >
                      {txt.noBudget}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-empire text-black font-bold hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    txt.submit
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-empire/20 border border-empire/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-empire" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{txt.successTitle}</h3>
              <p className="text-neutral-300 mb-6">{txt.successText}</p>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
              >
                {txt.close}
              </button>
            </div>
          )}

          {step === 'cancelled' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <XCircle className="text-neutral-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{txt.cancelledTitle}</h3>
              <p className="text-neutral-400 mb-6">{txt.cancelledText}</p>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
              >
                {txt.close}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
