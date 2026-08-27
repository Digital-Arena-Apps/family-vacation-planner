import { ORLANDO_OPTIONS } from './dataset.js';

const EXTRA_CONTEXT_OPTIONS = Object.freeze([
  {
    id: 'citywalk-dining',
    name: 'Universal CityWalk dinner',
    category: 'Dining district',
    summary: 'A flexible evening food stop with lots of choice in one walkable area.',
    thrill: 1, walking: 2, cost: 3, discovery: 2, duration: 'short', start: 'late', indoor: 2, dietary: 3, drive: 25, minAge: 0,
    icon: '/brand/ferda-ui-icon-food-dietary.webp',
    intents: ['dining']
  },
  {
    id: 'international-drive-food',
    name: 'International Drive food stop',
    category: 'Dining district',
    summary: 'Keep dinner flexible with a broad cluster of family dining options and easy plan-B choices.',
    thrill: 1, walking: 1, cost: 2, discovery: 2, duration: 'short', start: 'late', indoor: 3, dietary: 2, drive: 25, minAge: 0,
    icon: '/brand/ferda-ui-icon-food-dietary.webp',
    intents: ['dining']
  },
  {
    id: 'villa-food-night',
    name: 'Easy food night at the villa',
    category: 'Low-effort meal',
    summary: 'Protect the evening by bringing food back and letting the crew properly switch off.',
    thrill: 1, walking: 1, cost: 1, discovery: 1, duration: 'short', start: 'late', indoor: 3, dietary: 2, drive: 8, minAge: 0,
    icon: '/brand/ferda-ui-icon-food-dietary.webp',
    intents: ['dining']
  },
  {
    id: 'florida-mall',
    name: 'The Florida Mall',
    category: 'Shopping',
    summary: 'A large indoor shopping stop that works well when the crew wants variety or a weather-proof break.',
    thrill: 1, walking: 2, cost: 2, discovery: 1, duration: 'half', start: 'any', indoor: 3, dietary: 2, drive: 25, minAge: 0,
    icon: '/brand/ferda-ui-icon-trip-preferences.webp',
    intents: ['shopping']
  },
  {
    id: 'mall-at-millenia',
    name: 'The Mall at Millenia',
    category: 'Shopping',
    summary: 'A polished indoor shopping option with an easier all-in-one feel for a planned retail stop.',
    thrill: 1, walking: 2, cost: 3, discovery: 2, duration: 'half', start: 'any', indoor: 3, dietary: 2, drive: 25, minAge: 0,
    icon: '/brand/ferda-ui-icon-trip-preferences.webp',
    intents: ['shopping']
  },
  {
    id: 'vineland-outlets',
    name: 'Vineland Premium Outlets',
    category: 'Outlet shopping',
    summary: 'A focused outlet stop that can be worthwhile when the family has specific brands or bargains in mind.',
    thrill: 1, walking: 3, cost: 2, discovery: 1, duration: 'half', start: 'any', indoor: 1, dietary: 1, drive: 20, minAge: 0,
    icon: '/brand/ferda-ui-icon-trip-preferences.webp',
    intents: ['shopping']
  },
  {
    id: 'international-premium-outlets',
    name: 'International Premium Outlets',
    category: 'Outlet shopping',
    summary: 'A broad outlet option with lots of choice, best when the crew is happy with a heavier walking block.',
    thrill: 1, walking: 3, cost: 2, discovery: 1, duration: 'half', start: 'any', indoor: 1, dietary: 1, drive: 25, minAge: 0,
    icon: '/brand/ferda-ui-icon-trip-preferences.webp',
    intents: ['shopping']
  }
]);

export const FERDA_CONTEXT_OPTIONS = Object.freeze([...ORLANDO_OPTIONS, ...EXTRA_CONTEXT_OPTIONS]);
