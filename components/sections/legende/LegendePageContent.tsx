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
      ['Pour qui c’est ?', 'Pour les dirigeants, fondateurs et experts d’une entreprise qui fait au moins 300 000 € de chiffre d’affaires par an, qui ont des choses à dire et pas le temps de les publier.'],
      ['Combien de temps ça me prend ?', 'Une heure par semaine, maximum : ton interview. Le reste, on s’en occupe.'],
      ['Avec qui je travaille ?', 'Avec Kevin, sur l’offre à 4 500 € : c’est lui qui t’interviewe 4 fois par mois et qui retravaille ton offre. Avec un Head of Content formé par Kevin, sur l’offre de 1 000 à 3 000 €. Dans les deux cas, l’équipe Empire produit, publie et suit tes résultats.'],
      ['Vous tournez en studio ?', 'Non, et c’est voulu. Tes vidéos sont des lives filmés à l’iPhone avec des écouteurs. On l’a testé sur des milliers de posts : ce format performe bien mieux qu’une production de studio.'],
      ['Qu’est-ce que vous publiez pour moi ?', 'Au moins une publication par jour sur 7 réseaux (LinkedIn, Instagram, TikTok, YouTube, Facebook, X et Threads), et des vidéos YouTube longues. Les sujets, on les crée pour toi.'],
      ['Combien ça coûte ?', '4 500 € par mois avec Kevin, de 1 000 à 3 000 € par mois avec un Head of Content selon ton volume, pendant douze mois. Avec Kevin, il reste ' + PLACES_LEFT + ' places sur 10 cette année.'],
      ['Et si je veux d’abord un avis de Kevin ?', 'Tu peux réserver une session de conseil avec lui sur Intro, sans candidature. Vous travaillez directement sur ton blocage.'],
      ['Pourquoi pas simplement l’abonnement Empire ?', 'Si tu veux garder la main et que 20 minutes par semaine te vont, l’abonnement suffit, et il coûte bien moins cher. Le 1-to-1, c’est quand tu ne veux plus t’en occuper du tout.'],
    ] as [string, string][],
    applyLabel: 'Candidature', applyTitle: 'Deux minutes pour candidater.',
    applyText: 'Tes coordonnées, trois questions sur ton entreprise. Si ton profil correspond, tu choisis ton créneau dans la foulée.',
    apply: 'Candidater', notReady: 'Tu préfères garder la main ?', solo: 'Commence seul avec Empire', privacy: 'Confidentialité',
  },
  en: {
    faqLabel: 'Questions', faqTitle: 'Frequently asked questions',
    faq: [
      ['Who is it for?', 'For leaders, founders and experts whose company makes at least €300,000 in revenue a year, who have things to say and no time to publish them.'],
      ['How much of my time does it take?', 'One hour a week, at most: your interview. We handle the rest.'],
      ['Who will I work with?', 'With Kevin on the €4,500 plan: he interviews you 4 times a month and reworks your offer. With a Head of Content trained by Kevin on the €1,000 to €3,000 plan. Either way, the Empire team produces, publishes and tracks your results.'],
      ['Do you shoot in a studio?', 'No, on purpose. Your videos are live streams shot on an iPhone with earphones. We tested it on thousands of posts: this format performs far better than a studio production.'],
      ['What do you publish for me?', 'At least one post a day on 7 networks (LinkedIn, Instagram, TikTok, YouTube, Facebook, X and Threads), plus long-form YouTube videos. We create the topics for you.'],
      ['How much does it cost?', '€4,500 a month with Kevin, €1,000 to €3,000 a month with a Head of Content depending on your volume, for twelve months. With Kevin, ' + PLACES_LEFT + ' of 10 spots are left this year.'],
      ['What if I want Kevin’s advice first?', 'You can book an advisory session with him on Intro, no application needed. You work directly on what’s blocking you.'],
      ['Why not just the Empire subscription?', 'If you want to stay hands-on and 20 minutes a week works for you, the subscription is enough, and it costs far less. 1-to-1 is for when you don’t want to deal with it at all.'],
    ] as [string, string][],
    applyLabel: 'Application', applyTitle: 'Two minutes to apply.',
    applyText: 'Your details and three questions about your company. If your profile fits, you pick a slot right away.',
    apply: 'Apply', notReady: 'Prefer to stay hands-on?', solo: 'Start on your own with Empire', privacy: 'Privacy',
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
        <button type="button" onClick={() => apply()} className={styles.pill + ' mt-6'}>{t.apply}<ArrowRight aria-hidden size={15} /></button>
      </div>
      <p className="mt-5 text-center text-sm text-neutral-400">{t.notReady} <a href={TRIAL_URL} className="font-semibold text-white underline underline-offset-4">{t.solo}</a></p>
    </section>

    <div className="mt-16 md:mt-20"><PartnerFinalCta /></div>
    <footer className="mt-10 overflow-hidden px-5 sm:px-8">
      <div className="mx-auto flex max-w-5xl justify-between border-t border-white/10 py-4 text-[12px] text-neutral-500">
        <span>© Empire Internet</span><a href="/privacy" className="underline">{t.privacy}</a>
      </div>
      <p aria-hidden="true" className={styles.wordmark}>1-to-1</p>
    </footer>

    {applying && <LegendeApplyModal lang={lang} initialPlan={applying.plan} onClose={() => setApplying(null)} />}
  </main>
}
