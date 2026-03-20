import { useState } from 'react';
import { useBudget } from '../store/BudgetContext';
import { formatCurrency, sumExpenses, getPercentage, getStatusColor, generateId } from '../utils/helpers';
import { Plus, FolderOpen, Trash2, Edit3, X, Check, Calendar, DollarSign } from 'lucide-react';

const PROJECT_STATUSES = [
  { id: 'planned', name: 'Planned', color: '#A5A6A5' },
  { id: 'active', name: 'Active', color: '#A48450' },
  { id: 'completed', name: 'Completed', color: '#10b981' },
  { id: 'cancelled', name: 'Cancelled', color: '#ef4444' },
];

export default function Projects() {
  const { projects, expenses, categories, addProject, updateProject, deleteProject } = useBudget();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredProjects = filterStatus === 'all' ? projects : projects.filter(p => p.status === filterStatus);

  const handleDelete = (id) => {
    if (confirmDelete === id) { deleteProject(id); setConfirmDelete(null); }
    else { setConfirmDelete(id); setTimeout(() => setConfirmDelete(null), 3000); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-tdc-gray-800">Project Tracking</h2>
          <p className="text-sm text-tdc-gray-500">{projects.length} projects, {projects.filter(p => p.status === 'active').length} active</p>
        </div>
        <div className="flex gap-2">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg bg-white">
            <option value="all">All Statuses</option>
            {PROJECT_STATUSES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-tdc-gold text-white rounded-lg hover:bg-tdc-gold-light shadow-sm">
            <Plus size={14} /> Add Project
          </button>
        </div>
      </div>

      {showAddForm && (
        <ProjectForm categories={categories} onSave={(p) => { addProject(p); setShowAddForm(false); }} onCancel={() => setShowAddForm(false)} />
      )}

      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-tdc-gray-200 p-12 text-center shadow-sm">
          <FolderOpen size={48} className="mx-auto text-tdc-gray-300 mb-3" />
          <h3 className="font-medium text-tdc-gray-700 mb-1">No projects found</h3>
          <p className="text-sm text-tdc-gray-500">Create a project to start tracking expenses by initiative</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map(project => {
            const projExpenses = expenses.filter(e => e.projectId === project.id);
            const spent = sumExpenses(projExpenses);
            const pct = project.budget > 0 ? getPercentage(spent, project.budget) : 0;
            const cat = categories.find(c => c.id === project.categoryId);
            const status = PROJECT_STATUSES.find(s => s.id === project.status);

            return (
              <div key={project.id} className="bg-white rounded-xl border border-tdc-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-tdc-gray-900">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {cat && (
                        <span className="inline-flex items-center gap-1 text-xs">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                          {cat.name}
                        </span>
                      )}
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: (status?.color || '#A5A6A5') + '20', color: status?.color }}>
                        {status?.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditingId(project.id)} className="p-1 text-tdc-gray-400 hover:text-tdc-gold rounded"><Edit3 size={14} /></button>
                    <button onClick={() => handleDelete(project.id)} className={`p-1 rounded ${confirmDelete === project.id ? 'text-tdc-red bg-tdc-gray-100' : 'text-tdc-gray-400 hover:text-tdc-red'}`}>
                      {confirmDelete === project.id ? <Check size={14} /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>

                {project.description && <p className="text-sm text-tdc-gray-500 mb-3">{project.description}</p>}

                <div className="flex items-center gap-4 text-xs text-tdc-gray-500 mb-3">
                  {project.startDate && (
                    <span className="flex items-center gap-1"><Calendar size={12} />{project.startDate}{project.endDate && ` - ${project.endDate}`}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-tdc-gray-500 flex items-center gap-1"><DollarSign size={12} />Spent</span>
                    <span className="font-medium">{formatCurrency(spent)}</span>
                  </div>
                  {project.budget > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-tdc-gray-500">Budget</span>
                        <span className="font-medium">{formatCurrency(project.budget)}</span>
                      </div>
                      <div className="w-full bg-tdc-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: getStatusColor(pct) }} />
                      </div>
                      <div className="text-right text-xs text-tdc-gray-400">{pct}% used</div>
                    </>
                  )}
                  <div className="text-xs text-tdc-gray-500">{projExpenses.length} expense{projExpenses.length !== 1 ? 's' : ''}</div>
                </div>

                {/* Recent expenses for this project */}
                {projExpenses.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-tdc-gray-100">
                    <div className="text-xs text-tdc-gray-500 mb-1.5">Recent expenses</div>
                    {projExpenses.slice(-3).reverse().map(exp => (
                      <div key={exp.id} className="flex justify-between text-xs py-0.5">
                        <span className="text-tdc-gray-600 truncate mr-2">{exp.description}</span>
                        <span className="font-medium whitespace-nowrap">{formatCurrency(exp.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {editingId && (
        <ProjectForm
          project={projects.find(p => p.id === editingId)}
          categories={categories}
          onSave={(p) => { updateProject(p); setEditingId(null); }}
          onCancel={() => setEditingId(null)}
          isEditing
        />
      )}
    </div>
  );
}

function ProjectForm({ project, categories, onSave, onCancel, isEditing = false }) {
  const [form, setForm] = useState({
    id: project?.id || generateId(),
    name: project?.name || '',
    categoryId: project?.categoryId || '',
    budget: project?.budget || '',
    description: project?.description || '',
    startDate: project?.startDate || '',
    endDate: project?.endDate || '',
    status: project?.status || 'planned',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return;
    onSave({ ...form, budget: Number(form.budget) || 0 });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-5 border-b border-tdc-gray-200">
          <h3 className="font-semibold">{isEditing ? 'Edit Project' : 'New Project'}</h3>
          <button onClick={onCancel} className="text-tdc-gray-400 hover:text-tdc-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Project Name *</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g., Expert Office Hours Q1" className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tdc-gold/20" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Category</label>
              <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg bg-white">
                <option value="">None</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Budget</label>
              <input type="number" step="0.01" min="0" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                placeholder="0.00" className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tdc-gold/20" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Description</label>
            <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tdc-gold/20 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tdc-gold/20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-tdc-gray-600 mb-1">End Date</label>
              <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tdc-gold/20" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-tdc-gray-600 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg bg-white">
              {PROJECT_STATUSES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-tdc-gray-200">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border border-tdc-gray-300 rounded-lg text-tdc-gray-700 hover:bg-tdc-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-tdc-gold text-white rounded-lg hover:bg-tdc-gold-light shadow-sm">{isEditing ? 'Save' : 'Create Project'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
