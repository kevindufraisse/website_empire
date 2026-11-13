(() => {
  'use strict';
  const form = document.getElementById('application-form');
  const steps = [...form.querySelectorAll('[data-step]')];
  const error = document.getElementById('form-error');
  const next = document.getElementById('next');
  const back = document.getElementById('back');
  const titles = ['Ouvre ton dossier.', 'Ton engagement.', 'Ton regard sur le contenu.', 'Défends ta candidature.'];
  const introductions = [
    'Quatre étapes pour présenter ton profil. Chaque réponse compte dans notre sélection.',
    'Un projet sérieux commence par du temps disponible et un objectif clair.',
    'Ton expérience, tes points forts et ta façon de regarder ce qui fonctionne.',
    'Dix profils seront retenus ce mois-ci. Montre-nous pourquoi le tien doit en faire partie.',
  ];
  const lastStep = steps.length - 1;
  let step = 0, busy = false;
  const submissionId = crypto.randomUUID();
  function showError(message) { error.textContent = message; error.hidden = false; }
  function showStep(index, focus = true) {
    step = index;
    steps.forEach((el, i) => { el.hidden = i !== step; el.disabled = i !== step; });
    error.hidden = true;
    back.hidden = step === 0;
    document.getElementById('form-title').textContent = titles[step];
    document.getElementById('form-intro').textContent = introductions[step];
    document.getElementById('step-count').textContent = `0${step + 1} / 0${steps.length}`;
    document.getElementById('progress-bar').style.width = `${((step + 1) / steps.length) * 100}%`;
    next.textContent = step === lastStep ? 'Déposer ma candidature ↗' : 'Continuer →';
    if (focus) {
      steps[step].querySelector('input,select,textarea')?.focus({ preventScroll: true });
      document.getElementById('candidature').scrollIntoView({ block: 'start' });
    }
  }
  function readValues() {
    // Disabled fieldsets retain values but FormData would omit them.
    const values = Object.fromEntries([...form.querySelectorAll('input,select,textarea')].filter(el => el.name && el.name !== 'networks')
      .map(el => [el.name, el.type === 'checkbox' ? el.checked : el.value.trim()]));
    values.networks = [...form.querySelectorAll('input[name="networks"]:checked')].map(el => el.value);
    return values;
  }
  function validateStep() {
    const invalid = [...steps[step].querySelectorAll('input,select,textarea')].find(el => !el.checkValidity());
    if (invalid) { invalid.reportValidity(); return false; }
    if (step === 0) {
      const digits = form.elements.phone.value.replace(/\D/g, '');
      if (digits.length < 8 || digits.length > 15) { showError('Vérifie ton téléphone, avec l’indicatif pour un numéro hors France.'); form.elements.phone.focus(); return false; }
    }
    if (step === 2 && !form.querySelector('input[name="networks"]:checked')) { showError('Choisis au moins un réseau, ou « Aucun pour l’instant ».'); form.querySelector('input[name="networks"]').focus(); return false; }
    if (step === lastStep && form.elements.favoriteCreator.value.trim().length < 20) { showError('Présente ton créateur préféré et ce qui te plaît chez lui (20 caractères minimum).'); form.elements.favoriteCreator.focus(); return false; }
    if (step === lastStep && form.elements.project.value.trim().length < 60) { showError('Présente ta motivation en quelques phrases (60 caractères minimum).'); form.elements.project.focus(); return false; }
    return true;
  }
  form.querySelectorAll('input[name="networks"]').forEach(input => input.addEventListener('change', () => {
    if (!input.checked) return;
    form.querySelectorAll('input[name="networks"]').forEach(other => {
      if (other !== input && (input.value === 'none' || other.value === 'none')) other.checked = false;
    });
  }));
  back.addEventListener('click', () => { if (!busy && step > 0) showStep(step - 1); });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !validateStep()) return;
    error.hidden = true;
    if (step < lastStep) { showStep(step + 1); return; }
    busy = true; next.disabled = true; back.disabled = true; next.textContent = 'Envoi en cours…';
    const values = readValues();
    try {
      const response = await fetch('/api/head-of-content/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, submissionId, applicationVersion: 2 }), signal: AbortSignal.timeout(25000) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true) {
        if (result.field) {
          const target = [...form.elements].find(el => el.name === result.field);
          const index = steps.findIndex(el => target && el.contains(target));
          if (index >= 0 && index !== step) showStep(index);
          target?.focus();
        }
        throw new Error(result.error || 'L’envoi n’a pas abouti. Réessaie dans un instant.');
      }
      document.getElementById('candidate-name').textContent = values.firstName;
      document.getElementById('application-content').hidden = true;
      const confirmation = document.getElementById('confirmation');
      confirmation.hidden = false;
      document.getElementById('candidature').setAttribute('aria-label', 'Candidature envoyée');
      document.getElementById('candidature').removeAttribute('aria-labelledby');
      document.querySelectorAll('a[href="#candidature"]').forEach(el => { el.textContent = 'Candidature envoyée ✓'; });
      confirmation.focus({ preventScroll: true });
      confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
      form.reset();
    } catch (err) {
      showError(err.name === 'TimeoutError' || err.name === 'AbortError' ? 'La confirmation prend plus de temps que prévu. Réessaie dans un instant.' : (err instanceof TypeError ? 'La connexion a été interrompue. Vérifie ton réseau puis réessaie.' : err.message));
    } finally {
      busy = false; next.disabled = false; back.disabled = false;
      next.textContent = step === lastStep ? 'Déposer ma candidature ↗' : 'Continuer →';
    }
  });
  showStep(0, false);
})();
