'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { Mail } from 'lucide-react'
import { getCalApi } from "@calcom/embed-react"
import { useCalLink } from '@/hooks/useCalLink'
import { CtaReassurance } from '@/components/ui/cta-reassurance'

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

  if (isCandidaturePage) return null

  return (
    <footer className="relative w-full border-t border-white/10 bg-black pb-[env(safe-area-inset-bottom)]">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start w-full md:w-auto">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <span className="text-lg font-bold text-white">Empire Internet</span>
            </div>
            <p className="text-sm text-neutral-500 mb-3 md:mb-4 text-center md:text-left">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Mail size={16} />
              <a href="mailto:kevin@empire-internet.com" className="hover:text-empire transition-colors">
                kevin@empire-internet.com
              </a>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {isAcademyPage ? (
              <a
                href="/"
                className="w-full sm:w-auto text-center px-6 py-3.5 min-h-[44px] bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)]"
              >
                Découvrir Empire Internet →
              </a>
            ) : !isPartnersPage && (
              <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
                <button
                  data-cal-namespace={namespace}
                  data-cal-link={calLink}
                  data-cal-config='{"layout":"month_view","theme":"dark"}'
                  className="w-full sm:w-auto text-center px-6 py-3.5 min-h-[44px] bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)]"
                >
                  {t.finalCTA.watchDemo}
                </button>
                <CtaReassurance className="max-w-xs px-1" />
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-3 sm:gap-4 text-sm text-neutral-600">
            <p>© {new Date().getFullYear()} Empire Internet. All rights reserved.</p>
            <span className="hidden sm:inline text-neutral-700" aria-hidden>
              ·
            </span>
            <nav className="flex items-center gap-4 text-neutral-500">
              <a href="/terms" className="hover:text-empire transition-colors">
                {t.footer.termsOfUse}
              </a>
              <a href="/privacy" className="hover:text-empire transition-colors">
                {t.footer.privacyPolicy}
              </a>
            </nav>
          </div>
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

