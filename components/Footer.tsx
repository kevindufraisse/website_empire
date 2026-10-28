'use client'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { Mail } from 'lucide-react'
import { GiftFooterLink } from '@/components/GiftCountdownContext'
import OnboardingLink from '@/components/OnboardingLink'
import { partnerPayHref } from '@/lib/partner-festival-pricing'
import { postitJoinUrl } from '@/lib/postit'

export default function Footer() {
  const { t, lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const pathname = usePathname()
  
  const isPartnersPage = pathname === '/partners'
  const isAcademyPage = pathname === '/academy' || pathname?.startsWith('/academy/')
  const isVslPage = pathname === '/vsl'
  const isCandidaturePage = pathname === '/candidature' || pathname === '/decouverte' || pathname === '/join-us' || pathname === '/postuler' || pathname?.startsWith('/hire-our-team')

  if (pathname === '/live' || pathname === '/tarifs' || pathname === '/demo') return null

  if (isCandidaturePage || pathname === '/academy/merci' || pathname === '/thank-you' || pathname === '/webinar' || pathname === '/webinar/merci' || pathname === '/live') return null

  // Page vidéo (pub Meta) : rien que la mention, pas de liens qui détournent du bouton.
  if (pathname === '/partenaire') {
    return (
      <footer className="w-full bg-black px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6">
        <MetaDisclaimer fr={lang === 'fr'} />
      </footer>
    )
  }

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
                {lang === 'fr' ? 'Programme partenaire' : 'Partner program'}
              </a>
              <a href="/mission" className="text-sm text-neutral-400 hover:text-empire transition-colors">
                {lang === 'fr' ? 'Ma mission' : 'My mission'}
              </a>
              <a href="/comparatif" className="text-sm text-neutral-400 hover:text-empire transition-colors">
                {lang === 'fr' ? 'Comparatifs' : 'Comparisons'}
              </a>
            </div>
          </div>

          {/* Ressources gratuites - self-serve funnel, off-topic for Légende */}
          <div className="flex flex-col items-center md:items-start">
            {!autopilot && (
              <>
                <p className="text-sm font-bold text-white mb-3">{lang === 'fr' ? 'Ressources gratuites' : 'Free resources'}</p>
                <div className="flex flex-col gap-2 items-center md:items-start">
                  {!isVslPage && (
                    <a href="/vsl" className="text-sm text-neutral-400 hover:text-empire transition-colors">
                      {lang === 'fr' ? 'Workshop gratuit : la formule du million de vues (1 h 26)' : 'Free workshop: the million-views formula (1h26)'}
                    </a>
                  )}
                  <a href="/quiz" className="text-sm text-neutral-400 hover:text-empire transition-colors">
                    {lang === 'fr' ? 'Quiz : quel créateur êtes-vous ?' : 'Quiz: what creator are you?'}
                  </a>
                  <a href={postitJoinUrl('footer')} className="text-sm text-neutral-400 hover:text-empire transition-colors">
                    {lang === 'fr' ? 'Live gratuit : Post it like it’s hot (lundi 14h)' : 'Free live: Post it like it’s hot (Mon 2 pm)'}
                  </a>
                  <GiftFooterLink />
                </div>
              </>
            )}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center md:items-end">
            {!isPartnersPage && !isVslPage && !autopilot && (
              <OnboardingLink
                href={isAcademyPage ? partnerPayHref() : undefined}
                className={`inline-flex flex-col items-start rounded-xl px-6 py-3.5 text-left font-bold text-black transition hover:brightness-110 ${isAcademyPage ? 'bg-academy' : 'bg-empire'}`}
              >
                <span>{isAcademyPage
                  ? (lang === 'fr' ? 'Rejoindre l’Academy' : 'Join the Academy')
                  : (lang === 'fr' ? 'Tester 7 jours gratuitement' : 'Start my 7-day free trial')}</span>
                <span className="mt-1 text-[10px] font-semibold opacity-70">{isAcademyPage
                  ? (lang === 'fr' ? 'Paiement unique · Accès immédiat' : 'One-time payment · Instant access')
                  : (lang === 'fr' ? '500 crédits inclus dans l’essai' : '500 credits included in your trial')}</span>
              </OnboardingLink>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-3 sm:gap-4 text-sm text-neutral-400">
            <p>© {new Date().getFullYear()} Empire Internet. {lang === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
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
              <a href="/data-deletion" className="hover:text-empire transition-colors">
                {lang === 'fr' ? 'Suppression des données' : 'Data deletion'}
              </a>
            </nav>
          </div>
        </div>

        {isAcademyPage && <MetaDisclaimer fr={lang === 'fr'} />}
      </div>
    </footer>
  )
}

// Mention exigée sur les pages de destination des publicités Meta.
function MetaDisclaimer({ fr }: { fr: boolean }) {
  return (
    <div className="mx-auto mt-6 max-w-3xl space-y-2 text-center text-[11px] leading-relaxed text-neutral-500">
      <p>
        {fr
          ? "Ce site ne fait pas partie du site Web de Facebook ou de Facebook Inc. De plus, ce site n'est en aucun cas approuvé par Facebook. FACEBOOK est une marque commerciale de Meta Platforms, Inc."
          : 'This site is not a part of the Facebook website or Facebook Inc. Additionally, this site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of Meta Platforms, Inc.'}
      </p>
      <p>
        {fr
          ? 'Vos résultats peuvent varier. Les témoignages et exemples présentés ne garantissent pas que vous obtiendrez des résultats identiques ou similaires.'
          : 'Your results may vary. The testimonials and examples shown do not guarantee that you will get the same or similar results.'}
      </p>
    </div>
  )
}
