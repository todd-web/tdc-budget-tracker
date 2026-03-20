import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, isWithinInterval, parseISO, eachMonthOfInterval, eachWeekOfInterval, getQuarter } from 'date-fns';

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return format(parseISO(dateStr), 'MMM d, yyyy');
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '';
  return format(parseISO(dateStr), 'MM/dd/yy');
}

export function getPercentage(spent, budget) {
  if (!budget || budget === 0) return 0;
  return Math.round((spent / budget) * 100);
}

export function getStatusColor(percentage) {
  if (percentage >= 100) return '#000000'; // TDC Black - over budget
  if (percentage >= 90) return '#404752'; // TDC Dark Gray - critical
  if (percentage >= 75) return '#A48450'; // TDC Gold - warning
  return '#A5A6A5'; // TDC Medium Gray - on track
}

export function getStatusLabel(percentage) {
  if (percentage >= 100) return 'Over Budget';
  if (percentage >= 90) return 'Critical';
  if (percentage >= 75) return 'Warning';
  return 'On Track';
}

// Date range utilities
export function getDateRange(duration, referenceDate = new Date()) {
  switch (duration) {
    case 'week':
      return { start: startOfWeek(referenceDate, { weekStartsOn: 1 }), end: endOfWeek(referenceDate, { weekStartsOn: 1 }) };
    case 'month':
      return { start: startOfMonth(referenceDate), end: endOfMonth(referenceDate) };
    case 'quarter':
      return { start: startOfQuarter(referenceDate), end: endOfQuarter(referenceDate) };
    case 'year':
      return { start: startOfYear(referenceDate), end: endOfYear(referenceDate) };
    case 'all':
      return { start: new Date(2026, 0, 1), end: new Date(2026, 11, 31) };
    default:
      return { start: startOfYear(referenceDate), end: endOfYear(referenceDate) };
  }
}

export function filterExpensesByDateRange(expenses, start, end) {
  return expenses.filter(exp => {
    const d = parseISO(exp.date);
    return isWithinInterval(d, { start, end });
  });
}

export function filterExpensesByCategory(expenses, categoryId) {
  if (!categoryId || categoryId === 'all') return expenses;
  return expenses.filter(exp => exp.categoryId === categoryId);
}

export function filterExpensesBySubcategory(expenses, subcategoryId) {
  if (!subcategoryId || subcategoryId === 'all') return expenses;
  return expenses.filter(exp => exp.subcategoryId === subcategoryId);
}

export function filterExpensesByProject(expenses, projectId) {
  if (!projectId || projectId === 'all') return expenses;
  return expenses.filter(exp => exp.projectId === projectId);
}

export function sumExpenses(expenses) {
  return expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
}

export function groupExpensesByMonth(expenses) {
  const groups = {};
  for (const exp of expenses) {
    const month = format(parseISO(exp.date), 'yyyy-MM');
    if (!groups[month]) groups[month] = [];
    groups[month].push(exp);
  }
  return groups;
}

export function getMonthlyTotals(expenses, year = 2026) {
  const months = eachMonthOfInterval({ start: new Date(year, 0, 1), end: new Date(year, 11, 31) });
  return months.map(month => {
    const monthStr = format(month, 'yyyy-MM');
    const monthExpenses = expenses.filter(exp => exp.date.startsWith(monthStr));
    return {
      month: format(month, 'MMM'),
      monthFull: format(month, 'MMMM yyyy'),
      total: sumExpenses(monthExpenses),
      count: monthExpenses.length,
    };
  });
}

export function getQuarterlyTotals(expenses, year = 2026) {
  return [1, 2, 3, 4].map(q => {
    const start = new Date(year, (q - 1) * 3, 1);
    const end = endOfQuarter(start);
    const qExpenses = filterExpensesByDateRange(expenses, start, end);
    return {
      quarter: `Q${q}`,
      total: sumExpenses(qExpenses),
      count: qExpenses.length,
    };
  });
}

export function getCategoryTotals(expenses, categories) {
  return categories.map(cat => {
    const catExpenses = expenses.filter(exp => exp.categoryId === cat.id);
    const spent = sumExpenses(catExpenses);
    return {
      id: cat.id,
      name: cat.name,
      color: cat.color,
      budget: cat.totalBudget,
      spent,
      remaining: cat.totalBudget - spent,
      percentage: getPercentage(spent, cat.totalBudget),
    };
  });
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function getCurrentQuarter() {
  return getQuarter(new Date());
}

export function sortExpenses(expenses, sortField = 'date', sortDir = 'desc') {
  return [...expenses].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortField === 'amount') { valA = Number(valA); valB = Number(valB); }
    if (sortField === 'date') { valA = new Date(valA); valB = new Date(valB); }
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
}
