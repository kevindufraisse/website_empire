'use client'

import { useState } from 'react'
import { ArrowRight, Check, Clock3, Coins, ListChecks, RotateCcw, SlidersHorizontal } from 'lucide-react'
import EmpireSalesCta from '@/components/EmpireSalesCta'
import { CONTENT_CREDITS, PLANS } from '@/lib/plans'
import s from './FormulaCompareClear.module.css'

const OPTIONS = [
  { key: 'tools', name: 'Seul + outils', detail: 'Vous réalisez les contenus.' },
  { key: 'freelance', name: 'Un freelance', detail: 'Rédaction + montage délégués.' },
  { key: 'agency', name: 'Une agence', detail: 'Création + publication déléguées.' },
  { key: 'empire', name: 'Empire', detail: 'De vos idées à la publication.' },
] as const
const EXAMPLE = { reels: 6, posts: 6 }
const credits = EXAMPLE.reels * CONTENT_CREDITS.reel + EXAMPLE.posts * CONTENT_CREDITS.post
const plan = [...PLANS].sort((a, b) => a.price - b.price).find(p => p.credits >= credits)
const planName = plan ? plan.id.charAt(0).toUpperCase() + plan.id.slice(1) : ''
const INITIAL = { budgets: ['80', '900', '1800'], hours: ['16', '8', '4', '4'] }
const STAGES = ['Sujets', 'Textes', 'Montage', 'Publication', 'Bilan']
const OWNERS = [
  ['Vous', 'Vous', 'Vous', 'Vous', 'Vous'],
  ['Vous', 'Freelance', 'Freelance', 'Vous', 'Vous'],
  ['Agence', 'Agence', 'Agence', 'Agence', 'Agence'],
  ['Inclus', 'Inclus', 'Inclus', 'Inclus', 'Inclus'],
]
const fmt = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 2 })
function amount(value: string, max: number) {
  if (!value.trim()) return null
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 && n <= max ? n : null
}

function Estimate({ id, label, value, unit, max, onChange }: {
  id: string; label: string; value: string; unit: string; max: number; onChange: (value: string) => void
}) {
  const invalid = value !== '' && amount(value, max) === null
  return <div className={s.estimate}>
    <label htmlFor={id}>{label}</label>
    <div className={s.numberField}>
      <input id={id} type="number" inputMode="decimal" min="0" max={max} step="any" value={value}
        aria-invalid={invalid} aria-describedby={invalid ? `${id}-error` : undefined}
        onChange={event => onChange(event.target.value)} />
      <span>{unit}<small>/ mois</small></span>
    </div>
    {invalid && <small id={`${id}-error`} className={s.error}>Entre 0 et {fmt(max)} {unit}.</small>}
  </div>
}

export default function FormulaCompareSection() {
  const [budgets, setBudgets] = useState(INITIAL.budgets)
  const [hours, setHours] = useState(INITIAL.hours)
  const [compared, setCompared] = useState(0)
  const budget = amount(budgets[compared], 50000)
  const beforeHours = amount(hours[compared], 300)
  const empireHours = amount(hours[3], 300)
  const budgetDelta = budget !== null && plan ? Math.round((plan.price - budget) * 100) / 100 : null
  const hoursDelta = beforeHours !== null && empireHours !== null ? Math.round((beforeHours - empireHours) * 100) / 100 : null
  const update = (kind: 'budgets' | 'hours', index: number, value: string) => {
    const setter = kind === 'budgets' ? setBudgets : setHours
    setter(previous => previous.map((item, i) => i === index ? value : item))
  }
  const rows = [
    { key: 'money', name: 'Votre budget', description: 'Ce que vous dépensez chaque mois.', Icon: Coins },
    { key: 'time', name: 'Votre temps', description: 'Tournage, retours et validation compris.', Icon: Clock3 },
    { key: 'coverage', name: 'Qui fait quoi ?', description: 'Répartition retenue pour cet exemple.', Icon: ListChecks },
  ]

  return <section id="home-comparison" className={s.section} data-comparison-criteria data-animated="false" aria-labelledby="formula-compare-title">
    <div className={s.inner}>
      <header className={s.heading}>
        <span className={s.eyebrow}>12 contenus originaux par mois</span>
        <h2 id="formula-compare-title">Le même volume.<br /><em>Quel budget, combien de votre temps ?</em></h2>
        <p><b>6 Reels standard + 6 posts LinkedIn.</b> Les republications ne comptent pas comme de nouveaux contenus.</p>
      </header>
      <div className={s.simulation} id="comparison-assumptions">
        <SlidersHorizontal size={17} aria-hidden="true" />
        <p><strong>Simulation à personnaliser.</strong> Budgets et heures sont des exemples modifiables. Seul le prix Empire correspond au tarif de l’offre.</p>
        <button type="button" onClick={() => { setBudgets(INITIAL.budgets); setHours(INITIAL.hours) }}><RotateCcw size={13} aria-hidden="true" />Rétablir l’exemple</button>
      </div>
      <div className={s.matrix} role="table" aria-label="Budget, temps personnel et prestations pour 6 Reels et 6 posts par mois" aria-describedby="comparison-assumptions">
        <div className={s.columnHeads} role="row">
          <div role="columnheader">Pour le même volume</div>
          {OPTIONS.map(option => <div role="columnheader" key={option.key} data-comparison-option={option.key} className={option.key === 'empire' ? s.empire : ''}>
            <b>{option.name}</b><small>{option.detail}</small>
          </div>)}
        </div>
        <div role="rowgroup">
          {rows.map(({ key, name, description, Icon }, row) => <div className={s.row} role="row" data-comparison-axis={key} key={key}>
            <div className={s.axis} role="rowheader"><Icon size={18} aria-hidden="true" /><strong>{name}</strong><span>{description}</span></div>
            {OPTIONS.map((option, col) => <div className={`${s.cell} ${col === 3 ? s.empire : ''}`} role="cell" key={option.key} data-comparison-cell={option.key}>
              <span className={s.mobileLabel}>{option.name}</span>
              {row === 0 && (col === 3 ? <>
                <span className={s.fieldLabel}>Tarif {planName} mensuel</span>
                <strong className={s.price} data-comparison-price={plan?.price}>{plan ? <>{fmt(plan.price)} €<small>/ mois</small></> : 'Selon le volume'}</strong>
                <p>Pour vos 12 contenus du mois.</p>
              </> : <Estimate id={`comparison-budget-${option.key}`} label={`Budget d’exemple · ${option.name}`} value={budgets[col]} unit="€" max={50000} onChange={value => update('budgets', col, value)} />)}
              {row === 1 && <Estimate id={`comparison-hours-${option.key}`} label={`Temps estimé · ${option.name}`} value={hours[col]} unit="h" max={300} onChange={value => update('hours', col, value)} />}
              {row === 2 && <ul className={s.coverage}>{STAGES.map((stage, i) => <li key={stage}><span>{stage}</span><b data-owner={OWNERS[col][i]}>{col === 3 && <Check size={12} aria-hidden="true" />}{OWNERS[col][i]}</b></li>)}</ul>}
            </div>)}
          </div>)}
        </div>
      </div>
      <div className={s.result}>
        <div className={s.resultHeading}>
          <strong>Dans votre simulation</strong>
          <label htmlFor="comparison-alternative">Empire comparé à</label>
          <select id="comparison-alternative" value={compared} onChange={event => setCompared(Number(event.target.value))}>
            {OPTIONS.slice(0, 3).map((option, i) => <option value={i} key={option.key}>{option.name}</option>)}
          </select>
        </div>
        <div className={s.differences} aria-live="polite" aria-atomic="true">
          <div data-budget-delta={budgetDelta ?? ''}>
            <strong>{budgetDelta === null ? '—' : `${budgetDelta > 0 ? '+' : budgetDelta < 0 ? '−' : ''}${fmt(Math.abs(budgetDelta))} €`}</strong>
            <span>{budgetDelta === null ? 'Complétez votre budget.' : budgetDelta === 0 ? 'Même budget mensuel.' : budgetDelta < 0 ? 'de dépenses par mois.' : 'de budget par mois.'}</span>
          </div>
          <div data-hours-delta={hoursDelta ?? ''} data-saving={hoursDelta !== null && hoursDelta > 0}>
            <strong>{hoursDelta === null ? '—' : `${fmt(Math.abs(hoursDelta))} h`}</strong>
            <span>{hoursDelta === null ? 'Complétez les deux durées.' : hoursDelta === 0 ? 'Même temps personnel estimé.' : hoursDelta > 0 ? 'de votre temps en moins / mois.' : 'de votre temps en plus / mois.'}</span>
          </div>
        </div>
      </div>
      <div className={s.bottom}><p>Votre temps reste en heures.<br /><strong>Votre budget reste en euros.</strong></p><EmpireSalesCta source="home-formula-compare" showDemo={false} /></div>
      <details className={s.method}>
        <summary>Comprendre les chiffres et le périmètre <ArrowRight size={14} aria-hidden="true" /></summary>
        <div>
          <p><strong>Le volume Empire.</strong> {EXAMPLE.reels} Reels standard × {CONTENT_CREDITS.reel} crédits + {EXAMPLE.posts} posts texte × {CONTENT_CREDITS.post} crédits = {fmt(credits)} crédits. {plan ? `${planName} inclut ${fmt(plan.credits)} crédits à ${fmt(plan.price)} € par mois en facturation mensuelle.` : ''} Les vidéos longues et les formats IA spécifiques ont un autre coût en crédits. Les réseaux de diffusion dépendent du format et des comptes connectés.</p>
          <p><strong>Les budgets des alternatives.</strong> 80 €, 900 € et 1 800 € sont des budgets de démonstration, pas des prix de marché ni des devis. Remplacez-les par vos abonnements ou un devis couvrant le même volume. Le scénario freelance délègue la rédaction et le montage ; le scénario agence inclut les cinq étapes. Un prestataire peut proposer un autre périmètre.</p>
          <p><strong>Les heures sont des hypothèses, pas des mesures clients.</strong> Elles représentent votre propre temps, pas celui du prestataire ni les délais de livraison. Ajustez-les à votre façon de travailler, y compris pour Empire.</p>
          <ul>
            <li><b>Seul, 16 h :</b> sujets 2 h + textes 3 h + tournage 2 h + montage 6 h + publication 2 h + bilan 1 h.</li>
            <li><b>Freelance, 8 h :</b> sujets 2 h + brief 1 h + tournage 2 h + retours 1 h + publication 1 h + bilan 1 h.</li>
            <li><b>Agence, 4 h :</b> brief 1 h + tournage 2 h + validation 1 h.</li>
            <li><b>Empire, 4 h :</b> choix des sujets 1 h + tournage 2 h + validation 1 h.</li>
          </ul>
          <p>Les écarts suivent vos saisies. Aucune valeur horaire n’est ajoutée aux dépenses, et aucun gain de temps n’est garanti.</p>
          <a href="/tarifs">Voir les formules Empire <ArrowRight size={14} aria-hidden="true" /></a>
        </div>
      </details>
    </div>
  </section>
}
