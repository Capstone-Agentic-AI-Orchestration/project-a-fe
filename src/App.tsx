import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { calculateSummary, type Expense } from './expenses';
import { clearExpenses, loadExpenses, saveExpenses } from './expenseStorage';

export interface AppProps { title?: string }
const categories = ['Food', 'Transport', 'Housing', 'Health', 'Shopping', 'Other'];
const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export function App({ title = 'Daybook' }: AppProps) {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses());
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [expenseTitle, setExpenseTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  useEffect(() => saveExpenses(expenses), [expenses]);
  const shown = useMemo(() => expenses.filter(e => (categoryFilter === 'all' || e.category === categoryFilter) && (!dateFilter || e.date === dateFilter)), [expenses, categoryFilter, dateFilter]);
  const summary = useMemo(() => calculateSummary(shown), [shown]);
  const availableCategories = Array.from(new Set(expenses.map(e => e.category))).sort();

  function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(amount);
    if (!expenseTitle.trim() || !Number.isFinite(value) || value <= 0) return;
    setExpenses(current => [{ id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now()), title: expenseTitle.trim(), amount: value, category, date }, ...current]);
    setExpenseTitle(''); setAmount('');
  }
  function clearAll() { setExpenses([]); clearExpenses(); }

  return <main className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="topbar"><a className="brand" href="#main-content"><span className="brand-icon" aria-hidden="true">◒</span>{title}</a><span className="privacy-note">● Stored privately on this device</span></header>
    <div className="content" id="main-content">
      <section className="page-heading"><div><p className="eyebrow">YOUR MONEY, IN FOCUS</p><h1>Spending overview</h1><p className="subtitle">A clear picture of where your money goes.</p></div><span className="date-stamp">{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date())}</span></section>
      <section className="summary-grid" aria-label="Spending summary">
        <article className="summary-card total-card"><p>Total spent</p><strong>{money(summary.total)}</strong><span>Across displayed expenses</span></article>
        <article className="summary-card"><p>Expenses</p><strong>{summary.count}</strong><span>{summary.count === 1 ? 'transaction' : 'transactions'}</span></article>
        <article className="summary-card"><p>Average expense</p><strong>{money(summary.average)}</strong><span>Per transaction</span></article>
      </section>
      <section className="dashboard-grid">
        <article className="panel breakdown-panel"><div className="panel-heading"><div><p className="eyebrow">THE BIG PICTURE</p><h2>By category</h2></div><span className="subtle-count">{summary.count} items</span></div>
          {summary.categories.length ? <ul className="category-list">{summary.categories.map((item, i) => <li className="category-row" key={item.category}><div className="category-line"><span className="category-name"><i className={`category-dot tone-${i % 5}`} />{item.category}</span><span className="category-value">{money(item.total)} <small>{item.share}%</small></span></div><div className="progress-track" role="img" aria-label={item.category + ' share: ' + item.share + '%'}><span className={`progress-fill tone-${i % 5}`} style={{ width: item.share + '%' }} /></div></li>)}</ul> : <div className="empty-chart"><span aria-hidden="true">◌</span><p>No spending to break down yet.</p><small>Add an expense to see your categories.</small></div>}
        </article>
        <article className="panel add-panel"><div className="panel-heading"><div><p className="eyebrow">KEEP TRACK</p><h2>Add an expense</h2></div></div>
          <form className="expense-form" onSubmit={addExpense}>
            <label>Description<input value={expenseTitle} onChange={e => setExpenseTitle(e.target.value)} placeholder="e.g. Weekly groceries" required /></label>
            <div className="form-row"><label>Amount<input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required /></label><label>Category<select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(item => <option key={item}>{item}</option>)}</select></label></div>
            <label>Date<input type="date" value={date} onChange={e => setDate(e.target.value)} required /></label><button className="primary-button" type="submit">＋ Add expense</button>
          </form>
        </article>
      </section>
      <section className="panel transactions-panel"><div className="transactions-heading"><div><p className="eyebrow">RECENT ACTIVITY</p><h2>Transactions</h2></div><div className="filters">
        <label className="visually-hidden" htmlFor="category-filter">Filter by category</label><select id="category-filter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}><option value="all">All categories</option>{availableCategories.map(item => <option key={item}>{item}</option>)}</select>
        <label className="visually-hidden" htmlFor="date-filter">Filter by date</label><input id="date-filter" type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
        {(categoryFilter !== 'all' || dateFilter) && <button className="clear-filter" type="button" onClick={() => { setCategoryFilter('all'); setDateFilter(''); }}>Clear filters</button>}
      </div></div>
      {shown.length ? <ul className="transaction-list">{shown.map(e => <li key={e.id}><span className="transaction-icon" aria-hidden="true">{e.category.slice(0, 1)}</span><span className="transaction-description"><strong>{e.title}</strong><small>{e.category} · {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(e.date + 'T00:00:00Z'))}</small></span><strong className="transaction-amount">−{money(e.amount)}</strong></li>)}</ul> : <div className="empty-transactions"><p>{expenses.length ? 'No expenses match these filters.' : 'Nothing here yet.'}</p><span>{expenses.length ? 'Try changing the category or date.' : 'Add your first expense above to get started.'}</span></div>}
      {expenses.length > 0 && <div className="list-footer"><span>Showing {shown.length} of {expenses.length} expenses</span><button type="button" className="text-button" onClick={clearAll}>Clear all</button></div>}
      </section><footer className="page-footer">A little more clarity, one expense at a time.</footer>
    </div>
  </main>;
}