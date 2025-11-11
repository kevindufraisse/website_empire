'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Shield, CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import { PRICING } from '@/lib/pricing-config'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function GuaranteeSection() {
  const { lang } = useLanguage()

  return (
    <section className="container py-20 md:py-32">
      <div className="max-w-4xl mx-auto">
        <FadeInBlock>
          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-green-500/10 to-transparent border-2 border-green-500/30 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.15),transparent)]" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/30 to-green-500/10 border-2 border-green-400 flex items-center justify-center">
                  <Shield className="text-green-400" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {lang === 'fr' ? 'Essai Sans Risque' : 'Try Risk-Free'}
                  </h3>
                  <p className="text-green-400 font-semibold">
                    {lang === 'fr' ? 'Testez avant de vous engager' : 'Test before you commit'}
                  </p>
                </div>
              </div>

              <p className="text-lg md:text-xl text-neutral-200 mb-8 leading-relaxed">
                {lang === 'fr' 
                  ? `Commencez avec notre plan hebdomadaire (€${PRICING.weekly}). Voyez la qualité. Si vous n'êtes pas satisfait, annulez à tout moment. Sans questions.`
                  : `Start with our weekly plan (€${PRICING.weekly}). See the quality. If you're not happy, cancel anytime. No questions asked.`}
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-empire/20 border border-empire flex items-center justify-center">
                    <Clock className="text-empire" size={24} />
                  </div>
                  <p className="font-bold text-white mb-1">
                    {lang === 'fr' ? 'Aujourd\'hui' : 'Today'}
                  </p>
                  <p className="text-sm text-neutral-400">
                    {lang === 'fr' ? 'Enregistrez votre interview' : 'Record your interview'}
                  </p>
                </div>

                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-empire/20 border border-empire flex items-center justify-center">
                    <TrendingUp className="text-empire" size={24} />
                  </div>
                  <p className="font-bold text-white mb-1">
                    {lang === 'fr' ? '24-48h' : '24-48h'}
                  </p>
                  <p className="text-sm text-neutral-400">
                    {lang === 'fr' ? 'Contenu livré' : 'Content delivered'}
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-empire/20 to-empire/5 rounded-xl border-2 border-empire">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-empire/30 border border-empire flex items-center justify-center">
                    <CheckCircle2 className="text-empire" size={24} />
                  </div>
                  <p className="font-bold text-empire mb-1">
                    {lang === 'fr' ? 'Votre décision' : 'Your call'}
                  </p>
                  <p className="text-sm text-neutral-400">
                    {lang === 'fr' ? 'Continuer ou arrêter' : 'Continue or stop'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
                <CheckCircle2 className="text-green-400" size={16} />
                <span>
                  {lang === 'fr' 
                    ? 'Aucun engagement · Aucune pénalité d\'annulation · Qualité garantie'
                    : 'No commitment · No cancellation penalty · Quality guaranteed'}
                </span>
              </div>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

