import { FEEDBACK_REASONS, recordRecommendationFeedback } from './feedback.js';

function currentIntent(root) {
  return root.querySelector('[data-ferda-intent].active')?.dataset.ferdaIntent || 'all';
}

function optionFromCard(card) {
  return {
    id: card.querySelector('[data-add-result]')?.dataset.addResult || '',
    name: card.querySelector('.ferda-result-title h2')?.textContent?.trim() || ''
  };
}

function reasonMarkup() {
  return FEEDBACK_REASONS.map(([key, label]) => `
    <button type="button" data-ferda-reject-reason="${key}">${label}</button>`).join('');
}

function enhanceCard(root, card) {
  if (card.dataset.ferdaFeedbackWired) return;
  card.dataset.ferdaFeedbackWired = 'true';
  const actions = card.querySelector('.ferda-result-actions');
  const addButton = card.querySelector('[data-add-result]');
  if (!actions || !addButton) return;

  const feedback = document.createElement('div');
  feedback.className = 'ferda-result-feedback';
  feedback.innerHTML = `
    <button type="button" class="ferda-not-for-us" aria-expanded="false">Not for us</button>
    <div class="ferda-feedback-reasons" hidden>
      <small>What put you off?</small>
      <div>${reasonMarkup()}</div>
    </div>`;
  actions.insertAdjacentElement('afterend', feedback);

  addButton.addEventListener('click', () => {
    const option = optionFromCard(card);
    if (option.id) recordRecommendationFeedback(option, currentIntent(root), 'accept');
  }, { once: true });

  const rejectButton = feedback.querySelector('.ferda-not-for-us');
  const reasons = feedback.querySelector('.ferda-feedback-reasons');
  rejectButton.addEventListener('click', () => {
    const willOpen = reasons.hidden;
    reasons.hidden = !willOpen;
    rejectButton.setAttribute('aria-expanded', String(willOpen));
    rejectButton.textContent = willOpen ? 'Choose a reason' : 'Not for us';
  });

  reasons.querySelectorAll('[data-ferda-reject-reason]').forEach(button => button.addEventListener('click', () => {
    const option = optionFromCard(card);
    if (option.id) recordRecommendationFeedback(option, currentIntent(root), 'reject', button.dataset.ferdaRejectReason);
    card.classList.add('ferda-result-rejected');
    window.setTimeout(() => card.remove(), 160);
  }));
}

function scan(root) {
  root.querySelectorAll('.ferda-result-card').forEach(card => enhanceCard(root, card));
}

export function enhanceRecommendationFeedback(root) {
  scan(root);
  const observer = new MutationObserver(() => scan(root));
  observer.observe(root, { childList: true, subtree: true });
  return () => observer.disconnect();
}
