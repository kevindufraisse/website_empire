'use client'
import { useState } from 'react'
import { Calculator, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function CostCalculator() {
  const { lang } = useLanguage()
  
  // Sliders for each content type with their unit cost
  const [linkedinPosts, setLinkedinPosts] = useState(30)
  const [newsletters, setNewsletters] = useState(30)
  const [videos, setVideos] = useState(30) // Reels/Shorts
  const [carousels, setCarousels] = useState(4)
  const [instagramPosts, setInstagramPosts] = useState(30)
  
  // Unit costs
  const COSTS = {
    linkedinPost: 100,
    newsletter: 100,
    video: 80,
    carousel: 80,
    instagramPost: 50,
  }
  
  // Calculate total
  const totalCost = 
    linkedinPosts * COSTS.linkedinPost +
    newsletters * COSTS.newsletter +
    videos * COSTS.video +
    carousels * COSTS.carousel +
    instagramPosts * COSTS.instagramPost
  
  // Empire cost
  const empireCost = 1000
  const savings = totalCost - empireCost
  const savingsPerYear = savings * 12

  return (
    <div className="relative p-8 rounded-2xl bg-gradient-to-br from-empire/10 via-transparent to-purple-500/10 border-2 border-empire/30">
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
              ? 'Combien ça coûterait avec des freelances ?' 
              : 'How much would it cost with freelancers?'}
          </h3>
        </div>

        {/* Sliders for each content type */}
        <div className="space-y-4 mb-8">
          {/* LinkedIn Posts */}
          <div className="p-4 rounded-lg bg-black/40 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-white">
                {lang === 'fr' ? 'Posts LinkedIn' : 'LinkedIn Posts'}
              </label>
              <span className="text-sm text-empire">{linkedinPosts} × €{COSTS.linkedinPost} = €{linkedinPosts * COSTS.linkedinPost}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={linkedinPosts}
              onChange={(e) => setLinkedinPosts(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-empire"
            />
          </div>

          {/* Newsletters */}
          <div className="p-4 rounded-lg bg-black/40 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-white">Newsletters</label>
              <span className="text-sm text-empire">{newsletters} × €{COSTS.newsletter} = €{newsletters * COSTS.newsletter}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={newsletters}
              onChange={(e) => setNewsletters(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-empire"
            />
          </div>

          {/* Videos */}
          <div className="p-4 rounded-lg bg-black/40 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-white">
                {lang === 'fr' ? 'Vidéos montées (Reels/Shorts)' : 'Edited Videos (Reels/Shorts)'}
              </label>
              <span className="text-sm text-empire">{videos} × €{COSTS.video} = €{videos * COSTS.video}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={videos}
              onChange={(e) => setVideos(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-empire"
            />
          </div>

          {/* Carousels */}
          <div className="p-4 rounded-lg bg-black/40 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-white">Carousels</label>
              <span className="text-sm text-empire">{carousels} × €{COSTS.carousel} = €{carousels * COSTS.carousel}</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={carousels}
              onChange={(e) => setCarousels(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-empire"
            />
          </div>

          {/* Instagram Posts */}
          <div className="p-4 rounded-lg bg-black/40 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-white">Posts Instagram</label>
              <span className="text-sm text-empire">{instagramPosts} × €{COSTS.instagramPost} = €{instagramPosts * COSTS.instagramPost}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={instagramPosts}
              onChange={(e) => setInstagramPosts(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-empire"
            />
          </div>
        </div>

        {/* Comparison - Simple and clear */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Total Cost */}
          <div className="p-6 rounded-xl bg-red-500/10 border-2 border-red-500/30 text-center">
            <p className="text-sm text-neutral-400 mb-2">
              {lang === 'fr' ? 'Coût Total avec Freelances' : 'Total Cost with Freelancers'}
            </p>
            <p className="text-5xl font-bold text-red-400 mb-2">
              €{totalCost.toLocaleString()}
            </p>
            <p className="text-sm text-neutral-400">{lang === 'fr' ? 'par mois' : 'per month'}</p>
          </div>

          {/* Empire Cost + Savings */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire text-center">
            <p className="text-sm text-neutral-400 mb-2">
              {lang === 'fr' ? 'Avec Empire Internet' : 'With Empire Internet'}
            </p>
            <p className="text-5xl font-bold text-empire mb-2">€1,000</p>
            <p className="text-sm text-neutral-400 mb-3">{lang === 'fr' ? 'par mois' : 'per month'}</p>
            {savings > 0 && (
              <div className="pt-3 border-t border-empire/30">
                <p className="text-sm text-green-400 font-semibold">
                  {lang === 'fr' ? 'Vous économisez' : 'You save'} €{savings.toLocaleString()}/{lang === 'fr' ? 'mois' : 'month'}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  {lang === 'fr' ? 'soit' : 'or'} €{savingsPerYear.toLocaleString()}/{lang === 'fr' ? 'an' : 'year'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

