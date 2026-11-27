export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface CategorySummary {
  category: string;
  total: number;
  share: number;
}

export interface ExpenseSummary {
  total: number;
  count: number;
  average: number;
  categories: CategorySummary[];
}

export function calculateSummary(expenses: Expense[]): ExpenseSummary {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const grouped = new Map<string, number>();
  for (const expense of expenses) {
    grouped.set(expense.category, (grouped.get(expense.category) ?? 0) + expense.amount);
  }
  return {
    total,
    count: expenses.length,
    average: expenses.length ? total / expenses.length : 0,
    categories: Array.from(grouped, ([category, categoryTotal]) => ({
      category,
      total: categoryTotal,
      share: total > 0 ? Math.round((categoryTotal / total) * 100) : 0
    })).sort((a, b) => b.total - a.total || a.category.localeCompare(b.category))
  };
}
