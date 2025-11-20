'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Phone, TrendingUp, MessageSquare, Loader2, User, Mail, ChevronRight, ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

// Fonction pour calculer les 3 prochaines dates disponibles (mardis et jeudis à 12h30 heure de Paris)
function getNextAvailableDates(): Date[] {
  const dates: Date[] = []
  
  // Obtenir l'heure actuelle en heure de Paris
  const now = new Date()
  const parisTimeString = now.toLocaleString('en-US', { timeZone: 'Europe/Paris' })
  const parisTime = new Date(parisTimeString)
  
  // Créer une date de référence en heure de Paris pour aujourd'hui à 12h30
  const today = new Date(parisTime)
  today.setHours(12, 30, 0, 0)
  
  // Si on est déjà après 12h30 aujourd'hui, commencer à demain
  let currentDate = new Date(today)
  if (parisTime.getHours() > 12 || (parisTime.getHours() === 12 && parisTime.getMinutes() >= 30)) {
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  // Trouver les 3 prochains mardis ou jeudis
  while (dates.length < 3) {
    const dayOfWeek = currentDate.getDay() // 0 = dimanche, 2 = mardi, 4 = jeudi
    
    if (dayOfWeek === 2 || dayOfWeek === 4) { // Mardi ou jeudi
      // Créer une nouvelle date pour éviter les références mutables
      const dateToAdd = new Date(currentDate)
      dates.push(dateToAdd)
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return dates
}

// Formatage de la date en français (pour l'affichage)
function formatDate(date: Date): string {
  const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  
  const dayName = days[date.getDay()]
  const day = date.getDate()
  const month = months[date.getMonth()]
  
  return `${dayName} ${day} ${month}`
}

// Formatage de la date au format YYYY-MM-DD (pour le webhook)
function formatDateYYYYMMDD(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

// Options de CA (Chiffre d'Affaires)
const CA_OPTIONS = [
  { value: '0-10k', label: '0 - 10K€ / mois' },
  { value: '10k-50k', label: '10K - 50K€ / mois' },
  { value: '50k-100k', label: '50K - 100K€ / mois' },
  { value: '100k-500k', label: '100K - 500K€ / mois' },
  { value: '500k+', label: '500K€+ / mois' },
]

// Indicatifs téléphoniques par pays
const PHONE_COUNTRY_CODES = [
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+1', country: 'États-Unis / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'Royaume-Uni', flag: '🇬🇧' },
  { code: '+49', country: 'Allemagne', flag: '🇩🇪' },
  { code: '+39', country: 'Italie', flag: '🇮🇹' },
  { code: '+34', country: 'Espagne', flag: '🇪🇸' },
  { code: '+41', country: 'Suisse', flag: '🇨🇭' },
  { code: '+32', country: 'Belgique', flag: '🇧🇪' },
  { code: '+31', country: 'Pays-Bas', flag: '🇳🇱' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+46', country: 'Suède', flag: '🇸🇪' },
  { code: '+47', country: 'Norvège', flag: '🇳🇴' },
  { code: '+45', country: 'Danemark', flag: '🇩🇰' },
  { code: '+61', country: 'Australie', flag: '🇦🇺' },
  { code: '+81', country: 'Japon', flag: '🇯🇵' },
  { code: '+86', country: 'Chine', flag: '🇨🇳' },
  { code: '+91', country: 'Inde', flag: '🇮🇳' },
  { code: '+55', country: 'Brésil', flag: '🇧🇷' },
  { code: '+52', country: 'Mexique', flag: '🇲🇽' },
  { code: '+971', country: 'Émirats arabes unis', flag: '🇦🇪' },
  { code: '+65', country: 'Singapour', flag: '🇸🇬' },
  { code: '+27', country: 'Afrique du Sud', flag: '🇿🇦' },
]

const WEBHOOK_URL = 'https://hook.eu1.make.com/nr6udbulszt4jfwtj1y1xngkzglekjwf'

export default function DemoPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [step, setStep] = useState(1)
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  
  // Étape 1 : Date
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  
  // Étape 2 : Questions
  const [ca, setCa] = useState('')
  const [questions, setQuestions] = useState('')
  
  // Étape 3 : Informations personnelles
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneCountryCode, setPhoneCountryCode] = useState('+33')
  const [phoneNumber, setPhoneNumber] = useState('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setAvailableDates(getNextAvailableDates())
  }, [])

  const handleNext = () => {
    setError('')
    
    if (step === 1) {
      if (!selectedDate) {
        setError(t.demo.errorDate)
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!ca) {
        setError(t.demo.errorCA)
        return
      }
      setStep(3)
    }
  }

  const handlePrevious = () => {
    setError('')
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!firstName.trim()) {
      setError(t.demo.errorFirstName)
      return
    }

    if (!lastName.trim()) {
      setError(t.demo.errorLastName)
      return
    }

    if (!email.trim()) {
      setError(t.demo.errorEmail)
      return
    }

    if (!phoneNumber.trim()) {
      setError(t.demo.errorPhone)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate?.toISOString(),
          dateFormatted: selectedDate ? formatDateYYYYMMDD(selectedDate) : null,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: `${phoneCountryCode} ${phoneNumber.trim()}`,
          ca: ca,
          questions: questions.trim() || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi')
      }

      // Rediriger vers la page de remerciement
      router.push('/demo/thank-you')
    } catch (err) {
      console.error('Error submitting form:', err)
      setError(t.demo.errorSubmit)
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black via-[#0f0f0f] to-black pt-24 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(218,252,104,0.1),transparent)]" />
      
      <div className="container py-12 md:py-20 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-empire/30">
                <Image
                  src="https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/event-covers/ze/cc3ea0bd-f389-48b2-af3e-87f8dacdc687.png"
                  alt="Kevin Dufraisse"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t.demo.title}
              <br />
              <span className="text-empire">{t.demo.titleWith}</span>
            </h1>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              {t.demo.subtitle}
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step >= s
                        ? 'bg-empire text-black'
                        : 'bg-white/10 text-neutral-400'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`h-1 w-12 transition-all ${
                        step > s ? 'bg-empire' : 'bg-white/10'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-neutral-400">
              {step === 1 && t.demo.step1}
              {step === 2 && t.demo.step2}
              {step === 3 && t.demo.step3}
            </p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-empire/5 via-transparent to-blue-500/5 pointer-events-none" />
            
            <form onSubmit={handleSubmit} className="relative z-10">
              <AnimatePresence mode="wait">
                {/* Étape 1 : Sélection de la date */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="flex items-center gap-2 text-white font-semibold mb-4">
                        <Calendar className="text-empire" size={20} />
                        {t.demo.dateLabel}
                      </label>
                      <div className="grid gap-3">
                        {availableDates.map((date, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedDate(date)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              selectedDate?.getTime() === date.getTime()
                                ? 'border-empire bg-empire/10 shadow-[0_0_20px_rgba(218,252,104,0.3)]'
                                : 'border-white/10 bg-white/5 hover:border-empire/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white font-semibold">{formatDate(date)}</p>
                                <p className="text-sm text-neutral-400">{t.demo.dateTime}</p>
                              </div>
                              {selectedDate?.getTime() === date.getTime() && (
                                <div className="w-6 h-6 rounded-full bg-empire flex items-center justify-center">
                                  <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!selectedDate}
                        className="px-8 py-4 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                      >
                        {t.demo.next}
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Étape 2 : Questions */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="flex items-center gap-2 text-white font-semibold mb-2">
                        <TrendingUp className="text-empire" size={20} />
                        {t.demo.caLabel}
                      </label>
                      <select
                        value={ca}
                        onChange={(e) => setCa(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-empire focus:ring-2 focus:ring-empire/20 transition-all"
                        required
                      >
                        <option value="">{t.demo.caPlaceholder}</option>
                        {CA_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value} className="bg-black">
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-white font-semibold mb-2">
                        <MessageSquare className="text-empire" size={20} />
                        {t.demo.questionsLabel}
                      </label>
                      <textarea
                        value={questions}
                        onChange={(e) => setQuestions(e.target.value)}
                        placeholder={t.demo.questionsPlaceholder}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-empire focus:ring-2 focus:ring-empire/20 transition-all resize-none"
                      />
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-xl hover:border-empire hover:bg-empire/10 transition-all flex items-center gap-2"
                      >
                        <ChevronLeft size={20} />
                        {t.demo.previous}
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!ca}
                        className="px-8 py-4 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                      >
                        {t.demo.next}
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Étape 3 : Informations personnelles */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-white font-semibold mb-2">
                          <User className="text-empire" size={20} />
                          {t.demo.firstNameLabel}
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder={t.demo.firstNamePlaceholder}
                          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-empire focus:ring-2 focus:ring-empire/20 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-white font-semibold mb-2">
                          <User className="text-empire" size={20} />
                          {t.demo.lastNameLabel}
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder={t.demo.lastNamePlaceholder}
                          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-empire focus:ring-2 focus:ring-empire/20 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-white font-semibold mb-2">
                        <Mail className="text-empire" size={20} />
                        {t.demo.emailLabel}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.demo.emailPlaceholder}
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-empire focus:ring-2 focus:ring-empire/20 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-white font-semibold mb-2">
                        <Phone className="text-empire" size={20} />
                        {t.demo.phoneLabel}
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={phoneCountryCode}
                          onChange={(e) => setPhoneCountryCode(e.target.value)}
                          className="px-3 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-empire focus:ring-2 focus:ring-empire/20 transition-all"
                        >
                          {PHONE_COUNTRY_CODES.map((country) => (
                            <option key={country.code} value={country.code} className="bg-black">
                              {country.flag} {country.code}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder={t.demo.phonePlaceholder}
                          className="flex-1 px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-empire focus:ring-2 focus:ring-empire/20 transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-xl hover:border-empire hover:bg-empire/10 transition-all flex items-center gap-2"
                      >
                        <ChevronLeft size={20} />
                        {t.demo.previous}
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-4 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            {t.demo.submitting}
                          </>
                        ) : (
                          <>
                            {t.demo.submit}
                            <ChevronRight size={20} />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 p-6 rounded-xl bg-white/5 border border-white/10"
          >
            <h3 className="text-xl font-bold text-white mb-3">{t.demo.aboutTitle}</h3>
            <p className="text-neutral-300 leading-relaxed mb-4">
              {t.demo.aboutText1}
            </p>
            <p className="text-neutral-300 leading-relaxed">
              {t.demo.aboutText2}
            </p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-neutral-400">{t.demo.aboutPresentedBy}</p>
              <p className="text-empire font-bold">empire</p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
