'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { LegalArticle } from '@/components/legal/LegalArticle'

export function TermsContent() {
  const { lang } = useLanguage()
  const isFr = lang === 'fr'

  const title = isFr ? "Conditions Générales d'Utilisation" : 'Terms of Use'
  const date = isFr ? 'Dernière mise à jour : 12 mai 2026' : 'Last updated: May 12, 2026'

  return (
    <LegalArticle title={title} date={date} lang={lang}>
      {isFr ? <FrenchContent /> : <EnglishContent />}
    </LegalArticle>
  )
}

function FrenchContent() {
  return (
    <>
      <h2>1. Objet</h2>
      <p>
        Les présentes Conditions Générales d&apos;Utilisation (« CGU ») régissent l&apos;accès
        et l&apos;utilisation de la plateforme Empire Internet (« le service »), exploitée par
        Kevin Dufraisse, accessible sur <a href="https://empire-internet.com">empire-internet.com</a>{' '}
        et ses sous-domaines applicatifs. Le service permet la gestion et la publication
        automatisée de contenu sur les réseaux sociaux.
      </p>

      <h2>2. Acceptation</h2>
      <p>
        En créant un compte, en connectant un compte de réseau social ou en utilisant le
        service de quelque manière que ce soit, vous acceptez les présentes CGU dans leur
        intégralité, ainsi que notre <a href="/privacy">Politique de Confidentialité</a>. Si
        vous n&apos;acceptez pas ces conditions, n&apos;utilisez pas le service.
      </p>

      <h2>3. Description du service</h2>
      <p>Empire Internet permet à ses utilisateurs de :</p>
      <ul>
        <li>
          Connecter leurs comptes de réseaux sociaux (Facebook, Instagram, YouTube, TikTok,
          LinkedIn, X, Threads, Pinterest, Reddit, etc.) via OAuth.
        </li>
        <li>Créer, programmer et publier du contenu sur ces plateformes.</li>
        <li>Suivre les performances publiques de leurs publications.</li>
        <li>Collaborer avec d&apos;autres membres au sein d&apos;une organisation.</li>
      </ul>

      <h2>4. Compte utilisateur</h2>
      <ul>
        <li>Vous devez fournir des informations exactes et à jour lors de l&apos;inscription.</li>
        <li>Vous êtes responsable de la confidentialité de vos identifiants.</li>
        <li>Un compte est personnel et ne peut être partagé.</li>
        <li>Vous devez avoir au moins 16 ans pour utiliser le service.</li>
        <li>
          Nous nous réservons le droit de suspendre ou de résilier tout compte en cas de
          violation des présentes CGU ou des conditions des plateformes connectées.
        </li>
      </ul>

      <h2>5. Utilisation acceptable</h2>
      <p>Vous vous engagez à ne pas utiliser le service pour :</p>
      <ul>
        <li>Publier du contenu illégal, diffamatoire, haineux, trompeur ou frauduleux.</li>
        <li>
          Violer les conditions d&apos;utilisation des plateformes de réseaux sociaux
          connectées (voir section 7).
        </li>
        <li>Envoyer du spam ou diffuser du contenu non sollicité à grande échelle.</li>
        <li>
          Tenter d&apos;accéder de manière non autorisée aux systèmes, comptes ou données
          d&apos;autres utilisateurs.
        </li>
        <li>Contourner les limites techniques de l&apos;API d&apos;une plateforme tierce.</li>
        <li>Revendre, sous-licencier ou rétroconcevoir tout ou partie du service.</li>
      </ul>

      <h2>6. Propriété intellectuelle</h2>
      <p>
        Vous conservez l&apos;intégralité des droits sur le contenu que vous créez et publiez
        via le service. Empire Internet ne revendique aucun droit de propriété sur votre
        contenu et vous accorde une licence non exclusive pour utiliser la plateforme.
      </p>
      <p>
        La plateforme Empire Internet, son design, son code, sa marque et ses contenus
        propres sont la propriété d&apos;Empire Internet et protégés par les lois sur la
        propriété intellectuelle.
      </p>

      <h2>7. Connexion aux plateformes tierces</h2>
      <p>
        L&apos;utilisation des fonctionnalités liées à un réseau social tiers via notre
        service est <strong>soumise aux conditions d&apos;utilisation propres à chaque
        plateforme</strong>. Vous êtes responsable du respect de ces conditions. Notamment :
      </p>
      <ul>
        <li>
          <strong>Meta (Facebook / Instagram / Threads)</strong> :{' '}
          <a
            href="https://developers.facebook.com/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Meta Platform Terms
          </a>{' '}
          et{' '}
          <a
            href="https://developers.facebook.com/devpolicy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Meta Developer Policies
          </a>
          .
        </li>
        <li>
          <strong>Google / YouTube</strong> : en utilisant les fonctionnalités YouTube, vous
          acceptez les{' '}
          <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">
            YouTube Terms of Service
          </a>{' '}
          et la{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google Privacy Policy
          </a>
          . Notre utilisation des API Google est conforme à la{' '}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , y compris les exigences Limited Use.
        </li>
        <li>
          <strong>TikTok</strong> :{' '}
          <a
            href="https://developers.tiktok.com/legal/page/individual-developer-terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
          >
            TikTok Developer Terms of Service
          </a>
          .
        </li>
        <li>
          <strong>LinkedIn</strong> :{' '}
          <a
            href="https://www.linkedin.com/legal/l/api-terms-of-use"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn API Terms of Use
          </a>
          .
        </li>
        <li>
          <strong>X (Twitter)</strong> :{' '}
          <a
            href="https://developer.x.com/en/developer-terms/agreement-and-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            X Developer Agreement and Policy
          </a>
          .
        </li>
      </ul>
      <p>
        Empire Internet n&apos;est ni affilié, ni sponsorisé, ni soutenu par ces plateformes.
        Toutes les marques citées sont la propriété de leurs détenteurs respectifs.
      </p>

      <h2>8. Disponibilité du service</h2>
      <p>
        Nous nous efforçons de maintenir le service disponible en permanence, mais nous ne
        garantissons pas une disponibilité ininterrompue. Des interruptions pour maintenance,
        mises à jour ou évolutions des API tierces peuvent survenir sans préavis.
      </p>

      <h2>9. Limitation de responsabilité</h2>
      <p>
        Dans la limite autorisée par la loi, Empire Internet ne saurait être tenu responsable :
      </p>
      <ul>
        <li>Des modifications, restrictions ou interruptions des API des plateformes tierces.</li>
        <li>
          De la suspension, restriction ou suppression d&apos;un compte par une plateforme
          tierce résultant du contenu publié par l&apos;utilisateur.
        </li>
        <li>
          De la perte de données résultant de circonstances indépendantes de notre volonté
          (cas de force majeure, panne réseau, attaque informatique, etc.).
        </li>
        <li>
          Des conséquences directes ou indirectes des publications effectuées par
          l&apos;utilisateur via le service.
        </li>
        <li>
          Des dommages indirects, perte de profit, perte d&apos;audience, atteinte à la
          réputation.
        </li>
      </ul>

      <h2>10. Tarification, paiement et remboursement</h2>
      <p>
        Certaines fonctionnalités du service sont proposées par abonnement payant. Les tarifs,
        la durée et les modalités de paiement sont précisés au moment de la souscription. Vous
        pouvez résilier votre abonnement à tout moment ; la résiliation prend effet à la fin
        de la période en cours.
      </p>

      <h2>11. Résiliation</h2>
      <p>
        Vous pouvez supprimer votre compte à tout moment via votre tableau de bord ou en nous
        contactant. Voir la page <a href="/data-deletion">Suppression de données</a>. Nous
        nous réservons le droit de résilier ou suspendre votre accès en cas de non-respect
        des présentes CGU, des conditions des plateformes connectées, ou pour des raisons de
        sécurité.
      </p>

      <h2>12. Modifications des CGU</h2>
      <p>
        Nous pouvons modifier ces CGU à tout moment. En cas de modification substantielle,
        nous vous en informerons par e-mail ou via la plateforme au moins 30 jours avant
        l&apos;entrée en vigueur. La poursuite de l&apos;utilisation du service après cette
        date vaut acceptation des nouvelles conditions.
      </p>

      <h2>13. Droit applicable et juridiction</h2>
      <p>
        Les présentes CGU sont régies par le droit français. Tout litige relatif à leur
        interprétation ou exécution sera soumis aux tribunaux compétents de Paris, sous
        réserve des dispositions impératives applicables aux consommateurs.
      </p>

      <h2>14. Contact</h2>
      <p>
        Pour toute question relative à ces CGU :
        <br />
        Empire Internet — Kevin Dufraisse
        <br />
        <a href="mailto:kevin@empire-internet.com">kevin@empire-internet.com</a>
      </p>
    </>
  )
}

function EnglishContent() {
  return (
    <>
      <h2>1. Purpose</h2>
      <p>
        These Terms of Use (&quot;Terms&quot;) govern access to and use of the Empire Internet
        platform (&quot;the service&quot;), operated by Kevin Dufraisse, available at{' '}
        <a href="https://empire-internet.com">empire-internet.com</a> and its application
        subdomains. The service enables the management and automated publication of content
        across social media networks.
      </p>

      <h2>2. Acceptance</h2>
      <p>
        By creating an account, connecting a social account or using the service in any way,
        you accept these Terms in full, together with our{' '}
        <a href="/privacy">Privacy Policy</a>. If you do not accept these terms, do not use the
        service.
      </p>

      <h2>3. Service description</h2>
      <p>Empire Internet allows users to:</p>
      <ul>
        <li>
          Connect their social media accounts (Facebook, Instagram, YouTube, TikTok, LinkedIn,
          X, Threads, Pinterest, Reddit, etc.) via OAuth.
        </li>
        <li>Create, schedule and publish content to those platforms.</li>
        <li>Track the public performance of their posts.</li>
        <li>Collaborate with other members within an organization.</li>
      </ul>

      <h2>4. User account</h2>
      <ul>
        <li>You must provide accurate and up-to-date information at sign-up.</li>
        <li>You are responsible for keeping your credentials confidential.</li>
        <li>Accounts are personal and may not be shared.</li>
        <li>You must be at least 16 years old to use the service.</li>
        <li>
          We reserve the right to suspend or terminate any account that violates these Terms or
          the terms of any connected platform.
        </li>
      </ul>

      <h2>5. Acceptable use</h2>
      <p>You agree not to use the service to:</p>
      <ul>
        <li>Publish illegal, defamatory, hateful, misleading or fraudulent content.</li>
        <li>
          Violate the terms of use of any connected social media platform (see Section 7).
        </li>
        <li>Send spam or distribute unsolicited content at scale.</li>
        <li>
          Attempt unauthorized access to systems, accounts or data of other users.
        </li>
        <li>Circumvent the technical limits of any third-party API.</li>
        <li>Resell, sublicense or reverse-engineer any part of the service.</li>
      </ul>

      <h2>6. Intellectual property</h2>
      <p>
        You retain all rights to the content you create and publish through the service.
        Empire Internet claims no ownership of your content and grants you a non-exclusive
        license to use the platform.
      </p>
      <p>
        The Empire Internet platform, its design, code, brand and proprietary content are the
        property of Empire Internet and protected by intellectual property laws.
      </p>

      <h2>7. Connection to third-party platforms</h2>
      <p>
        Use of the features related to a third-party social network through our service is{' '}
        <strong>subject to the terms of use of each platform</strong>. You are responsible for
        complying with these terms. In particular:
      </p>
      <ul>
        <li>
          <strong>Meta (Facebook / Instagram / Threads)</strong>:{' '}
          <a
            href="https://developers.facebook.com/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Meta Platform Terms
          </a>{' '}
          and{' '}
          <a
            href="https://developers.facebook.com/devpolicy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Meta Developer Policies
          </a>
          .
        </li>
        <li>
          <strong>Google / YouTube</strong>: by using YouTube features, you agree to the{' '}
          <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">
            YouTube Terms of Service
          </a>{' '}
          and the{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google Privacy Policy
          </a>
          . Our use of Google APIs complies with the{' '}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </li>
        <li>
          <strong>TikTok</strong>:{' '}
          <a
            href="https://developers.tiktok.com/legal/page/individual-developer-terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
          >
            TikTok Developer Terms of Service
          </a>
          .
        </li>
        <li>
          <strong>LinkedIn</strong>:{' '}
          <a
            href="https://www.linkedin.com/legal/l/api-terms-of-use"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn API Terms of Use
          </a>
          .
        </li>
        <li>
          <strong>X (Twitter)</strong>:{' '}
          <a
            href="https://developer.x.com/en/developer-terms/agreement-and-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            X Developer Agreement and Policy
          </a>
          .
        </li>
      </ul>
      <p>
        Empire Internet is not affiliated with, sponsored by or endorsed by these platforms.
        All trademarks mentioned are the property of their respective owners.
      </p>

      <h2>8. Service availability</h2>
      <p>
        We strive to keep the service available at all times, but we do not guarantee
        uninterrupted availability. Maintenance, updates and changes to third-party APIs may
        cause interruptions without notice.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, Empire Internet shall not be liable for:
      </p>
      <ul>
        <li>Changes, restrictions or interruptions to third-party platform APIs.</li>
        <li>
          Suspension, restriction or removal of an account by a third-party platform resulting
          from user-published content.
        </li>
        <li>
          Data loss resulting from circumstances beyond our control (force majeure, network
          outage, cyber attack, etc.).
        </li>
        <li>
          Direct or indirect consequences of publications made by the user through the service.
        </li>
        <li>Indirect damages, loss of profit, loss of audience, reputational damage.</li>
      </ul>

      <h2>10. Pricing, payment and refund</h2>
      <p>
        Certain features of the service are offered through paid subscriptions. Prices, terms
        and payment methods are specified at the time of subscription. You may cancel your
        subscription at any time; cancellation takes effect at the end of the current period.
      </p>

      <h2>11. Termination</h2>
      <p>
        You can delete your account at any time via your dashboard or by contacting us. See
        our <a href="/data-deletion">Data Deletion page</a>. We reserve the right to terminate
        or suspend your access for breach of these Terms, breach of any connected
        platform&apos;s terms, or for security reasons.
      </p>

      <h2>12. Changes to the Terms</h2>
      <p>
        We may modify these Terms at any time. In case of material change, we will notify you
        by email or through the platform at least 30 days before the change takes effect.
        Continued use of the service after that date constitutes acceptance of the new terms.
      </p>

      <h2>13. Governing law and jurisdiction</h2>
      <p>
        These Terms are governed by French law. Any dispute relating to their interpretation
        or performance shall be submitted to the competent courts of Paris, subject to
        mandatory consumer protection provisions.
      </p>

      <h2>14. Contact</h2>
      <p>
        For any question relating to these Terms:
        <br />
        Empire Internet — Kevin Dufraisse
        <br />
        <a href="mailto:kevin@empire-internet.com">kevin@empire-internet.com</a>
      </p>
    </>
  )
}
