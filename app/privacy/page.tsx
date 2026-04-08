import type { Metadata } from 'next'
import { LegalArticle } from '@/components/legal/LegalArticle'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité - Empire Internet',
  description:
    "Politique de confidentialité et traitement des données - Empire Internet. Dernière mise à jour : 8 avril 2026.",
}

export default function PrivacyPage() {
  return (
    <LegalArticle title="Politique de Confidentialité" date="Dernière mise à jour : 8 avril 2026">
      <h2>1. Responsable du traitement</h2>
      <p>
        Empire Internet, exploité par Kevin Dufraisse.
        <br />
        Contact : <a href="mailto:kevin@empire-internet.com">kevin@empire-internet.com</a>
      </p>

      <h2>2. Données collectées</h2>
      <p>Nous collectons les données suivantes lorsque vous utilisez nos services :</p>
      <ul>
        <li>Informations de compte : adresse e-mail, nom, mot de passe (chiffré)</li>
        <li>
          Données de connexion aux réseaux sociaux : tokens OAuth (chiffrés), identifiants de
          comptes sociaux
        </li>
        <li>Données d&apos;utilisation : contenus créés, publications programmées, statistiques de publication</li>
        <li>Données techniques : adresse IP, type de navigateur, pages visitées</li>
      </ul>

      <h2>3. Finalités du traitement</h2>
      <ul>
        <li>Fournir et améliorer nos services de gestion de réseaux sociaux</li>
        <li>Publier du contenu sur vos réseaux sociaux selon vos instructions</li>
        <li>Vous envoyer des notifications liées au service</li>
        <li>Assurer la sécurité et le bon fonctionnement de la plateforme</li>
      </ul>

      <h2>4. Base légale</h2>
      <p>
        Le traitement de vos données est fondé sur l&apos;exécution du contrat de service (article
        6.1.b du RGPD) et votre consentement pour la connexion aux réseaux sociaux tiers.
      </p>

      <h2>5. Partage des données</h2>
      <p>Vos données ne sont jamais vendues. Elles sont partagées uniquement avec :</p>
      <ul>
        <li>
          Les plateformes de réseaux sociaux que vous avez connectées (LinkedIn, YouTube, TikTok,
          X, etc.) dans le cadre de la publication de contenu
        </li>
        <li>
          Nos sous-traitants techniques : hébergement (Coolify/VPS), base de données
          (Supabase/PostgreSQL)
        </li>
      </ul>

      <h2>6. Durée de conservation</h2>
      <p>
        Vos données sont conservées tant que votre compte est actif. Après suppression de votre
        compte, les données sont effacées sous 30 jours.
      </p>

      <h2>7. Vos droits</h2>
      <p>Conformément au RGPD, vous disposez des droits suivants :</p>
      <ul>
        <li>Droit d&apos;accès, de rectification et de suppression de vos données</li>
        <li>Droit à la portabilité de vos données</li>
        <li>Droit d&apos;opposition et de limitation du traitement</li>
        <li>Droit de retirer votre consentement à tout moment</li>
      </ul>
      <p>
        Pour exercer ces droits, contactez-nous à{' '}
        <a href="mailto:kevin@empire-internet.com">kevin@empire-internet.com</a>.
      </p>

      <h2>8. Sécurité</h2>
      <p>
        Nous mettons en place des mesures techniques et organisationnelles pour protéger vos
        données : chiffrement des tokens, accès restreint, protocoles HTTPS.
      </p>

      <h2>9. Cookies</h2>
      <p>
        Nous utilisons des cookies strictement nécessaires au fonctionnement du service
        (authentification, préférences). Aucun cookie publicitaire ou de tracking tiers n&apos;est
        utilisé.
      </p>

      <h2>10. Modifications</h2>
      <p>
        Cette politique peut être mise à jour. En cas de modification substantielle, nous vous en
        informerons par e-mail ou via la plateforme.
      </p>
    </LegalArticle>
  )
}
