'use client'
import { ArrowRight, Coins, Workflow, Brain } from 'lucide-react'
import EmpireSalesCta from '@/components/EmpireSalesCta'
import s from './FormulaCompareClear.module.css'

const CRITERIA = [
  { key: 'money', label: 'Coût en argent', Icon: Coins },
  { key: 'sophistication', label: 'Sophistication', Icon: Workflow },
  { key: 'mental-load', label: 'Charge mentale', Icon: Brain },
] as const

// Compare how each approach is organized, not invented prices or objective scores.
// A provider can offer a fully managed system; its scope depends on the contract.
const OPTIONS = [
  {
    key: 'tools', category: 'SOI-MÊME · OUTILS IA', title: 'Vous assemblez votre système.',
    cells: [
      { value: 'Des outils à additionner.', detail: 'Rédaction, montage, programmation, suivi : le budget dépend des abonnements et des usages choisis.' },
      { value: 'Un système à construire.', detail: 'Choisir les outils, les connecter et maintenir les automatisations. Le résultat dépend de votre assemblage.' },
      { value: 'Tout à orchestrer.', detail: 'Produire, transférer, adapter, publier, vérifier les résultats et résoudre les blocages entre les outils.' },
    ],
  },
  {
    key: 'providers', category: 'FREELANCE · STUDIO · AGENCE', title: 'Vous déléguez une prestation.',
    cells: [
      { value: 'Des honoraires sur devis.', detail: 'Une mission ou un forfait, selon les livrables, le volume et le niveau de prise en charge.' },
      { value: 'Un périmètre sur mesure.', detail: 'D’une expertise spécialisée à un système complet : ce qui est relié et automatisé dépend du contrat.' },
      { value: 'Briefs et validations.', detail: 'Vous transmettez vos idées et faites vos retours. La coordination peut être incluse ou rester à votre charge.' },
    ],
  },
  {
    key: 'empire', category: 'EMPIRE', title: 'Vous utilisez un parcours déjà relié.',
    cells: [
      { value: 'Une offre + des crédits.', detail: 'Un budget selon votre volume de création et les fonctionnalités choisies. Les tarifs détaillent ce qui est inclus.' },
      { value: 'Le système est intégré.', detail: 'Idées, création, diffusion et suivi réunis dans Empire. Vos comptes et intégrations restent à connecter.' },
      { value: 'Un seul parcours à piloter.', detail: 'Vous partagez vos idées, enregistrez et validez. Les contenus, leur programmation et leur suivi restent au même endroit.' },
    ],
  },
] as const

export default function FormulaCompareSection() {
  return <section id="home-comparison" className={s.section} aria-labelledby="formula-compare-title" data-comparison-criteria>
    <div className={s.wrap}>
      <header className={s.heading}>
        <h2 id="formula-compare-title">Ce que ça vous coûte.<br/><em>Ce que ça vous demande.</em></h2>
        <p>Coût en argent, sophistication du système et charge mentale.<br/>Ce que vous payez. Ce que vous devez construire. Ce que vous faites au quotidien.</p>
      </header>
      <div className={s.cards}>
        {OPTIONS.map(option => <article key={option.key} className={`${s.card} ${option.key === 'empire' ? s.empire : ''}`} data-comparison-option={option.key}>
          <header className={s.cardHeading}><span className={s.category}>{option.category}</span><h3>{option.title}</h3></header>
          <dl>{CRITERIA.map(({ key, label, Icon }, index) => <div key={key} data-comparison-axis={key}>
            <dt><Icon size={15} aria-hidden="true"/>{label}</dt>
            <dd><strong>{option.cells[index].value}</strong><p>{option.cells[index].detail}</p></dd>
          </div>)}</dl>
          {option.key === 'empire' && <a href="/tarifs">Voir les offres et les tarifs Empire <ArrowRight size={15} aria-hidden="true"/></a>}
        </article>)}
      </div>
      <p className={s.takeaway}><strong>La différence avec Empire :</strong> vous apportez votre expertise, sans assembler chaque étape entre des outils séparés.</p>
      <p className={s.note}>Repères d’organisation, pas des notes de performance. Un prestataire peut aussi tout prendre en charge. Le budget et la coordination varient selon l’usage et le contrat. Les fonctionnalités Empire dépendent de l’offre ; le suivi des conversions nécessite les liens et intégrations configurés.</p>
      <div className={s.cta}><EmpireSalesCta source="home-formula-compare"/></div>
    </div>
  </section>
}
