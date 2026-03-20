import { useState } from 'react';
import { BudgetProvider } from './store/BudgetContext';
import Dashboard from './components/Dashboard';
import Budget from './components/Budget';
import Expenses from './components/Expenses';
import Receipts from './components/Receipts';
import Reports from './components/Reports';
import Projects from './components/Projects';
import Optimize from './components/Optimize';
import Settings from './components/Settings';
import { LayoutDashboard, Wallet, Receipt, FileText, FolderKanban, PieChart, Lightbulb, Settings as SettingsIcon } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'budget', label: 'Budget', icon: PieChart },
  { id: 'expenses', label: 'Expenses', icon: Wallet },
  { id: 'receipts', label: 'Receipts', icon: Receipt },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'optimize', label: 'Optimize', icon: Lightbulb },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-tdc-gray-50">
      {/* Header - TDC Brand: Black + Gold */}
      <header className="bg-tdc-black text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={import.meta.env.BASE_URL + 'tdc-logo.png'} alt="The Desire Company" className="h-10" />
              <div>
                <h1 className="text-xl font-bold tracking-tight">Expert Team Budget Tracker</h1>
                <p className="text-sm text-tdc-gray-400 mt-0.5">2026 Strategic Plan</p>
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="text-tdc-gray-400">Fiscal Year 2026</div>
              <div className="text-tdc-gold font-semibold">Operational / Recruitment / Engagement</div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-tdc-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto py-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-tdc-black text-tdc-gold shadow-sm'
                      : 'text-tdc-gray-600 hover:text-tdc-gray-900 hover:bg-tdc-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="animate-fade-in">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'budget' && <Budget />}
          {activeTab === 'expenses' && <Expenses />}
          {activeTab === 'receipts' && <Receipts />}
          {activeTab === 'projects' && <Projects />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'optimize' && <Optimize />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-tdc-black border-t border-tdc-gray-800 py-3 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-tdc-gray-500">
          TDC Expert Team Budget Tracker v1.1 - The Desire Company
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BudgetProvider>
      <AppContent />
    </BudgetProvider>
  );
}
