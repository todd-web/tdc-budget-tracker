import { useState, useMemo } from 'react';
import { useBudget } from '../store/BudgetContext';
import { GRAND_TOTAL } from '../data/budgetStructure';
import { formatCurrency, getPercentage, getStatusColor, getStatusLabel, sumExpenses } from '../utils/helpers';
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function Budget() {
  const { expenses, categories } = useBudget();
  const [expandedCategories, setExpandedCategories] = useState(new Set(categories.map(c => c.id)));
  const [expandedSubs, setExpandedSubs] = useState(new Set());

  const toggleCategory = (id) => {
    const next = new Set(expandedCategories);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedCategories(next);
  };

  const toggleSub = (id) => {
    const next = new Set(expandedSubs);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedSubs(next);
  };

  const totalSpent = sumExpenses(expenses);
  const totalPercentage = getPercentage(totalSpent, GRAND_TOTAL);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-tdc-gray-800">Budget Categories</h2>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-tdc-green" /> On Track</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-tdc-yellow" /> Warning (75%+)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-tdc-orange" /> Critical (90%+)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-tdc-red" /> Over Budget</span>
        </div>
      </div>

      {/* Grand Total Bar */}
      <div className="bg-white rounded-xl border border-tdc-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-tdc-gray-900 text-lg">2026 Expert Team Total</h3>
          <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: getStatusColor(totalPercentage) + '20', color: getStatusColor(totalPercentage) }}>
            {getStatusLabel(totalPercentage)}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div><div className="text-xs text-tdc-gray-500">Allocated</div><div className="text-lg font-bold">{formatCurrency(GRAND_TOTAL)}</div></div>
          <div><div className="text-xs text-tdc-gray-500">Spent</div><div className="text-lg font-bold">{formatCurrency(totalSpent)}</div></div>
          <div><div className="text-xs text-tdc-gray-500">Remaining</div><div className="text-lg font-bold" style={{ color: getStatusColor(totalPercentage) }}>{formatCurrency(GRAND_TOTAL - totalSpent)}</div></div>
        </div>
        <div className="w-full bg-tdc-gray-100 rounded-full h-3">
          <div className="h-3 rounded-full transition-all duration-700" style={{ width: `${Math.min(totalPercentage, 100)}%`, backgroundColor: getStatusColor(totalPercentage) }} />
        </div>
        <div className="text-right text-xs text-tdc-gray-400 mt-1">{totalPercentage}% utilized</div>
      </div>

      {/* Category Tree */}
      {categories.map(cat => {
        const catExpenses = expenses.filter(e => e.categoryId === cat.id);
        const catSpent = sumExpenses(catExpenses);
        const catPct = getPercentage(catSpent, cat.totalBudget);
        const isExpanded = expandedCategories.has(cat.id);

        return (
          <div key={cat.id} className="bg-white rounded-xl border border-tdc-gray-200 shadow-sm overflow-hidden">
            {/* Category Header */}
            <button onClick={() => toggleCategory(cat.id)} className="w-full flex items-center justify-between p-5 hover:bg-tdc-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                {isExpanded ? <ChevronDown size={18} className="text-tdc-gray-400" /> : <ChevronRight size={18} className="text-tdc-gray-400" />}
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <div className="text-left">
                  <h3 className="font-semibold text-tdc-gray-900">{cat.name}</h3>
                  <p className="text-xs text-tdc-gray-500">{cat.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-right">
                  <div className="text-xs text-tdc-gray-500">Spent / Budget</div>
                  <div className="font-medium">{formatCurrency(catSpent)} / {formatCurrency(cat.totalBudget)}</div>
                </div>
                <div className="w-24">
                  <div className="w-full bg-tdc-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min(catPct, 100)}%`, backgroundColor: cat.color }} />
                  </div>
                  <div className="text-right text-xs text-tdc-gray-400 mt-0.5">{catPct}%</div>
                </div>
              </div>
            </button>

            {/* Subcategories */}
            {isExpanded && (
              <div className="border-t border-tdc-gray-100">
                {cat.subcategories.map(sub => {
                  const subExpenses = catExpenses.filter(e => e.subcategoryId === sub.id);
                  const subSpent = sumExpenses(subExpenses);
                  const subBudget = sub.items.reduce((s, i) => s + i.budget, 0);
                  const subPct = getPercentage(subSpent, subBudget);
                  const isSubExpanded = expandedSubs.has(sub.id);

                  return (
                    <div key={sub.id}>
                      <button onClick={() => toggleSub(sub.id)} className="w-full flex items-center justify-between px-5 py-3 pl-12 hover:bg-tdc-gray-50 transition-colors border-b border-tdc-gray-50">
                        <div className="flex items-center gap-2">
                          {isSubExpanded ? <ChevronDown size={14} className="text-tdc-gray-400" /> : <ChevronRight size={14} className="text-tdc-gray-400" />}
                          <span className="font-medium text-sm text-tdc-gray-700">{sub.name}</span>
                          {sub.quarterBudget && <span className="text-xs bg-tdc-gray-100 text-tdc-gray-500 px-2 py-0.5 rounded-full">{formatCurrency(sub.quarterBudget)} quarter budget</span>}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-tdc-gray-600">{formatCurrency(subSpent)} / {formatCurrency(subBudget)}</span>
                          <div className="w-16 bg-tdc-gray-100 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full" style={{ width: `${Math.min(subPct, 100)}%`, backgroundColor: getStatusColor(subPct) }} />
                          </div>
                        </div>
                      </button>

                      {/* Line Items */}
                      {isSubExpanded && (
                        <div className="bg-tdc-gray-50">
                          {sub.items.map(item => {
                            const itemExpenses = subExpenses.filter(e => e.itemId === item.id);
                            const itemSpent = sumExpenses(itemExpenses);
                            const itemPct = getPercentage(itemSpent, item.budget);

                            return (
                              <div key={item.id} className="flex items-center justify-between px-5 py-2.5 pl-20 text-sm border-b border-tdc-gray-100 last:border-b-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-tdc-gray-700">{item.name}</span>
                                  {item.isTBD && <span className="text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded">TBD</span>}
                                  {item.isVariable && <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">Variable</span>}
                                  {item.notes && (
                                    <span className="text-xs text-tdc-gray-400 flex items-center gap-0.5" title={item.notes}>
                                      <Info size={12} />
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className={`font-medium ${itemPct > 100 ? 'text-tdc-red' : 'text-tdc-gray-700'}`}>
                                    {formatCurrency(itemSpent)}
                                  </span>
                                  <span className="text-tdc-gray-400">/</span>
                                  <span className="text-tdc-gray-500 w-20 text-right">{formatCurrency(item.budget)}</span>
                                  <div className="w-16 bg-tdc-gray-200 rounded-full h-1.5">
                                    <div className="h-1.5 rounded-full" style={{ width: `${Math.min(itemPct, 100)}%`, backgroundColor: getStatusColor(itemPct) }} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
