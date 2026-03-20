import { useState, useMemo } from 'react';
import { useBudget } from '../store/BudgetContext';
import { PAYMENT_METHODS, EXPENSE_STATUSES } from '../data/budgetStructure';
import { formatCurrency, formatDate, sortExpenses, filterExpensesByCategory, filterExpensesByDateRange, getDateRange, sumExpenses, generateId } from '../utils/helpers';
import { Plus, Search, Filter, Trash2, Edit3, X, Check, ChevronUp, ChevronDown, Download } from 'lucide-react';

export default function Expenses() {
  const { expenses, categories, projects, addExpense, updateExpense, deleteExpense } = useBudget();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDuration, setFilterDuration] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];
    if (filterCategory !== 'all') result = filterExpensesByCategory(result, filterCategory);
    if (filterStatus !== 'all') result = result.filter(e => e.status === filterStatus);
    if (filterDuration !== 'all') {
      const { start, end } = getDateRange(filterDuration);
      result = filterExpensesByDateRange(result, start, end);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(e => e.description?.toLowerCase().includes(lower) || e.vendor?.toLowerCase().includes(lower));
    }
    return sortExpenses(result, sortField, sortDir);
  }, [expenses, filterCategory, filterStatus, filterDuration, searchTerm, sortField, sortDir]);

  const handleSort = (field) => {
    if (sortField === field) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const handleDelete = (id) => {
    if (confirmDelete === id) { deleteExpense(id); setConfirmDelete(null); }
    else { setConfirmDelete(id); setTimeout(() => setConfirmDelete(null), 3000); }
  };

  const exportCSV = () => {
    const headers = ['Date', 'Category', 'Subcategory', 'Description', 'Vendor', 'Amount', 'Payment Method', 'Status', 'Project', 'Tags'];
    const rows = filteredExpenses.map(e => {
      const cat = categories.find(c => c.id === e.categoryId);
      const sub = cat?.subcategories.find(s => s.id === e.subcategoryId);
      const proj = projects.find(p => p.id === e.projectId);
      return [e.date, cat?.name, sub?.name, e.description, e.vendor, e.amount, e.paymentMethod, e.status, proj?.name || '', (e.tags || []).join('; ')];
    });
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `tdc-expenses-${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-tdc-gray-800">Expense Tracker</h2>
          <p className="text-sm text-tdc-gray-500">{filteredExpenses.length} expenses totaling {formatCurrency(sumExpenses(filteredExpenses))}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-tdc-gray-300 rounded-lg text-tdc-gray-700 hover:bg-tdc-gray-50">
            <Download size={14} /> Export CSV
          </button>
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-tdc-gold text-white rounded-lg hover:bg-tdc-gold-light shadow-sm">
            <Plus size={14} /> Add Expense
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-tdc-gray-200 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tdc-gray-400" />
            <input type="text" placeholder="Search expenses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-tdc-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tdc-gold/20 focus:border-tdc-gold" />
          </div>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-tdc-gold/20">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-tdc-gold/20">
            <option value="all">All Statuses</option>
            {EXPENSE_STATUSES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={filterDuration} onChange={e => setFilterDuration(e.target.value)}
            className="px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-tdc-gold/20">
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Add Expense Form */}
      {showAddForm && (
        <ExpenseForm categories={categories} projects={projects} onSave={(exp) => { addExpense(exp); setShowAddForm(false); }} onCancel={() => setShowAddForm(false)} />
      )}

      {/* Expense Table */}
      <div className="bg-white rounded-xl border border-tdc-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-tdc-gray-50 border-b border-tdc-gray-200">
                {[
                  { key: 'date', label: 'Date' },
                  { key: 'description', label: 'Description' },
                  { key: 'categoryId', label: 'Category' },
                  { key: 'vendor', label: 'Vendor' },
                  { key: 'amount', label: 'Amount', align: 'right' },
                  { key: 'status', label: 'Status' },
                ].map(col => (
                  <th key={col.key} onClick={() => handleSort(col.key)}
                    className={`py-2.5 px-3 text-tdc-gray-600 font-medium cursor-pointer hover:text-tdc-gray-900 select-none ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                    <span className="inline-flex items-center gap-1">{col.label} <SortIcon field={col.key} /></span>
                  </th>
                ))}
                <th className="py-2.5 px-3 text-tdc-gray-600 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-tdc-gray-400">No expenses found</td></tr>
              ) : filteredExpenses.map(exp => {
                const cat = categories.find(c => c.id === exp.categoryId);
                const statusObj = EXPENSE_STATUSES.find(s => s.id === exp.status);
                return (
                  <tr key={exp.id} className="border-b border-tdc-gray-100 hover:bg-tdc-gray-50">
                    <td className="py-2.5 px-3 text-tdc-gray-600 whitespace-nowrap">{exp.date}</td>
                    <td className="py-2.5 px-3 max-w-[250px] truncate" title={exp.description}>{exp.description}</td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat?.color }} />
                        {cat?.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-tdc-gray-600">{exp.vendor}</td>
                    <td className="py-2.5 px-3 text-right font-medium">{formatCurrency(exp.amount)}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: (statusObj?.color || '#A5A6A5') + '20', color: statusObj?.color }}>
                        {statusObj?.name || exp.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditingId(exp.id)} className="p-1 text-tdc-gray-400 hover:text-tdc-gold rounded"><Edit3 size={14} /></button>
                        <button onClick={() => handleDelete(exp.id)} className={`p-1 rounded ${confirmDelete === exp.id ? 'text-tdc-red bg-tdc-gray-100' : 'text-tdc-gray-400 hover:text-tdc-red'}`}>
                          {confirmDelete === exp.id ? <Check size={14} /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <ExpenseForm
          expense={expenses.find(e => e.id === editingId)}
          categories={categories}
          projects={projects}
          onSave={(exp) => { updateExpense(exp); setEditingId(null); }}
          onCancel={() => setEditingId(null)}
          isEditing
        />
      )}
    </div>
  );
}

function ExpenseForm({ expense, categories, projects, onSave, onCancel, isEditing = false }) {
  const [form, setForm] = useState({
    id: expense?.id || generateId(),
    date: expense?.date || new Date().toISOString().split('T')[0],
    categoryId: expense?.categoryId || categories[0]?.id || '',
    subcategoryId: expense?.subcategoryId || '',
    itemId: expense?.itemId || '',
    projectId: expense?.projectId || '',
    amount: expense?.amount || '',
    vendor: expense?.vendor || '',
    description: expense?.description || '',
    paymentMethod: expense?.paymentMethod || 'credit-card',
    status: expense?.status || 'pending',
    receiptId: expense?.receiptId || null,
    tags: expense?.tags || [],
  });
  const [tagInput, setTagInput] = useState('');

  const selectedCategory = categories.find(c => c.id === form.categoryId);
  const subcategories = selectedCategory?.subcategories || [];
  const selectedSub = subcategories.find(s => s.id === form.subcategoryId);
  const items = selectedSub?.items || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.amount || !form.categoryId) return;
    onSave({ ...form, amount: Number(form.amount) });
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-tdc-gray-200">
          <h3 className="font-semibold text-tdc-gray-900">{isEditing ? 'Edit Expense' : 'Add New Expense'}</h3>
          <button onClick={onCancel} className="text-tdc-gray-400 hover:text-tdc-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Date *</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tdc-gold/20" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Amount *</label>
              <input type="number" step="0.01" min="0" placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tdc-gold/20" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Category *</label>
            <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value, subcategoryId: '', itemId: '' }))}
              className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-tdc-gold/20" required>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {subcategories.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Subcategory</label>
              <select value={form.subcategoryId} onChange={e => setForm(f => ({ ...f, subcategoryId: e.target.value, itemId: '' }))}
                className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-tdc-gold/20">
                <option value="">Select subcategory</option>
                {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
          {items.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Budget Line Item</label>
              <select value={form.itemId} onChange={e => setForm(f => ({ ...f, itemId: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-tdc-gold/20">
                <option value="">Select item</option>
                {items.map(i => <option key={i.id} value={i.id}>{i.name} ({formatCurrency(i.budget)})</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Vendor</label>
            <input type="text" placeholder="Vendor name" value={form.vendor} onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tdc-gold/20" />
          </div>
          <div>
            <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Description</label>
            <textarea rows={2} placeholder="Expense description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tdc-gold/20 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Payment Method</label>
              <select value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-tdc-gold/20">
                {PAYMENT_METHODS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-tdc-gold/20">
                {EXPENSE_STATUSES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Project (optional)</label>
            <select value={form.projectId} onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-tdc-gold/20">
              <option value="">No project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Tags</label>
            <div className="flex gap-2">
              <input type="text" placeholder="Add tag" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tdc-gold/20" />
              <button type="button" onClick={addTag} className="px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg text-tdc-gray-600 hover:bg-tdc-gray-50">Add</button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-tdc-gray-100 rounded-full text-tdc-gray-600">
                    {tag}
                    <button type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))}><X size={10} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-tdc-gray-200">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border border-tdc-gray-300 rounded-lg text-tdc-gray-700 hover:bg-tdc-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-tdc-gold text-white rounded-lg hover:bg-tdc-gold-light shadow-sm">{isEditing ? 'Save Changes' : 'Add Expense'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
