import type { ReactNode } from 'react'

// Version écrite de la VSL (le live « Regardez cette vidéo et vous ferez
// 10 000 000 de vues par mois », AKfoDblGUNs). Fidèle au transcript : mêmes
// idées, mêmes chiffres, mêmes moments de CTA (après les formats ~44 min,
// après la démo du système ~1h08, et la fin). Rien d'inventé : chaque chiffre
// vient de ce que Kevin dit dans la vidéo.

export const READ_MINUTES = 10

export type ScriptSection = {
  id: string
  title: string
  body: ReactNode
  /** Un CTA (le même que sous la vidéo) se place après cette section. */
  ctaAfter?: boolean
}

const P = ({ children }: { children: ReactNode }) => (
  <p className="mb-4 leading-relaxed text-neutral-300">{children}</p>
)

const B = ({ children }: { children: ReactNode }) => (
  <strong className="font-bold text-white">{children}</strong>
)

export const SCRIPT_SECTIONS: ScriptSection[] = [
  {
    id: 'triangle',
    title: 'Le triangle d’or : visibilité, confiance, offre',
    body: (
      <>
        <P>
          Pose-toi la question : pourquoi tu crées du contenu ? Pour être visible, pour créer de la
          confiance, pour partager ta vision… Toutes ces réponses tiennent dans un seul triangle :
          la <B>visibilité</B>, la <B>confiance</B>, et ton <B>offre</B>. Si les trois sont là, tu
          gagnes beaucoup d’argent. S’il en manque un, rien ne se passe : de la visibilité sans
          confiance ne vend pas, et une bonne offre que personne ne voit ne vend pas non plus.
        </P>
        <P>
          Ton contenu, c’est ta boutique. Si tu publies une fois de temps en temps sur un seul
          réseau, ta boutique est ouverte le lundi de 9 h à 10 h, dans une rue sombre. Si tu publies
          tous les jours partout, elle est ouverte 7 jours sur 7, 24 h sur 24. Et il y a
          <B> 7 réseaux</B> : si tu n’es que sur un seul, ce sont six opportunités que tu laisses à
          tes concurrents.
        </P>
      </>
    ),
  },
  {
    id: 'regle-7-11-4',
    title: 'La règle du 7-11-4',
    body: (
      <>
        <P>
          Des gens que je n’ai jamais vus de ma vie m’abordent à Lisbonne en sachant où j’habite et
          ce qui m’arrive. C’est la relation parasociale, et les Américains l’ont chiffrée : il faut
          qu’une personne te voie <B>7 heures</B>, avec <B>11 interactions</B>, sur{' '}
          <B>4 plateformes différentes</B>, pour commencer à créer du lien avec toi.
        </P>
        <P>
          Publier cinq fois par semaine sur un seul réseau n’atteint jamais ce seuil. C’est pour ça
          que « être régulier » ne suffit pas : il faut du volume, partout.
        </P>
      </>
    ),
  },
  {
    id: 'parcours',
    title: 'Pourquoi tu peux me croire',
    body: (
      <>
        <P>
          J’ai travaillé à The Family, le plus grand accélérateur de start-up d’Europe, comme growth
          hacker. J’ai formé <B>plus de 4 000 personnes</B>. Pendant le Covid, je vendais mes
          formations en postant sur LinkedIn : <B>entre 5 000 et 10 000 € par jour</B>, et une année
          à <B>700 000 €</B>, seul. Uniquement grâce au triangle : les gens me voyaient, me
          faisaient confiance, et j’avais une offre qu’ils voulaient.
        </P>
        <P>
          Puis je me suis posé deux questions. Qu’est-ce qui m’a rapporté le plus d’argent ? Créer
          du contenu. Qu’est-ce qui me pèse le plus ? Le créer. Trouver les sujets, filmer, monter,
          adapter… Alors je me suis mis dans une quête : comprendre la visibilité à fond, et la
          rendre accessible aux entrepreneurs qui n’ont pas le temps.
        </P>
      </>
    ),
  },
  {
    id: 'message',
    title: 'Le message : une idée, racontée 1 000 fois',
    body: (
      <>
        <P>
          J’ai déjeuné avec Justin Welsh, le premier créateur LinkedIn au monde :{' '}
          <B>plus d’un million d’abonnés</B>, environ <B>400 000 € par mois</B> avec une newsletter.
          Son conseil : la création de contenu, c’est raconter <B>une</B> chose de 1 000 manières
          différentes. Hormozi parle tout le temps des riches contre les pauvres. Welsh, du
          solopreneuriat. Deux ou trois idées maximum, recyclées à l’infini dans des formats
          différents. Le problème des créateurs, c’est qu’ils essaient de dire trop de choses.
        </P>
        <P>
          Blair Warren l’a résumé en une phrase : « Les gens feront n’importe quoi pour ceux qui
          encouragent leurs rêves, justifient leurs échecs, apaisent leurs peurs, confirment leurs
          soupçons et les aident à jeter des pierres à leurs ennemis. »
        </P>
        <P>
          L’ennemi commun marche très fort. À The Family, on était les pirates bootstrappés contre
          les costumes-cravates qui lèvent des fonds — et on le répétait partout. Mon exemple à moi :
          le hook « J’ai 35 ans, je suis entrepreneur et célibataire ». Je l’ai répété dans{' '}
          <B>10 vidéos</B> : chacune a fait entre <B>30 000 et 200 000 vues</B>. Ça n’a rien à voir
          avec ce que je vends ? Justement : ça touche un maximum de gens, ça attire les
          entrepreneurs et les entrepreneuses — ma cible — et je raccroche ensuite à mon business.
          Enrobe ta promesse dans une histoire.
        </P>
      </>
    ),
  },
  {
    id: 'topics',
    title: 'Les 3 topics : universal, hot, core',
    body: (
      <>
        <P>
          <B>Universal topic</B> : prendre un personnage ou une référence que tout le monde connaît
          pour illustrer ton propos. Jeff Bezos pour dire que les réunions sont inutiles, c’est plus
          crédible que toi qui le dis. Macron, Trump, un joueur de foot : tes vues décollent.
        </P>
        <P>
          <B>Hot topic</B> : surfer sur l’actualité. Une nouvelle version de ChatGPT, une série
          Harry Potter qui sort — l’information descend en vague des médias vers les créateurs, et
          tu as environ <B>un mois</B> pour prendre la vague. Un post au bon moment peut te faire un
          million de vues.
        </P>
        <P>
          <B>Core topic</B> : les tensions qui touchent tout le monde. Employé contre patron, CDI
          contre freelance, HEC contre autodidactes, homme contre femme. Les vidéos les plus vues de
          certaines chaînes ne parlent que de ça.
        </P>
      </>
    ),
  },
  {
    id: 'hma',
    title: 'HMA : Histoire, Matière, Action',
    body: (
      <>
        <P>
          Le framework pour transformer un topic en vente : une <B>Histoire</B> qui accroche, ta{' '}
          <B>Matière</B> (ton avis, ce que personne ne comprend), une <B>Action</B> (vers ton
          offre).
        </P>
        <P>
          Exemple réel : « J’y croyais pas, mais Anthony Bourbon va devenir milliardaire. »
          L’histoire intrigue. La matière : il construit son propre média, et chaque boîte qu’il
          expose se remplit de commandes en 24 h. L’action : crée ta marque personnelle.
        </P>
        <P>
          Ça marche pour n’importe quel métier. Une naturopathe ? James Bond boit un verre toutes
          les trois scènes devant des millions d’enfants : parle de ça, puis de l’alcool, puis de
          ton accompagnement. Un coach de thérapeutes ? Instagram traduit maintenant ta voix en{' '}
          <B>46 langues</B> : une vidéo touche le monde entier, profites-en. Tu peux relier
          n’importe quoi à ce que tu vends — c’est une gymnastique, et elle s’apprend.
        </P>
      </>
    ),
  },
  {
    id: 'formats',
    title: 'Les formats qui font des vues',
    ctaAfter: true,
    body: (
      <>
        <P>
          Le fond ne suffit pas : il faut la forme. Sur Instagram, tout se joue sur la courbe de
          rétention — un reel viral a une courbe plate, les gens restent jusqu’au bout. Les formats
          qui marchent le mieux en ce moment :
        </P>
        <P>
          <B>La tier list</B> : tu classes des personnes ou des choses à l’écran, en te filmant. Le
          cerveau veut voir la fin du classement.
        </P>
        <P>
          <B>Le flou → net</B> : « les meilleurs podcasts de 2026 », tout est flouté, et ça se
          révèle au fur et à mesure. Un hack de rétention pur.
        </P>
        <P>
          <B>La fausse FAQ</B> : tu réponds à une question qu’on t’a (ou pas) posée. Tu peux
          répondre à une audience que tu n’as pas encore.
        </P>
        <P>
          <B>Le reel illustré</B> : tu reprends un reel qui a déjà fait ses preuves et tu poses ton
          texte dessus. Guillaume Pley facture <B>79 000 €</B> une interview dans Legend : j’ai
          repris un extrait vu <B>25 millions de fois</B>, ajouté mon hook, et renvoyé vers mon
          offre. Pas besoin de créer le reel : il existe déjà.
        </P>
        <P>
          Et le tag malin : un post sur Anthony Bourbon, quelques comptes qui le taguent, il
          repartage en story — me voilà exposé à <B>400 000 personnes</B> et{' '}
          <B>3 000 à 4 000 abonnés</B> de plus, avec des rendez-vous pleins pendant un mois.
        </P>
        <P>
          Moi, je publie sur <B>7 plateformes</B>, ça me prend <B>20 minutes par semaine</B> — le
          temps de marcher jusqu’à ma salle de sport — et je fais{' '}
          <B>10 millions de vues par mois</B>. Comment ? C’est exactement ce que j’ai construit avec
          Empire : les formats sont prêts, les images sont trouvées, tu te filmes, c’est monté,
          c’est publié partout.
        </P>
      </>
    ),
  },
  {
    id: 'diffusion',
    title: 'La diffusion : publie partout, puis republie',
    body: (
      <>
        <P>
          Le « duplicate content » qui pénaliserait tes comptes ? Ça n’existe pas. La même idée m’a
          fait <B>3 millions de vues sur Instagram</B>, <B>50 000 sur LinkedIn</B> et{' '}
          <B>100 000 sur Threads</B>. Mon post sur mon contrôle fiscal, je l’ai reposté{' '}
          <B>4 fois</B>.
        </P>
        <P>
          Une description Instagram, c’est un post LinkedIn. Un transcript de tier list devient un
          post, une newsletter, un carrousel. Et chaque mois, republie tes posts les plus viraux du
          mois précédent — pense au nombre d’opportunités que tu rates en ne le faisant pas.
        </P>
      </>
    ),
  },
  {
    id: 'biais',
    title: 'Les 7 biais qui font cliquer',
    body: (
      <>
        <P>
          <B>1. L’extrémité</B> — MrBeast : « 50 légendes YouTube s’affrontent pour 1 million de
          dollars ». Tellement énorme que tu cliques.
        </P>
        <P>
          <B>2. Le contraste</B> — « Voiture à 1 $ contre voiture à 100 millions de dollars ». Moi :
          « les conseils d’un entrepreneur à 1 € par an contre ceux d’un client à{' '}
          <B>100 millions d’euros par an</B> ».
        </P>
        <P>
          <B>3. Les listes</B> — « Le top 5 des pires influenceurs LinkedIn ». Le cerveau veut la
          liste complète.
        </P>
        <P>
          <B>4. La négativité</B> — regarde les titres d’Hugo Décrypte : la honte, la mort,
          « l’ONU s’alarme ». Jamais « l’ONU est inquiète ». Les pires erreurs battent les meilleurs
          conseils.
        </P>
        <P>
          <B>5. La narration</B> — dis ce que la personne a fait avant son nom. « Ce mec de 30 ans a
          sauvé 3 milliards d’êtres humains, personne n’en parle » (Pasteur). « Cette femme a
          cofondé ChatGPT, sauf que personne ne la connaît. »
        </P>
        <P>
          <B>6. La familiarité</B> — parle de ce que ton audience connaît déjà : ChatGPT plutôt que
          « l’IA », James Bond plutôt que « le cinéma ».
        </P>
        <P>
          <B>7. La doxa</B> — prends l’inverse de ce que tout le monde pense vrai. C’est le secret
          des platistes : tout le monde est fasciné par celui qui conteste l’évidence.
        </P>
      </>
    ),
  },
  {
    id: 'systeme',
    title: 'Temps + coût : sans système, tu finis en burnout',
    ctaAfter: true,
    body: (
      <>
        <P>
          Tu peux passer une journée à monter une vidéo qui fera 200 vues. Ce qu’il te faut, c’est
          passer <B>10 secondes</B> sur une vidéo qui peut en faire un million — et si elle fait
          200 vues, tant pis : tu n’y as passé que 10 secondes. C’est toute la méthodologie du
          système.
        </P>
        <P>
          J’ai investi <B>plus de 20 000 €</B> dans un studio de podcast. Il ne sert à rien. Je n’ai
          jamais fait autant de vues que depuis que tout part de mon téléphone et de mes écouteurs.
          Un Américain dit que si tu n’es pas prêt à passer <B>3 ans sans gagner un centime</B>,
          tu n’es pas un vrai créateur. Moi je dis : avec un système, tu as des résultats dès le
          premier mois. Sans système, tu tiens trois semaines et tu finis en burnout.
        </P>
        <P>
          Et tout se mesure : chaque lien est tracké, chaque clic, chaque lead, chaque rendez-vous.
          Sur <B>1 000 clics</B>, je faisais <B>50 à 100 inscrits</B> à mes webinars — jusqu’à{' '}
          <B>1 000 inscrits</B> par webinar, en organique, sans un euro de publicité. Et quand ta
          croissance atteint un palier, une seule chose le fait sauter : ta marque personnelle.
        </P>
      </>
    ),
  },
  {
    id: 'legende',
    title: 'Crée ta légende, pas ton CV',
    body: (
      <>
        <P>
          Avec qui tu préfères dîner : Hugo Décrypte ou Anthony Bourbon ? La plupart répondent
          Bourbon. Pas parce qu’il est meilleur — parce qu’on connaît sa personnalité. C’est la
          différence entre documenter sa vie et créer sa légende : les gens t’ont en tête pour ce
          que tu es, pas pour ce que tu fais.
        </P>
        <P>
          Alors mets tes valeurs dans ton contenu. Moi, c’est la parole : quand je dis quelque
          chose, je le fais, et il n’y a pas d’autre canal que le contenu pour le faire savoir. Sois
          clivant si c’est ce que tu penses — les gens que tu attires te ressemblent, et ceux qui te
          critiquent sont précisément ceux avec qui tu ne veux pas travailler.
        </P>
        <P>
          Dernier conseil : décomplexifie le fait d’avoir tort. Lance-toi, publie, change d’avis en
          route. Plus tu le fais, plus tu as envie de partager, plus les vues arrivent — et plus la
          machine travaille pour toi.
        </P>
      </>
    ),
  },
]
