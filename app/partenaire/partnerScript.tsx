import type { ReactNode } from 'react'
import type { TextSection } from '@/components/ListenReadFormats'

// Version écrite de la vidéo partenaire (Loom 5ac5b550…, 21 min 52).
// Fidèle au transcript ElevenLabs Scribe : mêmes chiffres, mêmes témoignages,
// CTA (portes ouvertes) aux mêmes moments qu'en vidéo (~14:44, ~17:36, fin).
// Les prix 500/700/800 € sont ceux du festival partenaire (PARTNER_FESTIVAL_TIERS).

export const PARTNER_READ_MINUTES = 6

const P = ({ children }: { children: ReactNode }) => (
  <p className="mb-4 leading-relaxed text-neutral-300">{children}</p>
)

const B = ({ children }: { children: ReactNode }) => (
  <strong className="font-bold text-white">{children}</strong>
)

export const PARTNER_SECTIONS: TextSection[] = [
  {
    id: 'metier',
    title: 'Le métier dont personne ne parle',
    body: (
      <>
        <P>
          Il existe une application liée à l’intelligence artificielle qui permet à des gens comme
          toi de se reconvertir et de gagner <B>1 000 à 4 000 € par mois</B> depuis chez eux — sans
          compétence technique, sans quitter leur job actuel. Ce n’est pas du trading, pas de
          l’e-commerce, pas de la crypto, pas de l’immobilier. Et si c’était une arnaque, les plus
          grands créateurs et chefs d’entreprise de France ne feraient pas appel à nous au
          quotidien. Pourtant, ils le font.
        </P>
      </>
    ),
  },
  {
    id: 'marche',
    title: 'Pourquoi maintenant',
    body: (
      <>
        <P>
          Bill Gates, Elon Musk, Jeff Bezos et Mark Zuckerberg investissent des milliards dans
          l’IA — Bill Gates parle de la plus grosse révolution technologique depuis les années 80.
          Le marché du contenu, lui, devrait dépasser <B>480 milliards de dollars d’ici 2027</B> :
          même la publicité ne croît pas aussi vite.
        </P>
        <P>
          L’autre face de la pièce : selon Goldman Sachs, l’IA pourrait remplacer{' '}
          <B>300 millions d’emplois d’ici 5 ans</B> — finance, santé, commerce, banque, assurance,
          bureautique. Tu peux subir la vague, ou prendre une longueur d’avance en la maîtrisant.
        </P>
      </>
    ),
  },
  {
    id: 'exemples',
    title: 'Des gens partis de zéro',
    body: (
      <>
        <P>
          Amélie était salariée, bloquée dans sa routine de bureau, et n’avait jamais vendu une
          prestation en ligne. En appliquant la méthode pas à pas, elle a signé son premier client
          d’accompagnement à <B>500 € par mois</B> en quelques jours. Aujourd’hui :{' '}
          <B>plus de 1 500 € de revenus récurrents</B> chaque mois, avec trois clients réguliers.
        </P>
        <P>
          Mon propre frère utilise le système depuis plus d’un an : <B>3 clients réguliers à
          500 € par mois</B>, environ <B>4 heures de travail par client</B>, et un client reste en
          moyenne <B>6 mois</B>. 1 500 € qui tombent tous les mois, sans courir après les clients.
          Et pour des profils de dirigeants comme Olivier ou Sophie, le système remplace le travail
          de plusieurs freelances pour une fraction du prix.
        </P>
      </>
    ),
  },
  {
    id: 'kevin',
    title: 'Qui je suis pour te dire ça',
    body: (
      <>
        <P>
          Moi, c’est Kevin. J’étais en échec scolaire, dernier de ma classe, bloqué dans des boîtes
          où des patrons dictaient mes journées. Tout a basculé quand j’ai trouvé des systèmes pour
          faire le travail plus vite et moins cher que tout le monde : quand des agences
          facturaient un site <B>25 000 €</B>, je le livrais à <B>3 000 €</B> avec mon système — et
          les clients étaient ravis. J’ai ensuite rejoint The Family, le plus grand accélérateur de
          start-up d’Europe, pour enseigner ces techniques. Aujourd’hui, des multimillionnaires et
          des boîtes comme Walaxy s’appuient sur mes systèmes, et contrairement à la majorité des
          formateurs, je suis toujours sur le terrain. C’est exactement pour ça que je cherche des
          partenaires : on croule sous la demande.
        </P>
      </>
    ),
  },
  {
    id: 'content-operateur',
    title: 'Content opérateur, concrètement',
    body: (
      <>
        <P>
          Le métier : tu gères le contenu d’un dirigeant, Empire produit tout en arrière-plan. Tu
          fais un échange de <B>30 minutes</B> avec lui pour qu’il te raconte sa vie, tu glisses
          l’échange dans l’application, l’IA génère ses contenus sur <B>7 réseaux</B> en trois
          clics, et toi, tu valides. Ça te prend <B>environ 1 heure par semaine et par client</B>.
        </P>
        <P>
          Exemple réel : Walid, CEO de Success Group, voulait lancer un logiciel sans équipe pour
          communiquer. J’ai cadré son message, le système a généré ses contenus. Un seul contenu
          lui a rapporté <B>plus de 12 000 € de ventes</B> — et moi, <B>3 500 €</B> pour une
          mission gérée depuis le Brésil, les pieds dans l’eau. Les dirigeants paient pour ça parce
          qu’un contenu régulier leur rapporte des dizaines de milliers d’euros sans un centime de
          publicité.
        </P>
      </>
    ),
  },
  {
    id: 'calcul',
    title: 'Fais le calcul',
    body: (
      <>
        <P>
          Des content opérateurs qui débutent prennent <B>500 € par mois</B> par client ; d’autres
          montent vite à <B>1 000 €</B>. Avec seulement <B>3 clients réguliers à 500 €</B>, tu
          touches <B>1 500 € par mois</B> pour environ <B>12 heures de travail dans le mois</B> —
          depuis chez toi ou en voyage.
        </P>
        <P>
          Assez de clients pour tout le monde ? Il existe <B>plus de 20 millions d’entreprises
          francophones</B>. Si seulement 1 % veut se faire accompagner, ça fait{' '}
          <B>200 000 clients potentiels</B> — et il t’en faut deux ou trois. En face, l’offre est
          quasi inexistante : des concurrents facturent <B>20 000 €</B> ce qu’on livre pour 500 €,
          en mieux.
        </P>
        <P>
          Et pendant que tu gères le contenu de tes clients, tu utilises la machine pour toi : tu
          construis ta propre audience, sans devenir influenceur, sans même montrer ton visage si
          tu n’en as pas envie. Une de nos membres a ensuite lancé son activité pour aider les gens
          à arrêter l’alcool : <B>plus de 20 000 € par mois</B> grâce à l’audience qu’elle s’est
          bâtie.
        </P>
      </>
    ),
  },
  {
    id: 'programme',
    title: 'Le programme Partenaire Empire : 3 piliers',
    ctaAfter: true,
    body: (
      <>
        <P>
          <B>1. La machine de production.</B> Un accès complet à Empire, qui produit les contenus à
          ta place en moins de 5 minutes — même si tu n’as jamais écrit ni monté une vidéo. Plus de{' '}
          <B>350 formats et frameworks viraux</B>, tirés de publications qui cumulent{' '}
          <B>plus de 80 millions de vues</B>. Tu reçois <B>4 000 crédits dès le premier mois</B>{' '}
          pour ta propre visibilité, et ta page consultant pour encaisser depuis la plateforme.
        </P>
        <P>
          <B>2. La communauté et le réseau d’opportunités.</B> Accès à vie à la communauté et aux
          replays. Et surtout : on reçoit des demandes de clients chaque semaine, qu’on place en
          priorité chez nos membres formés. Romain a pris <B>500 € dès sa première semaine</B>,
          Sarah encaisse <B>1 000 € par mois</B>, Julien <B>1 500 € par mois</B> avec trois
          clients.
        </P>
        <P>
          <B>3. Le bootcamp 21 jours.</B> Un plan d’action d’<B>une heure par jour pendant
          21 jours</B>, un live chaque semaine, et un support continu pour débloquer tes dossiers.
          Tu es pris par la main jusqu’à ton premier client.
        </P>
      </>
    ),
  },
  {
    id: 'voies',
    title: 'Les trois voies',
    ctaAfter: true,
    body: (
      <>
        <P>
          <B>Voie 1 : tu ne fais rien.</B> C’est ce que feront 95 % de ceux qui voient cette vidéo.
          Avec l’inflation, les salaires qui stagnent et la retraite qui s’éloigne, attendre, c’est
          rester coincé dans une vie qui ne te convient plus.
        </P>
        <P>
          <B>Voie 2 : tu essaies seul.</B> Des dizaines de tutos YouTube plus tard, tu seras plus
          perdu qu’au départ — sans l’outil qui produit à ta place, sans les missions de la
          communauté, sans accompagnement. Un de nos membres a passé un an et demi comme ça, sans
          signer un seul client, avant de comprendre qu’il lui manquait juste un cadre et l’outil.
        </P>
        <P>
          <B>Voie 3 : tu viens aux portes ouvertes gratuites.</B> En 45 minutes, on te montre tout
          en direct : comment un content opérateur accompagne un dirigeant en 30 minutes, ce que tu
          fais et ce que la plateforme prend en charge, comment fonctionnent les missions, la
          rémunération et tes crédits, et comment se déroule le bootcamp.
        </P>
      </>
    ),
  },
  {
    id: 'investissement',
    title: 'L’investissement, en toute transparence',
    body: (
      <>
        <P>
          Le programme n’est pas fait pour tout le monde : il faut être prêt à investir une heure
          par jour pendant 21 jours. Les frais d’inscription sont clairs : <B>entre 500 et 800 €</B>{' '}
          selon le moment où tu prends ta place dans la semaine — <B>500 € jusqu’au live du
          jeudi</B>, 700 € après, 800 € le dimanche avant la fermeture. Paiement unique, accès à
          vie.
        </P>
        <P>
          Rien que payer des prestataires pour tes posts et tes montages te coûterait{' '}
          <B>plus de 1 000 € par mois</B>. Là, l’application produit tes propres contenus en
          automatique : même sans client, ton investissement se rentabilise pour toi-même. Et avec
          un seul client régulier à 500 € par mois, ton inscription est remboursée dès le premier
          mois.
        </P>
        <P>
          Le bootcamp, semaine par semaine : <B>semaine 1</B>, tu ne pars pas d’une page blanche —
          des posts prêts dans ton calendrier, des scripts de vente rédigés mot pour mot, tes
          premiers prospects connectés à ton agenda. <B>Semaine 2</B>, tu maîtrises les hooks et
          l’adaptation d’un même message sur 7 réseaux. <B>Semaine 3</B>, tu mènes l’entretien
          grâce au script, tu ouvres ta page consultant et tu signes tes premiers clients.
        </P>
        <P>
          Les résultats du bootcamp parlent : Amélie est passée de <B>0 à plus de 130 000 vues sur
          LinkedIn en 3 semaines</B>. Un autre membre, inactif depuis 5 ans, a fait{' '}
          <B>plus de 100 000 vues en 19 jours</B>. Dans le pire des cas, tu auras produit sur tous
          tes réseaux, développé ta marque et économisé 1 000 € de prestataires. Dans le meilleur,
          tu remplaces ton salaire depuis chez toi. Comme disait Einstein : la folie, c’est de
          faire toujours la même chose et d’attendre un résultat différent.
        </P>
      </>
    ),
  },
]
