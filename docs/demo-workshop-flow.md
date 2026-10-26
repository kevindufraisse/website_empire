# Démo et workshop Empire — 26 octobre 2026

Le site propose deux entrées : `/demo` pour le Loom produit après enregistrement de l’email, `/vsl` pour le workshop. Le workshop reste dans les ressources gratuites, dans un bloc d’accueil avant les offres et sous la démo. L’essai reste l’action commerciale principale : « Tester 7 jours gratuitement ».

## Capture et relances

- `POST /api/demo-email` attend la création/récupération du contact et la pose du tag avant de confirmer l’accès. Il ne passe pas par le formulaire d’appel stratégique ni par ses notifications.
- Tag distinct : `empire-demo-requested`, ID Systeme.io `2253174`.
- Workflow existant et actif : « Empire — Inscription site ou clic offre : démo et rappel conditionnel », ID `565258`. Le déclencheur `2473528` a été ajouté pour ce tag. Les déclencheurs `vsl-video`, `empire_home_gate` et `CLIC_PAGE_EMPIRE` restent présents.
- Le workflow conserve ses exclusions, notamment clients, rendez-vous actifs et `PARCOURS_DEMO_EMPIRE_DEMARRE`, puis inscrit à « Empire — Suivi démo après inscription site » (campagne `1216990`). Le premier email est réglé sur 2 heures. Les emails et délais n’ont pas été modifiés.
- Le workshop utilise toujours son tag `vsl-video`. Les deux entrées rejoignent le même suivi protégé contre une réinscription au parcours.
- Le Loom de la page reprend l’identifiant utilisé dans l’app : `00bc46ef533b4243ad108ed7549047be`. La campagne existante utilise également la version `7a02ce4826e34b76a6aab3e9ddc8dd8e` ; les deux pages sont accessibles et annoncent 1470 secondes.

## Vérification

`node scripts/check-demo-capture.cjs` vérifie les erreurs de saisie, l’indisponibilité du fournisseur et l’attente de l’enregistrement du contact ET du tag. Le test échoue en retirant cette attente. Aucun appel réel à Systeme.io pendant ces tests.

Le parcours navigateur a été vérifié à 390, 768 et 1440 pixels avec réponses de capture simulées : échec, réessai, ouverture du Loom, accès conservé, lien workshop et destination de l’essai. Aucune inscription réelle ni réception d’email n’a été testée.
