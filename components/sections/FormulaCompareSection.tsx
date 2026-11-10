'use client'

import { useState } from 'react'
import { ArrowRight, Building2, Check, CircleDashed, Clapperboard, Mail, MessageCircle, Minus, Palette, PenLine } from 'lucide-react'
import EmpireSalesCta from '@/components/EmpireSalesCta'
import { CONTENT_CREDITS, PLANS } from '@/lib/plans'
import s from './FormulaCompareClear.module.css'

const MONTH = { posts: 8, reels: 4, newsletters: 2 }
const originals = MONTH.posts + MONTH.reels + MONTH.newsletters
const credits = MONTH.posts * CONTENT_CREDITS.post + MONTH.reels * CONTENT_CREDITS.reel + MONTH.newsletters * CONTENT_CREDITS.newsletter
const sorted = [...PLANS].sort((a, b) => a.price - b.price)
const plan = sorted.find(p => p.credits >= credits)
const topPlan = sorted[sorted.length - 1]
const fmt = (value: number) => value.toLocaleString('fr-FR')

/** Prix publics relevés le 6 novembre 2026. Les dollars sont comptés pour un euro. */
const TOOLS = [
  { name: 'ChatGPT Plus', role: 'idées, scripts, brouillons', price: 23, unit: '€', href: 'https://openai.com/chatgpt/pricing/', core: true },
  { name: 'Taplio Starter', role: 'programmer LinkedIn', price: 39, unit: '$', href: 'https://taplio.com/pricing', core: true },
  { name: 'Submagic Starter', role: 'sous-titres et montage de 15 vidéos', price: 19, unit: '€', href: 'https://www.submagic.co/pricing', core: true },
  { name: 'Opus Clip Starter', role: 'découper une vidéo longue', price: 15, unit: '$', href: 'https://www.opus.pro/pricing', core: true },
  { name: 'Metricool Starter', role: 'programmer sur plusieurs réseaux', price: 20, unit: '€', href: 'https://metricool.com/pricing/', core: true },
  { name: 'ManyChat Essential', role: 'DM Instagram automatisés (39 $ avec l’IA)', price: 17, unit: '$', href: 'https://manychat.com/pricing', core: true },
  { name: 'Google AI Pro', role: 'images Nano Banana', price: 21.99, unit: '€', href: 'https://gemini.google/fr/subscriptions/', core: true },
  { name: 'HeyGen Creator', role: 'clone vidéo et voix', price: 29, unit: '$', href: 'https://www.heygen.com/pricing', core: false },
  { name: 'Switchy Team', role: 'liens trackés', price: 47, unit: '$', href: 'https://www.switchy.io/pricing', core: false },
]
const toolsFloor = Math.round(TOOLS.filter(t => t.core).reduce((sum, t) => sum + t.price, 0))
const toolsFull = Math.round(TOOLS.reduce((sum, t) => sum + t.price, 0) + (39 - 17))

/** Cinq métiers pour couvrir le périmètre d'Empire, aux fourchettes publiées. */
const TEAM = [
  { role: 'Ghostwriter LinkedIn', scope: '8 posts par mois', low: 800, high: 1500, href: 'https://copylinker.fr/tarif-ghostwriter-linkedin/', source: 'Fourchettes ghostwriting' },
  { role: 'Monteur vidéo', scope: 'forfait mensuel', low: 700, high: 1000, href: 'https://www.montageguepard.com/forfait-mensuel-monteur-video/', source: 'Forfaits de montage' },
  { role: 'Community manager', scope: '4 réseaux et plus, stratégie, modération', low: 2000, high: 3500, href: 'https://www.transacts.fr/blog/tarif-community-manager', source: 'Barème community manager' },
  { role: 'Graphiste', scope: '2 jours par mois à 402 € (Malt)', low: 800, high: 800, href: 'https://www.malt.fr/t/barometre-tarifs/web-graphic-design/graphiste', source: 'Baromètre Malt' },
  { role: 'Rédacteur newsletter', scope: '2 newsletters à 120 €', low: 240, high: 240, href: 'https://www.webplume.net/tarifs/', source: 'Tarif Webplume' },
]
const teamLow = TEAM.reduce((sum, t) => sum + t.low, 0)
const teamHigh = TEAM.reduce((sum, t) => sum + t.high, 0)
const productionFloor = 600 + 289 + MONTH.newsletters * 120

const agencyVideo = 2500
const agencyLinkedIn = 2000
const agencyExample = agencyVideo + agencyLinkedIn
const agencyWithYouTube = agencyExample + 2500
const agencyLow = 2500

const SOURCES = {
  writing: 'https://clement-aouadene.fr/',
  writingTime: 'https://ninasenoyer.fr/blog/tarif-ghostwriter-linkedin/',
  video: 'https://studio.clicnstart.com/',
  newsletter: 'https://www.webplume.net/tarifs/',
  newsletterTerms: 'https://www.webplume.net/conditions-generales-de-vente-internet/',
  agency: 'https://www.myroragency.com/agence-personal-branding',
  fragment: 'https://studio-fragment.fr/',
  teazit: 'https://teazit.com/landing-page-abonnement-location-studio/',
  agenceVideo: 'https://www.agence-video.net/autorite-dirigeant-influence/',
  personaOne: 'https://personaone.fr/',
  agencePersonnelle: 'https://agence-prsnl.com/entrepreneurs/',
  coordination: 'https://www.heysimon.fr/articles/cout-coordination-creation-graphique',
  freelanceOverhead: 'https://lolopepe.com/blog/hidden-costs-managing-freelancers-b2b-cmos',
  ghostTime: 'https://clement-aouadene.fr/ghostwriter-linkedin',
  ghostTimeKatalyx: 'https://katalyx.fr/linkedin/personal-branding-dirigeants',
  ghostTimeIpeople: 'https://ipeople.it/fr/comment-ca-marche/',
  editorRevisions: 'https://fox-rider.com/prestations/montage-video',
  cmValidation: 'https://lescreavores.fr/services/social-media/',
}

/** Temps client avec des freelances : coordination de plusieurs prestataires, hors tournage. */
const COORD_HOURS_WEEK = { low: 3, high: 6 }
const coordMonthLow = COORD_HOURS_WEEK.low * 4
const coordMonthHigh = COORD_HOURS_WEEK.high * 4
const manualHours = { low: 15, high: 21 }
const empirePrice = plan?.price ?? 199
const savingsFreelance = { low: teamLow - empirePrice, high: teamHigh - empirePrice }
const savingsAgency = { low: agencyLow - empirePrice, high: agencyWithYouTube - empirePrice }

function CellSources({ items }: { items: Array<[string, string]> }) {
  return <small className={s.cellSources}>Sources : {items.map(([name, href], i) => <span key={href}><a href={href} target="_blank" rel="noopener noreferrer">{name}</a>{i < items.length - 1 ? ' · ' : ''}</span>)}</small>
}
const OPTIONS = [
  { key: 'tools', name: 'Outils seuls', short: 'Outils seuls', detail: 'Tu fais tout, avec 7 à 9 abonnements' },
  { key: 'freelance', name: 'Freelances', short: 'Freelances', detail: '5 métiers à recruter et coordonner' },
  { key: 'agency', name: 'Agence dédiée', short: 'Agence', detail: 'Un contrat, un périmètre, un engagement' },
  { key: 'empire', name: 'Empire', short: 'Empire', detail: 'Un abonnement, tout compris' },
] as const
type Alternative = 'tools' | 'freelance' | 'agency'
type FeatureCell = { text: string; note?: string; status: 'included' | 'conditional' | 'manual' | 'excluded' }
type FeatureRow = { key: string; name: string; detail?: boolean; cells: [FeatureCell, FeatureCell, FeatureCell, FeatureCell] }
const FEATURES: FeatureRow[] = [
  { key: 'distribution', name: 'Publication, DM et commentaires sur 7 réseaux', cells: [
    { text: 'Tu programmes et réponds', note: 'Metricool, ManyChat', status: 'manual' }, { text: 'Community manager', note: 'Réseaux selon son forfait', status: 'included' },
    { text: 'Réseaux du contrat', note: 'MYROR : 1 réseau vidéo + LinkedIn · commentaires Instagram', status: 'conditional' }, { text: '7 réseaux + setter IA + boîte unique', note: 'Publication programmée, réponses centralisées', status: 'included' },
  ] },
  { key: 'tracking', name: 'Suivi des leads jusqu’au client', cells: [
    { text: 'À relier', note: 'Switchy, CRM', status: 'manual' }, { text: 'Non inclus', status: 'excluded' },
    { text: 'À définir au contrat', status: 'conditional' }, { text: 'Liens trackés + CRM', note: 'Clics, contacts, ventes', status: 'included' },
  ] },
  { key: 'ideas', detail: true, name: 'Idées et sujets', cells: [
    { text: 'À chercher toi-même', status: 'manual' }, { text: 'Angles LinkedIn', note: 'Par le ghostwriter', status: 'conditional' },
    { text: 'Stratégie dédiée', status: 'included' }, { text: 'Veille + sujets prêts', note: 'Chaque semaine', status: 'included' },
  ] },
  { key: 'method', detail: true, name: 'Formats et méthode', cells: [
    { text: 'À tester toi-même', note: 'Tes essais, tes réglages', status: 'manual' }, { text: 'Selon chaque spécialiste', status: 'conditional' },
    { text: 'Stratégie sur mesure', status: 'included' }, { text: 'Formats déjà testés', note: 'Sur les comptes de Kevin', status: 'included' },
  ] },
  { key: 'posts', detail: true, name: 'Posts écrits', cells: [
    { text: 'Tu écris', note: 'ChatGPT, Taplio', status: 'manual' }, { text: '8 posts', note: 'Ghostwriter', status: 'included' },
    { text: 'LinkedIn inclus', note: `${fmt(agencyLinkedIn)} € chez MYROR · volume à convenir`, status: 'included' }, { text: '8 posts', note: 'Dans cet exemple', status: 'included' },
  ] },
  { key: 'reels', detail: true, name: 'Vidéos courtes montées', cells: [
    { text: 'Tu montes', note: 'Submagic, Opus Clip', status: 'manual' }, { text: 'Forfait monteur', note: '4 à 12 vidéos selon l’offre', status: 'included' },
    { text: '1 réseau court au choix', note: 'Instagram, TikTok ou Shorts · volume à convenir', status: 'included' }, { text: '4 Reels', note: 'Montage + sous-titres', status: 'included' },
  ] },
  { key: 'review', detail: true, name: 'Montage vérifié par un humain', cells: [
    { text: 'Tu vérifies', status: 'manual' }, { text: 'Par le monteur', status: 'included' },
    { text: 'Monteur dédié', status: 'included' }, { text: 'Chaque Reel vérifié', note: 'Par l’équipe Empire', status: 'included' },
  ] },
  { key: 'visuals', detail: true, name: 'Visuels et carrousels', cells: [
    { text: 'Tu crées', note: 'Nano Banana, Canva', status: 'manual' }, { text: 'Graphiste à la journée', status: 'conditional' },
    { text: 'Selon devis', status: 'conditional' }, { text: 'Carrousels, miniatures, images', status: 'included' },
  ] },
  { key: 'newsletters', detail: true, name: 'Newsletters', cells: [
    { text: 'Tu rédiges', note: 'Substack gratuit', status: 'manual' }, { text: '2 newsletters', note: 'Rédaction seule', status: 'included' },
    { text: 'Non mentionné', note: 'À chiffrer', status: 'conditional' }, { text: '2 newsletters', note: 'Envoi via outil connecté', status: 'included' },
  ] },
  { key: 'accounts', detail: true, name: 'Plusieurs comptes', cells: [
    { text: 'Selon tes outils', status: 'conditional' }, { text: 'À renégocier', status: 'conditional' },
    { text: 'À confirmer', note: 'Nombre non précisé', status: 'conditional' }, { text: 'Multi-comptes', note: 'Comptes connectés', status: 'included' },
  ] },
  { key: 'advanced', detail: true, name: 'Clone, lead magnets, YouTube long', cells: [
    { text: 'Outils à ajouter', note: 'HeyGen, montage long', status: 'conditional' }, { text: 'En option', note: 'Auprès du studio', status: 'conditional' },
    { text: 'YouTube long à part', note: `+2 500 €/mois chez MYROR`, status: 'conditional' }, { text: 'Disponibles', note: 'Crédits selon le format¹', status: 'conditional' },
  ] },
]

/** Bandeau de synthèse : quatre cartes alignées sur une grille (visuel, €/mois, h/mois, ce que tu fais). */
const TOOL_PILLS = ['ChatGPT', 'Taplio', 'Submagic', 'Opus Clip', 'Metricool', 'ManyChat', 'Gemini']
const TEAM_ICONS = [
  { label: 'Ghostwriter', Icon: PenLine }, { label: 'Monteur', Icon: Clapperboard }, { label: 'Community manager', Icon: MessageCircle },
  { label: 'Graphiste', Icon: Palette }, { label: 'Rédacteur', Icon: Mail },
]
const SUMMARY = {
  tools: { price: `${fmt(toolsFloor)}–${fmt(toolsFull)} €`, priceNote: '/ mois · 7 à 9 abonnements', hours: `${manualHours.low}–${manualHours.high} h +`, hoursNote: '/ mois, tout à la main', you: 'Tout : idées, écriture, montage, publication, réponses' },
  freelance: { price: `${fmt(teamLow)}–${fmt(teamHigh)} €`, priceNote: 'HT / mois · 5 prestataires', hours: `${coordMonthLow}–${coordMonthHigh} h`, hoursNote: '/ mois de coordination', you: 'Recruter, briefer, filmer, valider' },
  agency: { price: `${fmt(agencyLow)}–${fmt(agencyWithYouTube)} €`, priceNote: 'HT / mois · pour 1 à 3 réseaux, pas 7', hours: '2–3 h', hoursNote: '/ mois (MYROR)', you: 'Transmettre tes idées, tourner' },
  empire: { price: `${fmt(empirePrice)} €`, priceNote: '/ mois · sans engagement', hours: '≈ 1 h', hoursNote: '/ mois', you: 'Parler et valider' },
} as const

function CardVisual({ option }: { option: typeof OPTIONS[number]['key'] }) {
  if (option === 'tools') return <div className={s.pills} aria-label="Outils à empiler">{TOOL_PILLS.map(name => <span key={name}>{name}</span>)}<span className={s.pillMore}>+2</span></div>
  if (option === 'freelance') return <div className={s.roles} aria-label="Cinq métiers">{TEAM_ICONS.map(({ label, Icon }) => <span key={label}><Icon size={15} aria-hidden="true" />{label}</span>)}</div>
  if (option === 'agency') return <div className={s.single}><Building2 size={26} aria-hidden="true" /><span>1 contrat<small>1 à 3 réseaux · 4 à 6 mois d’engagement</small></span></div>
  return <div className={s.wordmark}><span>1 abonnement</span><small>Le travail des 5 métiers, publié sur 7 réseaux</small></div>
}
function Source({ name, href }: { name: string; href: string }) {
  return <a className={s.source} href={href} target="_blank" rel="noopener noreferrer">{name}<ArrowRight size={11} aria-hidden="true" /></a>
}
function CalculationLink() {
  return <a className={s.source} href="#comparison-method" onClick={() => { const details = document.querySelector<HTMLDetailsElement>('#comparison-method'); if (details) details.open = true }}>Sources et calculs<ArrowRight size={11} aria-hidden="true" /></a>
}
function Feature({ cell }: { cell: FeatureCell }) {
  const Icon = cell.status === 'included' ? Check : cell.status === 'conditional' ? CircleDashed : Minus
  const status = { included: 'Inclus', conditional: 'Selon conditions', manual: 'À ta charge', excluded: 'Non inclus' }[cell.status]
  return <div className={s.feature} data-status={cell.status}><Icon size={16} aria-hidden="true" /><span><span className={s.srOnly}>{status} : </span>{cell.text}{cell.note && <small>{cell.note}</small>}</span></div>
}

export default function FormulaCompareSection() {
  const [alternative, setAlternative] = useState<Alternative>('freelance')
  const [showDetails, setShowDetails] = useState(false)
  const columnProps = (key: string) => ({ 'data-comparison-column': key, 'data-mobile-visible': key === alternative || key === 'empire', className: key === 'empire' ? s.empire : undefined })

  return <section id="home-comparison" className={s.section} data-comparison-criteria data-animated="false" aria-labelledby="formula-compare-title">
    <div className={s.inner}>
      <header className={s.heading}>
        <span className={s.eyebrow}>Le comparatif</span>
        <h2 id="formula-compare-title">Ce qui est inclus.<br /><em>Ce que ça te coûte.</em></h2>
        <p className={s.takeaway} data-comparison-takeaway><strong>Le travail de 5 métiers.</strong> <strong>{fmt(empirePrice)} €/mois.</strong> <strong>1 h de ton temps.</strong></p>
        <p>Même périmètre partout : idées, écriture, montage, visuels, 7 réseaux, réponses, suivi des leads. Seule la façon de l’obtenir change, en argent et surtout en temps.</p>
      </header>
      <div className={s.mobilePicker} role="group" aria-label="Comparer Empire avec">
        <span>Comparer Empire avec</span><div>{OPTIONS.filter(option => option.key !== 'empire').map(option => <button key={option.key} type="button" aria-pressed={alternative === option.key} aria-controls="comparison-table comparison-cards" onClick={() => setAlternative(option.key as Alternative)}>{option.short}</button>)}</div>
      </div>
      <div id="comparison-cards" className={s.cards} data-comparison-cards>
        {OPTIONS.map(option => <article key={option.key} className={`${s.card} ${option.key === 'empire' ? s.cardEmpire : ''}`} data-comparison-card={option.key} data-mobile-visible={option.key === alternative || option.key === 'empire'} aria-label={option.name}>
          <h3>{option.name}</h3>
          <CardVisual option={option.key} />
          <p className={s.cardPrice}><strong>{SUMMARY[option.key].price}</strong><small>{SUMMARY[option.key].priceNote}</small></p>
          <p className={s.cardHours}><strong>{SUMMARY[option.key].hours}</strong><small>{SUMMARY[option.key].hoursNote}</small></p>
          <p className={s.cardYou}><span>Tu fais</span>{SUMMARY[option.key].you}</p>
        </article>)}
      </div>
      <p className={s.savingsLine} data-comparison-savings>Avec Empire : <b>{fmt(Math.round(savingsFreelance.low / 100) * 100)} à {fmt(Math.round(savingsFreelance.high / 100) * 100)} €</b> de moins par mois qu’une équipe de freelances, <b>{fmt(Math.round(savingsAgency.low / 100) * 100)} à {fmt(Math.round(savingsAgency.high / 100) * 100)} €</b> de moins qu’une agence, et <b>{coordMonthLow - 1} à {coordMonthHigh - 1} h</b> de ton mois récupérées face à une équipe.</p>
      <div className={s.basis} data-comparison-basket><span>Un mois type</span><strong>4 vidéos courtes + 8 posts + 2 newsletters</strong><small>Exemple Empire : {originals} contenus originaux, publiés sur 7 réseaux. Les volumes des prestataires dépendent de leur offre.</small></div>
      <details className={s.detailsBlock} id="comparison-details" data-comparison-details>
      <summary>Voir le comparatif détaillé, ligne par ligne <ArrowRight size={14} aria-hidden="true" /></summary>
      <div className={s.tableWrap}>
        <table id="comparison-table" className={s.table} aria-describedby="comparison-scope comparison-format-note">
          <caption className={s.srOnly}>Prestations incluses et coûts : seul avec des outils, une équipe de freelances, une agence ou Empire.</caption>
          <thead><tr><th scope="col" className={s.criteria}>Ton contenu,<br />de l’idée au client</th>{OPTIONS.map(option => <th scope="col" key={option.key} data-comparison-option={option.key} {...columnProps(option.key)}><strong>{option.name}</strong><small>{option.detail}</small></th>)}</tr></thead>
          <tbody data-comparison-axis="money">
            <tr data-comparison-row="monthly"><th scope="row">Budget mensuel</th>
              <td {...columnProps('tools')}><span className={s.overline}>Abonnements seuls</span><strong className={`${s.price} ${s.priceRange}`}>{fmt(toolsFloor)}–{fmt(toolsFull)} €</strong><small>/ mois · 7 à 9 outils</small><small>Sans compter ton temps</small><CellSources items={[['Submagic', 'https://www.submagic.co/pricing'], ['Taplio', 'https://taplio.com/pricing'], ['Metricool', 'https://metricool.com/pricing/'], ['ManyChat', 'https://manychat.com/pricing'], ['Google AI', 'https://gemini.google/fr/subscriptions/']]} /></td>
              <td {...columnProps('freelance')}><span className={s.overline}>5 métiers additionnés</span><strong className={`${s.price} ${s.priceRange}`}>{fmt(teamLow)}–{fmt(teamHigh)} €</strong><small>HT / mois · fourchettes publiées</small><small>Production seule, sans publication ni réponses : dès {fmt(productionFloor)} €</small><CellSources items={[['CopyLinker', TEAM[0].href], ['Guépard', TEAM[1].href], ['Transacts', TEAM[2].href], ['Malt', TEAM[3].href], ['Webplume', TEAM[4].href]]} /></td>
              <td {...columnProps('agency')}><span className={s.overline}>Selon les réseaux couverts</span><strong className={`${s.price} ${s.priceRange}`}>{fmt(agencyLow)}–{fmt(agencyWithYouTube)} €</strong><small>HT / mois · engagement 4 à 6 mois</small><small>Pour 1 à 3 réseaux : aucune agence n’affiche 7 réseaux au rythme Empire</small><small>MYROR : {fmt(agencyExample)} € pour un réseau vidéo court + LinkedIn<br />{fmt(agencyWithYouTube)} € avec YouTube long</small><small>Dès 890 € pour 1 vidéo par semaine sur un seul réseau, 6 mois d’engagement</small><CellSources items={[['MYROR', SOURCES.agency], ['Fragment', SOURCES.fragment], ['Teazit', SOURCES.teazit], ['Persona One', SOURCES.personaOne], ['Agence Personnelle', SOURCES.agencePersonnelle]]} /></td>
              <td {...columnProps('empire')}><strong className={s.price} data-comparison-price={plan?.price}>{plan ? `${fmt(plan.price)} €` : 'Selon le volume'}</strong><small>/ mois · sans engagement<br />{fmt(credits)} / {plan ? fmt(plan.credits) : 'forfait'} crédits utilisés</small><small>Jusqu’à {fmt(topPlan.price)} € pour publier 2 fois par jour</small><CellSources items={[['Tarifs Empire', '/tarifs']]} /></td>
            </tr>
            <tr data-comparison-row="savings"><th scope="row">Par rapport à Empire ({fmt(empirePrice)} €)</th>
              <td {...columnProps('tools')}><strong>Prix équivalent</strong><small>L’écart n’est pas l’argent, c’est {manualHours.low} à {manualHours.high} h de production par mois en plus</small></td>
              <td {...columnProps('freelance')}><strong>+{fmt(savingsFreelance.low)} à +{fmt(savingsFreelance.high)} € / mois</strong><small>{fmt(savingsFreelance.low * 12)} à {fmt(savingsFreelance.high * 12)} € par an, et {coordMonthLow - 1} à {coordMonthHigh - 1} h de coordination en plus par mois</small></td>
              <td {...columnProps('agency')}><strong>+{fmt(savingsAgency.low)} à +{fmt(savingsAgency.high)} € / mois</strong><small>{fmt(savingsAgency.low * 12)} à {fmt(savingsAgency.high * 12)} € par an · temps client proche</small></td>
              <td {...columnProps('empire')}><strong>Référence</strong><small>Starter, facturation mensuelle</small></td>
            </tr>
          </tbody>
          <tbody data-comparison-axis="time">
            <tr data-comparison-row="effort"><th scope="row">Ton temps / mois</th>
              <td {...columnProps('tools')}><strong>{manualHours.low}–{manualHours.high} h / mois minimum</strong><small>Rien que pour écrire 8 posts et monter 4 vidéos, hors tests, visuels, publication et réponses</small></td>
              <td {...columnProps('freelance')}><strong>{coordMonthLow}–{coordMonthHigh} h / mois</strong><small>{COORD_HOURS_WEEK.low} à {COORD_HOURS_WEEK.high} h par semaine de briefs, relectures, allers-retours et relances pour plusieurs prestataires, hors tournage</small></td>
              <td {...columnProps('agency')}><strong>2–3 h / mois</strong><small>Temps annoncé par MYROR · un valideur, un délai de retour</small></td>
              <td {...columnProps('empire')}><strong className={s.effort}>≈ 1 h / mois²</strong><small>Repère d’usage Empire</small></td>
            </tr>
            <tr data-comparison-row="work"><th scope="row">Ce qu’il te reste à faire</th><td {...columnProps('tools')}>Tout : idées, tests, écriture, montage, visuels, publication, réponses</td><td {...columnProps('freelance')}>Recruter, briefer, filmer, valider, coordonner</td><td {...columnProps('agency')}>Transmettre tes idées et tourner<small>Équipe dédiée pour la suite</small></td><td {...columnProps('empire')}>Parler (filmer ou dicter) et valider</td></tr>
            <tr data-comparison-row="engagement"><th scope="row">Engagement</th><td {...columnProps('tools')}>Mensuel, outil par outil</td><td {...columnProps('freelance')}>Selon chaque prestataire</td><td {...columnProps('agency')}>4 à 6 mois<small>Fragment 6 mois · Teazit 4 mois · MYROR à confirmer</small></td><td {...columnProps('empire')}>Aucun<small>Tu arrêtes depuis l’app</small></td></tr>
            <tr data-comparison-row="frequency"><th scope="row">Rythme de publication</th><td {...columnProps('tools')}>Autant que tu produis</td><td {...columnProps('freelance')}>Selon chaque forfait<small>Ex. 8 posts, 4 à 12 vidéos</small></td><td {...columnProps('agency')}>Selon devis<small>Fragment : 14 à 19 vidéos par trimestre · Teazit : 10 par mois</small></td><td {...columnProps('empire')}>Tous les 2 jours à 2 fois par jour<small>Selon la formule</small></td></tr>
          </tbody>
          <tbody data-comparison-axis="coverage">
            {FEATURES.filter(row => !row.detail).map(row => <tr key={row.key} data-comparison-row={row.key}><th scope="row">{row.name}</th>{row.cells.map((cell, i) => <td key={OPTIONS[i].key} {...columnProps(OPTIONS[i].key)}><Feature cell={cell} /></td>)}</tr>)}
            {FEATURES.filter(row => row.detail).map(row => <tr key={row.key} data-comparison-row={row.key} data-comparison-detail hidden={!showDetails}><th scope="row">{row.name}</th>{row.cells.map((cell, i) => <td key={OPTIONS[i].key} {...columnProps(OPTIONS[i].key)}><Feature cell={cell} /></td>)}</tr>)}
          </tbody>
        </table>
        <div className={s.moreCell} data-comparison-more><button type="button" className={s.moreButton} aria-expanded={showDetails} aria-controls="comparison-table" onClick={() => setShowDetails(v => !v)}>{showDetails ? 'Masquer le détail' : `Voir tout ce qui est inclus (${FEATURES.filter(r => r.detail).length} lignes de plus)`}<ArrowRight size={13} aria-hidden="true" /></button></div>
      </div>
      <div className={s.legend}><span><Check size={14} aria-hidden="true" /> Inclus dans l’exemple</span><span><CircleDashed size={14} aria-hidden="true" /> Selon conditions / en option</span><span><Minus size={14} aria-hidden="true" /> À ta charge / non inclus</span></div>
      <p className={s.scope} id="comparison-format-note"><b>¹ Clonage, lead magnets et YouTube long :</b> disponibles dans Empire, avec leurs coûts en crédits. Ils ne sont pas ajoutés aux {fmt(credits)} crédits de cet exemple. Les services connectés peuvent avoir leur propre abonnement.</p>
      <p className={s.scope} id="comparison-scope">Prix publics vérifiés le 6 novembre 2026. Les colonnes décrivent les offres citées, pas un tarif moyen ni une prestation identique. Les fourchettes freelances et agences sont des additions d’offres publiques, pas des devis. Les republications sur plusieurs comptes ne comptent pas comme de nouveaux contenus.</p>
      <div className={s.references}><CalculationLink /><a className={s.source} href="/tarifs">Toutes les formules Empire<ArrowRight size={11} aria-hidden="true" /></a></div>

      <details className={s.method} id="comparison-method">
        <summary>Voir le détail des prix, des temps et des crédits <ArrowRight size={14} aria-hidden="true" /></summary>
        <div>
          <p><strong>Outils seuls · {fmt(toolsFloor)} à {fmt(toolsFull)} € par mois.</strong> Pour couvrir le périmètre d’Empire avec des outils, il faut en empiler plusieurs : {TOOLS.map((t, i) => <span key={t.name}>{t.name} ({t.role}) {fmt(t.price)} {t.unit}{i < TOOLS.length - 1 ? ', ' : '.'}</span>)} Les sept premiers font {fmt(toolsFloor)} € ; avec le clone vidéo, les liens trackés et l’IA de ManyChat, {fmt(toolsFull)} €. Newsletter via Substack et CRM en version gratuite ne sont pas comptés. Les dollars sont comptés pour un euro, hors taxes. Ces outils ne choisissent pas tes sujets, ne testent pas tes formats, n’écrivent pas, ne montent pas et ne répondent pas à ta place. {TOOLS.map(t => <Source key={t.href} name={t.name} href={t.href} />)}</p>
          <p><strong>Temps de production manuelle, partiel.</strong> Nina Senoyer estime l’écriture d’un post sur un sujet maîtrisé à 20–40 min : 8 posts = 2 h 40–5 h 20. Clic’N Start estime un short habillé à 3–4 h de montage : 4 shorts = 12–16 h. Somme : 14 h 40–21 h 20, arrondie à environ 15–21 h. Il faut encore ajouter recherche, tests de formats, tournage, visuels, newsletters, publication, réponses et analyse. Ces repères viennent de prestataires ; ils ne mesurent ni un débutant ni un utilisateur Empire. <Source name="Repère de rédaction" href={SOURCES.writingTime} /> <Source name="Repère de montage" href={SOURCES.video} /></p>
          <p><strong>Temps client avec des freelances · {coordMonthLow} à {coordMonthHigh} h par mois.</strong> Chaque prestataire pris seul demande peu : un ghostwriter annonce 30 min d’appel par mois plus 2 min de relecture par post (moins d’une heure), ou 30 min d’interview par semaine plus 15 min de validation (environ 3 h par mois) ; un monteur livre une V1 sous 24 h à 7 jours avec 1 à 2 révisions par vidéo à relire ; un community manager fait valider le planning du mois sous 5 jours ouvrés. Ce qui coûte, c’est l’addition : Heysimon mesure 3 à 6 h par semaine de coordination pour un responsable marketing dès que plusieurs prestataires coexistent, « ajouter un second prestataire double la charge » ; un benchmark B2B compte 3 à 5 h par semaine et par freelance, avec 30 à 40 % des livrables qui repartent en révision. Nous affichons {COORD_HOURS_WEEK.low} à {COORD_HOURS_WEEK.high} h par semaine, soit {coordMonthLow} à {coordMonthHigh} h par mois, hors tournage, pour cinq prestataires sans chef de projet. Ce sont des repères publiés par des tiers, pas une mesure sur nos clients. <Source name="Ghostwriter : moins d’une heure" href={SOURCES.ghostTime} /> <Source name="Ghostwriter : 30 min par semaine" href={SOURCES.ghostTimeKatalyx} /> <Source name="2 h par semaine avec un copywriter" href={SOURCES.ghostTimeIpeople} /> <Source name="Révisions monteur" href={SOURCES.editorRevisions} /> <Source name="Validation CM" href={SOURCES.cmValidation} /> <Source name="Coût de coordination" href={SOURCES.coordination} /> <Source name="Benchmark B2B" href={SOURCES.freelanceOverhead} /></p>
          <p><strong>Par rapport à Empire.</strong> Les écarts d’argent sont des soustractions simples : bas et haut de chaque fourchette moins {fmt(empirePrice)} € (Starter). Freelances : {fmt(teamLow)} − {fmt(empirePrice)} = {fmt(savingsFreelance.low)} € et {fmt(teamHigh)} − {fmt(empirePrice)} = {fmt(savingsFreelance.high)} € par mois. Agence : {fmt(agencyLow)} − {fmt(empirePrice)} = {fmt(savingsAgency.low)} € et {fmt(agencyWithYouTube)} − {fmt(empirePrice)} = {fmt(savingsAgency.high)} €. Outils seuls : prix comparable, l’écart est en heures. Les heures « en plus » sont la différence entre les repères ci-dessus et l’heure mensuelle estimée pour Empire². Nous ne chiffrons pas les gains (vues, leads, ventes) : aucune source ne permet de les attribuer à une solution plutôt qu’à une autre.</p>
          <p><strong>Freelances · {fmt(teamLow)} à {fmt(teamHigh)} € HT par mois.</strong> Un seul freelance ne couvre pas le périmètre : il faut cinq métiers. {TEAM.map((t, i) => <span key={t.role}>{t.role} ({t.scope}) : {t.low === t.high ? `${fmt(t.low)} €` : `${fmt(t.low)} à ${fmt(t.high)} €`}{i < TEAM.length - 1 ? ' · ' : '.'}</span>)} Addition : {TEAM.map(t => fmt(t.low)).join(' + ')} = <b>{fmt(teamLow)} €</b> en bas de fourchette, {TEAM.map(t => fmt(t.high)).join(' + ')} = <b>{fmt(teamHigh)} €</b> en haut. Sans chef de projet : c’est toi qui coordonnes. Si tu ne prends que la production (8 posts chez Clément Aouadène 600 € HT, 4 shorts chez Clic’N Start 289 € HT, 2 newsletters chez Webplume 2 × 120 €), le plancher est 600 + 289 + 2 × 120 = <b>{fmt(productionFloor)} € HT</b>, mais tournage, visuels, publication, réponses et suivi restent à ta charge. Ces fourchettes sont des grilles publiées, pas des devis ; un même prestataire peut regrouper plusieurs missions. {TEAM.map(t => <Source key={t.href} name={t.source} href={t.href} />)} <Source name="Offre du rédacteur" href={SOURCES.writing} /> <Source name="Offre du studio" href={SOURCES.video} /> <Source name="Conditions Webplume" href={SOURCES.newsletterTerms} /></p>
          <p><strong>Agence dédiée · {fmt(agencyLow)} à {fmt(agencyWithYouTube)} € HT par mois.</strong> MYROR affiche la gestion d’un réseau vidéo court à {fmt(agencyVideo)} €/mois et LinkedIn à {fmt(agencyLinkedIn)} €/mois : {fmt(agencyVideo)} + {fmt(agencyLinkedIn)} = <b>{fmt(agencyExample)} €/mois</b> pour deux réseaux ; YouTube long est une offre distincte à 2 500 €/mois, soit <b>{fmt(agencyWithYouTube)} €</b> pour trois. Le nombre de contenus dépend de la proposition commerciale ; l’agence annonce 2–3 h de temps client par mois et la réponse aux commentaires sur Instagram. Studio Fragment propose une formule complète (vidéos, posts, newsletters) à 2 500 € HT avec un tournage par trimestre et six mois d’engagement. Teazit facture 2 500 € HT pour 10 vidéos et 4 500 € pour 20, quatre mois minimum. Agence Vidéo démarre à 3 200 € HT sur six mois. Des agences moins chères existent pour un périmètre plus petit : Persona One 890 € HT/mois pour une vidéo par semaine avec community manager, Agence Personnelle Présence 1 000 € HT/mois pour 4 vidéos, toutes deux sur six mois d’engagement et un seul réseau principal ; elles ne couvrent ni les posts, ni la newsletter, ni 7 réseaux, d’où la mention « dès 890 € » hors fourchette. Aucune de ces offres ne couvre 7 réseaux ni une publication tous les deux jours : la fourchette agence achète 1 à 3 réseaux, pas le périmètre Empire ; volumes, taxes et remises restent à confirmer sur devis. <Source name="Prix et méthode MYROR" href={SOURCES.agency} /> <Source name="Studio Fragment" href={SOURCES.fragment} /> <Source name="Teazit" href={SOURCES.teazit} /> <Source name="Agence Vidéo" href={SOURCES.agenceVideo} /> <Source name="Persona One" href={SOURCES.personaOne} /> <Source name="Agence Personnelle" href={SOURCES.agencePersonnelle} /></p>
          <p><strong>Empire · tout dans un seul forfait.</strong> {MONTH.posts} posts × {CONTENT_CREDITS.post} crédits + {MONTH.reels} Reels standard × {CONTENT_CREDITS.reel} + {MONTH.newsletters} newsletters × {CONTENT_CREDITS.newsletter} = <b>{fmt(credits)} crédits</b>, sur {plan ? fmt(plan.credits) : 'le forfait'}. Starter est affiché à {plan ? fmt(plan.price) : 'un tarif variable'} €/mois en facturation mensuelle, sans engagement ; Scale à {fmt(topPlan.price)} €/mois pour publier deux fois par jour. Idées, formats, écriture, montage vérifié, visuels, publication sur 7 réseaux, setter IA Instagram, boîte unique des commentaires et DM, liens trackés et CRM des leads sont compris. Clonage, formats IA spécifiques, nouvelles générations et vidéos longues peuvent demander davantage de crédits. Les 7 réseaux sont Instagram, LinkedIn, YouTube, TikTok, Threads, X et Facebook ; ils ne reçoivent pas tous chaque format. Les services email et autres outils connectés peuvent avoir leurs propres abonnements.</p>
          <p><strong>² Ton temps avec Empire.</strong> Environ une heure par mois est le repère d’usage communiqué par Empire pour sa production mensuelle habituelle, une fois le compte configuré. C’est une estimation de la marque, pas une moyenne issue d’une étude comparative. Le temps dépend du démarrage, des formats choisis et des retours.</p>
          <p><strong>Méthode et résultats.</strong> Les formats testés sur les comptes de Kevin, le montage vérifié par l’équipe et la programmation sur plusieurs réseaux constituent les moyens fournis par Empire. Ils ne démontrent pas qu’un outil seul obtient forcément de moins bons résultats. Sur notre exemple, tenir trois mois représente {originals * 3} originaux ; aucun taux de continuité comparable n’a été mesuré entre ces solutions. Les prix ne permettent pas de prédire les vues ou les ventes.</p>
        </div>
      </details>
      </details>

      <div className={s.continuity} data-comparison-performance><div><span className={s.eyebrow}>Tenir dans la durée</span><strong>Ton expertise. Environ 1 h par mois².</strong><p>Des formats guidés, un montage vérifié et une diffusion programmée : ta présence ne repose plus sur une pile d’outils à coordonner ni sur cinq prestataires à briefer.</p></div><p data-comparison-success>Dans cet exemple : {originals * 3} contenus originaux sur trois mois. Un planning à tenir avec ton expertise, la création et la diffusion réunies dans Empire.</p></div>
      <div className={s.bottom}><p>Choisis ce que tu délègues.<br /><strong>Garde ton expertise.</strong></p><EmpireSalesCta source="home-formula-compare" showDemo={false} /></div>
    </div>
  </section>
}
