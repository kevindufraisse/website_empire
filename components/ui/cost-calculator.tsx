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
  
  // Simplified calculation - Much clearer!
  // Average time per post (writing + editing + scheduling + posting)
  const hoursPerPost = 2 // Realistic: 1h writing, 30min editing, 30min scheduling/posting
  
  // For video content (reels/shorts)
  const hoursPerVideo = 4 // Realistic: filming, editing, captions, thumbnail
  
  // Calculate monthly totals
  const postsPerMonth = postsPerWeek * 4
  const videosPerMonth = Math.round(postsPerMonth * 0.3) // 30% are videos
  const textPostsPerMonth = postsPerMonth - videosPerMonth
  
  // Time calculation (simplified and clear)
  const timeForTextPosts = textPostsPerMonth * hoursPerPost
  const timeForVideos = videosPerMonth * hoursPerVideo
  const timePerMonth = Math.round(timeForTextPosts + timeForVideos)
  
  // Cost calculation - Hiring freelancers
  const freelancerCopywriterCost = textPostsPerMonth * 100 // €100 per post (ghostwriting)
  const freelancerVideoEditorCost = videosPerMonth * 200 // €200 per video (editing)
  const platformManagementCost = platforms * 150 // €150/platform/month for scheduling/posting
  
  const costPerMonth = Math.round(freelancerCopywriterCost + freelancerVideoEditorCost + platformManagementCost)
  const costPerYear = Math.round(costPerMonth * 12)
  
  // Empire savings
  const empireCost = 1000
  const savingsPerMonth = costPerMonth - empireCost
  const savingsPerYear = costPerYear - (empireCost * 12)
  const roiPercentage = savingsPerMonth > 0 ? Math.round((savingsPerMonth / empireCost) * 100) : 0

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

        {/* Breakdown - Clear and simple */}
        <div className="mt-6 p-4 rounded-lg bg-black/40 border border-white/10">
          <p className="text-xs text-neutral-400 mb-3 text-center">
            {lang === 'fr' ? 'Détail des coûts avec freelances :' : 'Cost breakdown with freelancers:'}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">
                {textPostsPerMonth} {lang === 'fr' ? 'posts écrits' : 'written posts'} × €100
              </span>
              <span className="text-white font-semibold">€{freelancerCopywriterCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">
                {videosPerMonth} {lang === 'fr' ? 'vidéos montées' : 'edited videos'} × €200
              </span>
              <span className="text-white font-semibold">€{freelancerVideoEditorCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">
                {platforms} {lang === 'fr' ? 'plateformes gérées' : 'platforms managed'} × €150
              </span>
              <span className="text-white font-semibold">€{platformManagementCost.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-white/20 flex justify-between items-center">
              <span className="text-neutral-300 font-semibold">
                {lang === 'fr' ? 'Total/mois' : 'Total/month'}
              </span>
              <span className="text-red-400 font-bold text-lg">€{costPerMonth.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

