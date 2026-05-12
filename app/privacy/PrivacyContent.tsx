'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { LegalArticle } from '@/components/legal/LegalArticle'

export function PrivacyContent() {
  const { lang } = useLanguage()
  const isFr = lang === 'fr'

  const title = isFr ? 'Politique de Confidentialité' : 'Privacy Policy'
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
      <p>
        Empire Internet (« nous », « notre », « le service ») exploite la plateforme accessible
        sur <a href="https://empire-internet.com">empire-internet.com</a> et ses sous-domaines
        applicatifs. Le service permet à ses utilisateurs de connecter leurs comptes de réseaux
        sociaux (Facebook, Instagram, YouTube, TikTok, LinkedIn, X/Twitter, Threads, Pinterest,
        etc.) afin de programmer et publier du contenu. La présente politique décrit comment nous
        collectons, utilisons, stockons, partageons et protégeons vos données.
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        Empire Internet, exploité par Kevin Dufraisse.
        <br />
        Contact : <a href="mailto:kevin@empire-internet.com">kevin@empire-internet.com</a>
      </p>

      <h2>2. Données que nous collectons</h2>
      <p>Nous collectons et traitons les catégories de données suivantes :</p>
      <ul>
        <li>
          <strong>Informations de compte</strong> : adresse e-mail, nom, mot de passe (chiffré),
          préférences linguistiques.
        </li>
        <li>
          <strong>Données de connexion aux plateformes tierces</strong> : tokens OAuth (chiffrés
          au repos), identifiants publics du compte connecté (ID utilisateur, ID de page, nom de
          chaîne, identifiant), photo de profil publique, périmètre des autorisations accordées.
        </li>
        <li>
          <strong>Contenus que vous fournissez</strong> : textes, images, vidéos, légendes,
          hashtags, métadonnées de publication, calendrier de programmation.
        </li>
        <li>
          <strong>Statistiques publiques</strong> : nombre de vues, likes, commentaires,
          impressions, abonnés, fournis par les API des plateformes connectées.
        </li>
        <li>
          <strong>Données techniques</strong> : adresse IP, type de navigateur, système
          d&apos;exploitation, pages visitées, journaux d&apos;erreurs.
        </li>
      </ul>
      <p>
        Nous ne collectons <strong>jamais</strong> votre mot de passe des réseaux sociaux. La
        connexion se fait exclusivement via OAuth 2.0 ou les flux d&apos;authentification
        officiels de chaque plateforme.
      </p>

      <h2>3. Finalités du traitement</h2>
      <ul>
        <li>Fournir, exploiter et améliorer le service de gestion de réseaux sociaux.</li>
        <li>Publier du contenu sur vos comptes sociaux selon vos instructions explicites.</li>
        <li>Récupérer et afficher les statistiques publiques de vos publications.</li>
        <li>Vous envoyer des notifications de service (échec de publication, expiration de token, etc.).</li>
        <li>Assurer la sécurité, prévenir la fraude et respecter nos obligations légales.</li>
      </ul>
      <p>
        <strong>Nous n&apos;utilisons jamais</strong> vos données pour entraîner des modèles
        d&apos;IA, faire de la publicité, du profilage marketing ou les revendre à des tiers.
      </p>

      <h2>4. Base légale (RGPD)</h2>
      <p>
        Le traitement de vos données est fondé sur l&apos;exécution du contrat de service
        (article 6.1.b du RGPD), votre consentement explicite pour la connexion aux plateformes
        tierces (article 6.1.a), et notre intérêt légitime pour la sécurité et l&apos;amélioration
        du service (article 6.1.f).
      </p>

      <h2>5. Partage des données</h2>
      <p>
        Vos données ne sont <strong>jamais vendues</strong>. Elles sont partagées uniquement avec :
      </p>
      <ul>
        <li>
          Les plateformes de réseaux sociaux que vous avez explicitement connectées, dans le cadre
          strict de la publication ou de la récupération de statistiques que vous nous demandez.
        </li>
        <li>
          Nos sous-traitants techniques liés par accord de confidentialité : hébergement
          (Coolify / VPS européen), base de données (Supabase / PostgreSQL), envoi
          d&apos;e-mails transactionnels.
        </li>
        <li>Les autorités compétentes lorsque la loi nous y oblige.</li>
      </ul>

      <h2>6. Durée de conservation</h2>
      <ul>
        <li>Données de compte : durée d&apos;activité du compte.</li>
        <li>
          Tokens OAuth et connexions sociales : jusqu&apos;à la déconnexion de la plateforme par
          l&apos;utilisateur ou la suppression du compte.
        </li>
        <li>Contenus programmés : jusqu&apos;à publication ou suppression par l&apos;utilisateur.</li>
        <li>Statistiques publiques : 24 mois maximum.</li>
        <li>
          Après suppression de votre compte, l&apos;intégralité de vos données est effacée
          définitivement sous <strong>30 jours</strong>. Voir{' '}
          <a href="/data-deletion">notre page de suppression de données</a>.
        </li>
      </ul>

      <h2>7. Conformité aux politiques des plateformes connectées</h2>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">
        7.1 Meta (Facebook & Instagram)
      </h3>
      <p>
        Notre utilisation des données obtenues via les API Meta (Facebook Login, Pages API,
        Instagram Graph API, Threads API) est conforme aux{' '}
        <a href="https://developers.facebook.com/terms" target="_blank" rel="noopener noreferrer">
          Meta Platform Terms
        </a>{' '}
        et aux{' '}
        <a
          href="https://developers.facebook.com/devpolicy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Meta Developer Policies
        </a>
        .
      </p>
      <p>
        Données traitées : identifiant Facebook/Instagram, nom et photo publics, identifiants de
        Pages, jetons d&apos;accès Page, capacité de publication sur les Pages que vous gérez,
        statistiques publiques (impressions, portée, engagement). Nous n&apos;accédons pas à vos
        messages privés, ni à votre fil d&apos;actualité.
      </p>
      <p>
        Vous pouvez révoquer notre accès à tout moment via{' '}
        <a
          href="https://www.facebook.com/settings?tab=business_tools"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook → Paramètres → Intégrations business
        </a>{' '}
        ou{' '}
        <a
          href="https://www.instagram.com/accounts/manage_access/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram → Applications et sites web
        </a>
        . Pour demander la suppression de vos données Meta, suivez les instructions sur{' '}
        <a href="/data-deletion">notre page Data Deletion</a>.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">
        7.2 Google API Services et YouTube
      </h3>
      <p>
        Empire Internet utilise les{' '}
        <a
          href="https://developers.google.com/youtube/v3"
          target="_blank"
          rel="noopener noreferrer"
        >
          YouTube API Services
        </a>{' '}
        pour permettre la publication de vidéos sur les chaînes YouTube de nos utilisateurs.
      </p>
      <p>
        <strong>
          Notre utilisation des informations reçues des API Google, y compris les YouTube API
          Services, est conforme à la{' '}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , y compris les exigences Limited Use.
        </strong>
      </p>
      <p>
        En utilisant les fonctionnalités YouTube de notre service, vous acceptez également les{' '}
        <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">
          YouTube Terms of Service
        </a>{' '}
        et la{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          Google Privacy Policy
        </a>
        .
      </p>
      <p>Données traitées via YouTube API : identifiant de chaîne, nom de chaîne, miniature publique, capacité de téléversement vidéo, statistiques publiques des vidéos.</p>
      <p>
        Vous pouvez révoquer l&apos;accès d&apos;Empire Internet à vos données Google/YouTube à
        tout moment via{' '}
        <a
          href="https://myaccount.google.com/permissions"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google → Sécurité → Applications tierces avec accès au compte
        </a>
        .
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">7.3 TikTok</h3>
      <p>
        Notre utilisation de TikTok Login Kit et de la Content Posting API est conforme aux{' '}
        <a
          href="https://developers.tiktok.com/legal/page/individual-developer-terms-of-service"
          target="_blank"
          rel="noopener noreferrer"
        >
          TikTok Developer Terms of Service
        </a>{' '}
        et à la{' '}
        <a
          href="https://www.tiktok.com/legal/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          TikTok Privacy Policy
        </a>
        .
      </p>
      <p>Données traitées : nom d&apos;affichage public, avatar, identifiant ouvert (open_id), capacité de publication de vidéos.</p>
      <p>
        Pour révoquer l&apos;accès, rendez-vous dans l&apos;application TikTok → Paramètres &
        confidentialité → Gérer les applications et sites web autorisés.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">7.4 LinkedIn</h3>
      <p>
        Notre utilisation des API LinkedIn (Sign In with LinkedIn, Share on LinkedIn, Marketing
        Developer Platform) est conforme aux{' '}
        <a
          href="https://www.linkedin.com/legal/l/api-terms-of-use"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn API Terms of Use
        </a>
        .
      </p>
      <p>Données traitées : nom public, photo, identifiant LinkedIn, identifiants des pages d&apos;entreprise gérées, capacité de publication.</p>
      <p>
        Vous pouvez révoquer l&apos;accès via LinkedIn → Préférences et confidentialité → Comptes
        de données et services tiers → Applications autorisées.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">7.5 X (anciennement Twitter)</h3>
      <p>
        Notre utilisation de l&apos;API X est conforme au{' '}
        <a
          href="https://developer.x.com/en/developer-terms/agreement-and-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          X Developer Agreement and Policy
        </a>
        .
      </p>
      <p>Données traitées : nom d&apos;utilisateur, nom public, identifiant, avatar, capacité de publication.</p>
      <p>
        Vous pouvez révoquer l&apos;accès via{' '}
        <a
          href="https://x.com/settings/connected_apps"
          target="_blank"
          rel="noopener noreferrer"
        >
          X → Paramètres → Applications connectées
        </a>
        .
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">
        7.6 Autres plateformes (Threads, Pinterest, Reddit, etc.)
      </h3>
      <p>
        Pour toute autre plateforme connectée, notre utilisation des données est conforme aux
        conditions de développeur et politiques de confidentialité respectives de cette
        plateforme.
      </p>

      <h2>8. Vos droits (RGPD et lois équivalentes)</h2>
      <p>Vous disposez à tout moment des droits suivants :</p>
      <ul>
        <li>Droit d&apos;accès, de rectification et de suppression de vos données.</li>
        <li>Droit à la portabilité de vos données (export en format machine-lisible).</li>
        <li>Droit d&apos;opposition et de limitation du traitement.</li>
        <li>Droit de retirer votre consentement à tout moment.</li>
        <li>
          Droit d&apos;introduire une réclamation auprès de la CNIL (
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
            cnil.fr
          </a>
          ).
        </li>
      </ul>
      <p>
        Pour exercer ces droits, contactez-nous à{' '}
        <a href="mailto:kevin@empire-internet.com">kevin@empire-internet.com</a>. Nous répondons
        sous 30 jours.
      </p>

      <h2>9. Suppression de vos données</h2>
      <p>
        Vous pouvez demander la suppression totale de vos données à tout moment. Voir notre page
        dédiée : <a href="/data-deletion">empire-internet.com/data-deletion</a>.
      </p>

      <h2>10. Sécurité</h2>
      <p>
        Nous mettons en place des mesures techniques et organisationnelles pour protéger vos
        données : chiffrement AES-256 des tokens OAuth au repos, transport en HTTPS/TLS, accès
        restreint aux bases de données, journalisation des accès, hébergement dans
        l&apos;Espace Économique Européen.
      </p>

      <h2>11. Cookies</h2>
      <p>
        Nous utilisons uniquement des cookies strictement nécessaires (authentification,
        préférences linguistiques, sécurité). Aucun cookie publicitaire ou de tracking tiers
        n&apos;est utilisé en dehors d&apos;un consentement explicite.
      </p>

      <h2>12. Transferts internationaux</h2>
      <p>
        Les données sont stockées dans l&apos;Espace Économique Européen. Lorsque vous publiez
        sur une plateforme tierce, vos contenus sont transmis aux serveurs de cette plateforme,
        qui peut les traiter dans d&apos;autres juridictions selon ses propres conditions.
      </p>

      <h2>13. Mineurs</h2>
      <p>
        Le service n&apos;est pas destiné aux personnes de moins de 16 ans. Nous ne collectons
        pas sciemment de données concernant des mineurs. Si vous pensez qu&apos;un mineur nous a
        transmis des données, contactez-nous pour suppression immédiate.
      </p>

      <h2>14. Modifications</h2>
      <p>
        Cette politique peut être mise à jour. En cas de modification substantielle, nous vous
        en informerons par e-mail ou via la plateforme au moins 30 jours avant l&apos;entrée en
        vigueur.
      </p>

      <h2>15. Contact</h2>
      <p>
        Pour toute question relative à cette politique ou à vos données :
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
      <p>
        Empire Internet (&quot;we&quot;, &quot;our&quot;, &quot;the service&quot;) operates the
        platform available at <a href="https://empire-internet.com">empire-internet.com</a> and
        its application subdomains. The service allows users to connect their social media
        accounts (Facebook, Instagram, YouTube, TikTok, LinkedIn, X/Twitter, Threads, Pinterest,
        etc.) to schedule and publish content. This policy describes how we collect, use, store,
        share and protect your data.
      </p>

      <h2>1. Data Controller</h2>
      <p>
        Empire Internet, operated by Kevin Dufraisse.
        <br />
        Contact: <a href="mailto:kevin@empire-internet.com">kevin@empire-internet.com</a>
      </p>

      <h2>2. Data we collect</h2>
      <p>We collect and process the following categories of data:</p>
      <ul>
        <li>
          <strong>Account information</strong>: email address, name, password (hashed), language
          preferences.
        </li>
        <li>
          <strong>Third-party connection data</strong>: OAuth access and refresh tokens
          (encrypted at rest), public identifiers of the connected account (user ID, page ID,
          channel name, handle), public profile picture, scope of granted permissions.
        </li>
        <li>
          <strong>Content you provide</strong>: text, images, videos, captions, hashtags,
          publication metadata, scheduling calendar.
        </li>
        <li>
          <strong>Public statistics</strong>: number of views, likes, comments, impressions,
          followers, as provided by the APIs of connected platforms.
        </li>
        <li>
          <strong>Technical data</strong>: IP address, browser type, operating system, pages
          visited, error logs.
        </li>
      </ul>
      <p>
        We <strong>never</strong> collect your social media password. Connection is performed
        exclusively via OAuth 2.0 or each platform&apos;s official authentication flow.
      </p>

      <h2>3. How we use your data</h2>
      <ul>
        <li>Provide, operate and improve the social media management service.</li>
        <li>Publish content to your social accounts according to your explicit instructions.</li>
        <li>Retrieve and display public statistics of your posts.</li>
        <li>Send service notifications (publication failure, token expiration, etc.).</li>
        <li>Ensure security, prevent fraud, and comply with our legal obligations.</li>
      </ul>
      <p>
        We <strong>never</strong> use your data to train AI models, run advertising, build
        marketing profiles or resell it to third parties.
      </p>

      <h2>4. Legal basis (GDPR)</h2>
      <p>
        Processing is based on the performance of the service contract (GDPR Article 6.1.b),
        your explicit consent for connecting third-party platforms (Article 6.1.a), and our
        legitimate interest in security and service improvement (Article 6.1.f).
      </p>

      <h2>5. Data sharing</h2>
      <p>
        Your data is <strong>never sold</strong>. It is shared only with:
      </p>
      <ul>
        <li>
          The social media platforms you have explicitly connected, strictly to publish content
          or retrieve statistics you have requested.
        </li>
        <li>
          Our technical sub-processors bound by confidentiality: hosting (Coolify / European
          VPS), database (Supabase / PostgreSQL), transactional email delivery.
        </li>
        <li>Competent authorities when legally required.</li>
      </ul>

      <h2>6. Data retention</h2>
      <ul>
        <li>Account data: duration of account activity.</li>
        <li>
          OAuth tokens and social connections: until the user disconnects the platform or
          deletes the account.
        </li>
        <li>Scheduled content: until publication or user deletion.</li>
        <li>Public statistics: 24 months maximum.</li>
        <li>
          After account deletion, all your data is permanently erased within{' '}
          <strong>30 days</strong>. See our{' '}
          <a href="/data-deletion">data deletion page</a>.
        </li>
      </ul>

      <h2>7. Compliance with connected platforms</h2>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">
        7.1 Meta (Facebook &amp; Instagram)
      </h3>
      <p>
        Our use of data obtained through the Meta APIs (Facebook Login, Pages API, Instagram
        Graph API, Threads API) complies with the{' '}
        <a href="https://developers.facebook.com/terms" target="_blank" rel="noopener noreferrer">
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
      </p>
      <p>
        Data processed: Facebook/Instagram ID, public name and picture, Page IDs, Page access
        tokens, ability to publish on Pages you manage, public statistics (impressions, reach,
        engagement). We do not access your private messages or your news feed.
      </p>
      <p>
        You can revoke our access at any time via{' '}
        <a
          href="https://www.facebook.com/settings?tab=business_tools"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook → Settings → Business Integrations
        </a>{' '}
        or{' '}
        <a
          href="https://www.instagram.com/accounts/manage_access/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram → Apps and Websites
        </a>
        . To request deletion of your Meta data, follow the instructions on our{' '}
        <a href="/data-deletion">Data Deletion page</a>.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">
        7.2 Google API Services and YouTube
      </h3>
      <p>
        Empire Internet uses the{' '}
        <a
          href="https://developers.google.com/youtube/v3"
          target="_blank"
          rel="noopener noreferrer"
        >
          YouTube API Services
        </a>{' '}
        to enable publishing videos to our users&apos; YouTube channels.
      </p>
      <p>
        <strong>
          Empire Internet&apos;s use of information received from Google APIs, including the
          YouTube API Services, adheres to the{' '}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </strong>
      </p>
      <p>
        By using the YouTube features of our service, you also agree to the{' '}
        <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">
          YouTube Terms of Service
        </a>{' '}
        and the{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          Google Privacy Policy
        </a>
        .
      </p>
      <p>
        Data processed via the YouTube API: channel ID, channel name, public thumbnail, ability
        to upload videos, public video statistics.
      </p>
      <p>
        You can revoke Empire Internet&apos;s access to your Google/YouTube data at any time via{' '}
        <a
          href="https://myaccount.google.com/permissions"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google → Security → Third-party apps with account access
        </a>
        .
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">7.3 TikTok</h3>
      <p>
        Our use of the TikTok Login Kit and Content Posting API complies with the{' '}
        <a
          href="https://developers.tiktok.com/legal/page/individual-developer-terms-of-service"
          target="_blank"
          rel="noopener noreferrer"
        >
          TikTok Developer Terms of Service
        </a>{' '}
        and the{' '}
        <a
          href="https://www.tiktok.com/legal/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          TikTok Privacy Policy
        </a>
        .
      </p>
      <p>Data processed: public display name, avatar, open_id, ability to post videos.</p>
      <p>
        To revoke access, go to the TikTok app → Settings &amp; privacy → Manage authorized
        apps and websites.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">7.4 LinkedIn</h3>
      <p>
        Our use of LinkedIn APIs (Sign In with LinkedIn, Share on LinkedIn, Marketing Developer
        Platform) complies with the{' '}
        <a
          href="https://www.linkedin.com/legal/l/api-terms-of-use"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn API Terms of Use
        </a>
        .
      </p>
      <p>
        Data processed: public name, picture, LinkedIn ID, IDs of company Pages you manage,
        ability to publish.
      </p>
      <p>
        You can revoke access via LinkedIn → Settings &amp; Privacy → Data privacy → Other
        applications → Permitted services.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">7.5 X (formerly Twitter)</h3>
      <p>
        Our use of the X API complies with the{' '}
        <a
          href="https://developer.x.com/en/developer-terms/agreement-and-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          X Developer Agreement and Policy
        </a>
        .
      </p>
      <p>Data processed: handle, public name, ID, avatar, ability to publish.</p>
      <p>
        You can revoke access via{' '}
        <a
          href="https://x.com/settings/connected_apps"
          target="_blank"
          rel="noopener noreferrer"
        >
          X → Settings → Connected apps
        </a>
        .
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">
        7.6 Other platforms (Threads, Pinterest, Reddit, etc.)
      </h3>
      <p>
        For any other connected platform, our use of data complies with the respective developer
        terms and privacy policies of that platform.
      </p>

      <h2>8. Your rights (GDPR and equivalent laws)</h2>
      <p>You have the following rights at any time:</p>
      <ul>
        <li>Right of access, rectification and erasure of your data.</li>
        <li>Right to data portability (export in a machine-readable format).</li>
        <li>Right to object and to restrict processing.</li>
        <li>Right to withdraw consent at any time.</li>
        <li>
          Right to lodge a complaint with a supervisory authority (for EU residents, the French
          CNIL:{' '}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
            cnil.fr
          </a>
          ).
        </li>
      </ul>
      <p>
        To exercise these rights, contact us at{' '}
        <a href="mailto:kevin@empire-internet.com">kevin@empire-internet.com</a>. We respond
        within 30 days.
      </p>

      <h2>9. Data deletion</h2>
      <p>
        You can request full deletion of your data at any time. See our dedicated page:{' '}
        <a href="/data-deletion">empire-internet.com/data-deletion</a>.
      </p>

      <h2>10. Security</h2>
      <p>
        We implement technical and organizational measures to protect your data: AES-256
        encryption of OAuth tokens at rest, HTTPS/TLS transport, restricted database access,
        access logging, hosting within the European Economic Area.
      </p>

      <h2>11. Cookies</h2>
      <p>
        We use only strictly necessary cookies (authentication, language preferences, security).
        No advertising or third-party tracking cookies are used without explicit consent.
      </p>

      <h2>12. International transfers</h2>
      <p>
        Data is stored within the European Economic Area. When you publish to a third-party
        platform, your content is transmitted to that platform&apos;s servers, which may
        process it in other jurisdictions under their own terms.
      </p>

      <h2>13. Minors</h2>
      <p>
        The service is not intended for individuals under 16. We do not knowingly collect data
        from minors. If you believe a minor has provided us with data, contact us for immediate
        removal.
      </p>

      <h2>14. Changes</h2>
      <p>
        This policy may be updated. In case of material change, we will notify you by email or
        through the platform at least 30 days before the change takes effect.
      </p>

      <h2>15. Contact</h2>
      <p>
        For any question about this policy or your data:
        <br />
        Empire Internet — Kevin Dufraisse
        <br />
        <a href="mailto:kevin@empire-internet.com">kevin@empire-internet.com</a>
      </p>
    </>
  )
}
