import { rankOptions } from './engine.js';
import { adjustForRightNow } from './right-now.js';

const LEGACY_INTENTS = Object.freeze({
  dining: new Set(['disney-springs', 'mini-golf', 'celebration']),
  shopping: new Set(['disney-springs', 'outlet-shopping'])
});

const INTENTS = Object.freeze({
  all: {
    key: 'all',
    kicker: 'ASK FERDA',
    title: 'What should we do?',
    intro: 'FERDA ranks ideas against your actual crew, the day you are planning and what matters right now.',
    question: 'WHAT MATTERS RIGHT NOW?',
    resultTitle: 'Best matches for your crew',
    hint: 'Scores use your saved crew, trip preferences and the plans already on the target day.',
    moods: [
      ['best', 'Best fit'],
      ['short', 'About 2 hours'],
      ['value', 'Keep it cheap'],
      ['low-energy', 'Low energy'],
      ['drive', 'Happy to drive'],
      ['easy', 'Easy day'],
      ['big', 'Big day'],
      ['indoor', 'Mostly indoors'],
      ['surprise', 'Surprise us']
    ]
  },
  activities: {
    key: 'activities',
    kicker: 'ASK FERDA · ACTIVITIES',
    title: 'What should we do together?',
    intro: 'Start with the crew, then FERDA weighs pace, thrills, walking, timing, the target day and how everyone feels right now.',
    question: 'WHAT FITS RIGHT NOW?',
    resultTitle: 'Activities that fit the crew',
    hint: 'Ranked against the family, trip preferences and the plans already saved for this day.',
    moods: [
      ['best', 'Best fit'],
      ['short', 'About 2 hours'],
      ['value', 'Keep it cheap'],
      ['low-energy', 'Low energy'],
      ['drive', 'Happy to drive'],
      ['easy', 'Keep it easy'],
      ['big', 'Go big'],
      ['indoor', 'Mostly indoors'],
      ['surprise', 'Surprise us']
    ]
  },
  dining: {
    key: 'dining',
    kicker: 'ASK FERDA · DINING',
    title: 'Where should we eat?',
    intro: 'FERDA gives dietary needs, effort, cost and travel time a seat at the table before everyone gets hungry.',
    question: 'WHAT MATTERS MOST?',
    resultTitle: 'Food options that work for the crew',
    hint: 'Dietary fit uses the requirements saved against your travellers and FERDA also checks the target day for existing meals.',
    moods: [
      ['best', 'Best fit'],
      ['nearby', 'Less travel'],
      ['dietary', 'Dietary first'],
      ['value', 'Keep it sensible'],
      ['drive', 'Happy to drive'],
      ['surprise', 'Something different']
    ]
  },
  shopping: {
    key: 'shopping',
    kicker: 'ASK FERDA · SHOPPING',
    title: 'Where is worth a shopping stop?',
    intro: 'FERDA balances what is nearby with walking, cost and whether the stop is worth spending holiday time on.',
    question: 'WHAT KIND OF STOP?',
    resultTitle: 'Shopping stops worth considering',
    hint: 'A shorter, easier stop can rank above a bigger name when it fits the family and the rest of the day better.',
    moods: [
      ['best', 'Best fit'],
      ['short', 'About 2 hours'],
      ['nearby', 'Less travel'],
      ['value', 'Value first'],
      ['low-energy', 'Low energy'],
      ['drive', 'Happy to drive'],
      ['easy', 'Easy stop'],
      ['surprise', 'Something different']
    ]
  },
  transport: {
    key: 'transport',
    kicker: 'ASK FERDA · TRANSPORT',
    title: 'How should we get around?',
    intro: 'Use the transport setup you have already saved, then keep each journey realistic for the crew and the shape of the day.',
    question: '',
    resultTitle: '',
    hint: '',
    moods: []
  }
});

const BUDGET_VALUE = Object.freeze({ value: 1, balanced: 2, flexible: 3 });
const DISCOVERY_VALUE = Object.freeze({ familiar: 1, mix: 2, discover: 3 });
const WALKING_VALUE = Object.freeze({ low: 1, normal: 2, high: 3 });

export function normaliseExploreIntent(value) {
  return Object.prototype.hasOwnProperty.call(INTENTS, value) ? value : 'all';
}

export function getExploreIntent(value) {
  return INTENTS[normaliseExploreIntent(value)];
}

function optionSupportsIntent(option, intent) {
  if (intent === 'all') return true;
  if (intent === 'activities') {
    if (Array.isArray(option.intents)) return option.intents.includes('activities');
    return !LEGACY_INTENTS.shopping.has(option.id) || option.id === 'disney-springs';
  }
  if (Array.isArray(option.intents)) return option.intents.includes(intent);
  return LEGACY_INTENTS[intent]?.has(option.id) || false;
}

export function optionsForIntent(options, intent) {
  const key = normaliseExploreIntent(intent);
  if (key === 'transport') return [];
  return options.filter(option => optionSupportsIntent(option, key));
}

function clampScore(value) {
  return Math.max(52, Math.min(96, Math.round(value)));
}

function closeness(value, target, maximum) {
  return Math.max(0, maximum - Math.abs(value - target) * (maximum / 2));
}

function diningRank(options, context, mood) {
  const family = context.family || [];
  const preferences = context.preferences || {};
  const dietaryCrew = family.filter(person => person.dietary?.enabled);
  const strictDietary = dietaryCrew.some(person => person.dietary?.crossContact || person.dietary?.types?.includes('coeliac') || person.dietary?.types?.includes('allergy'));
  const budgetTarget = BUDGET_VALUE[preferences.budget] || 2;
  const discoveryTarget = DISCOVERY_VALUE[preferences.discovery] || 2;
  const lowWalking = preferences.walking === 'low' || preferences.accessibility?.minimiseWalking;

  return options.map(option => {
    let score = 56;
    const reasons = [];
    const cautions = [];

    if (dietaryCrew.length) {
      if (option.dietary >= 3) {
        score += strictDietary ? 18 : 14;
        reasons.push(strictDietary ? 'One of the stronger options when the crew has strict dietary requirements.' : 'Good fit for the dietary needs saved against the crew.');
      } else if (option.dietary === 2) {
        score += 8;
        if (strictDietary) cautions.push('Food needs checking carefully here because the crew has strict dietary requirements.');
      } else {
        score += 2;
        cautions.push('This is not one FERDA would leave to chance for the saved dietary needs.');
      }
    } else {
      score += 8;
    }

    if (option.drive <= 10) {
      score += 12;
      reasons.push('Very little extra travel makes this easy to fit around the rest of the day.');
    } else if (option.drive <= 25) {
      score += 9;
      reasons.push('Travel effort is reasonable for the trip base.');
    } else if (option.drive <= 40) {
      score += 5;
    } else {
      score += 1;
      cautions.push('This asks for more travel than most meal stops should need.');
    }

    const budgetFit = closeness(option.cost || 2, budgetTarget, 10);
    score += budgetFit;
    if (budgetFit >= 8) reasons.push('Cost is well aligned with the budget style you saved.');

    if (lowWalking) {
      if (option.walking === 1) {
        score += 7;
        reasons.push('Low-effort access fits the crew’s walking preference.');
      } else if (option.walking >= 3) {
        score -= 4;
        cautions.push('This meal stop may involve more walking than the crew usually wants.');
      }
    } else {
      score += 4;
    }

    score += closeness(option.discovery || 2, discoveryTarget, 6);

    if (mood === 'nearby') score += Math.max(0, 14 - (option.drive || 0) / 3);
    if (mood === 'dietary') score += (option.dietary || 1) * 5;
    if (mood === 'value') score += (4 - (option.cost || 2)) * 5;
    if (mood === 'surprise') score += (option.discovery || 1) * 4;

    return {
      ...option,
      score: clampScore(score),
      reasons: [...new Set(reasons)].slice(0, 2),
      caution: cautions[0] || ''
    };
  }).sort((a, b) => b.score - a.score);
}

function shoppingRank(options, context, mood) {
  const preferences = context.preferences || {};
  const budgetTarget = BUDGET_VALUE[preferences.budget] || 2;
  const discoveryTarget = DISCOVERY_VALUE[preferences.discovery] || 2;
  const walkingTarget = WALKING_VALUE[preferences.walking] || 2;

  return options.map(option => {
    let score = 58;
    const reasons = [];
    const cautions = [];

    if (option.drive <= 15) {
      score += 12;
      reasons.push('A short transfer makes this easier to justify as part of the holiday day.');
    } else if (option.drive <= 30) {
      score += 8;
      reasons.push('Travel time is manageable for a dedicated shopping stop.');
    } else {
      score += 3;
      cautions.push('FERDA would only spend this much travel time if the shopping itself really matters to the crew.');
    }

    const walkingFit = closeness(option.walking || 2, walkingTarget, 12);
    score += walkingFit;
    if (walkingFit >= 9) reasons.push('Walking demand is a good fit for the crew preference.');
    if (walkingTarget === 1 && option.walking >= 3) cautions.push('This is a heavier walking stop than your crew normally prefers.');

    const budgetFit = closeness(option.cost || 2, budgetTarget, 10);
    score += budgetFit;
    if (budgetFit >= 8) reasons.push('The spend profile fits the budget style you saved.');

    const discoveryFit = closeness(option.discovery || 2, discoveryTarget, 8);
    score += discoveryFit;
    if (discoveryFit >= 6 && preferences.discovery === 'discover') reasons.push('It gives the crew a less-obvious stop rather than only the familiar choices.');

    if (mood === 'nearby') score += Math.max(0, 14 - (option.drive || 0) / 3);
    if (mood === 'value') score += (4 - (option.cost || 2)) * 5;
    if (mood === 'easy') score += (4 - (option.walking || 2)) * 4 + (option.indoor || 1) * 2;
    if (mood === 'surprise') score += (option.discovery || 1) * 4;

    return {
      ...option,
      score: clampScore(score),
      reasons: [...new Set(reasons)].slice(0, 2),
      caution: cautions[0] || ''
    };
  }).sort((a, b) => b.score - a.score);
}

function rightNowConstraint(key, mood) {
  if (['short', 'low-energy', 'drive'].includes(mood)) return new Set([mood]);
  if (mood === 'value' && ['all', 'activities'].includes(key)) return new Set(['value']);
  return new Set();
}

export function rankForIntent(options, context, intent, mood = 'best') {
  const key = normaliseExploreIntent(intent);
  const filtered = optionsForIntent(options, key);
  const constraints = rightNowConstraint(key, mood);
  const baseMood = constraints.size ? 'best' : mood;
  let ranked;
  if (key === 'dining') ranked = diningRank(filtered, context, baseMood);
  else if (key === 'shopping') ranked = shoppingRank(filtered, context, baseMood);
  else ranked = rankOptions(filtered, context, baseMood);
  return constraints.size ? adjustForRightNow(ranked, constraints) : ranked;
}

export function addTypeForIntent(intent) {
  return normaliseExploreIntent(intent) === 'dining' ? 'meal' : 'activity';
}

export function transportModeLabel(mode) {
  return ({
    car: 'Car available',
    rideshare: 'Rideshare',
    public: 'Public transport',
    mixed: 'Mixed transport',
    none: 'Not decided yet'
  })[mode] || 'Not decided yet';
}

export function buildTransportAdvice(trip = {}, preferences = {}, todayItems = []) {
  const mode = trip.transport || 'none';
  const lowWalking = preferences.walking === 'low' || preferences.accessibility?.minimiseWalking;
  const busyDay = Array.isArray(todayItems) && todayItems.length >= 4;

  const modeAdvice = {
    car: {
      title: 'Use the car as the default',
      detail: lowWalking
        ? 'Door-to-door travel suits the lower-walking preference you have saved. Keep parking and the walk from the car in mind when choosing the stop.'
        : 'A car gives the family the most control over timing. It is especially useful when the day has more than one stop.'
    },
    rideshare: {
      title: 'Keep rideshare as the default',
      detail: 'It removes parking from the decision, but give fixed bookings a little extra buffer so a busy pickup does not put the next plan under pressure.'
    },
    public: {
      title: 'Build the day around the route',
      detail: 'Public transport works best when FERDA keeps stops clustered and the family is not relying on a tight connection between fixed plans.'
    },
    mixed: {
      title: 'Choose the easiest mode for each leg',
      detail: 'A mixed setup gives FERDA permission to favour convenience: drive when it saves hassle, switch modes when parking or a long evening makes that sensible.'
    },
    none: {
      title: 'Set the default before the day gets busy',
      detail: 'FERDA can make stronger suggestions once it knows whether the family normally has a car, uses rideshare, public transport or a mixture.'
    }
  }[mode];

  const cards = [
    modeAdvice,
    {
      title: busyDay ? 'Protect the transitions' : 'Leave a little travel breathing room',
      detail: busyDay
        ? 'This day already has several plan items. Treat travel as part of the itinerary rather than invisible time between attractions.'
        : 'A small buffer between stops gives the family somewhere to absorb queues, parking, tired legs or a late finish.'
    },
    {
      title: lowWalking ? 'Optimise for door-to-door effort' : 'Cluster stops when you can',
      detail: lowWalking
        ? 'The shortest drive is not always the easiest journey. FERDA should prefer a simple drop-off or parking experience when that protects the crew’s energy.'
        : 'Two good stops in the same area will usually make a nicer day than bouncing across the destination for marginally higher-rated options.'
    }
  ];

  return { mode, label: transportModeLabel(mode), cards };
}
