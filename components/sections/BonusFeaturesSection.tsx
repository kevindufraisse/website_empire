'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Bot, Globe2, Languages, Users, Zap, Workflow } from 'lucide-react'

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

export default function BonusFeaturesSection() {
  const { lang } = useLanguage()

  return (
    <section id="bonus-features" className="container py-20 md:py-32">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <FadeInBlock>
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 rounded-full bg-empire/20 border border-empire/30 mb-4">
              <p className="text-sm font-bold text-empire">
                {lang === 'fr' ? 'BONUS INCLUS' : 'BONUS INCLUDED'}
              </p>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {lang === 'fr' ? 'Multipliez Votre Portée par ' : 'Multiply Your Reach '}
              <span className="text-empire">100x</span>
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              {lang === 'fr' 
                ? 'Tout votre contenu peut être traduit et diffusé sur plusieurs comptes sociaux. Devenez une référence mondiale.'
                : 'All your content can be translated and published across multiple social accounts. Become a global authority.'}
            </p>
          </div>
        </FadeInBlock>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* API Multi-diffusion */}
          <FadeInBlock delay={0.1}>
            <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-500/30 hover:border-blue-500/50 transition-all overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent)]" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/20 border-2 border-blue-400 flex items-center justify-center">
                    <Globe2 className="text-blue-400" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {lang === 'fr' ? 'API Multi-diffusion' : 'Multi-Distribution API'}
                    </h3>
                  </div>
                </div>

                <p className="text-lg text-neutral-200 mb-6 leading-relaxed font-semibold">
                  {lang === 'fr' 
                    ? 'Traduisez et publiez votre contenu sur plusieurs comptes sociaux simultanément.'
                    : 'Translate and publish your content across multiple social accounts simultaneously.'}
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                      <Languages className="text-blue-400" size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-1">
                        {lang === 'fr' ? 'Traduction automatique' : 'Auto-translation'}
                      </p>
                      <p className="text-sm text-neutral-400">
                        {lang === 'fr' 
                          ? 'Votre contenu en 10+ langues (EN, ES, DE, IT, PT, etc.)'
                          : 'Your content in 10+ languages (EN, ES, DE, IT, PT, etc.)'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                      <Users className="text-blue-400" size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-1">
                        {lang === 'fr' ? 'Multi-comptes illimités' : 'Unlimited multi-accounts'}
                      </p>
                      <p className="text-sm text-neutral-400">
                        {lang === 'fr' 
                          ? 'Publiez sur 10 comptes LinkedIn, 5 comptes IG, etc.'
                          : 'Publish to 10 LinkedIn accounts, 5 IG accounts, etc.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                      <Workflow className="text-blue-400" size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-1">
                        {lang === 'fr' ? 'Workflows automatisés' : 'Automated workflows'}
                      </p>
                      <p className="text-sm text-neutral-400">
                        {lang === 'fr' 
                          ? 'Templates N8N & Make pré-configurés'
                          : 'Pre-built N8N & Make templates'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/10 border border-blue-500/30">
                  <p className="text-sm font-semibold text-blue-300 mb-2">
                    {lang === 'fr' ? '💡 Résultat :' : '💡 Result:'}
                  </p>
                  <p className="text-sm text-neutral-200">
                    {lang === 'fr' 
                      ? '1 interview → 30 posts EN → auto-traduits en FR, ES, DE... → publiés sur 20+ comptes'
                      : '1 interview → 30 posts EN → auto-translated to FR, ES, DE... → published to 20+ accounts'}
                  </p>
                </div>
              </div>
            </div>
          </FadeInBlock>

          {/* LinkedIn AI Setter */}
          <FadeInBlock delay={0.2}>
            <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/30 hover:border-purple-500/50 transition-all overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.15),transparent)]" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/20 border-2 border-purple-400 flex items-center justify-center">
                    <Bot className="text-purple-400" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {lang === 'fr' ? 'LinkedIn AI Setter' : 'LinkedIn AI Setter'}
                    </h3>
                  </div>
                </div>

                <p className="text-lg text-neutral-200 mb-6 leading-relaxed font-semibold">
                  {lang === 'fr' 
                    ? 'Un agent IA engage et qualifie vos prospects LinkedIn pendant que vous dormez.'
                    : 'An AI agent engages and qualifies your LinkedIn prospects while you sleep.'}
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                      <Zap className="text-purple-400" size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-1">
                        {lang === 'fr' ? 'Prospection automatique' : 'Automated prospecting'}
                      </p>
                      <p className="text-sm text-neutral-400">
                        {lang === 'fr' 
                          ? 'L\'IA identifie et engage vos prospects idéaux'
                          : 'AI identifies and engages your ideal prospects'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="text-purple-400" size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-1">
                        {lang === 'fr' ? 'Conversations naturelles' : 'Natural conversations'}
                      </p>
                      <p className="text-sm text-neutral-400">
                        {lang === 'fr' 
                          ? 'L\'IA converse comme un humain, pas un robot'
                          : 'AI converses like a human, not a robot'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                      <Users className="text-purple-400" size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-1">
                        {lang === 'fr' ? 'Leads qualifiés' : 'Qualified leads'}
                      </p>
                      <p className="text-sm text-neutral-400">
                        {lang === 'fr' 
                          ? 'Vous ne parlez qu\'aux prospects chauds et prêts'
                          : 'You only talk to warm, ready prospects'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30">
                  <p className="text-sm font-semibold text-purple-300 mb-2">
                    {lang === 'fr' ? '💡 Résultat :' : '💡 Result:'}
                  </p>
                  <p className="text-sm text-neutral-200">
                    {lang === 'fr' 
                      ? 'Pipeline de prospects LinkedIn qualifiés sans lever le petit doigt'
                      : 'Pipeline of qualified LinkedIn prospects without lifting a finger'}
                  </p>
                </div>
              </div>
            </div>
          </FadeInBlock>
        </div>

        {/* Impact Message */}
        <FadeInBlock delay={0.3}>
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <p className="text-2xl md:text-3xl font-bold text-white mb-4">
              {lang === 'fr' 
                ? 'Créez une fois. Diffusez partout. En toutes langues.'
                : 'Create once. Distribute everywhere. In all languages.'}
            </p>
            <p className="text-lg text-neutral-300">
              {lang === 'fr' 
                ? 'C\'est comme ça qu\'on devient une référence mondiale, pas juste locale.'
                : 'This is how you become a global authority, not just a local one.'}
            </p>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

