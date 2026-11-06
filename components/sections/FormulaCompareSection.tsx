'use client'

import { useState } from 'react'
import { ArrowRight, Check, CircleDashed, Minus } from 'lucide-react'
import EmpireSalesCta from '@/components/EmpireSalesCta'
import { CONTENT_CREDITS, PLANS } from '@/lib/plans'
import s from './FormulaCompareClear.module.css'

const MONTH = { posts: 8, reels: 4, newsletters: 2 }
const originals = MONTH.posts + MONTH.reels + MONTH.newsletters
const credits = MONTH.posts * CONTENT_CREDITS.post + MONTH.reels * CONTENT_CREDITS.reel + MONTH.newsletters * CONTENT_CREDITS.newsletter
const plan = [...PLANS].sort((a, b) => a.price - b.price).find(p => p.credits >= credits)
const productionFloor = 600 + 289 + MONTH.newsletters * 120
const agencyVideo = 2500
const agencyLinkedIn = 2000
const agencyExample = agencyVideo + agencyLinkedIn
const fmt = (value: number) => value.toLocaleString('fr-FR')
const SOURCES = {
  writing: 'https://clement-aouadene.fr/',
  writingTime: 'https://ninasenoyer.fr/blog/tarif-ghostwriter-linkedin/',
  video: 'https://studio.clicnstart.com/',
  newsletter: 'https://www.webplume.net/tarifs/',
  newsletterTerms: 'https://www.webplume.net/conditions-generales-de-vente-internet/',
  agency: 'https://www.myroragency.com/agence-personal-branding',
}
const OPTIONS = [
  { key: 'tools', name: 'Outils séparés', short: 'Outils seuls', detail: 'Vous pilotez chaque étape' },
  { key: 'freelance', name: 'Freelances + studio', short: 'Freelances', detail: '3 offres additionnées' },
  { key: 'agency', name: 'Agence dédiée', short: 'Agence', detail: 'Exemple MYROR · vidéo + LinkedIn' },
  { key: 'empire', name: 'Empire', short: 'Empire', detail: 'Formule Starter' },
] as const
type Alternative = 'tools' | 'freelance' | 'agency'
type FeatureCell = { text: string; note?: string; status: 'included' | 'conditional' | 'manual' | 'excluded' }
type FeatureRow = { key: string; name: string; cells: [FeatureCell, FeatureCell, FeatureCell, FeatureCell] }
const FEATURES: FeatureRow[] = [
  { key: 'ideas', name: 'Recherche d’idées', cells: [
    { text: 'À faire', status: 'manual' }, { text: 'Angles des posts', status: 'conditional' },
    { text: 'Stratégie dédiée', status: 'included' }, { text: 'Veille + idées', status: 'included' },
  ] },
  { key: 'method', name: 'Formats et méthode', cells: [
    { text: 'À construire', note: 'Vos essais et vos réglages', status: 'manual' }, { text: 'Selon le spécialiste', status: 'conditional' },
    { text: 'Stratégie sur mesure', status: 'included' }, { text: 'Formats déjà testés', note: 'Sur les comptes de Kevin', status: 'included' },
  ] },
  { key: 'review', name: 'Contrôle du montage', cells: [
    { text: 'Vous vérifiez', status: 'manual' }, { text: 'Relecture humaine', status: 'included' },
    { text: 'Monteur dédié', status: 'included' }, { text: 'Vérifié par l’équipe', note: 'Chaque Reel', status: 'included' },
  ] },
  { key: 'posts', name: 'Posts / publications', cells: [
    { text: 'À rédiger', status: 'manual' }, { text: '8 posts', note: 'LinkedIn', status: 'included' },
    { text: 'LinkedIn inclus', note: 'Volume à convenir', status: 'included' }, { text: '8 posts', note: 'Dans cet exemple', status: 'included' },
  ] },
  { key: 'reels', name: 'Vidéos courtes', cells: [
    { text: 'À monter', status: 'manual' }, { text: '4 shorts', note: 'Montage + sous-titres', status: 'included' },
    { text: 'Production incluse', note: 'Volume à convenir', status: 'included' }, { text: '4 Reels', note: 'Montage + sous-titres', status: 'included' },
  ] },
  { key: 'newsletters', name: 'Newsletters', cells: [
    { text: 'À rédiger', status: 'manual' }, { text: '2 newsletters', note: 'Rédaction seule', status: 'included' },
    { text: 'À chiffrer', note: 'Non mentionné', status: 'conditional' }, { text: '2 newsletters', note: 'Envoi via outil connecté', status: 'included' },
  ] },
  { key: 'publishing', name: 'Programmation et publication', cells: [
    { text: 'À organiser', status: 'manual' }, { text: 'Non inclus', note: 'Dans les offres retenues', status: 'excluded' },
    { text: '2 réseaux chiffrés', note: 'Un réseau vidéo court + LinkedIn', status: 'included' }, { text: '7 réseaux', note: 'Selon les formats', status: 'included' },
  ] },
  { key: 'accounts', name: 'Plusieurs comptes', cells: [
    { text: 'Selon vos outils', status: 'conditional' }, { text: 'Non inclus', status: 'excluded' },
    { text: 'À confirmer', note: 'Nombre non précisé', status: 'conditional' }, { text: 'Multi-comptes', note: 'Comptes connectés', status: 'included' },
  ] },
  { key: 'tracking', name: 'Suivi des résultats', cells: [
    { text: 'À relier', status: 'manual' }, { text: 'Non inclus', note: 'Suivi global', status: 'excluded' },
    { text: 'À définir au contrat', status: 'conditional' }, { text: 'Clics, contacts, ventes', note: 'Liens et outils connectés', status: 'included' },
  ] },
  { key: 'clone', name: 'Clonage vidéo', cells: [
    { text: 'Outil à prévoir', status: 'conditional' }, { text: 'En option', note: 'Auprès du studio', status: 'conditional' },
    { text: 'Non mentionné', status: 'conditional' }, { text: 'Disponible', note: 'Crédits selon le format¹', status: 'conditional' },
  ] },
  { key: 'lead', name: 'Lead magnets', cells: [
    { text: 'À créer', status: 'manual' }, { text: 'Non prévu', status: 'excluded' },
    { text: 'Non mentionné', status: 'conditional' }, { text: 'Disponible', note: 'Crédits selon le format¹', status: 'conditional' },
  ] },
  { key: 'youtube', name: 'YouTube long', cells: [
    { text: 'À produire', status: 'manual' }, { text: 'En supplément', note: 'Hors pack de shorts', status: 'conditional' },
    { text: 'Offre distincte', note: '2 500 €/mois', status: 'conditional' }, { text: 'Disponible', note: 'Crédits selon le format¹', status: 'conditional' },
  ] },
]
function Source({ name, href }: { name: string; href: string }) {
  return <a className={s.source} href={href} target="_blank" rel="noopener noreferrer">{name}<ArrowRight size={11} aria-hidden="true" /></a>
}
function CalculationLink() {
  return <a className={s.source} href="#comparison-method" onClick={() => { const details = document.querySelector<HTMLDetailsElement>('#comparison-method'); if (details) details.open = true }}>Sources et calculs<ArrowRight size={11} aria-hidden="true" /></a>
}
function Feature({ cell }: { cell: FeatureCell }) {
  const Icon = cell.status === 'included' ? Check : cell.status === 'conditional' ? CircleDashed : Minus
  const status = { included: 'Inclus', conditional: 'Selon conditions', manual: 'À votre charge', excluded: 'Non inclus' }[cell.status]
  return <div className={s.feature} data-status={cell.status}><Icon size={16} aria-hidden="true" /><span><span className={s.srOnly}>{status} : </span>{cell.text}{cell.note && <small>{cell.note}</small>}</span></div>
}

export default function FormulaCompareSection() {
  const [alternative, setAlternative] = useState<Alternative>('freelance')
  const columnProps = (key: string) => ({ 'data-comparison-column': key, 'data-mobile-visible': key === alternative || key === 'empire', className: key === 'empire' ? s.empire : undefined })

  return <section id="home-comparison" className={s.section} data-comparison-criteria data-animated="false" aria-labelledby="formula-compare-title">
    <div className={s.inner}>
      <header className={s.heading}>
        <span className={s.eyebrow}>Le comparatif</span>
        <h2 id="formula-compare-title">Ce qui est inclus.<br /><em>Ce que ça vous coûte.</em></h2>
        <p>Comparez le budget, votre temps et le travail pris en charge. Empire réunit les idées, la production et la diffusion.</p>
      </header>
      <div className={s.basis} data-comparison-basket><span>Un mois type</span><strong>4 vidéos courtes + 8 posts + 2 newsletters</strong><small>Exemple Empire : 14 contenus originaux. Les volumes et services des prestataires dépendent de leur offre.</small></div>
      <div className={s.mobilePicker} role="group" aria-label="Comparer Empire avec">
        <span>Comparer Empire avec</span><div>{OPTIONS.filter(option => option.key !== 'empire').map(option => <button key={option.key} type="button" aria-pressed={alternative === option.key} aria-controls="comparison-table" onClick={() => setAlternative(option.key as Alternative)}>{option.short}</button>)}</div>
      </div>
      <div className={s.tableWrap}>
        <table id="comparison-table" className={s.table} aria-describedby="comparison-scope comparison-format-note">
          <caption className={s.srOnly}>Prestations incluses et coûts : seul avec des outils, freelances et studio, agence ou Empire.</caption>
          <thead><tr><th scope="col" className={s.criteria}>Votre contenu,<br />de l’idée au résultat</th>{OPTIONS.map(option => <th scope="col" key={option.key} data-comparison-option={option.key} {...columnProps(option.key)}><strong>{option.name}</strong><small>{option.detail}</small></th>)}</tr></thead>
          <tbody data-comparison-axis="money">
            <tr data-comparison-row="monthly"><th scope="row">Budget mensuel</th>
              <td {...columnProps('tools')}><strong className={s.price}>Variables</strong><small>Abonnements à additionner</small></td>
              <td {...columnProps('freelance')}><span className={s.overline}>À partir de</span><strong className={s.price}>{fmt(productionFloor)} €</strong><small>HT / mois · production seule</small></td>
              <td {...columnProps('agency')}><span className={s.overline}>Addition des prix MYROR</span><strong className={s.price}>{fmt(agencyExample)} €</strong><small>/ mois · un réseau vidéo court + LinkedIn<br />Newsletters à chiffrer</small></td>
              <td {...columnProps('empire')}><strong className={s.price} data-comparison-price={plan?.price}>{plan ? `${fmt(plan.price)} €` : 'Selon le volume'}</strong><small>/ mois · facturation mensuelle<br />{fmt(credits)} / {plan ? fmt(plan.credits) : 'forfait'} crédits utilisés</small></td>
            </tr>
            <tr data-comparison-row="quarter"><th scope="row">Budget sur 3 mois</th><td {...columnProps('tools')}>Selon vos outils</td><td {...columnProps('freelance')}>Dès {fmt(productionFloor * 3)} € HT</td><td {...columnProps('agency')}>{fmt(agencyExample * 3)} €<small>Aux prix mensuels affichés</small></td><td {...columnProps('empire')}>{plan ? `${fmt(plan.price * 3)} €` : 'Selon le volume'}</td></tr>
          </tbody>
          <tbody data-comparison-axis="coverage">{FEATURES.map(row => <tr key={row.key} data-comparison-row={row.key}><th scope="row">{row.name}</th>{row.cells.map((cell, i) => <td key={OPTIONS[i].key} {...columnProps(OPTIONS[i].key)}><Feature cell={cell} /></td>)}</tr>)}</tbody>
          <tbody data-comparison-axis="time">
            <tr data-comparison-row="effort"><th scope="row">Votre temps / mois</th>
              <td {...columnProps('tools')}><strong>À votre charge</strong><small>Créer, assembler les outils et publier</small></td>
              <td {...columnProps('freelance')}><strong>Briefs + tournage + retours</strong><small>Temps total non publié</small></td>
              <td {...columnProps('agency')}><strong>2–3 h / mois</strong><small>Temps annoncé par MYROR</small></td>
              <td {...columnProps('empire')}><strong className={s.effort}>≈ 1 h / mois²</strong><small>Repère d’usage Empire</small></td>
            </tr>
            <tr data-comparison-row="work"><th scope="row">Ce qu’il vous reste à faire</th><td {...columnProps('tools')}>Créer, publier, analyser</td><td {...columnProps('freelance')}>Filmer, valider, coordonner et publier</td><td {...columnProps('agency')}>Transmettre vos idées et tourner<small>Équipe dédiée pour la suite</small></td><td {...columnProps('empire')}>Partager votre expertise, enregistrer et valider</td></tr>
          </tbody>
        </table>
      </div>
      <div className={s.legend}><span><Check size={14} aria-hidden="true" /> Inclus dans l’exemple</span><span><CircleDashed size={14} aria-hidden="true" /> Selon conditions / en option</span><span><Minus size={14} aria-hidden="true" /> À votre charge / non inclus</span></div>
      <p className={s.scope} id="comparison-format-note"><b>¹ Clonage, lead magnets et YouTube long :</b> disponibles dans Empire, avec leurs coûts en crédits. Ils ne sont pas ajoutés aux {fmt(credits)} crédits de cet exemple. Les services connectés peuvent avoir leur propre abonnement.</p>
      <p className={s.scope} id="comparison-scope">Prix publics vérifiés le 6 novembre 2026. Les colonnes décrivent les offres citées, pas un tarif moyen ni une prestation identique. MYROR : deux prix additionnés, volume et devis groupé à confirmer. Les republications sur plusieurs comptes ne comptent pas comme de nouveaux contenus.</p>
      <div className={s.references}><CalculationLink /><a className={s.source} href="/tarifs">Toutes les formules Empire<ArrowRight size={11} aria-hidden="true" /></a></div>

      <details className={s.method} id="comparison-method">
        <summary>Voir le détail des prix, des temps et des crédits <ArrowRight size={14} aria-hidden="true" /></summary>
        <div>
          <p><strong>8 posts texte · 600 € HT/mois.</strong> Clément Aouadène : écriture, angles et calendrier. La publication reste à votre charge. Son repère client est de 30 min d’entretien + 8 × 2 min de relecture = 46 min, hors démarrage, validation du calendrier, publication et conversations. Ce temps ne couvre pas les autres formats. <Source name="Offre du rédacteur" href={SOURCES.writing} /></p>
          <p><strong>4 vidéos courtes · 289 € HT/mois.</strong> Clic’N Start Essentiel : montage depuis vos rushs, 2 révisions par vidéo, sans engagement. Livraison annoncée sous 72 h après réception des rushs ; ce délai n’est pas du temps de travail. Tournage et publication ne sont pas inclus. <Source name="Offre du studio" href={SOURCES.video} /></p>
          <p><strong>2 newsletters · à partir de 240 €.</strong> Webplume affiche la rédaction à partir de 120 € par newsletter, TVA non applicable selon ses CGV. Le tarif exact, la longueur, les corrections et la disponibilité sont à confirmer sur devis. L’envoi et la plateforme email ne sont pas comptés dans cet exemple. <Source name="Tarif Webplume" href={SOURCES.newsletter} /> <Source name="Conditions tarifaires" href={SOURCES.newsletterTerms} /></p>
          <p><strong>Total de production séparée.</strong> 600 + 289 + 2 × 120 = <b>{fmt(productionFloor)} € HT minimum par mois</b>, soit {fmt(productionFloor * 3)} € HT sur trois mois à ces conditions. C’est l’addition de trois offres indépendantes, pas un forfait commun ni le prix de tous les freelances. Un même prestataire peut regrouper ces missions et proposer un autre tarif. La diffusion, l’emailing et le suivi transversal restent à organiser ou à chiffrer.</p>
          <p><strong>Agence dédiée · référence MYROR.</strong> La gestion d’un réseau vidéo court est affichée à {fmt(agencyVideo)} €/mois et LinkedIn à {fmt(agencyLinkedIn)} €/mois : {fmt(agencyVideo)} + {fmt(agencyLinkedIn)} = <b>{fmt(agencyExample)} €/mois</b>, soit {fmt(agencyExample * 3)} € sur trois mois à ces prix. Stratégie, tournage, montage et publication sont pris en charge. L’agence annonce 2–3 h de temps client par mois. Volumes, taxes, engagement, éventuelle remise groupée et newsletters restent à confirmer sur devis. Cette agence spécialisée est un exemple de service dédié, pas le prix de toutes les agences. <Source name="Prix et méthode MYROR" href={SOURCES.agency} /></p>
          <p><strong>Temps de production manuelle, partiel.</strong> Nina Senoyer estime l’écriture d’un post sur un sujet maîtrisé à 20–40 min : 8 posts = 2 h 40–5 h 20. Clic’N Start estime un short habillé à 3–4 h de montage : 4 shorts = 12–16 h. Somme : 14 h 40–21 h 20, arrondie à environ 15–21 h. Il faut encore ajouter recherche, tournage, newsletters, diffusion et analyse. Ces repères viennent de prestataires, sans assistance IA ; ils ne mesurent ni un débutant ni un utilisateur Empire. <Source name="Repère de rédaction" href={SOURCES.writingTime} /> <Source name="Repère de montage" href={SOURCES.video} /></p>
          <p><strong>Empire · trois formats dans un seul forfait.</strong> {MONTH.posts} posts × {CONTENT_CREDITS.post} crédits + {MONTH.reels} Reels standard × {CONTENT_CREDITS.reel} + {MONTH.newsletters} newsletters × {CONTENT_CREDITS.newsletter} = <b>{fmt(credits)} crédits</b>, sur {plan ? fmt(plan.credits) : 'le forfait'}. Starter est affiché à {plan ? fmt(plan.price) : 'un tarif variable'} €/mois en facturation mensuelle. Clonage, formats IA spécifiques, nouvelles générations et vidéos longues peuvent demander davantage de crédits. Les 7 réseaux sont Instagram, LinkedIn, YouTube, TikTok, Threads, X et Facebook ; ils ne reçoivent pas tous chaque format. Les services email et autres outils connectés peuvent avoir leurs propres abonnements.</p>
          <p><strong>² Votre temps avec Empire.</strong> Environ une heure par mois est le repère d’usage communiqué par Empire pour sa production mensuelle habituelle. C’est une estimation de la marque, pas une moyenne issue d’une étude comparative. Le temps dépend du démarrage, des formats choisis et des retours.</p>
          <p><strong>Méthode et résultats.</strong> Les formats testés sur les comptes de Kevin, le montage vérifié par l’équipe et la programmation sur plusieurs réseaux constituent les moyens fournis par Empire. Ils ne démontrent pas qu’un outil seul obtient forcément de moins bons résultats. Sur notre exemple, tenir trois mois représente 42 originaux ; aucun taux de continuité comparable n’a été mesuré entre ces solutions. Les prix ne permettent pas de prédire les vues ou les ventes.</p>
        </div>
      </details>

      <div className={s.continuity} data-comparison-performance><div><span className={s.eyebrow}>Tenir dans la durée</span><strong>Votre expertise. Environ 1 h par mois².</strong><p>Des formats guidés, un montage vérifié et une diffusion programmée : votre présence ne repose plus sur une liste d’outils à coordonner.</p></div><p data-comparison-success>Dans cet exemple : {originals * 3} contenus originaux sur trois mois. Un planning à tenir avec votre expertise, la création et la diffusion réunies dans Empire.</p></div>
      <div className={s.bottom}><p>Choisissez ce que vous déléguez.<br /><strong>Gardez votre expertise.</strong></p><EmpireSalesCta source="home-formula-compare" showDemo={false} /></div>
    </div>
  </section>
}
