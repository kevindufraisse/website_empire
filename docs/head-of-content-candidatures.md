# Candidatures Head of Content

`/academy` est réécrit vers `public/academy/head-of-content/index.html`. La page partenaire et les autres sous-pages Academy ne sont pas modifiées.

Le formulaire en quatre étapes envoie les coordonnées, dix réponses de qualification, un profil facultatif et le consentement à `/api/head-of-content/apply` (`applicationVersion: 2`). Les dix questions : statut professionnel (CDI, CDD, freelance…), heures disponibles **par mois**, revenus personnels nets actuels (avec choix de ne pas les communiquer dans le formulaire), objectif de chiffre d’affaires mensuel à 6 mois, expérience en contenu, réseaux où la personne a déjà publié, aisance écrit/oral/vidéo, créateur préféré et explication, motivation pour être retenu, date possible de démarrage. Les réseaux sont un choix multiple ; « aucun » est exclusif. Le message Slack inclut le nombre de réseaux et leurs noms.

Le positionnement est l’apprentissage de la viralité et du système Empire pour développer sa propre activité de Head of Content. **10 places par mois**, quota d’admissions communiqué par Kevin le 12 novembre 2026 ; aucune fausse jauge de places restantes ni fermeture automatique des candidatures. L’équipe décide des admissions. La version précédente du formulaire reste acceptée pour les onglets déjà ouverts ; ces candidatures sont signalées comme anciennes dans Slack et Folk, sans inventer les réponses aux nouvelles questions.

Neuf témoignages existants sont repris de `components/pricing/CustomerReviews.tsx` : sept vidéos (Amélie Faligot et Sébastien Min pour le bootcamp ; Marc Dufraisse pour le programme partenaire, frère de Kevin indiqué ; Olivier Sarezinski, Sophie Guibaud, Julien Guyard et Léa Marie pour le système Empire) et les avis écrits, mot pour mot, d’Emmanuelle J. et Gaidig D. Leur contexte reste affiché ; ils ne sont pas présentés comme d’anciens élèves de cette nouvelle sélection gratuite.

Le 13 novembre, Kevin demande l’angle « 3 000 €/mois en 6 h par semaine ». La page présente un **objectif de chiffre d’affaires** et un **temps d’accompagnement estimé**, pas un revenu net ni un temps total garantis. Calcul affiché : 6 clients × 500 €/mois = 3 000 € ; 6 clients × environ 4 h/mois = 24 h/mois, soit 6 h/semaine sur une base de 4 semaines. Les bases de 500 € et 4 h par client sont déjà utilisées dans `app/partenaire/partnerScript.tsx`, sections `exemples` et `calcul`. Formation, prospection et gestion viennent en plus ; le temps réel dépend de chaque mission. Le bloc indique avant charges, impôts et frais d’outils. Aucun chiffre n’est attribué aux témoins. L’admission reste une décision de l’équipe, sans score automatique fondé sur le revenu actuel.

Configuration serveur Vercel :

- `ACADEMY_SLACK_BOT_TOKEN` : bot Empire, secret serveur.
- `ACADEMY_SLACK_CHANNEL` : canal privé `#miam`, `C0CFYMGCXL3`, choisi par Kevin le 12 novembre 2026. Le bot doit en être membre.
- `FOLK_API_KEY` et `FOLK_GROUP_ID` : intégration CRM existante, copie secondaire.

La réponse de succès dépend d'une confirmation `ok: true` de Slack. Un échec Slack renvoie 503, sans effacer le formulaire ni afficher les portes ouvertes. Le message Slack conserve toutes les réponses et fournit un bouton WhatsApp ; ce bouton n'envoie aucun message automatiquement. Folk reçoit ensuite la même candidature dans la description et une note, via `waitUntil`. Un échec Folk est journalisé et ne remet pas en cause la réception dans Slack. Aucune séquence commerciale Systeme.io ou WhatsApp ne démarre depuis ce formulaire.

Les données saisies sont affichées en texte brut dans Slack. Validation serveur, consentement requis, pot de miel, limitation de fréquence et UUID de soumission. Le cache de dédoublonnage et la limite sont locaux à chaque instance : ils réduisent les doubles clics et les tentatives répétées, sans constituer un registre durable global. La référence de soumission est visible dans Slack pour reconnaître un éventuel doublon après une reprise réseau sur une autre instance.

Les portes ouvertes (`https://event.webinarjam.com/register/r0w4xps2`) apparaissent après réception confirmée. La candidature ne vaut pas admission : recontact sous 48 heures pour les personnes sélectionnées. Aucun paiement n'est demandé ; la formation est présentée comme gratuite pour les profils retenus.

Vérification hors ligne : `npm run test:head-of-content` (validation, erreurs réseau/Slack, doublons, contenu CRM, destination serveur imposée). Le script ne contacte aucun service externe.

## Référence du parcours

Dans le podcast de Robin Dormion [à 53:58](https://www.youtube.com/watch?v=odxkbnjQH1o&t=3238s), le parcours décrit est vidéo, questionnaire, contact, formation, pratique. La [vidéo publique de recrutement](https://www.tella.tv/video/createurs-bu-ewm7) mentionne 2–3 questions et un recontact WhatsApp si sélectionné, mais ne révèle pas les questions. Le second podcast transmis (`HxFYL3GzEeo`) ne détaille pas non plus cette liste dans son transcript. Le transcript du documentaire `X7WEXAAMktI` n’était pas disponible lors de cette vérification. Les questions retenues ici sont donc adaptées au brief de Kevin ; ce n’est pas une reproduction prétendument exacte d’un formulaire de Robin.
