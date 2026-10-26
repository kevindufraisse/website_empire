# Demande de démo — 26 octobre 2026

Parcours validé par Kevin : prénom et email, puis choix entre la démo enregistrée et une démo personnelle. Le téléphone n'est demandé que pour le rendez-vous. Aucun changement du CTA « Demander une démo » sur les autres pages.

- `/api/demo-email` enregistre prénom/email dans Systeme.io avec `empire-demo-requested`. La réponse attend l'enregistrement et la pose du tag. Ce tag n'est pas relié au workflow d'emails du workshop.
- « Je regarde la démo à mon rythme » ouvre le Loom `00bc46ef533b4243ad108ed7549047be`. Le visiteur peut passer au rendez-vous à tout moment.
- « J’ai des questions, je préfère en parler » réutilise `YtLeadForm` avec les coordonnées déjà saisies, puis le calendrier personnel existant `team/empire-internet/audit-empire`. Les autres usages du formulaire gardent leurs trois champs.
- Le workshop est proposé sous la démo. Un clic explicite utilise le parcours existant `/api/vsl-email` → `/vsl`, avec le tag `vsl-video` et ses automatisations existantes. L'email n'est pas redemandé et n'est jamais placé dans l'URL. Aucun nouveau workflow ou message n'est créé.
- La popup de ressources chronométrée est masquée sur `/demo` pour laisser la personne terminer son choix.

Événements sans coordonnées personnelles : `empire_demo_requested`, `empire_demo_path_selected` (`path: watch | book`), `empire_workshop_clicked` (`source: demo_video`) dans Amplitude ; `empire_demo_booking_opened` dans le dataLayer à l'ouverture du calendrier (pas une confirmation de réservation).

Vérification de la capture : `node scripts/check-demo-capture.cjs`, sans réseau. Refus des entrées invalides, indisponibilité du prestataire, sauvegarde attendue avant succès ; un sabotage du `await` doit faire échouer le contrôle.
