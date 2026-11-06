'use client'

import { ArrowRight, Clock3, Coins, ListChecks, Video, Target } from 'lucide-react'
import EmpireSalesCta from '@/components/EmpireSalesCta'
import { CONTENT_CREDITS, PLANS } from '@/lib/plans'
import s from './FormulaCompareClear.module.css'

const POSTS = 8
const REELS = 4
const textCredits = POSTS * CONTENT_CREDITS.post
const mixedCredits = textCredits + REELS * CONTENT_CREDITS.reel
const plan = [...PLANS].sort((a, b) => a.price - b.price).find(p => p.credits >= mixedCredits)
const fmt = (value: number, digits = 0) => value.toLocaleString('fr-FR', { maximumFractionDigits: digits })
const SOURCES = {
  clement: 'https://clement-aouadene.fr/',
  nina: 'https://ninasenoyer.fr/services/ghostwriter-linkedin/',
  time: 'https://ninasenoyer.fr/blog/tarif-ghostwriter-linkedin/',
  agency: 'https://klickbee.com/fr/services/agence-linkedin',
  video: 'https://studio.clicnstart.com/',
}
const OPTIONS = [
  { key: 'tools', name: 'Seul + outils', detail: 'Vous écrivez et publiez.' },
  { key: 'freelance', name: 'Un freelance', detail: 'Deux offres publiques comparées.' },
  { key: 'agency', name: 'Une agence', detail: 'Klickbee · offre Intensif.' },
  { key: 'empire', name: 'Empire', detail: 'Votre studio de contenu IA.' },
] as const

function Source({ name, href }: { name: string; href: string }) {
  return <a className={s.source} href={href} target="_blank" rel="noopener noreferrer">{name}<ArrowRight size={11} aria-hidden="true" /></a>
}

export default function FormulaCompareSection() {
  const rows = [
    { key: 'money', name: 'Votre budget', description: 'Prix publiés pour 8 posts LinkedIn par mois.', Icon: Coins },
    { key: 'time', name: 'Votre temps', description: 'Temps personnel, distinct du travail du prestataire.', Icon: Clock3 },
    { key: 'coverage', name: 'Qui fait quoi ?', description: 'Création, personnalisation et suivi.', Icon: ListChecks },
  ]
  const cells = [
    [
      <><span className={s.label}>Abonnements de votre choix</span><strong className={s.value}>Selon vos outils</strong><p>Aucun prestataire à payer. Vous réalisez la production.</p></>,
      <><span className={s.label}>Offres relevées · HT / mois</span><strong className={s.price}>600–1 250 €</strong><p>Sur 3 mois : <b>1 800 à 3 750 € HT.</b> Le niveau d’accompagnement diffère.</p><Source name="Clément Aouadène" href={SOURCES.clement} /><Source name="Nina Senoyer" href={SOURCES.nina} /></>,
      <><span className={s.label}>Offre Intensif · HT / mois</span><strong className={s.price}>1 000 €</strong><p><b>+ 900 € HT au démarrage.</b><br />3 mois minimum : <b>3 900 € HT</b> avec le démarrage.</p><Source name="Klickbee" href={SOURCES.agency} /></>,
      <><span className={s.label}>Starter · facturation mensuelle</span><strong className={s.price} data-comparison-price={plan?.price}>{plan ? `${fmt(plan.price)} €` : 'Selon le volume'}</strong><p>{fmt(textCredits)} crédits pour 8 posts texte, sur {plan ? fmt(plan.credits) : 'les crédits'} inclus. Sur 3 mois au tarif mensuel : <b>{plan ? `${fmt(plan.price * 3)} €` : 'selon le volume'}.</b></p><a className={s.source} href="/tarifs">Voir le tarif Empire<ArrowRight size={11} aria-hidden="true" /></a></>,
    ],
    [
      <><span className={s.label}>Repère de rédaction seule</span><strong className={s.value}>2 h 40–5 h 20</strong><p>8 × 20–40 min, avec les idées déjà trouvées. Ajouter recherche, publication et échanges avec l’audience.</p><Source name="Estimation de Nina Senoyer" href={SOURCES.time} /></>,
      <><span className={s.label}>Brief + relecture · par mois</span><strong className={s.value}>46 min–2 h 20</strong><p>46 min chez Clément ; 2 h 20 chez Nina. Hors démarrage, publication éventuelle et commentaires.</p><a className={s.source} href="#comparison-method" onClick={() => { const details = document.querySelector<HTMLDetailsElement>('#comparison-method'); if (details) details.open = true }}>Voir le calcul<ArrowRight size={11} aria-hidden="true" /></a></>,
      <><span className={s.label}>Durée non chiffrée par l’agence</span><strong className={s.value}>Échanger, valider</strong><p>Vous apportez vos idées et relisez. L’équipe rédige, programme et prépare le bilan.</p><Source name="Méthode Klickbee" href={SOURCES.agency} /></>,
      <><span className={s.label}>Pas encore de moyenne chronométrée</span><strong className={s.value}>Partager, valider</strong><p>Vous apportez votre expertise et relisez les contenus. Votre temps dépend des corrections et des formats choisis.</p></>,
    ],
    [
      <><strong className={s.value}>Vous pilotez tout</strong><p>Choix des sujets, rédaction, corrections, calendrier et analyse. Le rendu dépend de votre savoir-faire et des outils utilisés.</p></>,
      <><strong className={s.value}>Une plume dédiée</strong><p>Clément : voix et calendrier, publication par vous.<br />Nina : stratégie, profil, programmation et retours illimités.</p></>,
      <><strong className={s.value}>Un suivi délégué</strong><p>Positionnement, profil, rédaction, publication et reporting mensuel. Vous validez les contenus.</p></>,
      <><strong className={s.value}>Un parcours intégré</strong><p>Veille, idées, création, programmation et suivi dans un même outil. Vous gardez la décision éditoriale.</p></>,
    ],
  ]

  return <section id="home-comparison" className={s.section} data-comparison-criteria data-animated="false" aria-labelledby="formula-compare-title">
    <div className={s.inner}>
      <header className={s.heading}>
        <span className={s.eyebrow}>Des offres réelles. Un volume précis.</span>
        <h2 id="formula-compare-title">Publier régulièrement.<br /><em>Quel budget pour tenir le rythme ?</em></h2>
        <p><b>8 posts LinkedIn par mois.</b> Même nombre de textes, avec des niveaux de service différents. Les tarifs des prestataires sont ceux de leurs offres publiques, relevés le 6 novembre 2026.</p>
      </header>
      <div className={s.matrix} role="table" aria-label="Comparatif pour 8 posts LinkedIn par mois" aria-describedby="comparison-scope">
        <div className={s.columnHeads} role="row">
          <div role="columnheader">Pour 8 posts / mois</div>
          {OPTIONS.map(option => <div role="columnheader" key={option.key} data-comparison-option={option.key} className={option.key === 'empire' ? s.empire : ''}><b>{option.name}</b><small>{option.detail}</small></div>)}
        </div>
        <div role="rowgroup">
          {rows.map(({ key, name, description, Icon }, row) => <div className={s.row} role="row" data-comparison-axis={key} key={key}>
            <div className={s.axis} role="rowheader"><Icon size={18} aria-hidden="true" /><strong>{name}</strong><span>{description}</span></div>
            {OPTIONS.map((option, col) => <div className={`${s.cell} ${col === 3 ? s.empire : ''}`} role="cell" key={option.key} data-comparison-cell={option.key}><span className={s.mobileLabel}>{option.name}</span>{cells[row][col]}</div>)}
          </div>)}
        </div>
      </div>
      <p className={s.scope} id="comparison-scope">Les fourchettes décrivent les offres citées, pas une moyenne du marché. Les durées viennent des prestataires ; elles ne sont pas des mesures indépendantes. Les postes de temps exclus sont indiqués dans chaque colonne.</p>

      <aside className={s.video} aria-labelledby="comparison-video-title" data-comparison-video>
        <div><Video size={22} aria-hidden="true" /><h3 id="comparison-video-title">Et si vous ajoutez<br /><em>4 Reels par mois ?</em></h3><p>Montage de vidéos courtes à partir de vos rushs. Le tournage reste à votre charge.</p></div>
        <div><span className={s.label}>Exemple de studio de montage</span><strong className={s.price}>+ 289 € HT</strong><p>Clic’N Start : 4 shorts, 2 révisions par vidéo, sans engagement. Délai annoncé : 72 h. Son repère pour un montage manuel : 12–16 h pour 4 shorts, hors tournage.</p><Source name="Voir l’offre du studio" href={SOURCES.video} /></div>
        <div className={s.videoEmpire}><span className={s.label}>Avec Empire Starter</span><strong className={s.price}>Toujours {plan ? `${fmt(plan.price)} €` : 'selon le volume'}</strong><p><b>8 posts + 4 Reels standard = {fmt(mixedCredits)} crédits.</b> Ce volume tient dans les {plan ? fmt(plan.credits) : 'crédits'} du forfait. Rendu et accompagnement différents d’un montage humain sur mesure.</p></div>
      </aside>

      <div className={s.performance} data-comparison-performance>
        <div className={s.performanceHeading}><Target size={21} aria-hidden="true" /><div><span className={s.eyebrow}>Réussir, c’est tenir sur la durée</span><h3>Le bon système est celui<br /><em>que vous utilisez encore dans 3 mois.</em></h3></div></div>
        <div className={s.metrics}>
          <div><span>OBJECTIF DE PRODUCTION</span><h4>24 posts en 3 mois</h4><p>À 8 posts par mois. C’est le rythme visé, pas un résultat déjà obtenu ni une promesse de vues.</p></div>
          <div><span>RÉGULARITÉ RÉELLE</span><h4>Publiés ÷ prévus</h4><p>Le taux de réalisation de votre calendrier. Comptez aussi les semaines sans publication pour repérer les interruptions.</p></div>
          <div><span>EFFORT SOUTENABLE</span><h4>Votre temps par semaine</h4><p>Idées, relecture, corrections et publication : chronométrez ce qui vous reste à faire, même les semaines chargées.</p></div>
        </div>
        <p className={s.success} data-comparison-success><strong>Quelle chance de tenir trois mois ? Pas de taux de continuité mesuré.</strong> Pour donner un pourcentage, il faudrait suivre tous les utilisateurs ayant commencé au même moment et vérifier combien maintiennent leur cadence à trois mois, abandons compris. Ces données comparables ne sont pas disponibles ici, y compris pour Empire. La délégation et l’automatisation changent le travail à fournir ; elles ne prouvent pas, à elles seules, un taux de réussite.</p>
      </div>

      <div className={s.bottom}><p>Un budget que vous pouvez garder.<br /><strong>Un rythme qui tient dans votre semaine.</strong></p><EmpireSalesCta source="home-formula-compare" showDemo={false} /></div>
      <details className={s.method} id="comparison-method">
        <summary>Sources, calculs et prestations incluses <ArrowRight size={14} aria-hidden="true" /></summary>
        <div>
          <p><strong>Freelance · 600 € HT.</strong> Clément Aouadène annonce 8 posts, 2 accroches par post, 30 min d’entretien et 2 min de relecture par texte : 30 + 8 × 2 = 46 min, hors validation du calendrier, publication et conversations. Sans engagement. <Source name="Offre et méthode" href={SOURCES.clement} /></p>
          <p><strong>Freelance · 1 250 € HT.</strong> Nina Senoyer propose 24 posts sur 3 mois, soit 8 par mois, avec stratégie, profil, programmation et retours illimités. Son estimation mensuelle : 2 h d’entretiens + 20 min de validation + 2 h de commentaires = 4 h 20. Le tableau isole les 2 h 20 de préparation et validation. Ajouter environ 4 h de démarrage. Son offre sur 6 mois est à 1 050 € HT/mois. <Source name="Forfaits" href={SOURCES.nina} /> <Source name="Détail du temps" href={SOURCES.time} /></p>
          <p><strong>Seul · rédaction uniquement.</strong> Le repère de 20–40 min par post vient de Nina Senoyer pour un sujet déjà maîtrisé. 8 posts représentent 160–320 min. Ce n’est ni un temps complet de gestion de compte, ni un benchmark avec assistance IA.</p>
          <p><strong>Agence · 1 000 € HT.</strong> Klickbee Intensif comprend 8 posts mensuels et les prestations Standard : positionnement, profil, programmation et reporting. Mise en place : 900 € HT. Minimum contractuel : 3 mois, soit 3 900 € HT avec la mise en place ; puis préavis d’un mois. L’agence ne publie pas de durée précise pour le client. <Source name="Offre Intensif" href={SOURCES.agency} /></p>
          <p><strong>Vidéo · un autre périmètre.</strong> Le studio Clic’N Start affiche 289 € HT pour 4 shorts mensuels, tournage non inclus. Avec les deux offres freelance citées, l’écriture et le montage reviennent à 889 ou 1 539 € HT/mois, auprès de deux prestataires. Le studio estime le montage manuel d’un short habillé à 3–4 h : 12–16 h pour quatre, hors tournage. Ce repère ne mesure pas le temps d’un utilisateur Empire. Les 72 h sont un délai de livraison, pas 72 h de travail. <Source name="Tarif et conditions" href={SOURCES.video} /></p>
          <p><strong>Empire · tarif affiché sur notre page offres.</strong> 8 posts × {CONTENT_CREDITS.post} crédits = {fmt(textCredits)} crédits. Avec 4 Reels standard × {CONTENT_CREDITS.reel}, le total est de {fmt(mixedCredits)} crédits sur {plan ? fmt(plan.credits) : 'le forfait'}. Les clones, formats IA spécifiques, nouvelles générations et vidéos longues peuvent consommer davantage. L’abonnement donne accès au logiciel ; il ne comprend pas un ghostwriter ou un monteur humain dédié. Les offres ne garantissent donc pas un niveau de finition identique.</p>
          <p><strong>Lecture des montants.</strong> Les prix des prestataires sont repris HT comme sur leurs sites ; le montant Empire reprend notre tarif affiché. Aucune économie nette après taxes ni gain de temps Empire n’est calculé. Tarifs et conditions consultés le 6 novembre 2026, à reconfirmer auprès du prestataire.</p>
        </div>
      </details>
    </div>
  </section>
}
