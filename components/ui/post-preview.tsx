'use client'
import { SocialIcons } from './social-icons'
import { Eye, Heart, MessageCircle, Share2 } from 'lucide-react'

export function LinkedInPost() {
  return (
    <div className="w-full rounded-xl bg-gradient-to-br from-[#0A66C2]/10 to-white/5 backdrop-blur-md border border-white/20 overflow-hidden shadow-lg hover:shadow-empire/20 transition-shadow">
      {/* Header */}
      <div className="p-3 flex items-center gap-2 bg-white/5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-empire/40 to-empire/20 flex items-center justify-center text-xs font-bold text-black">
          K
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Kevin Dufraisse</p>
          <p className="text-[11px] text-neutral-400">Top 50 Creator • 2h ago</p>
        </div>
        <div className="scale-90"><SocialIcons.linkedin /></div>
      </div>
      {/* Content */}
      <div className="p-3">
        <p className="text-sm text-neutral-200 leading-relaxed">
          Here's the truth about content marketing that nobody tells you...
        </p>
      </div>
      {/* Stats */}
      <div className="px-3 py-2 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
        <span className="text-empire font-semibold">127K views</span>
        <div className="flex gap-3">
          <span>3.2K likes</span>
          <span>456 comments</span>
        </div>
      </div>
    </div>
  )
}

export function InstagramReel() {
  return (
    <div className="w-40 h-72 rounded-2xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-pink-500/5 backdrop-blur-md border border-pink-500/20 overflow-hidden relative shadow-lg hover:shadow-pink-500/20 transition-shadow">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between z-10 bg-gradient-to-b from-black/40 to-transparent">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-white">
              K
            </div>
          </div>
          <p className="text-xs font-semibold text-white drop-shadow-lg">kevin</p>
        </div>
        <div className="scale-75"><SocialIcons.instagram /></div>
      </div>
      
      {/* Video mockup */}
      <div className="h-full bg-gradient-to-br from-empire/10 via-pink-500/5 to-purple-500/10 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-xl">
          <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1" />
        </div>
      </div>
      
      {/* Bottom stats */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <Heart size={14} className="text-white" fill="white" />
              <span className="text-xs text-white font-bold">42K</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye size={14} className="text-white" />
              <span className="text-xs text-white font-bold">856K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function InstagramCarousel() {
  return (
    <div className="w-40 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/5 backdrop-blur-md border border-pink-500/20 overflow-hidden shadow-lg hover:shadow-pink-500/20 transition-shadow">
      {/* Header */}
      <div className="p-2 flex items-center gap-1.5 bg-white/5">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 p-[2px]">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[9px] font-bold text-white">
            K
          </div>
        </div>
        <p className="text-[11px] font-semibold text-white">kevin</p>
      </div>
      
      {/* Main carousel image */}
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-empire/30 via-pink-500/20 to-purple-500/15" />
        {/* Dots indicator */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-empire shadow-lg" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>
      </div>
      
      {/* Stats */}
      <div className="p-2 flex gap-3 text-[11px] text-white bg-white/5">
        <span className="flex items-center gap-1">
          <Heart size={11} fill="white" className="text-pink-500" /> <strong>12K</strong>
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle size={11} /> 456
        </span>
      </div>
    </div>
  )
}

export function YouTubeShort() {
  return (
    <div className="w-44 h-80 rounded-2xl bg-gradient-to-br from-red-500/10 to-black/20 backdrop-blur-md border border-red-500/20 overflow-hidden relative shadow-lg hover:shadow-red-500/20 transition-shadow">
      {/* YouTube header */}
      <div className="absolute top-0 left-0 right-0 p-2 flex items-center justify-between z-10 bg-gradient-to-b from-black/50 to-transparent">
        <div className="scale-90"><SocialIcons.youtube /></div>
        <p className="text-xs text-white font-bold">Shorts</p>
      </div>
      
      {/* Video mockup */}
      <div className="h-full bg-gradient-to-br from-red-500/15 via-empire/5 to-black/30 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-red-500/40 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/20">
          <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[18px] border-l-white border-b-[12px] border-b-transparent ml-1" />
        </div>
      </div>
      
      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <p className="text-xs text-white font-medium mb-2 line-clamp-2">
          How I made 700K writing one post a day
        </p>
        <div className="flex gap-4 text-xs text-white">
          <span className="flex items-center gap-1.5">
            <Eye size={12} /> <strong>2.1M</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Heart size={12} fill="white" /> <strong>87K</strong>
          </span>
        </div>
      </div>
    </div>
  )
}

export function TwitterThread() {
  return (
    <div className="w-full rounded-xl bg-gradient-to-br from-blue-400/10 to-white/5 backdrop-blur-md border border-blue-400/20 overflow-hidden shadow-lg hover:shadow-blue-400/20 transition-shadow">
      {/* Header */}
      <div className="p-3 flex items-center gap-2 bg-white/5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400/40 to-blue-400/20 flex items-center justify-center text-xs font-bold text-black">
          K
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Kevin Dufraisse</p>
          <p className="text-[11px] text-neutral-400">@kevin • 3h ago</p>
        </div>
        <div className="scale-90">
          <SocialIcons.twitter />
        </div>
      </div>
      
      {/* Thread content */}
      <div className="p-3">
        <p className="text-sm text-neutral-200 leading-relaxed mb-2">
          1/ The content game changed in 2024.
        </p>
        <p className="text-xs text-blue-400 font-semibold">🧵 Thread (1/10)</p>
      </div>
      
      {/* Stats */}
      <div className="px-3 py-2 border-t border-white/10 flex items-center gap-4 text-[11px] text-neutral-400">
        <span className="flex items-center gap-1">
          <Eye size={11} /> <strong className="text-empire">342K</strong>
        </span>
        <span className="flex items-center gap-1">
          <Heart size={11} /> 8.9K
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle size={11} /> 567
        </span>
      </div>
    </div>
  )
}

