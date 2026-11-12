(() => {
  'use strict';
  const form = document.getElementById('application-form');
  const steps = [...form.querySelectorAll('[data-step]')];
  const error = document.getElementById('form-error');
  const next = document.getElementById('next');
  const back = document.getElementById('back');
  const titles = ['Faisons connaissance.', 'D’où pars-tu ?', 'Et où veux-tu aller ?'];
  let step = 0, busy = false;
  const submissionId = crypto.randomUUID();
  function showError(message) { error.textContent = message; error.hidden = false; }
  function showStep(index, focus = true) {
    step = index;
    steps.forEach((el, i) => { el.hidden = i !== step; el.disabled = i !== step; });
    error.hidden = true;
    back.hidden = step === 0;
    document.getElementById('form-title').textContent = titles[step];
    document.getElementById('step-count').textContent = `0${step + 1} / 03`;
    document.getElementById('progress-bar').style.width = `${((step + 1) / 3) * 100}%`;
    next.textContent = step === 2 ? 'Envoyer ma candidature ↗' : 'Continuer →';
    if (focus) steps[step].querySelector('input,select,textarea')?.focus({ preventScroll: true });
  }
  function readValues() {
    // Disabled fieldsets retain values but FormData would omit them.
    return Object.fromEntries([...form.querySelectorAll('input,select,textarea')].filter(el => el.name)
      .map(el => [el.name, el.type === 'checkbox' ? el.checked : el.value.trim()]));
  }
  function validateStep() {
    const invalid = [...steps[step].querySelectorAll('input,select,textarea')].find(el => !el.checkValidity());
    if (invalid) { invalid.reportValidity(); return false; }
    if (step === 0) {
      const digits = form.elements.phone.value.replace(/\D/g, '');
      if (digits.length < 8 || digits.length > 15) { showError('Vérifie ton téléphone, avec l’indicatif pour un numéro hors France.'); form.elements.phone.focus(); return false; }
    }
    if (step === 2 && form.elements.project.value.trim().length < 30) { showError('Présente ton projet en quelques phrases (30 caractères minimum).'); form.elements.project.focus(); return false; }
    return true;
  }
  back.addEventListener('click', () => { if (!busy && step > 0) showStep(step - 1); });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !validateStep()) return;
    error.hidden = true;
    if (step < 2) { showStep(step + 1); return; }
    busy = true; next.disabled = true; back.disabled = true; next.textContent = 'Envoi en cours…';
    const values = readValues();
    try {
      const response = await fetch('/api/head-of-content/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, submissionId }), signal: AbortSignal.timeout(25000) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true) {
        if (result.field) {
          const target = form.elements.namedItem(result.field);
          const index = steps.findIndex(el => target && el.contains(target));
          if (index >= 0 && index !== step) showStep(index);
        }
        throw new Error(result.error || 'L’envoi n’a pas abouti. Réessaie dans un instant.');
      }
      document.getElementById('candidate-name').textContent = values.firstName;
      document.getElementById('application-content').hidden = true;
      const confirmation = document.getElementById('confirmation');
      confirmation.hidden = false;
      document.querySelectorAll('a[href="#candidature"]').forEach(el => { el.textContent = 'Candidature envoyée ✓'; });
      confirmation.focus({ preventScroll: true });
      confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
      form.reset();
    } catch (err) {
      showError(err.name === 'TimeoutError' || err.name === 'AbortError' ? 'La confirmation prend plus de temps que prévu. Réessaie dans un instant.' : (err instanceof TypeError ? 'La connexion a été interrompue. Vérifie ton réseau puis réessaie.' : err.message));
    } finally {
      busy = false; next.disabled = false; back.disabled = false;
      next.textContent = step === 2 ? 'Envoyer ma candidature ↗' : 'Continuer →';
    }
  });
  showStep(0, false);
})();
