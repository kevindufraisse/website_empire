import { ReactNode } from 'react'

export default function OrderLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Minimal Header - Just Logo */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-empire to-empire/50 flex items-center justify-center font-bold text-black text-sm">
                E
              </div>
              <span className="text-xl font-bold text-white group-hover:text-empire transition-colors">
                Empire Internet
              </span>
            </a>
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

