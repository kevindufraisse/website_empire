import type { Metadata } from 'next'
import { LegalArticle } from '@/components/legal/LegalArticle'

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation - Empire Internet",
  description:
    "CGU de la plateforme Empire Internet. Dernière mise à jour : 8 avril 2026.",
}

export default function TermsPage() {
  return (
    <LegalArticle
      title="Conditions Générales d'Utilisation"
      date="Dernière mise à jour : 8 avril 2026"
    >
      <h2>1. Objet</h2>
      <p>
        Les présentes Conditions Générales d&apos;Utilisation régissent l&apos;accès et
        l&apos;utilisation de la plateforme Empire Internet, un service de gestion et de
        publication sur les réseaux sociaux.
      </p>

      <h2>2. Acceptation</h2>
      <p>
        En créant un compte ou en utilisant le service, vous acceptez les présentes conditions
        dans leur intégralité. Si vous n&apos;acceptez pas ces conditions, n&apos;utilisez pas le
        service.
      </p>

      <h2>3. Description du service</h2>
      <p>Empire Internet permet de :</p>
      <ul>
        <li>
          Connecter vos comptes de réseaux sociaux (LinkedIn, YouTube, TikTok, X, Instagram,
          etc.)
        </li>
        <li>Créer, programmer et publier du contenu sur ces plateformes</li>
        <li>Suivre les performances de vos publications</li>
        <li>Collaborer avec d&apos;autres membres de votre organisation</li>
      </ul>

      <h2>4. Compte utilisateur</h2>
      <ul>
        <li>Vous devez fournir des informations exactes lors de l&apos;inscription</li>
        <li>Vous êtes responsable de la confidentialité de vos identifiants de connexion</li>
        <li>Un compte est personnel et ne peut être partagé</li>
        <li>
          Nous nous réservons le droit de suspendre tout compte en cas de violation de ces
          conditions
        </li>
      </ul>

      <h2>5. Utilisation acceptable</h2>
      <p>Vous vous engagez à ne pas utiliser le service pour :</p>
      <ul>
        <li>Publier du contenu illégal, diffamatoire, haineux ou trompeur</li>
        <li>Violer les conditions d&apos;utilisation des plateformes de réseaux sociaux connectées</li>
        <li>Envoyer du spam ou du contenu non sollicité</li>
        <li>
          Tenter d&apos;accéder de manière non autorisée aux systèmes ou aux données
          d&apos;autres utilisateurs
        </li>
      </ul>

      <h2>6. Propriété intellectuelle</h2>
      <p>
        Vous conservez tous les droits sur le contenu que vous créez et publiez via le service.
        Empire Internet ne revendique aucun droit de propriété sur votre contenu.
      </p>
      <p>
        La plateforme Empire Internet, son design, son code et sa marque sont la propriété
        d&apos;Empire Internet.
      </p>

      <h2>7. Connexion aux services tiers</h2>
      <p>
        L&apos;utilisation des réseaux sociaux via notre service est soumise aux conditions
        d&apos;utilisation respectives de chaque plateforme (LinkedIn, YouTube, TikTok, X, etc.).
        Vous êtes responsable du respect de ces conditions.
      </p>

      <h2>8. Disponibilité du service</h2>
      <p>
        Nous nous efforçons de maintenir le service disponible en permanence, mais ne garantissons
        pas une disponibilité ininterrompue. Des interruptions pour maintenance ou mises à jour
        peuvent survenir.
      </p>

      <h2>9. Limitation de responsabilité</h2>
      <p>Empire Internet ne saurait être tenu responsable :</p>
      <ul>
        <li>Des modifications ou interruptions des API des réseaux sociaux tiers</li>
        <li>De la perte de données résultant de circonstances indépendantes de notre volonté</li>
        <li>Des conséquences de publications effectuées par l&apos;utilisateur via le service</li>
      </ul>

      <h2>10. Résiliation</h2>
      <p>
        Vous pouvez supprimer votre compte à tout moment. Nous nous réservons le droit de résilier
        ou suspendre votre accès en cas de non-respect des présentes conditions.
      </p>

      <h2>11. Droit applicable</h2>
      <p>
        Les présentes conditions sont régies par le droit français. Tout litige sera soumis aux
        tribunaux compétents de Paris.
      </p>

      <h2>12. Contact</h2>
      <p>
        Pour toute question relative à ces conditions :
        <br />
        <a href="mailto:kevin@empire-internet.com">kevin@empire-internet.com</a>
      </p>
    </LegalArticle>
  )
}
