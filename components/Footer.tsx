'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { Mail } from 'lucide-react'
import { getCalApi } from "@calcom/embed-react"
import { useCalLink } from '@/hooks/useCalLink'
import { CtaReassurance } from '@/components/ui/cta-reassurance'
import { GiftHeaderBadge } from '@/components/GiftCountdownBar'

export default function Footer() {
  const { t, lang } = useLanguage()
  const pathname = usePathname()
  
  const isPartnersPage = pathname === '/partners'
  const isAcademyPage = pathname === '/academy'
  const isCandidaturePage = pathname === '/candidature' || pathname === '/decouverte' || pathname === '/join-us'

  const namespace = 'audit-empire'
  const calLink = useCalLink()

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace })
      cal("ui", { 
        hideEventTypeDetails: false, 
        layout: "month_view",
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#dafc68" },
          dark: { "cal-brand": "#dafc68" }
        }
      })
    })()
  }, [namespace])

  if (isCandidaturePage || pathname === '/academy/merci') return null

  return (
    <footer className="relative w-full border-t border-white/10 bg-black pb-[env(safe-area-inset-bottom)]">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-lg font-bold text-white mb-2">Empire Internet</span>
            <p className="text-sm text-neutral-400 mb-3 text-center md:text-left">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Mail size={14} />
              <a href="mailto:kevin@empire-internet.com" className="hover:text-empire transition-colors">
                kevin@empire-internet.com
              </a>
            </div>
          </div>

          {/* Site */}
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm font-bold text-white mb-3">{lang === 'fr' ? 'Site' : 'Site'}</p>
            <div className="flex flex-col gap-2 items-center md:items-start">
              <a href="/" className="text-sm text-neutral-400 hover:text-empire transition-colors">
                Empire Internet
              </a>
              <a href="/academy" className="text-sm text-neutral-400 hover:text-empire transition-colors">
                Academy
              </a>
            </div>
          </div>

          {/* Ressources gratuites */}
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm font-bold text-white mb-3">{lang === 'fr' ? 'Ressources gratuites' : 'Free resources'}</p>
            <div className="flex flex-col gap-2 items-center md:items-start">
              <a href="/vsl" className="text-sm text-neutral-400 hover:text-empire transition-colors">
                {lang === 'fr' ? 'Masterclass : le système Empire (20 min)' : 'Masterclass: the Empire system (20 min)'}
              </a>
              <a href="/quiz" className="text-sm text-neutral-400 hover:text-empire transition-colors">
                {lang === 'fr' ? 'Quiz : quel créateur êtes-vous ?' : 'Quiz: what creator are you?'}
              </a>
              <GiftHeaderBadge />
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center md:items-end">
            {!isPartnersPage && (
              <button
                data-cal-namespace={namespace}
                data-cal-link={calLink}
                data-cal-config='{"layout":"month_view","theme":"dark"}'
                className="inline-flex flex-col items-center px-6 py-3.5 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.3)]"
              >
                <span>{t.finalCTA.watchDemo}</span>
                <span className="text-[10px] font-semibold opacity-70">300 000 vues/mois garanties · 45 min</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-3 sm:gap-4 text-sm text-neutral-400">
            <p>© {new Date().getFullYear()} Empire Internet. All rights reserved.</p>
            <span className="hidden sm:inline text-neutral-400" aria-hidden>
              ·
            </span>
            <nav className="flex items-center gap-4 text-neutral-400">
              <a href="/terms" className="hover:text-empire transition-colors">
                {t.footer.termsOfUse}
              </a>
              <a href="/privacy" className="hover:text-empire transition-colors">
                {t.footer.privacyPolicy}
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}

