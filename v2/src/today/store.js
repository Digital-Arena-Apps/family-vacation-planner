const STORAGE_KEY = 'fvp_v2_today_plan_v1';

function readAll() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(value) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch {}
}

function normaliseItem(input = {}) {
  const period = ['morning', 'afternoon', 'evening'].includes(input.period) ? input.period : 'morning';
  const type = ['activity', 'meal', 'travel', 'other'].includes(input.type) ? input.type : 'activity';
  return {
    id: String(input.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    period,
    type,
    title: String(input.title || '').trim().slice(0, 80),
    note: String(input.note || '').trim().slice(0, 140)
  };
}

export function createTodayStore() {
  const listeners = new Set();

  function list(dateKey) {
    const all = readAll();
    const rows = Array.isArray(all[dateKey]) ? all[dateKey] : [];
    return rows.map(normaliseItem).filter(item => item.title);
  }

  function emit(dateKey) {
    const snapshot = list(dateKey);
    listeners.forEach(listener => listener(snapshot, dateKey));
  }

  return {
    list,
    add(dateKey, input) {
      const item = normaliseItem(input);
      if (!item.title) return null;
      const all = readAll();
      const rows = Array.isArray(all[dateKey]) ? all[dateKey] : [];
      all[dateKey] = [...rows, item];
      writeAll(all);
      emit(dateKey);
      return item;
    },
    update(dateKey, id, input) {
      const all = readAll();
      const rows = Array.isArray(all[dateKey]) ? all[dateKey] : [];
      let updated = null;
      all[dateKey] = rows.map(existing => {
        if (String(existing.id) !== String(id)) return existing;
        const next = normaliseItem({ ...existing, ...input, id: existing.id });
        updated = next.title ? next : null;
        return next;
      }).filter(item => String(item.id) !== String(id) || item.title);
      writeAll(all);
      emit(dateKey);
      return updated;
    },
    remove(dateKey, id) {
      const all = readAll();
      const rows = Array.isArray(all[dateKey]) ? all[dateKey] : [];
      all[dateKey] = rows.filter(item => String(item.id) !== String(id));
      writeAll(all);
      emit(dateKey);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
