const thrillValue = { low:1, medium:2, high:3 };
const prefValue = { low:1, normal:2, high:3, relaxed:1, balanced:2, full:3, value:1, flexible:3, familiar:1, mix:2, discover:3, early:1, late:3 };

function closeness(a, b, weight) {
  return Math.max(0, weight - Math.abs(a - b) * (weight / 2));
}

function crewThrillFit(option, family) {
  if (!family.length) return { score: 10, text: 'Works for a mixed crew.' };
  const values = family.map(person => thrillValue[person.thrill] || 2);
  const avg = values.reduce((a,b) => a+b, 0) / values.length;
  const score = closeness(option.thrill, avg, 18);
  const spread = Math.max(...values) - Math.min(...values);
  if (spread >= 2 && option.thrill >= 3) return { score: score - 2, text: 'Great for thrill-seekers, but gentler alternatives will matter for part of the crew.', caution:true };
  if (option.thrill === 1 && avg >= 2.4) return { score, text: 'A calmer choice than your crew usually prefers.', caution:true };
  return { score, text: option.thrill >= 3 ? 'Strong match for the crew’s appetite for bigger thrills.' : option.thrill === 2 ? 'A balanced mix of excitement should work for most of the crew.' : 'Low-pressure and easy to enjoy together.' };
}

function dietaryFit(option, family) {
  const dietary = family.filter(person => person.dietary?.enabled);
  if (!dietary.length) return { score: 8, text: 'No saved dietary constraints reduce this option.' };
  const strict = dietary.some(person => person.dietary.crossContact || person.dietary.types?.includes('coeliac') || person.dietary.types?.includes('allergy'));
  if (strict && option.dietary < 3) return { score: option.dietary * 2, text: 'Food planning needs extra care here because your crew has strict dietary requirements.', caution:true };
  if (option.dietary >= 3) return { score: 10, text: 'One of the stronger choices for a crew with saved dietary needs.' };
  return { score: 6, text: 'Food should be planned rather than left to chance.' };
}

function ageFit(option, family) {
  if (!family.length) return { score: 8, text:'Broad family fit.' };
  const tooYoung = family.filter(person => person.age < option.minAge);
  if (tooYoung.length) return { score: 2, text:`${tooYoung.length} traveller${tooYoung.length===1?' is':'s are'} below the ideal age range.`, caution:true };
  const children = family.filter(person => person.role === 'child').length;
  return { score: children ? 10 : 8, text: children ? 'Suitable for the ages in your saved crew.' : 'Works well for an adult group.' };
}

function durationScore(option, preferences) {
  const target = prefValue[preferences.pace] || 2;
  const value = option.duration === 'full' ? 3 : option.duration === 'half' ? 2 : 1;
  const score = closeness(value, target, 14);
  return { score, text: target === 1 && value <= 2 ? 'Fits your preference for easier-going days.' : target === 3 && value === 3 ? 'Makes good use of your preference for fuller days.' : 'The time commitment is a reasonable fit for your normal pace.' };
}

function walkingScore(option, preferences) {
  const target = prefValue[preferences.walking] || 2;
  const score = closeness(option.walking, target, 14);
  if (target === 1 && option.walking >= 3) return { score: score - 3, text:'This is a heavier walking day than your crew normally prefers.', caution:true };
  if (target === 1 && option.walking === 1) return { score: score + 2, text:'Strong fit for your preference to keep walking lower.' };
  return { score, text:'Walking demand is broadly aligned with your saved preference.' };
}

function budgetScore(option, preferences) {
  const target = prefValue[preferences.budget] || 2;
  const score = closeness(option.cost, target, 12);
  if (target === 1 && option.cost === 3) return { score: score - 2, text:'This is one of the more expensive choices for your saved budget style.', caution:true };
  if (target === 1 && option.cost === 1) return { score: score + 2, text:'Good value fit for your crew.' };
  return { score, text:'Cost is reasonably aligned with your budget preference.' };
}

function discoveryScore(option, preferences) {
  const target = prefValue[preferences.discovery] || 2;
  const score = closeness(option.discovery, target, 10);
  if (target === 3 && option.discovery === 3) return { score: score + 2, text:'Exactly the sort of less-obvious discovery your crew says it wants.' };
  if (target === 1 && option.discovery === 1) return { score: score + 2, text:'A dependable, familiar choice rather than a gamble.' };
  return { score, text:'A reasonable match for how adventurous you want recommendations to be.' };
}

function rhythmScore(option, preferences) {
  if (option.start === 'any' || preferences.rhythm === 'flexible') return { score:8, text:'Flexible enough to fit your normal day rhythm.' };
  if (preferences.rhythm === 'early' && option.start === 'early') return { score:10, text:'Works well for your crew’s early-start rhythm.' };
  if (preferences.rhythm === 'late' && option.start === 'late') return { score:10, text:'Fits your preference for later starts.' };
  if (preferences.rhythm === 'late' && option.start === 'early') return { score:2, text:'This works best with an early start, which clashes with your saved rhythm.', caution:true };
  return { score:6, text:'Timing is workable, though not a perfect rhythm match.' };
}

function transportScore(option, trip) {
  const noCar = trip.transport === 'none' || trip.transport === 'public';
  if (noCar && option.drive > 35) return { score:1, text:'Harder to reach with the transport setup you saved.', caution:true };
  if (option.drive >= 70) return { score:4, text:`Worth considering, but it is roughly a ${option.drive}-minute drive from the Orlando area.`, caution:true };
  if (option.drive <= 25) return { score:8, text:'Relatively easy to fit into an Orlando-based trip.' };
  return { score:6, text:'Travel time is manageable for a day out.' };
}

function moodAdjustment(option, mood) {
  if (mood === 'easy') return (4 - option.walking) * 3 + (option.duration === 'short' ? 5 : option.duration === 'half' ? 3 : 0);
  if (mood === 'big') return option.thrill * 2 + (option.duration === 'full' ? 5 : 0);
  if (mood === 'indoor') return option.indoor * 4;
  if (mood === 'surprise') return option.discovery * 4;
  return 0;
}

export function rankOptions(options, context, mood = 'best') {
  const { family = [], preferences = {}, trip = {} } = context;
  return options.map(option => {
    const factors = [
      crewThrillFit(option, family),
      ageFit(option, family),
      durationScore(option, preferences),
      walkingScore(option, preferences),
      budgetScore(option, preferences),
      discoveryScore(option, preferences),
      rhythmScore(option, preferences),
      dietaryFit(option, family),
      transportScore(option, trip)
    ];
    const raw = factors.reduce((sum, factor) => sum + Math.max(0, factor.score), 0) + moodAdjustment(option, mood);
    const score = Math.max(52, Math.min(96, Math.round((raw / 104) * 100)));
    const positives = factors.filter(f => !f.caution).sort((a,b)=>b.score-a.score).slice(0,2).map(f=>f.text);
    const caution = factors.filter(f => f.caution).sort((a,b)=>a.score-b.score)[0]?.text || '';
    return { ...option, score, reasons: positives, caution };
  }).sort((a,b) => b.score - a.score);
}
