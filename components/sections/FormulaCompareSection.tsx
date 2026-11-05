'use client'
import { Check, ArrowRight } from 'lucide-react'
import EmpireSalesCta from '@/components/EmpireSalesCta'
import s from './FormulaCompareClear.module.css'

export default function FormulaCompareSection(){
 return <section id="home-comparison" className={s.section} aria-labelledby="formula-compare-title">
  <div className={s.wrap}>
   <header className={s.heading}><h2 id="formula-compare-title">La différence avec Empire ?<br/><em>Tout est relié, de l’idée au client.</em></h2><p>Comparez ce que vous confiez, ce que vous gardez à faire et la façon dont le travail est organisé.</p></header>
   <div className={s.cards}>
    <article className={s.card}><span className={s.category}>SOI-MÊME · OUTILS IA</span><h3>Vous assemblez<br/>votre système.</h3><p className={s.intro}>Les outils vous aident. Vous organisez les étapes entre eux.</p><dl><div><dt>Ce que vous obtenez</dt><dd>Des outils spécialisés : idées, textes, montage ou programmation.</dd></div><div><dt>Ce que vous faites</dt><dd>Choisir les sujets, guider les outils, transférer les fichiers, adapter et suivre les publications.</dd></div><div><dt>Temps et budget</dt><dd>Votre temps de production et de coordination, plus les abonnements choisis.</dd></div></dl></article>
    <article className={s.card}><span className={s.category}>FREELANCE · STUDIO · AGENCE</span><h3>Vous déléguez<br/>un périmètre.</h3><p className={s.intro}>Une prestation, ou une équipe : le contrat définit ce qui est pris en charge.</p><dl><div><dt>Ce que vous obtenez</dt><dd>Une expertise et des livrables définis avec votre prestataire.</dd></div><div><dt>Ce que vous faites</dt><dd>Définir le besoin, transmettre vos idées, échanger et valider. La coordination dépend de la mission.</dd></div><div><dt>Temps et budget</dt><dd>Briefs et validations. Honoraires à la mission ou au forfait, sur devis.</dd></div></dl></article>
    <article className={`${s.card} ${s.empire}`}><span className={s.category}>EMPIRE</span><h3>Vous prenez la parole.<br/>Empire relie la suite.</h3><p className={s.intro}>Votre idée reste dans le même parcours jusqu’à sa publication et au suivi des conversions.</p><dl><div><dt>Ce qu’Empire réunit</dt><dd><Check size={14}/>Veille, formats et préparation.<br/><Check size={14}/>Montage, textes et visuels.<br/><Check size={14}/>Diffusion, republication et suivi.</dd></div><div><dt>Ce que vous faites</dt><dd>Partager vos idées, enregistrer votre point de vue et valider vos contenus.</dd></div><div><dt>Temps et budget</dt><dd>Un parcours centralisé. Une offre et des crédits selon votre volume, sans additionner les prestations.</dd></div></dl><a href="/tarifs">Voir les offres Empire <ArrowRight size={15}/></a></article>
   </div>
   <p className={s.note}>Un freelance, un studio ou une agence peut aussi proposer une prise en charge complète. Le périmètre varie selon le contrat. Les fonctionnalités Empire dépendent de l’offre ; le suivi des conversions nécessite les liens et intégrations configurés.</p>
   <div className={s.cta}><EmpireSalesCta source="home-formula-compare"/></div>
  </div>
 </section>
}
