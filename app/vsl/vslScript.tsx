import type { ReactNode } from 'react'

// Version écrite de la VSL (« L'équation de la visibilité avec l'IA », 29 min 30,
// hébergée sur notre storage — remplace le live d'1 h 26 depuis le 20 novembre
// 2026). Fidèle au transcript : mêmes idées, mêmes chiffres, mêmes moments de
// CTA (après l'équation complète, après le système, et la fin). Rien d'inventé :
// chaque chiffre vient de ce que Kevin dit dans la vidéo.

export const READ_MINUTES = 8

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
    id: 'cigarette',
    title: 'La première cigarette',
    body: (
      <>
        <P>
          Tu te souviens de ta première cigarette ? Moi, j’avais 14 ans, caché derrière le gymnase
          avec mon meilleur pote. Il avait piqué un paquet de Marlboro à son père, il en a allumé
          une et il me l’a tendue. Je savais très bien que c’était mauvais — on nous l’avait répété
          mille fois, le prof de SVT nous avait montré les photos de poumons tout noirs. Mais
          c’était mon meilleur pote, la main tendue. Je l’ai prise, évidemment. C’était infect, et
          pourtant le lendemain j’en ai repris une avec lui.
        </P>
        <P>
          Cette scène cache l’une des leçons les plus puissantes de l’histoire du marketing. La
          cigarette est probablement <B>le pire produit jamais vendu</B> : elle ne te rend ni plus
          riche ni plus beau, elle te tue, et c’est écrit en gros sur le paquet. Pourtant{' '}
          <B>17,5 millions de Français</B> fument chaque jour, plus d’un milliard de personnes dans
          le monde. Personne n’a commencé parce que « ça avait l’air d’être un bon produit ». Tu as
          fumé parce que quelqu’un que tu aimais fumait. L’industrie du tabac l’avait compris :
          Philip Morris aurait versé <B>42 100 $</B> pour placer ses Marlboro dans Superman II.
        </P>
        <P>
          C’est ce que le psychologue Robert Zajonc appelle <B>l’effet de simple exposition</B> :
          plus on voit quelque chose, plus on l’apprécie et plus on lui fait confiance, sans aucune
          raison. On n’achète pas un produit pour sa qualité. On achète un produit parce qu’on le
          voit partout.
        </P>
      </>
    ),
  },
  {
    id: 'equation',
    title: 'La visibilité est une équation',
    body: (
      <>
        <P>
          Si tu es entrepreneur, tes futurs clients te choisissent exactement de la même façon.
          Quand quelqu’un cherche une solution, il ne va pas vers le meilleur : il va vers{' '}
          <B>celui qu’il a vu passer 30 fois dans son fil</B>. Tu peux être très bon, avoir des
          clients contents et des années de métier — si personne ne te voit, c’est ton concurrent,
          moins bon, qui prend les clients. Et pendant que ta vidéo plafonne à 187 vues, d’autres,
          pas plus intelligents que toi, en font 100 000 sur la même plateforme.
        </P>
        <P>
          Après des années à publier et des millions d’impressions, j’ai décortiqué des milliers de
          contenus — les miens et ceux des plus gros créateurs du monde, dans des niches qui
          n’avaient rien à voir. Une poignée de variables revient partout, et elles ne marchent pas
          chacune dans leur coin : elles se multiplient et forment <B>l’équation de la visibilité</B>.
          Résous-la et tu deviens visible partout. Rate une seule variable et tu restes bloqué à
          187 vues, peu importe tes efforts.
        </P>
        <P>
          Pendant des années, cette équation était insoluble pour presque tout le monde : il
          fallait y sacrifier ses soirées, ou payer une équipe de monteurs, rédacteurs et community
          managers à plus de 5 000 € par mois. Avec l’IA, cette contrainte s’est effondrée.{' '}
          <B>Pour la première fois, l’équation est solvable pour presque tout le monde.</B> Dans
          cette page, je te la dévoile variable par variable.
        </P>
      </>
    ),
  },
  {
    id: 'parcours',
    title: 'D’où vient cette équation',
    body: (
      <>
        <P>
          Je m’appelle Kevin Dufraisse. Avant de faire du contenu, j’ai passé des années dans le
          marketing, jusqu’à travailler chez <B>The Family</B>, l’un des plus grands accélérateurs
          de start-up d’Europe. Beaucoup pensent que The Family était un incubateur. En réalité,
          c’était un média : son vrai métier, c’était de <B>fabriquer la légende de ses fondateurs</B>.
          On prenait des parts dans des boîtes solides dont personne ne parlait, et au lieu de
          retoucher le produit, on aidait le fondateur à prendre la parole pour qu’on le voie
          partout. Un fondateur que tout le monde connaît, ça change tout : les rendez-vous se
          remplissent, le carnet de commandes explose, les investisseurs viennent d’eux-mêmes.
          Cette stratégie a représenté plus d’un milliard d’euros de valorisation.
        </P>
        <P>
          Quand The Family s’est effondré, j’ai tout testé sur moi. J’ai écrit sur LinkedIn tous
          les jours, et en quelques années je suis devenu <B>le n°1 de la génération de leads en
          France</B> sur LinkedIn. Les plus gros créateurs francophones me citaient, partageaient
          mes posts, m’invitaient. Pendant 4 ans, j’ai eu un monopole que personne ne voyait — et
          c’est comme ça que j’ai généré <B>plus de 3 millions d’euros</B> avec mes formations.
        </P>
        <P>
          Vu de l’extérieur, j’avais réussi. En vrai, j’étais à la limite du burn-out : je me
          couchais en pensant au post du lendemain, je vérifiais mes stats avant de dire bonjour.
          Pour tenir, je payais des freelances à plein temps, j’ai acheté plus de 20 000 € de
          formations, investi 20 000 € dans un studio podcast. Alors je me suis posé une seule
          question : <B>est-ce qu’on peut être visible partout, tout le temps, sans y laisser sa
          vie ?</B>
        </P>
      </>
    ),
  },
  {
    id: 'message',
    title: 'Variable 1 : le Message',
    body: (
      <>
        <P>
          La première variable m’a mis en colère, parce qu’elle contredisait tout ce qu’on m’avait
          vendu. Toutes les formations m’avaient appris à écrire des accroches qui claquent, à
          aérer mes posts, à suivre des templates. J’appliquais tout à la lettre — et mes posts les
          mieux écrits faisaient des flops, pendant que d’autres, écrits en 5 minutes entre deux
          rendez-vous, explosaient.
        </P>
        <P>
          Regarde Éric Larchevêque, le fondateur de Ledger : il écrit des posts sans aucune règle
          de copywriting, et il cartonne. Tu vas me dire « normal, tout le monde le connaît » — et
          c’est justement ça, la leçon. <B>Les gens ne s’arrêtent pas sur ce qui est bien écrit,
          ils s’arrêtent sur ce qu’ils connaissent déjà.</B> Ce n’est pas comment tu écris qui fait
          des vues, c’est ce que tu dis et à quoi tu l’accroches. Tu n’as pas besoin d’être connu :
          tu as besoin de parler de ce que ton marché connaît déjà, et d’y apporter ton regard, tes
          convictions, ce que des années de métier t’ont appris et que personne ne peut raconter à
          ta place.
        </P>
        <P>
          C’est le premier terme de l’équation : <B>le Message</B>. Le seul qu’aucun ghostwriter,
          aucun freelance et aucune IA ne pourra jamais remplir pour toi. La bonne nouvelle : ce
          message, tu l’as déjà. Depuis des années.
        </P>
      </>
    ),
  },
  {
    id: 'diffusion',
    title: 'Variable 2 : la Diffusion',
    body: (
      <>
        <P>
          Avoir un bon message, c’est bien. Si personne ne le voit, ça ne sert à rien. Le 10 juin
          dernier, j’ai publié sur LinkedIn une réflexion sur Google : <B>39 546 vues</B>. La
          plupart des gens se seraient arrêtés là. J’ai pris exactement le même texte, sans rien
          changer, et je l’ai publié sur Threads le même jour : <B>304 535 vues</B> — presque
          8 fois plus. Le lendemain, la même idée en reel Instagram : <B>79 785 vues</B> de plus.
        </P>
        <P>
          Beaucoup d’experts te disent de maîtriser une seule plateforme avant d’aller sur les
          autres. Si j’avais suivi ce conseil, cette idée aurait fait 40 000 vues. En la diffusant
          partout, elle en a fait 400 000 : <B>90 % des vues sont venues d’ailleurs que de là où je
          l’avais écrite</B>. Tes clients ne vivent pas tous sur LinkedIn : certains scrollent
          Instagram le soir, d’autres regardent YouTube, d’autres passent leur temps sur Threads ou
          X. Et avec la traduction automatique, ton contenu n’est même plus limité à un pays.
        </P>
        <P>
          Diffuser, ce n’est pas seulement publier partout : c’est aussi <B>republier</B>. Quand un
          post a marché, Justin Welsh le republie quelques semaines plus tard — et il refait des
          vues. C’est la deuxième variable : <B>la Diffusion</B>.
        </P>
      </>
    ),
  },
  {
    id: 'format',
    title: 'Variable 3 : le Format',
    body: (
      <>
        <P>
          Attention : on ne publie pas la même chose de la même façon partout. Chaque plateforme a
          son propre langage, et chacune possède <B>des formats qui fonctionnent tout le temps</B>,
          que tous les créateurs utilisent. Imagine que tu es avocat en droit du travail et que ton
          message, c’est : « la plupart des salariés signent leur rupture conventionnelle sans
          connaître leurs droits ». Sur TikTok, tu en fais une tier list des pires erreurs de tes
          clients, de la moins grave à la plus coûteuse. Sur YouTube, un extrait de podcast où tu
          racontes un dossier qui t’a marqué. Sur Instagram, tu réagis à un post viral sur le sujet
          et tu ajoutes ton message à la fin — porté par la force de quelqu’un d’autre, comme au
          jiu-jitsu.
        </P>
        <P>
          Et le plus fou : <B>un format qui a marché une fois remarche</B>. Quand je repère un post
          qui a explosé, je ne copie pas son contenu — je reprends sa structure et j’y mets mon
          message. C’est exactement ce que font Alex Hormozi, Ali Abdaal ou Justin Welsh : ils ne
          réinventent pas la roue à chaque post. Sur certains, je ne me prends même pas la tête :
          je clone directement mon visage sur un format qui a déjà marché.
        </P>
        <P>
          Tout le secret est là : <B>le bon message, dans le bon format, pour le bon réseau</B>.
          Certains formats marchent sur LinkedIn mais pas sur TikTok, d’autres cartonnent trois
          mois puis s’essoufflent — et tu n’as ni le temps ni l’envie de tous les tester. C’est
          exactement ce qu’on fait pour les clients qu’on accompagne.
        </P>
      </>
    ),
  },
  {
    id: 'temps-cout',
    title: 'Le dénominateur : Temps + Coût',
    ctaAfter: true,
    body: (
      <>
        <P>
          Récapitulons : un bon message, décliné dans les bons formats, diffusé sur un maximum de
          plateformes. Sur le papier, c’est simple. Dans la vraie vie, toute cette production
          prend du temps et coûte de l’argent : trouver l’idée, écrire, tourner, monter,
          sous-titrer, adapter à chaque réseau, plusieurs fois par semaine — un deuxième métier en
          plus du tien. Alors la plupart des experts délèguent : un monteur, un rédacteur, un
          community manager, et cette petite équipe coûte vite <B>plus de 5 000 € par mois</B> —
          jusqu’à 15 000 € en agence, pour des contenus qui mettent des semaines à sortir et qui ne
          te ressemblent même pas.
        </P>
        <P>
          C’est le dénominateur de l’équation : <B>le Temps et le Coût de production</B>. Si ça te
          coûte trop cher ou te prend trop de temps, tu finiras par arrêter. Or les réseaux ont
          changé : avant, tes posts étaient montrés à tes abonnés ; aujourd’hui,{' '}
          <B>les gens ne suivent plus des comptes, ils suivent des centres d’intérêt</B>. Quelqu’un
          qui a 200 abonnés peut faire un million de vues. Chaque post est une nouvelle chance,
          comme au poker : plus tu joues de mains, plus tu peux gagner. La seule façon de gagner,
          c’est de produire en quantité, pour qu’un contenu qui ne marche pas ne te coûte presque
          rien.
        </P>
        <P>
          Et c’est là que tout a basculé : avec l’IA, ce qui demandait une équipe entière se fait
          en quelques minutes. La contrainte du temps et du coût s’est effondrée.{' '}
          <B>L’équation de la visibilité est devenue solvable — pas seulement pour les grandes
          marques, pour tout le monde.</B> Pourtant, à peine 3 % des gens créent du contenu. Les
          97 % restants regardent. Il y a une place énorme à prendre, mais cette fenêtre ne restera
          pas ouverte longtemps.
        </P>
      </>
    ),
  },
  {
    id: 'systeme',
    title: 'Le système Empire',
    ctaAfter: true,
    body: (
      <>
        <P>
          Ceux qui résolvent l’équation en entier deviennent la référence de leur niche : ils
          vendent plus cher sans justifier leurs prix, leurs clients les recommandent, les
          prospects arrivent déjà convaincus. Cette place, dans un an ou deux, elle sera prise —
          par toi, ou par un concurrent moins bon mais plus rapide. La bonne nouvelle : tu n’as
          plus à résoudre l’équation seul. Avec mon équipe, on a construit <B>le système Empire</B>.
        </P>
        <P>
          En <B>une heure par mois</B>, tu crées un mois de contenu. Tu n’as presque rien à changer
          à tes journées : tu prends ton téléphone et tu parles. Tu n’as même pas à chercher quoi
          dire — chaque semaine, on analyse tes concurrents et les contenus qui explosent, et tu
          reçois des propositions de sujets dans la plateforme. Une idée en pleine journée ? Tu
          l’envoies en vocal, elle devient un contenu. Une seule prise se décline en cascade :
          reels sous-titrés, posts LinkedIn, carrousels, newsletter — chacun adapté aux codes de
          son réseau. Quand tu rouvres l’app, tout est prêt : monté, sous-titré, édité. Il ne reste
          qu’un bouton à presser.
        </P>
        <P>
          Et parce que ce qu’on veut vraiment, ce sont des clients : <B>chaque post porte un lien
          tracké</B>, connecté à ton agenda, tes formulaires, ton système de paiement. Quand un
          prospect prend rendez-vous, tu sais exactement quel post l’a amené. Chaque semaine, tu
          reçois un rapport de ce qui a marché, tes meilleurs contenus sont republiés
          automatiquement, et tous tes commentaires et messages arrivent dans une seule boîte.
          C’est comme ça que Kevin a dépassé les 100 000 vues sur LinkedIn en 21 jours, que Sophie
          a gagné plus de 10 heures par semaine, et que Marguerite, experte CRM, a doublé son
          pipeline commercial.
        </P>
      </>
    ),
  },
  {
    id: 'action',
    title: 'À toi de décider',
    ctaAfter: true,
    body: (
      <>
        <P>
          Imagine : lundi matin, tu prends ton café, et le premier message que tu lis vient d’un
          inconnu — « ça fait des semaines que je vous suis, j’aimerais travailler ensemble ».
          Finis les messages de prospection à froid, finis les appels où il faut tout justifier à
          commencer par ton prix. Quand un prospect arrive en rendez-vous, il a déjà vu dix de tes
          vidéos : il ne se demande plus s’il va travailler avec toi, il se demande quand il peut
          commencer. Tout ça en 20 minutes par semaine.
        </P>
        <P>
          Tu te souviens de mon meilleur pote et de la cigarette ? Je ne l’ai pas suivi parce que
          c’était bon. Je l’ai suivi parce que je le voyais tous les jours et que je lui faisais
          confiance. <B>Demain, c’est toi qu’on peut suivre de la même manière</B> — pour une bien
          meilleure raison : ce que tu as à dire aide vraiment les gens.
        </P>
        <P>
          Si tu fermes cette page et que rien ne change, à quoi ressemblera ton année ? Des soirées
          perdues sur des vidéos qui plafonnent à 187 vues, des concurrents moins bons que toi qui
          signent les clients que tu aurais dû avoir, et une expertise qui reste invisible. Pendant
          ce temps, l’IA n’attend pas : chaque mois, de nouveaux concurrents se lancent pour
          publier plus, plus vite, partout. La visibilité ne dépend pas du hasard — c’est une
          équation, et aujourd’hui elle se résout. Le système Empire a été conçu pour ça :
          commence gratuitement, ou demande une démo et viens avec les chiffres de tes 30 derniers
          jours.
        </P>
      </>
    ),
  },
]
