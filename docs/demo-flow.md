# Demande de démo — 26 octobre 2026 (revu le 28)

Parcours revu par Kevin le 28 octobre : prénom et email, puis la démo s'ouvre directement (plus d'écran de choix). Sous la vidéo : « Tester 7 jours gratuitement » et « Prendre rendez-vous ». Après 3 min passées sur la démo, le workshop est proposé avant le rendez-vous. Le téléphone n'est demandé que pour le rendez-vous. `/vsl` porte maintenant le même « Demander une démo » que la page d'accueil.

- `/api/demo-email` enregistre prénom/email dans Systeme.io avec `empire-demo-requested`. La route attend toujours l'enregistrement et la pose du tag, mais la page n'attend plus la route (Systeme.io peut mettre 40 s) : la capture part en fond, avec un second essai. Ce tag n'est relié à aucun workflow d'emails : aucune campagne ne part sur une demande de démo tant qu'une règle Systeme.io n'est pas créée sur ce tag.
- La démo est le Loom `00bc46ef533b4243ad108ed7549047be`. Le visiteur peut passer au rendez-vous à tout moment.
- « Prendre rendez-vous » réutilise `YtLeadForm` avec les coordonnées déjà saisies, puis le calendrier personnel existant `team/empire-internet/audit-empire`. Le calendrier s'ouvre tout de suite, `/api/callback` part en fond. Les autres usages du formulaire gardent leurs trois champs.
- Le workshop apparaît après 3 min sur la démo. Un clic explicite utilise le parcours existant `/api/vsl-email` → `/vsl`, avec le tag `vsl-video` et ses automatisations existantes. L'email n'est pas redemandé et n'est jamais placé dans l'URL. Aucun nouveau workflow ou message n'est créé.
- La popup de ressources chronométrée est masquée sur `/demo` pour laisser la personne regarder.

Événements sans coordonnées personnelles : `empire_demo_requested`, `empire_demo_path_selected` (`path: book`, `source`), `empire_trial_clicked` (`source: demo-…`), `empire_demo_workshop_shown`, `empire_workshop_clicked` (`source: demo_video`), `empire_demo_capture_failed` dans Amplitude ; `empire_demo_booking_opened` dans le dataLayer à l'ouverture du calendrier (pas une confirmation de réservation).

Vérification de la capture : `node scripts/check-demo-capture.cjs`, sans réseau. Refus des entrées invalides, indisponibilité du prestataire, sauvegarde attendue avant succès ; un sabotage du `await` doit faire échouer le contrôle.
