'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { LegalArticle } from '@/components/legal/LegalArticle'

export function DataDeletionContent() {
  const { lang } = useLanguage()
  const isFr = lang === 'fr'

  const title = isFr ? 'Suppression de vos données' : 'Data Deletion Instructions'
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
        Cette page explique comment demander la suppression de vos données personnelles
        détenues par Empire Internet, ainsi que la révocation de l&apos;accès aux plateformes
        de réseaux sociaux que vous avez connectées (Facebook, Instagram, YouTube, TikTok,
        LinkedIn, X, etc.).
      </p>

      <h2>1. Suppression depuis l&apos;application</h2>
      <p>
        Si vous disposez d&apos;un compte Empire Internet, vous pouvez supprimer l&apos;intégralité
        de vos données depuis votre tableau de bord :
      </p>
      <ul>
        <li>Connectez-vous à votre compte.</li>
        <li>
          Allez dans <strong>Paramètres → Compte → Supprimer mon compte</strong>.
        </li>
        <li>Confirmez la suppression.</li>
      </ul>
      <p>
        L&apos;intégralité de votre compte, vos tokens OAuth, vos contenus programmés, vos
        statistiques et vos paramètres seront <strong>définitivement effacés sous 30 jours</strong>.
      </p>

      <h2>2. Demande par e-mail</h2>
      <p>
        Si vous n&apos;avez pas accès à votre compte ou si vous préférez procéder par e-mail,
        envoyez votre demande à :
      </p>
      <p>
        <a href="mailto:kevin@empire-internet.com?subject=Demande%20de%20suppression%20de%20donn%C3%A9es">
          kevin@empire-internet.com
        </a>
      </p>
      <p>Indiquez dans votre demande :</p>
      <ul>
        <li>Votre nom et votre adresse e-mail liée au compte Empire Internet.</li>
        <li>
          (Facultatif) L&apos;identifiant Facebook, Instagram, YouTube, TikTok, LinkedIn ou X
          concerné, pour faciliter le traitement.
        </li>
        <li>L&apos;objet : « Demande de suppression de données ».</li>
      </ul>
      <p>
        Nous accusons réception sous 72 heures et procédons à la suppression complète sous{' '}
        <strong>30 jours maximum</strong>, conformément au RGPD. Vous recevrez une confirmation
        par e-mail.
      </p>

      <h2>3. Révocation de l&apos;accès depuis les plateformes</h2>
      <p>
        Vous pouvez également révoquer l&apos;accès d&apos;Empire Internet directement depuis
        chaque plateforme. Cela coupe immédiatement la connexion OAuth et empêche toute
        publication ou lecture de données ultérieure.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">Facebook</h3>
      <p>
        <a
          href="https://www.facebook.com/settings?tab=business_tools"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook → Paramètres → Intégrations business
        </a>{' '}
        → cherchez <em>Empire Internet</em> → <strong>Supprimer</strong>.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">Instagram</h3>
      <p>
        <a
          href="https://www.instagram.com/accounts/manage_access/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram → Applications et sites web
        </a>{' '}
        → cherchez <em>Empire Internet</em> → <strong>Supprimer</strong>.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">Google / YouTube</h3>
      <p>
        <a
          href="https://myaccount.google.com/permissions"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google → Sécurité → Applications tierces avec accès au compte
        </a>{' '}
        → cherchez <em>Empire Internet</em> → <strong>Supprimer l&apos;accès</strong>.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">TikTok</h3>
      <p>
        Application TikTok → <strong>Profil</strong> → <strong>☰ Menu</strong> →{' '}
        <strong>Paramètres et confidentialité</strong> → <strong>Sécurité</strong> →{' '}
        <strong>Gérer les applications et sites web autorisés</strong> → cherchez{' '}
        <em>Empire Internet</em> → <strong>Supprimer l&apos;accès</strong>.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">LinkedIn</h3>
      <p>
        LinkedIn → <strong>Préférences et confidentialité</strong> →{' '}
        <strong>Confidentialité des données</strong> → <strong>Autres applications</strong> →{' '}
        <strong>Services autorisés</strong> → cherchez <em>Empire Internet</em> →{' '}
        <strong>Supprimer</strong>.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">X (Twitter)</h3>
      <p>
        <a
          href="https://x.com/settings/connected_apps"
          target="_blank"
          rel="noopener noreferrer"
        >
          X → Paramètres → Applications connectées
        </a>{' '}
        → cherchez <em>Empire Internet</em> → <strong>Révoquer l&apos;accès</strong>.
      </p>

      <h2>4. Ce qui est supprimé</h2>
      <ul>
        <li>Votre profil utilisateur (e-mail, nom, mot de passe haché).</li>
        <li>Vos tokens OAuth pour toutes les plateformes connectées.</li>
        <li>Vos contenus programmés et brouillons.</li>
        <li>Vos statistiques de publication.</li>
        <li>Vos paramètres et préférences.</li>
        <li>Vos journaux d&apos;utilisation, hors obligations légales de conservation.</li>
      </ul>

      <h2>5. Durée et confirmation</h2>
      <p>
        La suppression est effective sous <strong>30 jours maximum</strong>. Vous recevrez une
        confirmation par e-mail. Passé ce délai, vos données ne sont plus récupérables.
      </p>

      <h2>6. Contact</h2>
      <p>
        Pour toute question concernant la suppression de vos données :
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
        This page explains how to request deletion of your personal data held by Empire
        Internet, and how to revoke access to the social media platforms you have connected
        (Facebook, Instagram, YouTube, TikTok, LinkedIn, X, etc.).
      </p>

      <h2>1. Delete from the application</h2>
      <p>
        If you have an Empire Internet account, you can delete all your data from your
        dashboard:
      </p>
      <ul>
        <li>Sign in to your account.</li>
        <li>
          Go to <strong>Settings → Account → Delete my account</strong>.
        </li>
        <li>Confirm the deletion.</li>
      </ul>
      <p>
        Your entire account, OAuth tokens, scheduled content, statistics and settings will be{' '}
        <strong>permanently erased within 30 days</strong>.
      </p>

      <h2>2. Request by email</h2>
      <p>
        If you do not have access to your account or prefer to request via email, send your
        request to:
      </p>
      <p>
        <a href="mailto:kevin@empire-internet.com?subject=Data%20deletion%20request">
          kevin@empire-internet.com
        </a>
      </p>
      <p>Include in your request:</p>
      <ul>
        <li>Your name and the email address linked to your Empire Internet account.</li>
        <li>
          (Optional) The Facebook, Instagram, YouTube, TikTok, LinkedIn or X identifier
          concerned, to speed up processing.
        </li>
        <li>Subject: &quot;Data deletion request&quot;.</li>
      </ul>
      <p>
        We acknowledge receipt within 72 hours and complete the deletion within{' '}
        <strong>30 days maximum</strong>, in accordance with GDPR. You will receive an email
        confirmation.
      </p>

      <h2>3. Revoke access from the platforms</h2>
      <p>
        You can also revoke Empire Internet&apos;s access directly from each platform. This
        immediately disconnects the OAuth link and prevents any further publication or data
        retrieval.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">Facebook</h3>
      <p>
        <a
          href="https://www.facebook.com/settings?tab=business_tools"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook → Settings → Business Integrations
        </a>{' '}
        → find <em>Empire Internet</em> → <strong>Remove</strong>.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">Instagram</h3>
      <p>
        <a
          href="https://www.instagram.com/accounts/manage_access/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram → Apps and Websites
        </a>{' '}
        → find <em>Empire Internet</em> → <strong>Remove</strong>.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">Google / YouTube</h3>
      <p>
        <a
          href="https://myaccount.google.com/permissions"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google → Security → Third-party apps with account access
        </a>{' '}
        → find <em>Empire Internet</em> → <strong>Remove access</strong>.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">TikTok</h3>
      <p>
        TikTok app → <strong>Profile</strong> → <strong>☰ Menu</strong> →{' '}
        <strong>Settings and privacy</strong> → <strong>Security</strong> →{' '}
        <strong>Manage authorized apps and websites</strong> → find <em>Empire Internet</em> →{' '}
        <strong>Remove access</strong>.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">LinkedIn</h3>
      <p>
        LinkedIn → <strong>Settings &amp; Privacy</strong> → <strong>Data privacy</strong> →{' '}
        <strong>Other applications</strong> → <strong>Permitted services</strong> → find{' '}
        <em>Empire Internet</em> → <strong>Remove</strong>.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-2">X (Twitter)</h3>
      <p>
        <a
          href="https://x.com/settings/connected_apps"
          target="_blank"
          rel="noopener noreferrer"
        >
          X → Settings → Connected apps
        </a>{' '}
        → find <em>Empire Internet</em> → <strong>Revoke access</strong>.
      </p>

      <h2>4. What gets deleted</h2>
      <ul>
        <li>Your user profile (email, name, hashed password).</li>
        <li>Your OAuth tokens for all connected platforms.</li>
        <li>Your scheduled content and drafts.</li>
        <li>Your publication statistics.</li>
        <li>Your settings and preferences.</li>
        <li>Your usage logs, except where legal retention obligations apply.</li>
      </ul>

      <h2>5. Timeline and confirmation</h2>
      <p>
        Deletion is effective within <strong>30 days maximum</strong>. You will receive an
        email confirmation. After this period, your data cannot be recovered.
      </p>

      <h2>6. Contact</h2>
      <p>
        For any question regarding the deletion of your data:
        <br />
        <a href="mailto:kevin@empire-internet.com">kevin@empire-internet.com</a>
      </p>
    </>
  )
}
