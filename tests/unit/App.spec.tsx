import { renderToString } from 'react-dom/server';
import { App } from '../../src/App';
import { calculateSummary, type Expense } from '../../src/expenses';
import { clearExpenses, loadExpenses, saveExpenses } from '../../src/expenseStorage';

const sample: Expense[] = [
  { id: '1', title: 'Lunch', amount: 20, category: 'Food', date: '2026-11-20' },
  { id: '2', title: 'Bus pass', amount: 10, category: 'Transport', date: '2026-11-21' },
  { id: '3', title: 'Dinner', amount: 30, category: 'Food', date: '2026-11-21' }
];
function memoryStorage(): Storage {
  const values = new Map<string, string>();
  return { get length() { return values.size; }, clear: () => values.clear(), getItem: key => values.get(key) ?? null,
    key: index => Array.from(values.keys())[index] ?? null, removeItem: key => { values.delete(key); }, setItem: (key, value) => { values.set(key, value); } };
}
describe('expense summaries', () => {
  it('calculates totals, count, average, and category shares', () => {
    expect(calculateSummary(sample)).toEqual({ total: 60, count: 3, average: 20, categories: [{ category: 'Food', total: 50, share: 83 }, { category: 'Transport', total: 10, share: 17 }] });
  });
  it('handles empty and zero-total data', () => {
    expect(calculateSummary([])).toEqual({ total: 0, count: 0, average: 0, categories: [] });
    expect(calculateSummary([{ ...sample[0], amount: 0 }]).categories[0].share).toBe(0);
  });
});
describe('expense storage', () => {
  it('saves, loads, and clears expenses', () => { const storage = memoryStorage(); saveExpenses(sample, storage); expect(loadExpenses(storage)).toEqual(sample); clearExpenses(storage); expect(loadExpenses(storage)).toEqual([]); });
  it('safely handles missing, malformed, and invalid stored values', () => {
    const storage = memoryStorage(); expect(loadExpenses(storage)).toEqual([]);
    storage.setItem('daybook.expenses', '{bad json'); expect(loadExpenses(storage)).toEqual([]);
    storage.setItem('daybook.expenses', JSON.stringify([{ id: 1 }, sample[0]])); expect(loadExpenses(storage)).toEqual([sample[0]]);
  });
});
describe('expense interface', () => {
  it('renders summary, filters, entry form, and empty states', () => {
    const html = renderToString(<App />);
    expect(html).toContain('Spending overview'); expect(html).toContain('Total spent'); expect(html).toContain('Average expense');
    expect(html).toContain('Filter by category'); expect(html).toContain('Add an expense'); expect(html).toContain('Nothing here yet.');
    expect(html).toContain('No spending to break down yet.');
  });
  it('accepts an alternate title', () => { expect(renderToString(<App title="My expenses" />)).toContain('My expenses'); });
});
