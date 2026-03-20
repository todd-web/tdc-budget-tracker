import { useState, useMemo } from 'react';
import { useBudget } from '../store/BudgetContext';
import { GRAND_TOTAL } from '../data/budgetStructure';
import { formatCurrency, getPercentage, getStatusColor, getStatusLabel, getCategoryTotals, getMonthlyTotals, getQuarterlyTotals, filterExpensesByDateRange, sumExpenses, getDateRange } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FileText, Download, Calendar, Printer } from 'lucide-react';
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, eachWeekOfInterval } from 'date-fns';

const REPORT_TYPES = [
  { id: 'weekly', label: 'Weekly Report' },
  { id: 'monthly', label: 'Monthly Report' },
  { id: 'quarterly', label: 'Quarterly Report' },
  { id: 'annual', label: 'Annual Report' },
  { id: 'custom', label: 'Custom Date Range' },
];

export default function Reports() {
  const { expenses, categories, projects } = useBudget();
  const [reportType, setReportType] = useState('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [customStart, setCustomStart] = useState('2026-01-01');
  const [customEnd, setCustomEnd] = useState(new Date().toISOString().split('T')[0]);

  const dateRange = useMemo(() => {
    const ref = parseISO(selectedDate);
    switch (reportType) {
      case 'weekly': return { start: startOfWeek(ref, { weekStartsOn: 1 }), end: endOfWeek(ref, { weekStartsOn: 1 }) };
      case 'monthly': return { start: startOfMonth(ref), end: endOfMonth(ref) };
      case 'quarterly': return { start: startOfQuarter(ref), end: endOfQuarter(ref) };
      case 'annual': return getDateRange('year', ref);
      case 'custom': return { start: parseISO(customStart), end: parseISO(customEnd) };
      default: return getDateRange('month', ref);
    }
  }, [reportType, selectedDate, customStart, customEnd]);

  const periodExpenses = useMemo(() => filterExpensesByDateRange(expenses, dateRange.start, dateRange.end), [expenses, dateRange]);
  const periodTotal = sumExpenses(periodExpenses);
  const ytdTotal = sumExpenses(expenses);
  const categoryTotals = useMemo(() => getCategoryTotals(periodExpenses, categories), [periodExpenses, categories]);
  const monthlyTotals = useMemo(() => getMonthlyTotals(expenses), [expenses]);
  const quarterlyTotals = useMemo(() => getQuarterlyTotals(expenses), [expenses]);

  const periodLabel = useMemo(() => {
    switch (reportType) {
      case 'weekly': return `Week of ${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d, yyyy')}`;
      case 'monthly': return format(dateRange.start, 'MMMM yyyy');
      case 'quarterly': return `Q${Math.ceil((dateRange.start.getMonth() + 1) / 3)} ${format(dateRange.start, 'yyyy')}`;
      case 'annual': return format(dateRange.start, 'yyyy');
      case 'custom': return `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d, yyyy')}`;
      default: return '';
    }
  }, [reportType, dateRange]);

  // Top vendors
  const vendorTotals = useMemo(() => {
    const map = {};
    for (const exp of periodExpenses) {
      const v = exp.vendor || 'Unknown';
      map[v] = (map[v] || 0) + Number(exp.amount);
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [periodExpenses]);

  // Top expenses
  const topExpenses = useMemo(() => [...periodExpenses].sort((a, b) => b.amount - a.amount).slice(0, 5), [periodExpenses]);

  const handlePrint = () => window.print();

  const handleExport = () => {
    const report = generateTextReport(periodLabel, periodTotal, ytdTotal, categoryTotals, vendorTotals, topExpenses, periodExpenses);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `tdc-budget-report-${periodLabel.replace(/\s/g, '-').toLowerCase()}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-tdc-gray-800">Budget Reports</h2>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-tdc-gray-300 rounded-lg text-tdc-gray-700 hover:bg-tdc-gray-50">
            <Printer size={14} /> Print
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-tdc-gray-300 rounded-lg text-tdc-gray-700 hover:bg-tdc-gray-50">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="bg-white rounded-xl border border-tdc-gray-200 p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Report Type</label>
            <select value={reportType} onChange={e => setReportType(e.target.value)}
              className="px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg bg-white">
              {REPORT_TYPES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </div>
          {reportType !== 'custom' && (
            <div>
              <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Date</label>
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                className="px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg" />
            </div>
          )}
          {reportType === 'custom' && (
            <>
              <div>
                <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Start Date</label>
                <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)}
                  className="px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-medium text-tdc-gray-600 mb-1">End Date</label>
                <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)}
                  className="px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Report Content */}
      <div id="report-content" className="space-y-6">
        {/* Report Header */}
        <div className="bg-white rounded-xl border border-tdc-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={24} className="text-tdc-blue" />
            <div>
              <h3 className="font-bold text-tdc-gray-900 text-lg">TDC Expert Team - Budget Report</h3>
              <p className="text-sm text-tdc-gray-500">{periodLabel}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-tdc-gray-50 rounded-lg p-3">
              <div className="text-xs text-tdc-gray-500">Period Spend</div>
              <div className="text-lg font-bold">{formatCurrency(periodTotal)}</div>
            </div>
            <div className="bg-tdc-gray-50 rounded-lg p-3">
              <div className="text-xs text-tdc-gray-500">YTD Spend</div>
              <div className="text-lg font-bold">{formatCurrency(ytdTotal)}</div>
            </div>
            <div className="bg-tdc-gray-50 rounded-lg p-3">
              <div className="text-xs text-tdc-gray-500">Annual Budget</div>
              <div className="text-lg font-bold">{formatCurrency(GRAND_TOTAL)}</div>
            </div>
            <div className="bg-tdc-gray-50 rounded-lg p-3">
              <div className="text-xs text-tdc-gray-500">YTD Utilization</div>
              <div className="text-lg font-bold" style={{ color: getStatusColor(getPercentage(ytdTotal, GRAND_TOTAL)) }}>
                {getPercentage(ytdTotal, GRAND_TOTAL)}%
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-tdc-gray-200 p-5 shadow-sm">
          <h4 className="font-semibold text-tdc-gray-800 mb-4">Category Breakdown (Period)</h4>
          <div className="space-y-3">
            {categoryTotals.map(cat => (
              <div key={cat.id} className="flex items-center gap-4">
                <div className="w-28 text-sm font-medium text-tdc-gray-700 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </div>
                <div className="flex-1">
                  <div className="w-full bg-tdc-gray-100 rounded-full h-4">
                    <div className="h-4 rounded-full flex items-center justify-end pr-2 transition-all" style={{ width: `${Math.max(Math.min(cat.percentage, 100), 3)}%`, backgroundColor: cat.color }}>
                      <span className="text-white text-[10px] font-medium">{cat.percentage}%</span>
                    </div>
                  </div>
                </div>
                <div className="w-32 text-right text-sm">
                  <span className="font-medium">{formatCurrency(cat.spent)}</span>
                  <span className="text-tdc-gray-400"> / {formatCurrency(cat.budget)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quarterly Summary Chart */}
        <div className="bg-white rounded-xl border border-tdc-gray-200 p-5 shadow-sm">
          <h4 className="font-semibold text-tdc-gray-800 mb-4">Quarterly Spending</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={quarterlyTotals}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${(v/1000).toFixed(1)}k`} />
              <Tooltip formatter={v => formatCurrency(v)} />
              <Bar dataKey="total" radius={[4,4,0,0]} name="Spend">
                {quarterlyTotals.map((entry, i) => <Cell key={i} fill={['#2563eb', '#10b981', '#8b5cf6', '#f59e0b'][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Vendors */}
          <div className="bg-white rounded-xl border border-tdc-gray-200 p-5 shadow-sm">
            <h4 className="font-semibold text-tdc-gray-800 mb-3">Top Vendors (Period)</h4>
            {vendorTotals.length === 0 ? (
              <p className="text-sm text-tdc-gray-400 text-center py-4">No expenses in this period</p>
            ) : (
              <div className="space-y-2">
                {vendorTotals.map(([vendor, total], i) => (
                  <div key={vendor} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-tdc-gray-700 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-tdc-gray-100 flex items-center justify-center text-xs text-tdc-gray-500">{i + 1}</span>
                      {vendor}
                    </span>
                    <span className="text-sm font-medium">{formatCurrency(total)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Largest Expenses */}
          <div className="bg-white rounded-xl border border-tdc-gray-200 p-5 shadow-sm">
            <h4 className="font-semibold text-tdc-gray-800 mb-3">Top Expenses (Period)</h4>
            {topExpenses.length === 0 ? (
              <p className="text-sm text-tdc-gray-400 text-center py-4">No expenses in this period</p>
            ) : (
              <div className="space-y-2">
                {topExpenses.map((exp, i) => (
                  <div key={exp.id} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-tdc-gray-100 flex items-center justify-center text-xs text-tdc-gray-500">{i + 1}</span>
                      <div>
                        <div className="text-sm text-tdc-gray-700">{exp.description}</div>
                        <div className="text-xs text-tdc-gray-400">{exp.date}</div>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{formatCurrency(exp.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* All Period Expenses */}
        <div className="bg-white rounded-xl border border-tdc-gray-200 p-5 shadow-sm">
          <h4 className="font-semibold text-tdc-gray-800 mb-3">All Expenses ({periodLabel})</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-tdc-gray-200">
                  <th className="text-left py-2 px-2 text-tdc-gray-500 font-medium">Date</th>
                  <th className="text-left py-2 px-2 text-tdc-gray-500 font-medium">Description</th>
                  <th className="text-left py-2 px-2 text-tdc-gray-500 font-medium">Vendor</th>
                  <th className="text-left py-2 px-2 text-tdc-gray-500 font-medium">Category</th>
                  <th className="text-right py-2 px-2 text-tdc-gray-500 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {periodExpenses.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-tdc-gray-400">No expenses in this period</td></tr>
                ) : [...periodExpenses].sort((a, b) => b.date.localeCompare(a.date)).map(exp => {
                  const cat = categories.find(c => c.id === exp.categoryId);
                  return (
                    <tr key={exp.id} className="border-b border-tdc-gray-100">
                      <td className="py-1.5 px-2 text-tdc-gray-600">{exp.date}</td>
                      <td className="py-1.5 px-2">{exp.description}</td>
                      <td className="py-1.5 px-2 text-tdc-gray-600">{exp.vendor}</td>
                      <td className="py-1.5 px-2"><span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat?.color }} />{cat?.name}</span></td>
                      <td className="py-1.5 px-2 text-right font-medium">{formatCurrency(exp.amount)}</td>
                    </tr>
                  );
                })}
                <tr className="bg-tdc-gray-50 font-bold">
                  <td colSpan={4} className="py-2 px-2 text-right">Period Total</td>
                  <td className="py-2 px-2 text-right">{formatCurrency(periodTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateTextReport(periodLabel, periodTotal, ytdTotal, categoryTotals, vendorTotals, topExpenses, periodExpenses) {
  const lines = [
    '═══════════════════════════════════════════════════════',
    '  TDC EXPERT TEAM - BUDGET REPORT',
    `  Period: ${periodLabel}`,
    `  Generated: ${new Date().toLocaleDateString()}`,
    '═══════════════════════════════════════════════════════',
    '',
    `Period Spend:     ${formatCurrency(periodTotal)}`,
    `YTD Spend:        ${formatCurrency(ytdTotal)}`,
    `Annual Budget:    ${formatCurrency(GRAND_TOTAL)}`,
    `YTD Utilization:  ${getPercentage(ytdTotal, GRAND_TOTAL)}%`,
    '',
    '─── CATEGORY BREAKDOWN ───',
    ...categoryTotals.map(c => `  ${c.name.padEnd(15)} ${formatCurrency(c.spent).padStart(10)} / ${formatCurrency(c.budget).padStart(10)}  (${c.percentage}%)`),
    '',
    '─── TOP VENDORS ───',
    ...vendorTotals.map(([v, t]) => `  ${v.padEnd(30)} ${formatCurrency(t)}`),
    '',
    '─── EXPENSE DETAILS ───',
    ...periodExpenses.map(e => `  ${e.date}  ${(e.description || '').substring(0, 35).padEnd(35)} ${formatCurrency(e.amount).padStart(10)}`),
    '',
    `TOTAL: ${formatCurrency(periodTotal)}`,
    '',
    '═══════════════════════════════════════════════════════',
  ];
  return lines.join('\n');
}
