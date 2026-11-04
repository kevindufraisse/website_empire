'use client'
import EmpireSalesCta from '@/components/EmpireSalesCta'

const TERMS=['Vos idées','Création','Diffusion','Votre temps','Coût'] as const
// Compare the scope of each approach, not an invented score or a universal market price.
const ROWS=[
 {name:'Tout faire soi-même',example:'Vous gardez la main sur chaque étape.',cells:['Vous cherchez les sujets et choisissez les angles.','Vous écrivez, filmez et montez.','Vous adaptez et publiez sur chaque réseau.','Vous prenez en charge tout le processus.','Vos outils et le temps que vous y consacrez.']},
 {name:'Assembler des outils IA',example:'Vous construisez votre propre système.',cells:['Vous fournissez les sujets et les consignes.','Selon les outils : rédaction, montage, visuels.','À connecter ou à gérer avec un outil de publication.','Configuration, coordination et validation.','Abonnements selon les outils et leur usage.']},
 {name:'Podcast ou studio',example:'Vous partez d’un enregistrement.',cells:['Vous préparez les thèmes de l’épisode.','Enregistrement et montage selon la prestation.','Extraits et republication selon le contrat.','Préparation, enregistrement et validation.','À la session ou au forfait, sur devis.']},
 {name:'Un freelance',example:'Vous déléguez une mission définie.',cells:['Stratégie incluse ou non, selon la mission.','Selon sa spécialité et les livrables convenus.','Incluse uniquement si prévue dans la mission.','Brief, échanges et relectures.','À la mission ou au forfait, sur devis.']},
 {name:'Une agence',example:'Vous confiez un périmètre à une équipe.',cells:['Accompagnement stratégique selon le contrat.','Formats et volume définis ensemble.','Réseaux et gestion des comptes selon le contrat.','Briefs, coordination et validations.','Honoraires selon le périmètre, sur devis.']},
 {name:'Empire',example:'Vos idées, la création et la diffusion au même endroit.',empire:true,cells:['Vos idées et votre point de vue, complétés par la veille.','Formats vidéo, textes, miniatures et visuels.','Adaptation multi-réseaux et programmation.','Vous partagez vos idées, enregistrez et validez.','Abonnement selon l’offre et le volume choisis.']},
]

export default function FormulaCompareSection(){
 return <section id="home-comparison" className="bg-[#090909] px-4 py-16 text-white md:py-24" aria-labelledby="formula-compare-title">
  <div className="mx-auto max-w-6xl">
   <div className="mx-auto max-w-3xl text-center"><h2 id="formula-compare-title" className="text-3xl font-semibold leading-tight tracking-[-.04em] sm:text-4xl">Que voulez-vous garder en main,<br className="hidden sm:block"/> et que voulez-vous déléguer ?</h2><p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-400">Comparez les mêmes étapes : trouver vos sujets, créer, publier et gérer le travail.</p></div>
   <div className="mt-10 hidden overflow-x-auto rounded-2xl border border-white/10 md:block">
    <table className="w-full table-fixed text-left"><caption className="sr-only">Périmètre de six façons de produire et diffuser votre contenu. Les prestations et budgets dépendent des outils et des contrats.</caption><thead className="bg-white/[0.03] text-xs font-semibold text-neutral-300"><tr><th scope="col" className="w-[18%] px-5 py-4">Solution</th>{TERMS.map(t=><th scope="col" key={t} className="px-3 py-4">{t}</th>)}</tr></thead><tbody>{ROWS.map(row=><tr key={row.name} className={row.empire?'border-t border-empire/40 bg-empire/[0.07]':'border-t border-white/10'}><th scope="row" className="px-5 py-5 align-top"><b className={`block text-base ${row.empire?'text-empire':'text-white'}`}>{row.name}</b><span className="mt-2 block text-xs font-normal leading-relaxed text-neutral-400">{row.example}</span></th>{row.cells.map((cell,i)=><td key={i} className="px-3 py-5 align-top text-xs leading-relaxed text-neutral-300">{cell}</td>)}</tr>)}</tbody></table>
   </div>
   <div className="mt-8 space-y-4 md:hidden">{ROWS.map(row=><article key={row.name} className={`rounded-2xl border p-5 ${row.empire?'border-empire/50 bg-empire/[0.07]':'border-white/10 bg-white/[0.02]'}`}><h3 className={`text-lg font-semibold ${row.empire?'text-empire':'text-white'}`}>{row.name}</h3><p className="mt-1 text-sm leading-relaxed text-neutral-400">{row.example}</p><dl className="mt-5 space-y-3">{row.cells.map((cell,i)=><div key={i} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3 text-xs leading-relaxed"><dt className="font-semibold text-neutral-300">{TERMS[i]}</dt><dd className="text-neutral-400">{cell}</dd></div>)}</dl></article>)}</div>
   <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-relaxed text-neutral-500">Repères de périmètre, pas un classement de qualité. Les services d’un outil, d’un freelance, d’un studio ou d’une agence varient selon l’offre et le contrat. Aucune de ces options ne garantit des vues ou des ventes.</p>
   <div className="mt-8"><EmpireSalesCta source="home-formula-compare" /></div>
   <p className="mt-5 text-center text-sm text-neutral-400"><a href="/tarifs" className="underline underline-offset-4 hover:text-white">Voir les offres et les tarifs Empire</a></p>
  </div>
 </section>
}
