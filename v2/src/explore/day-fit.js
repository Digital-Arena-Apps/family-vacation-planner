function clamp(value) {
  return Math.max(45, Math.min(96, Math.round(value)));
}

function normalise(value = '') {
  return String(value).trim().toLowerCase();
}

function planProfile(items = []) {
  const rows = Array.isArray(items) ? items : [];
  const periods = { morning: 0, afternoon: 0, evening: 0 };
  const types = { activity: 0, meal: 0, travel: 0, other: 0 };

  rows.forEach(item => {
    if (periods[item.period] !== undefined) periods[item.period] += 1;
    if (types[item.type] !== undefined) types[item.type] += 1;
  });

  const busiestPeriod = Object.entries(periods).sort((a, b) => b[1] - a[1])[0] || ['morning', 0];
  return {
    count: rows.length,
    periods,
    types,
    busiestPeriod: busiestPeriod[0],
    busiestCount: busiestPeriod[1],
    names: new Set(rows.map(item => normalise(item.title)).filter(Boolean))
  };
}

function dayAdjustment(option, intent, profile, preferences = {}) {
  let delta = 0;
  const reasons = [];
  const cautions = [];
  const duration = option.duration || 'half';
  const relaxed = preferences.pace === 'relaxed';

  if (!profile.count) {
    if (intent === 'activities' && duration === 'full') {
      delta += 4;
      reasons.push('The day is still open enough for a full anchor plan.');
    }
    return { delta, reasons, cautions };
  }

  if (intent === 'dining') {
    if (profile.types.meal >= 2) {
      delta -= 10;
      cautions.push('You already have multiple meal plans on this day, so FERDA is treating another food stop as optional.');
    } else if (profile.types.meal === 0) {
      delta += 7;
      reasons.push('There is no meal planned yet, so this fills a useful gap in the day.');
    } else {
      delta += 2;
      reasons.push('This can complement the meal plan already on the day without overloading it.');
    }
    return { delta, reasons, cautions };
  }

  if (intent === 'shopping') {
    if (profile.count >= 4) {
      if (duration === 'short') {
        delta += 7;
        reasons.push('A short stop fits better around a day that already has several plans.');
      } else if (duration === 'full') {
        delta -= 18;
        cautions.push('The day is already busy; a full shopping block would make it harder to enjoy what is already planned.');
      } else {
        delta -= 7;
      }
    }
    return { delta, reasons, cautions };
  }

  /* Broad Explore and Activities use the shape of the day strongly. */
  if (profile.count >= 4) {
    if (duration === 'full') {
      delta -= relaxed ? 24 : 20;
      cautions.push('This is effectively a full-day commitment and the target day already has several plans.');
    } else if (duration === 'half') {
      delta -= relaxed ? 12 : 8;
      cautions.push('This needs a decent block of time, so FERDA is ranking it lower on an already busy day.');
    } else if (duration === 'short') {
      delta += 8;
      reasons.push('Its shorter format is much easier to fit around the plans already on this day.');
    }
  } else if (profile.count >= 2) {
    if (duration === 'full') {
      delta -= relaxed ? 14 : 9;
      cautions.push('A full-day option would compete with plans you have already saved.');
    } else if (duration === 'short') {
      delta += 5;
      reasons.push('It can slot around the plans already on the itinerary.');
    }
  }

  if (profile.busiestCount >= 2 && duration === 'short') {
    delta += 2;
  }

  return { delta, reasons, cautions };
}

export function adjustRankedForDay(ranked = [], intent = 'all', dayItems = [], preferences = {}) {
  const profile = planProfile(dayItems);

  return ranked
    .filter(option => !profile.names.has(normalise(option.name)))
    .map(option => {
      const adjustment = dayAdjustment(option, intent, profile, preferences);
      const dayReasons = adjustment.reasons;
      const existingReasons = Array.isArray(option.reasons) ? option.reasons : [];
      const existingCaution = option.caution || '';
      const caution = adjustment.cautions[0] || existingCaution;
      return {
        ...option,
        score: clamp((option.score || 52) + adjustment.delta),
        reasons: [...dayReasons, ...existingReasons].filter(Boolean).slice(0, 2),
        caution
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function describeDayForFerda(dayItems = []) {
  const profile = planProfile(dayItems);
  if (!profile.count) return 'This day is still wide open.';
  if (profile.count === 1) return '1 plan is already on this day.';
  return `${profile.count} plans are already on this day.`;
}
