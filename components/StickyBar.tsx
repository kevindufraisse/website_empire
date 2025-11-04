'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export function StickyBar() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 400
      console.log('Scroll position:', window.scrollY, 'Show:', scrolled)
      setShow(scrolled)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  console.log('StickyBar render - show:', show, 'dismissed:', dismissed)
  
  if (dismissed) return null
  
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t-2 border-empire/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transition-transform duration-300"
      style={{ transform: show ? 'translateY(0)' : 'translateY(100%)' }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="hidden md:flex w-10 h-10 rounded-lg bg-gradient-to-br from-empire to-empire/50 flex-shrink-0 items-center justify-center text-black font-bold">
              E
            </div>
            <div>
              <p className="font-bold text-white text-sm md:text-base">Empire Internet</p>
              <p className="text-xs text-neutral-400">
                €1,000/mo · <span className="text-empire font-semibold">83 spots left</span> of 100
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a 
              href="/pricing" 
              className="px-4 md:px-6 py-2 md:py-3 bg-empire text-black font-bold rounded-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)] text-sm md:text-base whitespace-nowrap"
            >
              Start Now
            </a>
            <button
              onClick={() => setDismissed(true)}
              className="p-2 text-neutral-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

