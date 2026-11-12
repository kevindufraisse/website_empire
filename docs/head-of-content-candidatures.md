# Candidatures Head of Content

`/academy` est réécrit vers `public/academy/head-of-content/index.html`. La page partenaire et les autres sous-pages Academy ne sont pas modifiées.

Le formulaire en trois étapes envoie les coordonnées, quatre réponses de qualification (situation, expérience, disponibilité, projet), un profil facultatif et le consentement à `/api/head-of-content/apply`.

Configuration serveur Vercel :

- `ACADEMY_SLACK_BOT_TOKEN` : bot Empire, secret serveur.
- `ACADEMY_SLACK_CHANNEL` : canal privé `#miam`, `C0CFYMGCXL3`, choisi par Kevin le 12 novembre 2026. Le bot doit en être membre.
- `FOLK_API_KEY` et `FOLK_GROUP_ID` : intégration CRM existante, copie secondaire.

La réponse de succès dépend d'une confirmation `ok: true` de Slack. Un échec Slack renvoie 503, sans effacer le formulaire ni afficher les portes ouvertes. Le message Slack conserve toutes les réponses et fournit un bouton WhatsApp ; ce bouton n'envoie aucun message automatiquement. Folk reçoit ensuite la même candidature dans la description et une note, via `waitUntil`. Un échec Folk est journalisé et ne remet pas en cause la réception dans Slack. Aucune séquence commerciale Systeme.io ou WhatsApp ne démarre depuis ce formulaire.

Les données saisies sont affichées en texte brut dans Slack. Validation serveur, consentement requis, pot de miel, limitation de fréquence et UUID de soumission. Le cache de dédoublonnage et la limite sont locaux à chaque instance : ils réduisent les doubles clics et les tentatives répétées, sans constituer un registre durable global. La référence de soumission est visible dans Slack pour reconnaître un éventuel doublon après une reprise réseau sur une autre instance.

Les portes ouvertes (`https://event.webinarjam.com/register/r0w4xps2`) apparaissent après réception confirmée. La candidature ne vaut pas admission : recontact sous 48 heures pour les personnes sélectionnées. Aucun paiement n'est demandé ; la formation est présentée comme gratuite pour les profils retenus.

Vérification hors ligne : `npm run test:head-of-content` (validation, erreurs réseau/Slack, doublons, contenu CRM, destination serveur imposée). Le script ne contacte aucun service externe.
