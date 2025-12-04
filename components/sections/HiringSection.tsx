'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Mail, TrendingUp, Users, Zap, Target, DollarSign, Award, Rocket, CheckCircle2 } from 'lucide-react'

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

export default function HiringSection() {
  const { t } = useLanguage()
  const hiring = t.hiring || {}

  return (
    <section className="relative w-full py-20 md:py-32 bg-gradient-to-b from-black via-[#0f0f0f] to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(218,252,104,0.1),transparent)]" />
      
      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <FadeInBlock>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {hiring.title || 'We are hiring'}
              </h1>
              <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
                {hiring.subtitle || 'Join Empire Internet and help us build the world\'s fastest content machine'}
              </p>
            </div>
          </FadeInBlock>

          {/* Company Mission */}
          <FadeInBlock delay={0.1}>
            <div className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-empire">
                {hiring.companyMission?.title || 'Mission de l\'entreprise'}
              </h2>
              <p className="text-neutral-300 mb-4 leading-relaxed">
                {hiring.companyMission?.description || 'Empire Internet transforme 15 minutes d\'interview en plus de 100 contenus optimisés grâce à une IA propriétaire.'}
              </p>
              <p className="text-neutral-300 mb-4 leading-relaxed">
                {hiring.companyMission?.vision || 'Nous construisons la machine de contenu la plus rapide du marché pour entrepreneurs, créateurs et CEOs.'}
              </p>
              <div className="mt-6 space-y-2">
                <div className="flex items-start gap-3">
                  <Rocket className="text-empire mt-1 flex-shrink-0" size={20} />
                  <p className="text-neutral-300">{hiring.companyMission?.ambition1 || 'Devenir la plateforme n°1 mondiale du content automation'}</p>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="text-empire mt-1 flex-shrink-0" size={20} />
                  <p className="text-neutral-300">{hiring.companyMission?.ambition2 || 'Passer de 1M → 10M → 50M/an'}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="text-empire mt-1 flex-shrink-0" size={20} />
                  <p className="text-neutral-300">{hiring.companyMission?.ambition3 || 'Industrialiser la création de contenu comme Shopify l\'a fait pour l\'e-commerce'}</p>
                </div>
              </div>
              <p className="text-empire font-bold mt-6 text-lg">
                {hiring.companyMission?.cta || 'Tu arrives au moment exact où tout explose.'}
              </p>
            </div>
          </FadeInBlock>

          {/* Job Listings */}
          <div className="space-y-12">
            {/* Job 1: Sales Closer */}
            <FadeInBlock delay={0.2}>
              <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">
                      {hiring.salesCloser?.title || 'Sales Closer FR/EN — Poste fondateur'}
                    </h2>
                    <div className="flex flex-wrap gap-3 mt-4">
                      <span className="px-4 py-2 rounded-lg bg-empire/20 text-empire font-semibold text-sm">
                        {hiring.salesCloser?.type || 'Freelance — Remote'}
                      </span>
                      <span className="px-4 py-2 rounded-lg bg-white/10 text-white font-semibold text-sm">
                        {hiring.salesCloser?.compensation || '8k–20k€/mois'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mission */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-empire flex items-center gap-2">
                    <Target size={24} />
                    {hiring.salesCloser?.missionTitle || 'Mission du rôle'}
                  </h3>
                  <p className="text-neutral-300 mb-4 leading-relaxed">
                    {hiring.salesCloser?.missionDescription || 'Tu es la personne qui transforme notre volume massif de leads en clients premium.'}
                  </p>
                  <ul className="space-y-2">
                    {hiring.salesCloser?.responsibilities?.map((resp: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-neutral-300">
                        <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={18} />
                        <span>{resp}</span>
                      </li>
                    )) || [
                      'Prendre en charge les leads entrants (FR + EN)',
                      'Mener les appels de closing (qualification, diagnostic, closing)',
                      'Gérer les objections avec calme et leadership',
                      'Closer l\'offre principale (1 000€/mois / 10 000€/an)',
                      'Upsell les offres premium (3k → 50k)',
                      'Maintenir un pipeline propre et prévisible',
                      'Collaborer directement avec Kevin (fondateur)',
                    ].map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-neutral-300">
                        <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={18} />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-empire font-semibold mt-4">
                    {hiring.salesCloser?.trajectory || 'Trajectoire : Head of Sales en 6–12 mois.'}
                  </p>
                </div>

                {/* Profile */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-empire flex items-center gap-2">
                    <Users size={24} />
                    {hiring.salesCloser?.profileTitle || 'Profil recherché'}
                  </h3>
                  <p className="text-neutral-300 mb-4 leading-relaxed">
                    {hiring.salesCloser?.profileDescription || 'Tu es un closer qui coche ces cases :'}
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {hiring.salesCloser?.requirements?.map((req: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-neutral-300">
                        <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={16} />
                        <span className="text-sm">{req}</span>
                      </div>
                    )) || [
                      'Parfait niveau FR + EN',
                      'Expérience solide en high-ticket',
                      'Aisance avec entrepreneurs, créateurs et CEOs',
                      'Calme, écoute active, intelligence sociale',
                      'Discipline et rigueur (pipeline clean only)',
                      'Mentalité top 1%',
                      'Envie d\'un rôle fondateur, pas d\'un job',
                      'Capacité à performer dans un environnement très rapide',
                    ].map((req, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-neutral-300">
                        <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={16} />
                        <span className="text-sm">{req}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-empire font-bold mt-6 text-lg">
                    {hiring.salesCloser?.motivation || 'Tu veux littéralement : Gagner plus en 12 mois qu\'en 3 ans dans une autre boîte.'}
                  </p>
                </div>

                {/* Compensation */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-empire flex items-center gap-2">
                    <DollarSign size={24} />
                    {hiring.salesCloser?.compensationTitle || 'Rémunération'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-neutral-300 mb-2">
                        <strong className="text-white">{hiring.salesCloser?.fixed || 'Fixe possible'}</strong> : 1 000–2 000€/mois
                      </p>
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-2">{hiring.salesCloser?.variable || 'Variable'}:</p>
                      <ul className="space-y-1 text-neutral-300 ml-4">
                        <li>• 10% sur l'offre principale</li>
                        <li>• 15–20% sur les offres premium</li>
                        <li>• Bonus illimités</li>
                      </ul>
                      <p className="text-empire font-semibold mt-2">
                        {hiring.salesCloser?.currentPerformers || 'Performers actuels : 8 000–20 000€/mois'}
                      </p>
                    </div>
                    <div className="mt-4 p-4 rounded-xl bg-empire/10 border border-empire/30">
                      <p className="text-white font-semibold mb-2 flex items-center gap-2">
                        <Award size={20} />
                        {hiring.salesCloser?.equityTitle || 'Équity'}
                      </p>
                      <p className="text-neutral-300 text-sm mb-2">
                        {hiring.salesCloser?.equityDescription || 'Après 6 mois de performance prouvée :'}
                      </p>
                      <ul className="space-y-1 text-neutral-300 text-sm ml-4">
                        <li>• Phantom shares : 0.25% → 1%</li>
                        <li>• Vesting 4 ans</li>
                        <li>• Cliff 12 mois</li>
                      </ul>
                      <p className="text-empire font-semibold mt-2 text-sm">
                        {hiring.salesCloser?.equityCta || 'Tu deviens partenaire de la croissance.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Why Unique */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-empire">
                    {hiring.salesCloser?.whyUniqueTitle || 'Pourquoi ce rôle est unique'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {hiring.salesCloser?.uniquePoints?.map((point: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-neutral-300">
                        <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={16} />
                        <span className="text-sm">{point}</span>
                      </div>
                    )) || [
                      '100% leads entrants (YouTube, LinkedIn, communauté)',
                      'Produit validé, market fit clair',
                      'Croissance organique explosive',
                      'Tu construis le département Sales',
                      'Accès direct au fondateur',
                      'Ascension rapide vers Head of Sales',
                      'Full remote',
                      'Culture de vitesse, excellence, ownership',
                      'Zéro politique interne, zéro bullshit',
                    ].map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-neutral-300">
                        <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={16} />
                        <span className="text-sm">{point}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-empire font-bold mt-6 text-lg">
                    {hiring.salesCloser?.finalCta || 'Tu arrives juste avant l\'explosion. Tu peux prendre une part de la fusée.'}
                  </p>
                </div>

                {/* Apply */}
                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-xl font-bold mb-4 text-empire flex items-center gap-2">
                    <Mail size={24} />
                    {hiring.salesCloser?.applyTitle || 'Pour postuler'}
                  </h3>
                  <p className="text-neutral-300 mb-4 leading-relaxed">
                    {hiring.salesCloser?.applyDescription || 'Envoie une vidéo de 1 minute (FR + EN) dans laquelle tu :'}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {hiring.salesCloser?.applyPoints?.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-neutral-300">
                        <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={18} />
                        <span>{point}</span>
                      </li>
                    )) || [
                      'Te présentes',
                      'Pitches Empire Internet',
                      'Explique pourquoi tu veux un rôle fondateur',
                      'Partages ton track record',
                    ].map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-neutral-300">
                        <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={18} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-neutral-300 text-lg">
                    {hiring.salesCloser?.applyButton || 'Envoyer à :'} <span className="text-empire font-semibold">{hiring.salesCloser?.email || 'kevin@empire-internet.com'}</span>
                  </p>
                </div>
              </div>
            </FadeInBlock>

            {/* Job 2: Customer Success */}
            <FadeInBlock delay={0.3}>
              <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">
                      {hiring.customerSuccess?.title || 'Customer Success & Community Coordinator'}
                    </h2>
                    <div className="flex flex-wrap gap-3 mt-4">
                      <span className="px-4 py-2 rounded-lg bg-empire/20 text-empire font-semibold text-sm">
                        {hiring.customerSuccess?.type || 'CDI ou freelance longue durée — Remote'}
                      </span>
                      <span className="px-4 py-2 rounded-lg bg-white/10 text-white font-semibold text-sm">
                        {hiring.customerSuccess?.compensation || '1 000 – 2 000€/mois + bonus upsells'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mission */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-empire flex items-center gap-2">
                    <Target size={24} />
                    {hiring.customerSuccess?.missionTitle || 'Mission en une phrase'}
                  </h3>
                  <p className="text-neutral-300 mb-6 leading-relaxed text-lg">
                    {hiring.customerSuccess?.missionDescription || 'Aider les clients existants à réussir, rester motivés et utiliser Empire Internet à 100%, et proposer un upsell lorsqu\'il est pertinent.'}
                  </p>
                </div>

                {/* Responsibilities */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-empire flex items-center gap-2">
                    <Users size={24} />
                    {hiring.customerSuccess?.responsibilitiesTitle || 'Responsabilités'}
                  </h3>
                  
                  {/* Customer Success */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 text-white">1. Customer Success</h4>
                    <ul className="space-y-2">
                      {hiring.customerSuccess?.customerSuccessTasks?.map((task: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-neutral-300">
                          <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={18} />
                          <span>{task}</span>
                        </li>
                      )) || [
                        'Répondre aux messages clients',
                        'Maintenir une relation saine et durable',
                        'Vérifier qu\'ils utilisent bien Empire Internet',
                        'Relancer les clients inactifs',
                        'Clarifier les routines et étapes',
                        'Résoudre les petits blocages',
                        'Remonter les feedbacks clients',
                        'Maintenir un churn bas',
                      ].map((task, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-neutral-300">
                          <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={18} />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-empire font-semibold mt-3">
                      {hiring.customerSuccess?.customerSuccessGoal || 'Objectif : que chaque client se sente accompagné et motivé.'}
                    </p>
                  </div>

                  {/* Community */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 text-white">2. Motivation et Communauté</h4>
                    <ul className="space-y-2">
                      {hiring.customerSuccess?.communityTasks?.map((task: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-neutral-300">
                          <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={18} />
                          <span>{task}</span>
                        </li>
                      )) || [
                        'Animer la communauté (School / WhatsApp / Discord)',
                        'Répondre aux questions',
                        'Encourager, féliciter, motiver',
                        'Partager les victoires des clients',
                        'Organiser 1 challenge/mois :',
                      ].map((task, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-neutral-300">
                          <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={18} />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="ml-6 mt-2 space-y-1 text-neutral-400 text-sm">
                      <p>• 7 jours = 7 posts</p>
                      <p>• 30 jours = 30 vidéos</p>
                      <p>• Routine contenu 5 jours</p>
                      <p>• YouTube 0 → 1</p>
                    </div>
                    <p className="text-empire font-semibold mt-3">
                      {hiring.customerSuccess?.communityGoal || 'Objectif : garder les clients engagés au quotidien.'}
                    </p>
                  </div>

                  {/* Upsells */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-white">3. Upsells (soft, sans pression)</h4>
                    <ul className="space-y-2">
                      {hiring.customerSuccess?.upsellTasks?.map((task: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-neutral-300">
                          <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={18} />
                          <span>{task}</span>
                        </li>
                      )) || [
                        'Proposer l\'offre annuelle (10k)',
                        'Proposer coaching / VIP quand pertinent',
                        'Relancer doucement les opportunités',
                      ].map((task, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-neutral-300">
                          <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={18} />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-empire font-semibold mt-3">
                      {hiring.customerSuccess?.upsellGoal || 'Objectif : augmenter la LTV naturellement.'}
                    </p>
                  </div>
                </div>

                {/* Profile */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-empire flex items-center gap-2">
                    <Users size={24} />
                    {hiring.customerSuccess?.profileTitle || 'Profil recherché (réaliste pour 1 000–2 000€/mois)'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {hiring.customerSuccess?.requirements?.map((req: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-neutral-300">
                        <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={16} />
                        <span className="text-sm">{req}</span>
                      </div>
                    )) || [
                      'Excellent relationnel',
                      'Bonne énergie',
                      'À l\'aise au téléphone',
                      'Fiable et organisée',
                      'Bonne communication écrite',
                      'Empathique, motivante',
                      'Comprend l\'univers des entrepreneurs / créateurs',
                      'Aime aider',
                      'Prend des initiatives',
                    ].map((req, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-neutral-300">
                        <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={16} />
                        <span className="text-sm">{req}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-neutral-300 mt-4 italic">
                    {hiring.customerSuccess?.note || 'Pas besoin d\'être experte : formation full interne.'}
                  </p>
                </div>

                {/* Compensation */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-empire flex items-center gap-2">
                    <DollarSign size={24} />
                    {hiring.customerSuccess?.compensationTitle || 'Rémunération'}
                  </h3>
                  <div className="space-y-3 text-neutral-300">
                    <p>
                      <strong className="text-white">{hiring.customerSuccess?.base || 'Base'}</strong> : 1 000 – 2 000€/mois
                    </p>
                    <p>
                      <strong className="text-white">{hiring.customerSuccess?.bonus || 'Bonus upsells'}</strong> : 5–10%
                    </p>
                    <p>
                      <strong className="text-white">{hiring.customerSuccess?.access || 'Accès gratuit'}</strong> à Empire Internet (valeur 1 000€/mois)
                    </p>
                    <p>
                      <strong className="text-white">{hiring.customerSuccess?.evolutive || 'Évolutif'}</strong> après 6 mois
                    </p>
                    <p className="text-empire font-semibold mt-4">
                      {hiring.customerSuccess?.total || 'Avec les upsells, le total peut monter à 1 500 – 3 000€/mois.'}
                    </p>
                  </div>
                </div>

                {/* Why Key */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-empire">
                    {hiring.customerSuccess?.whyKeyTitle || 'Pourquoi ce rôle est clé pour toi'}
                  </h3>
                  <p className="text-neutral-300 mb-4 leading-relaxed">
                    {hiring.customerSuccess?.whyKeyDescription || 'Cette personne te retire :'}
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    {hiring.customerSuccess?.whyKeyPoints?.map((point: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-neutral-300">
                        <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={16} />
                        <span className="text-sm">{point}</span>
                      </div>
                    )) || [
                      'Le support',
                      'La gestion de communauté',
                      'La motivation clients',
                      'Les relances',
                      'Les upsells simples',
                      'Les retours / blocages',
                      'Les demandes quotidiennes',
                    ].map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-neutral-300">
                        <CheckCircle2 className="text-empire mt-1 flex-shrink-0" size={16} />
                        <span className="text-sm">{point}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-empire font-bold text-lg">
                    {hiring.customerSuccess?.whyKeyCta || 'Tu récupères 10–15 heures/semaine. Tu peux te concentrer sur YouTube, scaling, produit et vision.'}
                  </p>
                </div>

                {/* Apply */}
                <div className="pt-6 border-t border-white/10">
                  <p className="text-neutral-300 text-lg">
                    {hiring.customerSuccess?.applyButton || 'Postuler à :'} <span className="text-empire font-semibold">{hiring.customerSuccess?.email || 'kevin@empire-internet.com'}</span>
                  </p>
                </div>
              </div>
            </FadeInBlock>
          </div>
        </div>
      </div>
    </section>
  )
}
