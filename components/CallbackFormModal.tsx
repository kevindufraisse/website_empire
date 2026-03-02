'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Phone, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

type Step = 'info' | 'budget' | 'success' | 'cancelled'

interface CallbackFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CallbackFormModal({ isOpen, onClose }: CallbackFormModalProps) {
  const { lang } = useLanguage()
  const [step, setStep] = useState<Step>('info')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ firstName: '', email: '', phone: '' })
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const t = {
    fr: {
      title: 'Être recontacté',
      subtitle: 'Laissez vos coordonnées, on vous rappelle rapidement',
      firstName: 'Prénom',
      email: 'Email',
      phone: 'Téléphone',
      next: 'Suivant',
      budgetTitle: 'Quel est votre budget mensuel ?',
      budgetSubtitle: 'Cela nous aide à préparer la meilleure offre pour vous',
      budget1: '1 000€ - 5 000€ / mois',
      budget2: '+ 5 000€ / mois',
      noBudget: 'Je n\'ai pas de budget',
      successTitle: 'Parfait !',
      successText: 'On vous recontacte très vite. Gardez votre téléphone à portée de main.',
      cancelledTitle: 'Pas de souci',
      cancelledText: 'N\'hésitez pas à revenir quand vous serez prêt. En attendant, regardez notre vidéo de démo.',
      close: 'Fermer',
    },
    en: {
      title: 'Get a callback',
      subtitle: 'Leave your details, we\'ll get back to you quickly',
      firstName: 'First name',
      email: 'Email',
      phone: 'Phone',
      next: 'Next',
      budgetTitle: 'What\'s your monthly budget?',
      budgetSubtitle: 'This helps us prepare the best offer for you',
      budget1: '€1,000 - €5,000 / month',
      budget2: '€5,000+ / month',
      noBudget: 'I don\'t have a budget',
      successTitle: 'Perfect!',
      successText: 'We\'ll get back to you very soon. Keep your phone close.',
      cancelledTitle: 'No worries',
      cancelledText: 'Feel free to come back when you\'re ready. In the meantime, check out our demo video.',
      close: 'Close',
    },
  }

  const txt = lang === 'fr' ? t.fr : t.en

  function handleClose() {
    setStep('info')
    setForm({ firstName: '', email: '', phone: '' })
    setErrors({})
    setLoading(false)
    onClose()
  }

  function validateInfo() {
    const newErrors: Record<string, boolean> = {}
    if (!form.firstName.trim()) newErrors.firstName = true
    if (!form.email.trim() || !form.email.includes('@')) newErrors.email = true
    if (!form.phone.trim()) newErrors.phone = true
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleNext() {
    if (validateInfo()) {
      setStep('budget')
    }
  }

  async function handleBudgetSelect(budget: string) {
    if (budget === 'none') {
      setStep('cancelled')
      return
    }

    setLoading(true)
    try {
      await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          email: form.email,
          phone: form.phone,
          budget,
        }),
      })
      setStep('success')
    } catch {
      setStep('success')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
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

          {step === 'info' && (
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-empire/10 border border-empire/30 flex items-center justify-center">
                  <Phone className="text-empire" size={18} />
                </div>
                <h3 className="text-xl font-bold text-white">{txt.title}</h3>
              </div>
              <p className="text-sm text-neutral-400 mb-6 ml-[52px]">{txt.subtitle}</p>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder={txt.firstName}
                    value={form.firstName}
                    onChange={(e) => { setForm({ ...form, firstName: e.target.value }); setErrors({ ...errors, firstName: false }) }}
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-neutral-500 focus:outline-none focus:border-empire transition-colors ${errors.firstName ? 'border-red-500' : 'border-white/10'}`}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder={txt.email}
                    value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: false }) }}
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-neutral-500 focus:outline-none focus:border-empire transition-colors ${errors.email ? 'border-red-500' : 'border-white/10'}`}
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder={txt.phone}
                    value={form.phone}
                    onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: false }) }}
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-neutral-500 focus:outline-none focus:border-empire transition-colors ${errors.phone ? 'border-red-500' : 'border-white/10'}`}
                  />
                </div>
                <button
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-empire text-black font-bold hover:scale-[1.02] transition-transform"
                >
                  {txt.next}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 'budget' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{txt.budgetTitle}</h3>
              <p className="text-sm text-neutral-400 mb-6">{txt.budgetSubtitle}</p>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="text-empire animate-spin" size={32} />
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => handleBudgetSelect('1000-5000')}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:border-empire/50 hover:bg-empire/5 transition-all text-left"
                  >
                    {txt.budget1}
                  </button>
                  <button
                    onClick={() => handleBudgetSelect('5000+')}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:border-empire/50 hover:bg-empire/5 transition-all text-left"
                  >
                    {txt.budget2}
                  </button>
                  <button
                    onClick={() => handleBudgetSelect('none')}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-neutral-400 text-sm hover:border-red-500/30 hover:text-red-400 transition-all text-left"
                  >
                    {txt.noBudget}
                  </button>
                </div>
              )}
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
    </AnimatePresence>
  )
}
