import { normaliseAvatar } from './avatars.js';
import { persistentSetItem } from '../storage/native-persistence.js';

const STORAGE_KEY = 'fvp_v2_family_v1';

const DIETARY_TYPES = ['allergy', 'coeliac', 'intolerance', 'preference'];
const DIETARY_AVOIDS = [
  'gluten', 'dairy', 'peanuts', 'tree_nuts', 'eggs', 'shellfish',
  'fish', 'soy', 'sesame', 'vegetarian', 'vegan', 'other'
];

function id() {
  return globalThis.crypto?.randomUUID?.() || `m_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function emptyDietary() {
  return {
    enabled: false,
    types: [],
    avoids: [],
    crossContact: false,
    notes: ''
  };
}

function normaliseDietary(value) {
  const source = value && typeof value === 'object' ? value : emptyDietary();
  return {
    enabled: !!source.enabled,
    types: Array.isArray(source.types) ? [...new Set(source.types.filter(type => DIETARY_TYPES.includes(type)))] : [],
    avoids: Array.isArray(source.avoids) ? [...new Set(source.avoids.filter(item => DIETARY_AVOIDS.includes(item)))] : [],
    crossContact: !!source.crossContact,
    notes: String(source.notes || '').trim()
  };
}

function looksLikeLegacyDemo(members) {
  if (!Array.isArray(members) || members.length !== 4) return false;
  const signature = members.map(member => `${member?.name || ''}:${Number(member?.age) || 0}`).join('|');
  if (signature !== 'Adult 1:40|Adult 2:38|Child 1:14|Child 2:10') return false;
  return members.every(member => {
    const dietary = member?.dietary || {};
    return !String(member?.notes || '').trim()
      && !dietary.enabled
      && !(dietary.types || []).length
      && !(dietary.avoids || []).length
      && !dietary.crossContact
      && !String(dietary.notes || '').trim();
  });
}

function normaliseMember(member) {
  return {
    id: member.id || id(),
    name: String(member.name || '').trim() || 'Traveller',
    age: Math.max(0, Math.min(99, Number(member.age) || 0)),
    role: member.role === 'child' ? 'child' : 'adult',
    thrill: ['low', 'medium', 'high'].includes(member.thrill) ? member.thrill : 'medium',
    heightBand: ['under36', '36to41', '42to47', '48plus', 'unknown'].includes(member.heightBand) ? member.heightBand : 'unknown',
    avatar: normaliseAvatar(member.avatar),
    notes: String(member.notes || '').trim(),
    dietary: normaliseDietary(member.dietary)
  };
}

export function createFamilyStore() {
  let members = [];
  const listeners = new Set();

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(saved) && !looksLikeLegacyDemo(saved)) members = saved.map(normaliseMember);
    if (looksLikeLegacyDemo(saved)) persistentSetItem(STORAGE_KEY, '[]');
  } catch {
    members = [];
  }

  function persist() {
    try { persistentSetItem(STORAGE_KEY, JSON.stringify(members)); } catch {}
  }

  function notify() {
    persist();
    listeners.forEach(fn => fn(list()));
  }

  function list() {
    return members.map(member => ({ ...member, dietary: { ...member.dietary, types: [...member.dietary.types], avoids: [...member.dietary.avoids] } }));
  }

  return {
    list,
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    get(memberId) {
      const found = members.find(member => member.id === memberId);
      return found ? { ...found, dietary: { ...found.dietary, types: [...found.dietary.types], avoids: [...found.dietary.avoids] } } : null;
    },
    save(member) {
      const next = normaliseMember(member);
      const index = members.findIndex(existing => existing.id === next.id);
      if (index >= 0) members[index] = next;
      else members.push(next);
      notify();
      return { ...next, dietary: { ...next.dietary, types: [...next.dietary.types], avoids: [...next.dietary.avoids] } };
    },
    remove(memberId) {
      members = members.filter(member => member.id !== memberId);
      notify();
    },
    reorder(ids) {
      const map = new Map(members.map(member => [member.id, member]));
      const ordered = ids.map(memberId => map.get(memberId)).filter(Boolean);
      const remainder = members.filter(member => !ids.includes(member.id));
      members = [...ordered, ...remainder];
      notify();
    },
    reset() {
      members = [];
      notify();
    }
  };
}
