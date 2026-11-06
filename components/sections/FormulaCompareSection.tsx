'use client'

import { ArrowRight, Clock3, Coins, ListChecks, Video, Mail, FileText, Search, Send, ChartNoAxesCombined, Target } from 'lucide-react'
import EmpireSalesCta from '@/components/EmpireSalesCta'
import { CONTENT_CREDITS, PLANS } from '@/lib/plans'
import s from './FormulaCompareClear.module.css'

const MONTH = { posts: 8, reels: 4, newsletters: 2 }
const originals = MONTH.posts + MONTH.reels + MONTH.newsletters
const credits = MONTH.posts * CONTENT_CREDITS.post + MONTH.reels * CONTENT_CREDITS.reel + MONTH.newsletters * CONTENT_CREDITS.newsletter
const plan = [...PLANS].sort((a, b) => a.price - b.price).find(p => p.credits >= credits)
const productionFloor = 600 + 289 + MONTH.newsletters * 120
const agencyExample = 890 + 390
const fmt = (value: number) => value.toLocaleString('fr-FR')
const SOURCES = {
  writing: 'https://clement-aouadene.fr/',
  writingTime: 'https://ninasenoyer.fr/blog/tarif-ghostwriter-linkedin/',
  video: 'https://studio.clicnstart.com/',
  newsletter: 'https://www.webplume.net/tarifs/',
  newsletterTerms: 'https://www.webplume.net/conditions-generales-de-vente-internet/',
  agency: 'https://flowify.fr/tarifs/',
}
const OPTIONS = [
  { key: 'tools', name: 'Seul + outils', detail: 'Vous reliez les étapes.' },
  { key: 'freelance', name: 'Des prestataires', detail: 'Écriture, montage, newsletter.' },
  { key: 'agency', name: 'Une agence', detail: 'Production et gestion déléguées.' },
  { key: 'empire', name: 'Empire', detail: 'Un studio pour tous vos formats.' },
] as const
const JOURNEY = [
  { title: 'Trouver les idées', detail: 'Vos idées, la veille et les publications de vos concurrents.', Icon: Search },
  { title: 'Créer vos contenus', detail: 'Vidéos courtes, posts et newsletters à partir de votre expertise.', Icon: Video },
  { title: 'Diffuser', detail: 'Programmation sur 7 réseaux et plusieurs comptes, selon les formats.', Icon: Send },
  { title: 'Suivre les résultats', detail: 'Clics, contacts et revenus attribués via vos liens et outils connectés.', Icon: ChartNoAxesCombined },
]
function Source({ name, href }: { name: string; href: string }) {
  return <a className={s.source} href={href} target="_blank" rel="noopener noreferrer">{name}<ArrowRight size={11} aria-hidden="true" /></a>
}
function CalculationLink() {
  return <a className={s.source} href="#comparison-method" onClick={() => { const details = document.querySelector<HTMLDetailsElement>('#comparison-method'); if (details) details.open = true }}>Voir le calcul<ArrowRight size={11} aria-hidden="true" /></a>
}

export default function FormulaCompareSection() {
  const rows = [
    { key: 'money', name: 'Votre budget', description: 'Textes, vidéos et newsletters. Périmètres précisés pour chaque offre.', Icon: Coins },
    { key: 'time', name: 'Votre temps', description: 'Produire, transmettre votre expertise, valider et coordonner.', Icon: Clock3 },
    { key: 'coverage', name: 'Qui fait quoi ?', description: 'De la recherche d’idées au suivi des résultats.', Icon: ListChecks },
  ]
  const cells = [
    [
      <><span className={s.label}>Vos abonnements</span><strong className={s.value}>Selon vos outils</strong><p>Écriture, montage, emailing, programmation et statistiques : vous composez votre équipement.</p></>,
      <><span className={s.label}>Exemple de production séparée · HT / mois</span><strong className={s.price}>Dès {fmt(productionFloor)} €</strong><p><b>8 posts + 4 shorts + 2 newsletters.</b> Trois offres additionnées ; diffusion et suivi global à compléter.</p><CalculationLink /></>,
      <><span className={s.label}>Exemple Flowify · prix affichés / mois</span><strong className={s.price}>{fmt(agencyExample)} €</strong><p>890 € de social + 390 € d’emailing. <b>Offre plus large :</b> 24 publications, 4 Reels et 2 newsletters, avec gestion et suivi.</p><Source name="Voir les deux offres" href={SOURCES.agency} /></>,
      <><span className={s.label}>Starter · facturation mensuelle</span><strong className={s.price} data-comparison-price={plan?.price}>{plan ? `${fmt(plan.price)} €` : 'Selon le volume'}</strong><p><b>Les 3 formats dans le même abonnement.</b> {fmt(credits)} crédits sur {plan ? fmt(plan.credits) : 'le forfait'}. Sur 3 mois au tarif mensuel : {plan ? `${fmt(plan.price * 3)} €` : 'selon le volume'}.</p><a className={s.source} href="/tarifs">Voir les formules<ArrowRight size={11} aria-hidden="true" /></a></>,
    ],
    [
      <><span className={s.label}>Posts + montage manuel seulement</span><strong className={s.value}>≈ 15–21 h / mois</strong><p>Repères de prestataires, sans assistance IA. Ajouter newsletters, tournage, recherche, diffusion et bilan.</p><CalculationLink /></>,
      <><span className={s.label}>Repère pour les 8 posts seuls</span><strong className={s.value}>46 min + le reste</strong><p>Brief et relecture annoncés par le rédacteur. Ajouter tournage, retours vidéo, validation des newsletters et coordination.</p><Source name="Méthode du rédacteur" href={SOURCES.writing} /></>,
      <><span className={s.label}>Temps client non chiffré</span><strong className={s.value}>Briefer, valider</strong><p>Vous fournissez la matière et faites vos retours. Le devis précise qui filme, qui publie et qui répond à l’audience.</p></>,
      <><span className={s.label}>Pas encore de moyenne chronométrée</span><strong className={s.value}>Créer depuis vos idées</strong><p>Vous apportez votre expertise, enregistrez et validez. Les étapes de création et de diffusion restent réunies dans Empire.</p></>,
    ],
    [
      <><strong className={s.value}>Tout coordonner</strong><p>Veille, textes, montage, déclinaisons, programmation et analyse. Vous passez d’un outil à l’autre selon votre équipement.</p></>,
      <><strong className={s.value}>Assembler les missions</strong><p>Dans cet exemple, les prestataires livrent les contenus. La diffusion sur vos comptes et l’analyse commune restent à organiser.</p></>,
      <><strong className={s.value}>Déléguer un périmètre</strong><p>L’offre citée prévoit 4 réseaux, la veille, la gestion des messages et l’emailing. Les formats et comptes supplémentaires se négocient.</p></>,
      <><strong className={s.value}>Un parcours commun</strong><p>Idées, vidéos, textes, newsletters, multi-comptes et suivi des résultats. Vos contenus restent reliés à leur diffusion.</p></>,
    ],
  ]

  return <section id="home-comparison" className={s.section} data-comparison-criteria data-animated="false" aria-labelledby="formula-compare-title">
    <div className={s.inner}>
      <header className={s.heading}>
        <span className={s.eyebrow}>Votre studio de contenu complet</span>
        <h2 id="formula-compare-title">Vidéos, posts, newsletters.<br /><em>De vos idées à leurs résultats.</em></h2>
        <p>Empire réunit la recherche d’idées, la création dans plusieurs formats, la diffusion et le suivi. Comparons ce travail dans son ensemble.</p>
      </header>

      <div className={s.journey} data-comparison-journey aria-label="Le parcours de contenu Empire">
        {JOURNEY.map(({ title, detail, Icon }, i) => <div key={title}><span className={s.journeyNumber}>0{i + 1}</span><Icon size={21} aria-hidden="true" /><h3>{title}</h3><p>{detail}</p></div>)}
      </div>
      <div className={s.formats} data-comparison-formats><strong>Et selon votre stratégie :</strong><span>Clonage</span><span>Lead magnets</span><span>YouTube long</span><p>Ces formats ont leurs propres coûts en crédits et ne sont pas ajoutés au volume d’exemple ci-dessous.</p></div>

      <div className={s.basket} data-comparison-basket>
        <div className={s.basketHeading}><b>Un mois de contenu, par exemple</b><span>{originals} contenus originaux · 3 formats</span></div>
        <ul>
          <li><Video size={19} aria-hidden="true" /><strong>{MONTH.reels}</strong><span>vidéos courtes<small>Reels, Shorts, TikTok</small></span></li>
          <li><FileText size={19} aria-hidden="true" /><strong>{MONTH.posts}</strong><span>posts texte<small>LinkedIn dans cet exemple</small></span></li>
          <li><Mail size={19} aria-hidden="true" /><strong>{MONTH.newsletters}</strong><span>newsletters<small>Pour votre audience email</small></span></li>
        </ul>
        <p>Les republications sur plusieurs comptes ne comptent pas comme de nouveaux contenus. Vos formats et comptes connectés déterminent les canaux de diffusion.</p>
      </div>

      <div className={s.matrix} role="table" aria-label="Comparer la production de vidéos, posts et newsletters et leur diffusion" aria-describedby="comparison-scope">
        <div className={s.columnHeads} role="row"><div role="columnheader">Une présence dans plusieurs formats</div>{OPTIONS.map(option => <div role="columnheader" key={option.key} data-comparison-option={option.key} className={option.key === 'empire' ? s.empire : ''}><b>{option.name}</b><small>{option.detail}</small></div>)}</div>
        <div role="rowgroup">{rows.map(({ key, name, description, Icon }, row) => <div className={s.row} role="row" data-comparison-axis={key} key={key}><div className={s.axis} role="rowheader"><Icon size={18} aria-hidden="true" /><strong>{name}</strong><span>{description}</span></div>{OPTIONS.map((option, col) => <div className={`${s.cell} ${col === 3 ? s.empire : ''}`} role="cell" key={option.key} data-comparison-cell={option.key}><span className={s.mobileLabel}>{option.name}</span>{cells[row][col]}</div>)}</div>)}</div>
      </div>
      <p className={s.scope} id="comparison-scope">Repères tirés d’offres publiques consultées le 6 novembre 2026. Les prestations séparées, l’agence et le logiciel n’incluent pas le même accompagnement. Le total des prestataires est un point de départ, pas une moyenne du marché ni un devis global. L’agence propose un volume plus large.</p>

      <details className={s.method} id="comparison-method">
        <summary>Voir le détail des prix, des temps et des crédits <ArrowRight size={14} aria-hidden="true" /></summary>
        <div>
          <p><strong>8 posts texte · 600 € HT/mois.</strong> Clément Aouadène : écriture, angles et calendrier. La publication reste à votre charge. Son repère client est de 30 min d’entretien + 8 × 2 min de relecture = 46 min, hors démarrage, validation du calendrier, publication et conversations. Ce temps ne couvre pas les autres formats. <Source name="Offre du rédacteur" href={SOURCES.writing} /></p>
          <p><strong>4 vidéos courtes · 289 € HT/mois.</strong> Clic’N Start Essentiel : montage depuis vos rushs, 2 révisions par vidéo, sans engagement. Livraison annoncée sous 72 h après réception des rushs ; ce délai n’est pas du temps de travail. Tournage et publication ne sont pas inclus. <Source name="Offre du studio" href={SOURCES.video} /></p>
          <p><strong>2 newsletters · à partir de 240 €.</strong> Webplume affiche la rédaction à partir de 120 € par newsletter, TVA non applicable selon ses CGV. Le tarif exact, la longueur, les corrections et la disponibilité sont à confirmer sur devis. L’envoi et la plateforme email ne sont pas comptés dans cet exemple. <Source name="Tarif Webplume" href={SOURCES.newsletter} /> <Source name="Conditions tarifaires" href={SOURCES.newsletterTerms} /></p>
          <p><strong>Total de production séparée.</strong> 600 + 289 + 2 × 120 = <b>{fmt(productionFloor)} € HT minimum par mois</b>, soit {fmt(productionFloor * 3)} € HT sur trois mois à ces conditions. C’est l’addition de trois offres indépendantes, pas un forfait commun ni le prix de tous les freelances. Un même prestataire peut regrouper ces missions et proposer un autre tarif. La diffusion, l’emailing et le suivi transversal restent à organiser ou à chiffrer.</p>
          <p><strong>Agence · exemple plus large.</strong> Flowify affiche Social Pro à 890 €/mois (24 publications + 4 Reels, 4 réseaux, veille et messages) et Email Marketing à 390 €/mois (2 newsletters, séquence de bienvenue, segmentation et reporting). Addition : {fmt(agencyExample)} €/mois, soit {fmt(agencyExample * 3)} € sur trois mois, aux prix affichés, sans engagement annoncé. Le mix de formats, les contenus uniques, les taxes et la captation sont à confirmer. Nous ne ramenons pas ce forfait à un prix par contenu. <Source name="Offres Flowify" href={SOURCES.agency} /></p>
          <p><strong>Temps de production manuelle, partiel.</strong> Nina Senoyer estime l’écriture d’un post sur un sujet maîtrisé à 20–40 min : 8 posts = 2 h 40–5 h 20. Clic’N Start estime un short habillé à 3–4 h de montage : 4 shorts = 12–16 h. Somme : 14 h 40–21 h 20, arrondie à environ 15–21 h. Il faut encore ajouter recherche, tournage, newsletters, diffusion et analyse. Ces repères viennent de prestataires, sans assistance IA ; ils ne mesurent ni un débutant ni un utilisateur Empire. <Source name="Repère de rédaction" href={SOURCES.writingTime} /> <Source name="Repère de montage" href={SOURCES.video} /></p>
          <p><strong>Empire · trois formats dans un seul forfait.</strong> {MONTH.posts} posts × {CONTENT_CREDITS.post} crédits + {MONTH.reels} Reels standard × {CONTENT_CREDITS.reel} + {MONTH.newsletters} newsletters × {CONTENT_CREDITS.newsletter} = <b>{fmt(credits)} crédits</b>, sur {plan ? fmt(plan.credits) : 'le forfait'}. Starter est affiché à {plan ? fmt(plan.price) : 'un tarif variable'} €/mois en facturation mensuelle. Clonage, formats IA spécifiques, nouvelles générations et vidéos longues peuvent demander davantage de crédits. Les 7 réseaux sont Instagram, LinkedIn, YouTube, TikTok, Threads, X et Facebook ; ils ne reçoivent pas tous chaque format. Les services email et autres outils connectés peuvent avoir leurs propres abonnements.</p>
          <p><strong>Ce qui est comparé.</strong> Un service humain dédié et un logiciel de création n’offrent pas la même finition ni le même travail de conseil. Aucun gain de temps Empire, économie nette après taxes, résultat commercial ou taux de continuité n’est déduit de ces prix.</p>
        </div>
      </details>

      <div className={s.performance} data-comparison-performance>
        <div className={s.performanceHeading}><Target size={21} aria-hidden="true" /><div><span className={s.eyebrow}>Tenir dans la durée</span><h3>Le même rythme,<br /><em>sur tous vos formats.</em></h3></div></div>
        <div className={s.metrics}>
          <div><span>OBJECTIF SUR 3 MOIS</span><h4>{originals * 3} contenus originaux</h4><p>12 vidéos, 24 posts et 6 newsletters dans cet exemple. Les republications ne gonflent pas le total.</p></div>
          <div><span>RÉGULARITÉ RÉELLE</span><h4>Publiés ÷ prévus</h4><p>Vérifiez votre cadence format par format, et les semaines où votre planning s’interrompt.</p></div>
          <div><span>EFFORT SOUTENABLE</span><h4>Votre temps par semaine</h4><p>Comptez aussi le tournage, les validations et la coordination pour savoir si ce rythme tient dans votre agenda.</p></div>
        </div>
        <p className={s.success} data-comparison-success><strong>Pas de taux de continuité mesuré.</strong> Nous ne disposons pas d’un suivi comparable des personnes qui maintiennent ce rythme pendant trois mois, abandons compris, y compris pour Empire. La cadence indiquée est un objectif, pas une probabilité de réussite.</p>
      </div>
      <div className={s.bottom}><p>Vos idées deviennent plusieurs formats.<br /><strong>Leur création, leur diffusion et leurs résultats restent reliés.</strong></p><EmpireSalesCta source="home-formula-compare" showDemo={false} /></div>
    </div>
  </section>
}
