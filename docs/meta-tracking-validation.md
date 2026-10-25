# Tracking partenaire — état du 25 octobre 2026

Travail préparé dans les branches `codex/meta-academy-tracking` des deux dépôts. Aucun déploiement ni envoi réel à Meta effectué pour cette modification.

## Sécurité avant mise en ligne

Révoquer le token CAPI exposé dans le Gestionnaire d’événements Meta, en générer un nouveau et le renseigner uniquement dans `META_CAPI_TOKEN` sur l’hébergement serveur du site (Vercel). Ne pas l’envoyer dans le chat, l’exposer au navigateur ou le commiter. Le code conserve le token dans le corps de la requête serveur, jamais dans l’URL.

`META_TEST_EVENT_CODE` est le réglage serveur existant du site. Lorsqu’il est renseigné, tous les événements CAPI de cet environnement sont envoyés en mode test : utiliser un environnement de test isolé et le retirer avant le trafic de production. Le serveur app doit aussi avoir ce réglage pour autoriser la confirmation navigateur d’une session Stripe de test. Il n’a pas besoin du token Meta.

## Modifications

- Cookies `_fbp` / `_fbc` sur `.empire-internet.com`, sécurisés, même valeur entre www et app. Retrait des copies antérieures limitées à un sous-domaine. Le fbclid crée un fbc stable, sans renouveler son timestamp à chaque rendu.
- UTM et fbclid ajoutés aux liens internes cliqués. L’attribution reste aussi dans le cookie partagé, pour les CTA WebinarJam statiques. Les métadonnées Stripe conservent fbp/fbc et les cinq UTM existants.
- CompleteRegistration accepte les coordonnées disponibles et les hache côté serveur : e-mail normalisé, téléphone international, prénom, nom, ID utilisateur. Les empreintes disponibles sont partagées dans un cookie de première partie ; changer d’e-mail ne réutilise pas le téléphone du visiteur précédent.
- InitiateCheckout navigateur + CAPI à l’affichage de l’offre Academy, après résolution du prix affiché, avec un identifiant commun. Aucun nouveau checkout sur les retours de paiement.
- Stripe demande le téléphone. Purchase CAPI utilise exactement l’ID de session Stripe ; les retries et paiements asynchrones gardent cet ID. Montant et devise proviennent de Stripe, et seuls les achats Academy partner/bootcamp payés sont admissibles.
- Le retour de paiement vérifie la session auprès de Stripe avant d’émettre Purchase navigateur. Il ne lit pas le montant depuis l’URL. Aucun renseignement client brut n’est renvoyé par cette vérification. Les achats de test n’atteignent pas le pixel si le mode test serveur n’est pas configuré.

## Validation réalisée

- Site : `npm run test:tracking` ; tests du webhook signé, des erreurs Meta, de l’isolation Stripe test/live, des cookies et du hachage. Typage Next vérifié avec `npx tsc --noEmit --incremental false`.
- Application : `node scripts/check-academy-meta.cjs`, `node scripts/check-checkout-attribution.cjs`, `node --check src/lib/waSetter.cjs`. Handler réel de vérification Stripe et composant de confirmation exécutés avec transport simulé ; un seul Purchase au deuxième effet React.
- `npm run typecheck` application : erreurs préexistantes, aucune ne cite les fichiers modifiés.
- Chromium : `node scripts/check-meta-cross-domain.cjs <chemin-du-depot-app>` ; toutes les requêtes interceptées. Test de cookies www → app, nettoyage des cookies locaux, UTM/fbclid dans les liens, CTA sans paramètres et identifiant commun InitiateCheckout.
- Contre-épreuve : l’ancien code échoue sur le domaine `www.empire-internet.com` au lieu de `.empire-internet.com`, et sur `Purchase.cs_fixture` au lieu de `cs_fixture`.
- `meta-payloads-offline.json` contient les payloads effectivement sérialisées lors des tests simulés (les trois routes, y compris le webhook signé), empreintes masquées. Ce fichier ne prouve pas une réception chez Meta.

## Limites qui empêchent de déclarer les critères atteints

Le choix utilisateur est de conserver le formulaire WebinarJam actuel. L’iframe ne transmet pas son e-mail et son téléphone au site : em/ph ne sont donc pas garantis pour CompleteRegistration ou l’arrivée initiale sur Academy. Le code ne fabrique aucune coordonnée et aucun identifiant utilisateur. Un contact connu peut fournir les champs ; un visiteur anonyme garde seulement l’attribution et le contexte réseau.

L’utilisateur a ensuite explicitement autorisé le stockage de l’IP, de l’agent utilisateur et des empreintes d’identité dans Stripe. Cet enrichissement est appliqué uniquement au checkout Academy : contexte réseau lu côté serveur, empreintes validées sur 64 caractères hexadécimaux, aucun champ de prix ou de droits accepté. Purchase relit ces métadonnées ; email/téléphone Stripe restent prioritaires. Les tests exécutent le véritable constructeur du checkout et vérifient les métadonnées envoyées à Stripe avec un transport simulé.

Aucun nouveau token confirmé ni code de test réel n’a été fourni pendant ce travail. La réception et la déduplication dans le Gestionnaire d’événements ne sont pas encore vérifiées. La qualité de correspondance > 7/10 ne peut pas être garantie par le code ; elle doit être constatée chez Meta sur des événements reçus. La consultation initiale du pixel ne donnait pas de note pour les trois événements demandés.

## Ordre de mise en ligne / contrôle restant

Après rotation du secret et validation du code de test : vérifier sur environnement de test les paires CompleteRegistration, InitiateCheckout et un achat Stripe test (jamais débiter un client réel pour un test). Comparer nom, event_id/eventID et em/ph disponibles, puis observer la déduplication Meta. Déployer le webhook site avant l’application (l’ancien client n’émet pas Purchase). Vérifier que le webhook Stripe dédié pointe sur `/api/meta/stripe-webhook` et reçoit aussi `checkout.session.async_payment_succeeded`. Retirer le mode test pour le trafic réel ; contrôler ensuite la qualité de correspondance sur des données suffisantes.
