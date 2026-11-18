'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import PartnerFinalCta from '@/components/sections/PartnerFinalCta'
import { TRIAL_URL } from '@/lib/startTrial'
import type { PlanId } from '@/lib/legende-flow'
import { Reveal } from './LegendeWeekScroll'
import LegendeMarketing, { PLACES_LEFT } from './LegendeMarketing'
import LegendeApplyModal from './LegendeApplyModal'
import styles from './legende-form.module.css'

const copy = {
  fr: {
    faqLabel: 'Questions', faqTitle: 'Questions fréquentes',
    faq: [
      ['Pour qui est-ce ?', 'Pour les dirigeants, fondateurs et experts d’une entreprise, qui ont des choses à dire et pas le temps de les publier.'],
      ['Combien de temps cela me prend-il ?', 'Une heure par semaine, maximum : votre interview. Le reste, nous nous en occupons.'],
      ['Avec qui vais-je travailler ?', 'Avec Kevin : c’est lui qui vous interviewe 4 fois par mois et qui retravaille votre offre. Avec un Head of Content formé par Kevin. Dans les deux cas, l’équipe Empire produit, publie et suit vos résultats.'],
      ['Pourquoi pas un tournage en studio, avec un vrai montage ?', 'Parce que ça marche moins bien. Nous l’avons testé sur des milliers de posts : les vidéos de studio, avec un décor et un montage sophistiqué, font moins de vues que des lives filmés à l’iPhone avec des écouteurs. En 2027, c’est l’authenticité qui gagne sur les réseaux sociaux, et peu de dirigeants l’ont encore compris. Profitez-en : c’est maintenant ou jamais.'],
      ['Que publiez-vous pour moi ?', 'Au moins une publication par jour sur 7 réseaux (LinkedIn, Instagram, TikTok, YouTube, Facebook, X et Threads), et des vidéos YouTube longues. Les sujets, nous les créons pour vous.'],
      ['Et si je veux d’abord un avis de Kevin ?', 'Réservez une session de conseil avec lui sur Intro, sans candidature. Vous travaillez directement sur votre blocage.'],
      ['Pourquoi pas simplement l’abonnement Empire ?', 'Si vous voulez garder la main et que 20 minutes par semaine vous conviennent, l’abonnement suffit. Le 1-to-1, c’est quand vous ne voulez plus vous en occuper du tout.'],
    ] as [string, string][],
    applyLabel: 'Candidature', applyTitle: 'Deux minutes pour candidater.',
    applyText: 'Vos coordonnées, trois questions sur votre entreprise. Si votre profil correspond, vous choisissez votre créneau dans la foulée.',
    apply: 'Candidater · 2 min', notReady: 'Vous préférez garder la main ?', solo: 'Commencez seul avec Empire', privacy: 'Confidentialité', terms: 'Conditions générales',
  },
  en: {
    faqLabel: 'Questions', faqTitle: 'Frequently asked questions',
    faq: [
      ['Who is it for?', 'For leaders, founders and experts, who have things to say and no time to publish them.'],
      ['How much of my time does it take?', 'One hour a week, at most: your interview. We handle the rest.'],
      ['Who will I work with?', 'With Kevin: he interviews you 4 times a month and reworks your offer. With a Head of Content trained by Kevin. Either way, the Empire team produces, publishes and tracks your results.'],
      ['Why not a studio shoot, with proper editing?', 'Because it works worse. We tested it on thousands of posts: studio videos, with a set and sophisticated editing, get fewer views than live streams shot on an iPhone with earphones. In 2027, authenticity wins on social media, and few leaders have figured it out yet. Make the most of it: it’s now or never.'],
      ['What do you publish for me?', 'At least one post a day on 7 networks (LinkedIn, Instagram, TikTok, YouTube, Facebook, X and Threads), plus long-form YouTube videos. We create the topics for you.'],
      ['What if I want Kevin’s advice first?', 'You can book an advisory session with him on Intro, no application needed. You work directly on what’s blocking you.'],
      ['Why not just the Empire subscription?', 'If you want to stay hands-on and 20 minutes a week works for you, the subscription is enough. 1-to-1 is for when you don’t want to deal with it at all.'],
    ] as [string, string][],
    applyLabel: 'Application', applyTitle: 'Two minutes to apply.',
    applyText: 'Your details and three questions about your company. If your profile fits, you pick a slot right away.',
    apply: 'Apply · 2 min', notReady: 'Prefer to stay hands-on?', solo: 'Start on your own with Empire', privacy: 'Privacy', terms: 'Terms',
  },
}

export default function LegendePageContent() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const [applying, setApplying] = useState<{ plan?: PlanId } | null>(null)
  const apply = (plan?: PlanId) => setApplying({ plan })

  return <main lang={lang} className={styles.page}>
    <LegendeMarketing lang={lang} onApply={apply} />

    <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8 md:mt-20" aria-labelledby="legende-faq">
      <Reveal>
      <p className={styles.label}><span className="h-1.5 w-1.5 rounded-full bg-autopilot" aria-hidden />{t.faqLabel}</p>
      <h2 id="legende-faq" className={styles.sectionTitle}>{t.faqTitle}</h2>
      <div className="mt-6 border-t border-white/10">
        {t.faq.map(([q, a]) => <details key={q} className={styles.faq}>
          <summary>{q}<span aria-hidden>+</span></summary>
          <p>{a}</p>
        </details>)}
      </div>
      </Reveal>
    </section>

    <section id="candidature" className="mx-auto mt-16 max-w-3xl scroll-mt-20 px-5 sm:px-8 md:mt-20" aria-labelledby="legende-apply">
      <div className={styles.panel + ' text-center'}>
        <p className={styles.label}><span className="h-1.5 w-1.5 rounded-full bg-autopilot" aria-hidden />{t.applyLabel}</p>
        <h2 id="legende-apply" className={styles.sectionTitle}>{t.applyTitle}</h2>
        <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-neutral-300">{t.applyText}</p>
        <button type="button" onClick={() => apply()} className={styles.pill + ' mt-6'}><span className="text-balance">{t.apply}</span><ArrowRight aria-hidden size={15} /></button>
      </div>
      <p className="mt-5 text-center text-sm text-neutral-400">{t.notReady} <a href={TRIAL_URL} className="font-semibold text-white underline underline-offset-4">{t.solo}</a></p>
    </section>

    <div className="mt-16 md:mt-20"><PartnerFinalCta /></div>
    <footer className="mt-10 overflow-hidden px-5 sm:px-8">
      <div className="mx-auto flex max-w-5xl justify-between border-t border-white/10 py-4 text-[12px] text-neutral-500">
        <span>© Empire Internet</span><span className="flex gap-4"><a href="/terms" className="underline">{t.terms}</a><a href="/privacy" className="underline">{t.privacy}</a></span>
      </div>
      <p aria-hidden="true" className={styles.wordmark}>1-to-1</p>
    </footer>

    {applying && <LegendeApplyModal lang={lang} initialPlan={applying.plan} onClose={() => setApplying(null)} />}
  </main>
}
