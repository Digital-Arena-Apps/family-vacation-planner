const STORAGE_KEY = 'fvp_v2_family_v1';

function id() {
  return globalThis.crypto?.randomUUID?.() || `m_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function seedMembers() {
  return [
    { id: id(), name: 'Adult 1', age: 40, role: 'adult', thrill: 'medium', heightBand: '48plus', notes: '' },
    { id: id(), name: 'Adult 2', age: 38, role: 'adult', thrill: 'low', heightBand: '48plus', notes: '' },
    { id: id(), name: 'Child 1', age: 14, role: 'child', thrill: 'high', heightBand: '48plus', notes: '' },
    { id: id(), name: 'Child 2', age: 10, role: 'child', thrill: 'medium', heightBand: '42to47', notes: '' }
  ];
}

function normaliseMember(member) {
  return {
    id: member.id || id(),
    name: String(member.name || '').trim() || 'Traveller',
    age: Math.max(0, Math.min(99, Number(member.age) || 0)),
    role: member.role === 'child' ? 'child' : 'adult',
    thrill: ['low', 'medium', 'high'].includes(member.thrill) ? member.thrill : 'medium',
    heightBand: ['under36', '36to41', '42to47', '48plus', 'unknown'].includes(member.heightBand) ? member.heightBand : 'unknown',
    notes: String(member.notes || '').trim()
  };
}

export function createFamilyStore() {
  let members;
  const listeners = new Set();

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    members = Array.isArray(saved) && saved.length ? saved.map(normaliseMember) : seedMembers();
  } catch {
    members = seedMembers();
  }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(members)); } catch {}
  }

  function notify() {
    persist();
    listeners.forEach(fn => fn(list()));
  }

  function list() {
    return members.map(member => ({ ...member }));
  }

  return {
    list,
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    get(memberId) {
      const found = members.find(member => member.id === memberId);
      return found ? { ...found } : null;
    },
    save(member) {
      const next = normaliseMember(member);
      const index = members.findIndex(existing => existing.id === next.id);
      if (index >= 0) members[index] = next;
      else members.push(next);
      notify();
      return { ...next };
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
    resetDemo() {
      members = seedMembers();
      notify();
    }
  };
}
