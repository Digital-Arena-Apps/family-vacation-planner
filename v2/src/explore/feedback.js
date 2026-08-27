import { persistentSetItem } from '../storage/native-persistence.js';

const STORAGE_KEY = 'ferda_v3_recommendation_feedback';
const MAX_RECORDS = 200;

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(records) {
  try {
    persistentSetItem(STORAGE_KEY, JSON.stringify(records.slice(-MAX_RECORDS)));
  } catch {}
}

function compactOption(option = {}) {
  return {
    id: String(option.id || ''),
    name: String(option.name || ''),
    cost: Number(option.cost || 2),
    walking: Number(option.walking || 2),
    drive: Number(option.drive || 0),
    duration: String(option.duration || 'half'),
    discovery: Number(option.discovery || 2)
  };
}

export const FEEDBACK_REASONS = Object.freeze([
  ['not-us', 'Not our thing'],
  ['too-far', 'Too far'],
  ['too-expensive', 'Too expensive'],
  ['too-much-walking', 'Too much walking'],
  ['too-much-time', 'Too much time'],
  ['already-done', 'Already done']
]);

export function recordRecommendationFeedback(option, intent, action, reason = '') {
  const records = read();
  records.push({
    ...compactOption(option),
    intent: String(intent || 'all'),
    action: action === 'accept' ? 'accept' : 'reject',
    reason: String(reason || ''),
    at: Date.now()
  });
  write(records);
}

function countsFor(records, intent) {
  const relevant = records.filter(row => row.action === 'reject' && (row.intent === intent || row.intent === 'all' || intent === 'all'));
  const counts = {};
  relevant.forEach(row => {
    if (!row.reason) return;
    counts[row.reason] = (counts[row.reason] || 0) + 1;
  });
  return { relevant, counts };
}

function traitAdjustment(option, counts) {
  let delta = 0;
  const reasons = [];
  const cautions = [];

  if ((counts['too-far'] || 0) >= 2) {
    if ((option.drive || 0) >= 35) {
      delta -= 11;
      cautions.push('FERDA has learned that the crew often rejects longer journeys.');
    } else if ((option.drive || 0) <= 15) {
      delta += 4;
      reasons.push('FERDA has learned that shorter journeys tend to work better for your crew.');
    }
  }

  if ((counts['too-expensive'] || 0) >= 2) {
    if ((option.cost || 2) >= 3) {
      delta -= 12;
      cautions.push('The crew has repeatedly rejected higher-cost suggestions.');
    } else if ((option.cost || 2) <= 1) {
      delta += 4;
      reasons.push('Lower-cost options have been a better fit for your crew.');
    }
  }

  if ((counts['too-much-walking'] || 0) >= 2) {
    if ((option.walking || 2) >= 3) {
      delta -= 13;
      cautions.push('FERDA has learned that heavy walking is often a deal-breaker.');
    } else if ((option.walking || 2) <= 1) {
      delta += 5;
      reasons.push('Lower-walking options better match your recent feedback.');
    }
  }

  if ((counts['too-much-time'] || 0) >= 2) {
    if (option.duration === 'full') {
      delta -= 13;
      cautions.push('Full-day commitments have been rejected repeatedly.');
    } else if (option.duration === 'short') {
      delta += 5;
      reasons.push('Shorter experiences better match your recent feedback.');
    }
  }

  if ((counts['already-done'] || 0) >= 2 && (option.discovery || 2) >= 3) {
    delta += 3;
    reasons.push('FERDA is leaning towards fresher discoveries because familiar options have been marked as done.');
  }

  return { delta, reasons, cautions };
}

function clamp(value) {
  return Math.max(38, Math.min(96, Math.round(value)));
}

export function applyRecommendationLearning(ranked = [], intent = 'all') {
  const records = read();
  if (!records.length) return ranked;
  const { relevant, counts } = countsFor(records, intent);
  const rejectedIds = new Map();
  relevant.forEach(row => {
    if (!row.id) return;
    rejectedIds.set(row.id, (rejectedIds.get(row.id) || 0) + 1);
  });

  return ranked.map(option => {
    const exactRejects = rejectedIds.get(String(option.id || '')) || 0;
    const learned = traitAdjustment(option, counts);
    const reasons = [...learned.reasons, ...(option.reasons || [])].filter(Boolean).slice(0, 2);
    const caution = learned.cautions[0] || option.caution || '';
    return {
      ...option,
      score: clamp((option.score || 52) + learned.delta - exactRejects * 22),
      reasons,
      caution
    };
  }).sort((a, b) => b.score - a.score);
}
