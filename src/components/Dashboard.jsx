import { useState, useMemo } from 'react';
import { useBudget } from '../store/BudgetContext';
import { GRAND_TOTAL } from '../data/budgetStructure';
import { formatCurrency, getPercentage, getStatusColor, getStatusLabel, getCategoryTotals, getMonthlyTotals, sumExpenses, filterExpensesByDateRange, getDateRange } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Line, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

const DURATION_OPTIONS = [
  { id: 'month', label: 'This Month' },
  { id: 'quarter', label: 'This Quarter' },
  { id: 'year', label: 'Year to Date' },
  { id: 'all', label: 'Full Year' },
];

export default function Dashboard() {
  const { expenses, categories } = useBudget();
  const [duration, setDuration] = useState('year');

  const { start, end } = getDateRange(duration);
  const filteredExpenses = useMemo(() => filterExpensesByDateRange(expenses, start, end), [expenses, start, end]);
  const totalSpent = sumExpenses(filteredExpenses);
  const remaining = GRAND_TOTAL - sumExpenses(expenses); // remaining always against full year
  const ytdPercentage = getPercentage(sumExpenses(expenses), GRAND_TOTAL);

  const categoryTotals = useMemo(() => getCategoryTotals(expenses, categories), [expenses, categories]);
  const monthlyTotals = useMemo(() => getMonthlyTotals(expenses), [expenses]);

  // Cumulative spending line data
  const cumulativeData = useMemo(() => {
    let running = 0;
    return monthlyTotals.map(m => {
      running += m.total;
      return { ...m, cumulative: running, budgetPace: GRAND_TOTAL / 12 * (monthlyTotals.indexOf(m) + 1) };
    });
  }, [monthlyTotals]);

  const budgetBarData = categoryTotals.map(cat => ({
    name: cat.name,
    Budget: cat.budget,
    Spent: cat.spent,
    fill: cat.color,
  }));

  const pieData = categoryTotals.filter(c => c.spent > 0).map(cat => ({
    name: cat.name,
    value: cat.spent,
    color: cat.color,
  }));

  return (
    <div className="space-y-6">
      {/* Duration Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-tdc-gray-800">Budget Overview</h2>
        <div className="flex bg-tdc-gray-100 rounded-lg p-0.5">
          {DURATION_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setDuration(opt.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                duration === opt.id ? 'bg-white text-tdc-gold shadow-sm' : 'text-tdc-gray-500 hover:text-tdc-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Budget"
          value={formatCurrency(GRAND_TOTAL)}
          subtitle="2026 Annual"
          icon={<DollarSign size={20} />}
          color="gold"
        />
        <KPICard
          title="Total Spent"
          value={formatCurrency(sumExpenses(expenses))}
          subtitle={`${ytdPercentage}% of annual budget`}
          icon={<TrendingUp size={20} />}
          color={ytdPercentage > 75 ? 'red' : ytdPercentage > 50 ? 'yellow' : 'green'}
        />
        <KPICard
          title="Annual Remaining"
          value={formatCurrency(remaining)}
          subtitle={`${100 - ytdPercentage}% of annual budget available`}
          icon={remaining > 0 ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          color={remaining > 0 ? 'green' : 'red'}
        />
        <KPICard
          title="Period Spend"
          value={formatCurrency(totalSpent)}
          subtitle={`${filteredExpenses.length} transactions`}
          icon={<TrendingDown size={20} />}
          color="dark"
        />
      </div>

      {/* Category Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categoryTotals.map(cat => (
          <div key={cat.id} className="bg-white rounded-xl border border-tdc-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-tdc-gray-800">{cat.name}</h3>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: getStatusColor(cat.percentage) + '20', color: getStatusColor(cat.percentage) }}
              >
                {getStatusLabel(cat.percentage)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-tdc-gray-500">Spent</span>
                <span className="font-medium">{formatCurrency(cat.spent)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-tdc-gray-500">Budget</span>
                <span className="font-medium">{formatCurrency(cat.budget)}</span>
              </div>
              <div className="w-full bg-tdc-gray-100 rounded-full h-2.5 mt-2">
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(cat.percentage, 100)}%`, backgroundColor: cat.color }}
                />
              </div>
              <div className="text-right text-xs text-tdc-gray-400">{cat.percentage}% used</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Actual Bar Chart */}
        <div className="bg-white rounded-xl border border-tdc-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-tdc-gray-800 mb-4">Budget vs. Actual</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={budgetBarData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="Budget" fill="#EAEBEC" radius={[4,4,0,0]} />
              <Bar dataKey="Spent" radius={[4,4,0,0]}>
                {budgetBarData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Spending by Category Pie */}
        <div className="bg-white rounded-xl border border-tdc-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-tdc-gray-800 mb-4">Spending Distribution</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={v => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-tdc-gray-400">No spending data yet</div>
          )}
        </div>
      </div>

      {/* Monthly Spending Trend */}
      <div className="bg-white rounded-xl border border-tdc-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-tdc-gray-800 mb-4">Monthly Spending Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={cumulativeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={v => formatCurrency(v)} />
            <Legend />
            <Bar dataKey="total" fill="#A48450" opacity={0.3} name="Monthly Spend" radius={[4,4,0,0]} />
            <Line type="monotone" dataKey="cumulative" stroke="#A48450" strokeWidth={2} name="Cumulative Spend" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="budgetPace" stroke="#A5A6A5" strokeWidth={2} strokeDasharray="5 5" name="Budget Pace" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-xl border border-tdc-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-tdc-gray-800 mb-4">Recent Expenses</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-tdc-gray-200">
                <th className="text-left py-2 px-3 text-tdc-gray-500 font-medium">Date</th>
                <th className="text-left py-2 px-3 text-tdc-gray-500 font-medium">Description</th>
                <th className="text-left py-2 px-3 text-tdc-gray-500 font-medium">Category</th>
                <th className="text-left py-2 px-3 text-tdc-gray-500 font-medium">Vendor</th>
                <th className="text-right py-2 px-3 text-tdc-gray-500 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {[...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8).map(exp => {
                const cat = categories.find(c => c.id === exp.categoryId);
                return (
                  <tr key={exp.id} className="border-b border-tdc-gray-100 hover:bg-tdc-gray-50">
                    <td className="py-2 px-3 text-tdc-gray-600">{exp.date}</td>
                    <td className="py-2 px-3">{exp.description}</td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat?.color }} />
                        {cat?.name}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-tdc-gray-600">{exp.vendor}</td>
                    <td className="py-2 px-3 text-right font-medium">{formatCurrency(exp.amount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, subtitle, icon, color }) {
  const colorMap = {
    gold: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    yellow: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    dark: { bg: 'bg-neutral-50', text: 'text-neutral-700', border: 'border-neutral-200' },
  };
  const c = colorMap[color] || colorMap.gold;
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-5 shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-tdc-gray-500 uppercase tracking-wide">{title}</span>
        <span className={c.text}>{icon}</span>
      </div>
      <div className="text-2xl font-bold text-tdc-gray-900">{value}</div>
      <div className="text-xs text-tdc-gray-500 mt-1">{subtitle}</div>
    </div>
  );
}
