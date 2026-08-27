import { rankOptions } from './engine.js';

const LEGACY_INTENTS = Object.freeze({
  dining: new Set(['disney-springs', 'mini-golf', 'celebration']),
  shopping: new Set(['disney-springs', 'outlet-shopping'])
});

const INTENTS = Object.freeze({
  all: {
    key: 'all',
    kicker: 'ASK FERDA',
    title: 'What should we do?',
    intro: 'FERDA ranks ideas against your actual crew — not a generic “top 10”.',
    question: 'WHAT KIND OF DAY?',
    resultTitle: 'Best matches for your crew',
    hint: 'Prototype scores use your saved profiles and trip preferences.',
    moods: [
      ['best', 'Best fit'],
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
    intro: 'Start with the crew, then FERDA weighs pace, thrills, walking, timing and how adventurous you want the day to feel.',
    question: 'WHAT FITS TODAY?',
    resultTitle: 'Activities that fit the crew',
    hint: 'Ranked against the family and trip preferences you have already saved.',
    moods: [
      ['best', 'Best fit'],
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
    hint: 'Dietary fit uses the requirements saved against your travellers.',
    moods: [
      ['best', 'Best fit'],
      ['nearby', 'Less travel'],
      ['dietary', 'Dietary first'],
      ['value', 'Keep it sensible'],
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
    hint: 'A shorter, easier stop can rank above a bigger name when it fits the crew better.',
    moods: [
      ['best', 'Best fit'],
      ['nearby', 'Less travel'],
      ['value', 'Value first'],
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

function contextualBonus(option, mood) {
  if (mood === 'nearby') {
    const bonus = Math.max(0, 12 - Math.round((option.drive || 0) / 5));
    return { bonus, reason: bonus >= 7 ? 'One of the easier options to reach from an Orlando base.' : '' };
  }
  if (mood === 'dietary') {
    const bonus = (option.dietary || 1) * 4;
    return { bonus, reason: option.dietary >= 3 ? 'Stronger fit when the crew needs food choices to be planned carefully.' : '' };
  }
  if (mood === 'value') {
    const bonus = (4 - (option.cost || 2)) * 4;
    return { bonus, reason: option.cost === 1 ? 'One of the lower-cost ways to use this part of the day.' : '' };
  }
  return { bonus: 0, reason: '' };
}

export function rankForIntent(options, context, intent, mood = 'best') {
  const filtered = optionsForIntent(options, intent);
  const baseMood = ['nearby', 'dietary', 'value'].includes(mood) ? 'best' : mood;
  return rankOptions(filtered, context, baseMood).map(option => {
    const extra = contextualBonus(option, mood);
    if (!extra.bonus) return option;
    return {
      ...option,
      score: Math.min(96, option.score + extra.bonus),
      reasons: extra.reason ? [extra.reason, ...option.reasons].slice(0, 2) : option.reasons
    };
  }).sort((a, b) => b.score - a.score);
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
        ? 'Today already has several plan items. Treat travel as part of the itinerary rather than invisible time between attractions.'
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
