import type { Expense } from './expenses';

const STORAGE_KEY = 'daybook.expenses';

function isExpense(value: unknown): value is Expense {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.amount === 'number' && Number.isFinite(item.amount) && item.amount >= 0 &&
    typeof item.category === 'string' &&
    typeof item.date === 'string';
}

function getStorage(): Storage | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

export function loadExpenses(storage: Storage | undefined = getStorage()): Expense[] {
  if (!storage) return [];
  try {
    const stored = storage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isExpense) : [];
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[], storage: Storage | undefined = getStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {
    // Storage can be unavailable or full; the in-memory app remains usable.
  }
}

export function clearExpenses(storage: Storage | undefined = getStorage()): void {
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable; clearing the in-memory app still works.
  }
}
