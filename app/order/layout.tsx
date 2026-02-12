'use client'
import { ReactNode } from 'react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default function OrderLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Minimal Header - Logo + Language Switcher */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-bold text-white group-hover:text-empire transition-colors">
                Empire Internet
              </span>
            </a>
            
            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
        </nav>
      </header>
      
      {/* Content without Footer */}
      <div className="pt-16">
        {children}
      </div>
    </>
  )
}

