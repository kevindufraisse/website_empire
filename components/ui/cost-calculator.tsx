'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp, Clock, DollarSign, Users, Zap } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import NumberTicker from '@/components/magicui/number-ticker'

export function CostCalculator() {
  const { lang } = useLanguage()
  
  // User inputs
  const [postsPerWeek, setPostsPerWeek] = useState(7) // 30 posts/month = ~7/week
  const [platforms, setPlatforms] = useState(6)
  
  // Calculation constants
  const HOURLY_RATES = {
    copywriter: 50, // €/hour
    videoEditor: 60, // €/hour
    designer: 55, // €/hour
    socialManager: 45, // €/hour
  }
  
  const TIME_PER_CONTENT = {
    linkedinPost: 1, // hours
    newsletter: 2,
    reel: 3,
    carousel: 2,
    thread: 1.5,
    podcast: 4,
  }
  
  // Calculate DIY costs
  const linkedinPosts = postsPerWeek
  const newsletters = postsPerWeek
  const reels = postsPerWeek
  const carousels = Math.ceil(postsPerWeek / 7)
  const threads = postsPerWeek
  const podcasts = 1 // per week
  
  // Time calculation (hours per week)
  const timePerWeek = 
    linkedinPosts * TIME_PER_CONTENT.linkedinPost +
    newsletters * TIME_PER_CONTENT.newsletter +
    reels * TIME_PER_CONTENT.reel +
    carousels * TIME_PER_CONTENT.carousel +
    threads * TIME_PER_CONTENT.thread +
    podcasts * TIME_PER_CONTENT.podcast
  
  // Cost calculation (per week)
  const costPerWeek = 
    linkedinPosts * TIME_PER_CONTENT.linkedinPost * HOURLY_RATES.copywriter +
    newsletters * TIME_PER_CONTENT.newsletter * HOURLY_RATES.copywriter +
    reels * TIME_PER_CONTENT.reel * HOURLY_RATES.videoEditor +
    carousels * TIME_PER_CONTENT.carousel * HOURLY_RATES.designer +
    threads * TIME_PER_CONTENT.thread * HOURLY_RATES.copywriter +
    podcasts * TIME_PER_CONTENT.podcast * HOURLY_RATES.videoEditor
  
  // Monthly values
  const timePerMonth = Math.round(timePerWeek * 4.3)
  const costPerMonth = Math.round(costPerWeek * 4.3)
  const costPerYear = Math.round(costPerMonth * 12)
  
  // Empire savings
  const empireCost = 1000
  const savingsPerMonth = costPerMonth - empireCost
  const savingsPerYear = costPerYear - (empireCost * 12)
  const roiPercentage = Math.round((savingsPerMonth / empireCost) * 100)

  return (
    <div className="relative p-8 rounded-2xl bg-gradient-to-br from-empire/10 via-transparent to-purple-500/10 border-2 border-empire/30 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-empire/10 via-transparent to-purple-500/10 blur-3xl opacity-50" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-empire/20 border border-empire/30 mb-4">
            <Calculator className="text-empire" size={20} />
            <span className="text-sm font-bold text-empire">
              {lang === 'fr' ? 'CALCULETTE ROI' : 'ROI CALCULATOR'}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {lang === 'fr' 
              ? 'Combien ça coûterait de le faire vous-même ?' 
              : 'How much would it cost to do it yourself?'}
          </h3>
          <p className="text-neutral-400">
            {lang === 'fr'
              ? 'Calculez le coût réel de la création de contenu en interne'
              : 'Calculate the real cost of in-house content creation'
            }
          </p>
        </div>

        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              {lang === 'fr' ? 'Posts par semaine' : 'Posts per week'}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="30"
                value={postsPerWeek}
                onChange={(e) => setPostsPerWeek(parseInt(e.target.value))}
                className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-empire"
              />
              <div className="w-16 text-center px-3 py-2 rounded-lg bg-empire/20 border border-empire/30">
                <span className="text-xl font-bold text-empire">{postsPerWeek}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              {lang === 'fr' ? 'Nombre de plateformes' : 'Number of platforms'}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={platforms}
                onChange={(e) => setPlatforms(parseInt(e.target.value))}
                className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-empire"
              />
              <div className="w-16 text-center px-3 py-2 rounded-lg bg-empire/20 border border-empire/30">
                <span className="text-xl font-bold text-empire">{platforms}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results - 3 columns */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Time Required */}
          <motion.div
            key={timePerMonth}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-xl bg-black/40 border border-white/10 text-center"
          >
            <Clock className="text-red-400 mx-auto mb-3" size={32} />
            <p className="text-xs text-neutral-400 mb-1">
              {lang === 'fr' ? 'Votre temps/mois' : 'Your time/month'}
            </p>
            <p className="text-4xl font-bold text-red-400 mb-1">
              <NumberTicker value={timePerMonth} />h
            </p>
            <p className="text-xs text-neutral-500">
              {lang === 'fr' ? 'À créer le contenu' : 'Creating content'}
            </p>
          </motion.div>

          {/* Cost if DIY */}
          <motion.div
            key={costPerMonth}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-xl bg-black/40 border border-red-500/30 text-center"
          >
            <DollarSign className="text-red-400 mx-auto mb-3" size={32} />
            <p className="text-xs text-neutral-400 mb-1">
              {lang === 'fr' ? 'Coût si vous le faites' : 'Cost if you do it'}
            </p>
            <p className="text-4xl font-bold text-red-400 mb-1">
              €<NumberTicker value={costPerMonth} />
            </p>
            <p className="text-xs text-neutral-500">/month</p>
          </motion.div>

          {/* Savings with Empire */}
          <motion.div
            key={savingsPerMonth}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire text-center"
          >
            <TrendingUp className="text-empire mx-auto mb-3" size={32} />
            <p className="text-xs text-neutral-400 mb-1">
              {lang === 'fr' ? 'Économies avec Empire' : 'Savings with Empire'}
            </p>
            <p className="text-4xl font-bold text-empire mb-1">
              €<NumberTicker value={savingsPerMonth} />
            </p>
            <p className="text-xs text-neutral-300">{lang === 'fr' ? 'économisés/mois' : 'saved/month'}</p>
          </motion.div>
        </div>

        {/* Big Number - Annual Savings */}
        <motion.div
          key={savingsPerYear}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 text-center mb-6"
        >
          <p className="text-sm text-neutral-400 mb-2">
            {lang === 'fr' ? 'ÉCONOMIES ANNUELLES TOTALES' : 'TOTAL ANNUAL SAVINGS'}
          </p>
          <p className="text-5xl md:text-6xl font-bold text-green-400 mb-2">
            €<NumberTicker value={savingsPerYear} />
          </p>
          <p className="text-neutral-300">
            {lang === 'fr' 
              ? `En payant €${(empireCost * 12).toLocaleString()} au lieu de €${costPerYear.toLocaleString()}`
              : `By paying €${(empireCost * 12).toLocaleString()} instead of €${costPerYear.toLocaleString()}`
            }
          </p>
        </motion.div>

        {/* ROI Highlight */}
        <div className="p-6 rounded-xl bg-empire/10 border border-empire/30 text-center">
          <div className="flex items-center justify-center gap-3">
            <Zap className="text-empire" size={24} />
            <p className="text-white">
              {lang === 'fr' ? 'Retour sur investissement' : 'Return on Investment'}:{' '}
              <span className="text-2xl font-bold text-empire">+{roiPercentage}%</span>
            </p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-6 p-4 rounded-lg bg-black/40 border border-white/10">
          <p className="text-xs text-neutral-400 mb-3 text-center">
            {lang === 'fr' ? 'Détail des coûts si vous le faites :' : 'Cost breakdown if you do it:'}
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Copywriter (€50/h)</span>
              <span className="text-neutral-300">~{Math.round(timePerWeek * 0.5 * HOURLY_RATES.copywriter * 4.3)}/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Video editor (€60/h)</span>
              <span className="text-neutral-300">~{Math.round(timePerWeek * 0.3 * HOURLY_RATES.videoEditor * 4.3)}/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Designer (€55/h)</span>
              <span className="text-neutral-300">~{Math.round(timePerWeek * 0.1 * HOURLY_RATES.designer * 4.3)}/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Social manager (€45/h)</span>
              <span className="text-neutral-300">~{Math.round(timePerWeek * 0.1 * HOURLY_RATES.socialManager * 4.3)}/mo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

