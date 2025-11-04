'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { Mail } from 'lucide-react'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="relative w-full border-t border-white/10 bg-black">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-empire to-empire/50 flex items-center justify-center font-bold text-black text-sm">
                E
              </div>
              <span className="text-lg font-bold text-white">Empire Internet</span>
            </div>
            <p className="text-sm text-neutral-500 mb-4">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Mail size={16} />
              <a href="mailto:contact@empire-internet.com" className="hover:text-empire transition-colors">
                contact@empire-internet.com
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t.footer.product || 'Product'}</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><a href="/formats" className="hover:text-empire transition-colors">{t.header.formats || 'Formats'}</a></li>
              <li><a href="/how-it-works" className="hover:text-empire transition-colors">{t.header.howItWorks}</a></li>
              <li><a href="/pricing" className="hover:text-empire transition-colors">{t.header.pricing}</a></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t.footer.about || 'About'}</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><a href="/story" className="hover:text-empire transition-colors">{t.footer.ourStory || 'Our Story'}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-600">
            © {new Date().getFullYear()} Empire Internet. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-empire animate-pulse" />
            <p className="text-xs text-neutral-500">
              <span className="text-empire font-semibold">83</span> {t.footer.spotsRemaining}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

