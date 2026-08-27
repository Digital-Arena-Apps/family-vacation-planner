export const RIGHT_NOW_OPTIONS = Object.freeze([
  ['short', 'About 2 hours'],
  ['value', 'Keep it cheap'],
  ['low-energy', 'Low energy'],
  ['drive', 'Happy to drive']
]);

function clamp(value) {
  return Math.max(42, Math.min(96, Math.round(value)));
}

export function adjustForRightNow(ranked = [], active = new Set()) {
  if (!active?.size) return ranked;

  return ranked.map(option => {
    let score = option.score || 52;
    const reasons = [];
    const cautions = [];

    if (active.has('short')) {
      if (option.duration === 'short') {
        score += 14;
        reasons.push('Good fit when you only want to use a couple of hours.');
      } else if (option.duration === 'half') {
        score += 3;
      } else if (option.duration === 'full') {
        score -= 20;
        cautions.push('This is too big a commitment for the time window you picked.');
      }
    }

    if (active.has('value')) {
      if ((option.cost || 2) <= 1) {
        score += 12;
        reasons.push('One of the lower-cost options for right now.');
      } else if ((option.cost || 2) >= 3) {
        score -= 12;
        cautions.push('This is a higher-spend option than your “keep it cheap” request suggests.');
      } else {
        score += 3;
      }
    }

    if (active.has('low-energy')) {
      if ((option.walking || 2) <= 1) {
        score += 12;
        reasons.push('Lower walking demand makes this easier on a low-energy day.');
      } else if ((option.walking || 2) >= 3) {
        score -= 14;
        cautions.push('This asks for more walking than a low-energy choice should.');
      }
      if (option.duration === 'full') score -= 7;
    }

    if (active.has('drive')) {
      const drive = Number(option.drive || 0);
      if (drive >= 35) {
        score += 8;
        reasons.push('You said you are happy to drive, so FERDA is widening the search radius.');
      } else if (drive >= 20) {
        score += 4;
      }
    }

    return {
      ...option,
      score: clamp(score),
      reasons: [...reasons, ...(option.reasons || [])].filter(Boolean).slice(0, 2),
      caution: cautions[0] || option.caution || ''
    };
  }).sort((a, b) => b.score - a.score);
}
