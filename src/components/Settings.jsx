import { useState, useRef, useMemo } from 'react';
import { useBudget } from '../store/BudgetContext';
import { Database, Upload, Download, Trash2, RefreshCw, AlertTriangle, Check, Info } from 'lucide-react';

export default function Settings() {
  const { expenses, projects, receipts, exportData, importData, resetToSample, clearAll } = useBudget();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const fileRef = useRef(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `tdc-budget-data-${new Date().toISOString().split('T')[0]}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.expenses || data.projects || data.receipts) {
          importData(data);
          setImportStatus({ type: 'success', message: `Imported ${data.expenses?.length || 0} expenses, ${data.projects?.length || 0} projects, ${data.receipts?.length || 0} receipts` });
        } else {
          setImportStatus({ type: 'error', message: 'Invalid data format. Expected {expenses, projects, receipts}.' });
        }
      } catch (err) {
        setImportStatus({ type: 'error', message: 'Failed to parse JSON file.' });
      }
      setTimeout(() => setImportStatus(null), 5000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const storageUsed = useMemo(() => {
    try {
      const data = localStorage.getItem('tdc-budget-tracker-v1');
      return data ? (new Blob([data]).size / 1024).toFixed(1) : '0';
    } catch { return '?'; }
  }, [expenses, projects, receipts]);

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-semibold text-tdc-gray-800">Settings & Data Management</h2>

      {/* Data Summary */}
      <div className="bg-white rounded-xl border border-tdc-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-tdc-gray-800 mb-4 flex items-center gap-2"><Database size={16} />Data Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-tdc-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-tdc-gray-900">{expenses.length}</div>
            <div className="text-xs text-tdc-gray-500">Expenses</div>
          </div>
          <div className="bg-tdc-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-tdc-gray-900">{projects.length}</div>
            <div className="text-xs text-tdc-gray-500">Projects</div>
          </div>
          <div className="bg-tdc-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-tdc-gray-900">{receipts.length}</div>
            <div className="text-xs text-tdc-gray-500">Receipts</div>
          </div>
          <div className="bg-tdc-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-tdc-gray-900">{storageUsed}KB</div>
            <div className="text-xs text-tdc-gray-500">Storage Used</div>
          </div>
        </div>
      </div>

      {/* Data Operations */}
      <div className="bg-white rounded-xl border border-tdc-gray-200 p-5 shadow-sm space-y-4">
        <h3 className="font-semibold text-tdc-gray-800">Data Operations</h3>

        <div className="flex items-center justify-between p-3 bg-tdc-gray-50 rounded-lg">
          <div>
            <div className="text-sm font-medium text-tdc-gray-700">Export Data</div>
            <div className="text-xs text-tdc-gray-500">Download all data as JSON (backup)</div>
          </div>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-tdc-gold text-white rounded-lg hover:bg-tdc-gold-light">
            <Download size={14} /> Export JSON
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-tdc-gray-50 rounded-lg">
          <div>
            <div className="text-sm font-medium text-tdc-gray-700">Import Data</div>
            <div className="text-xs text-tdc-gray-500">Load data from a JSON backup file</div>
          </div>
          <div>
            <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-tdc-gray-300 rounded-lg text-tdc-gray-700 hover:bg-white">
              <Upload size={14} /> Import JSON
            </button>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </div>
        </div>

        {importStatus && (
          <div className={`p-3 rounded-lg text-sm ${importStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {importStatus.type === 'success' ? <Check size={14} className="inline mr-1" /> : <AlertTriangle size={14} className="inline mr-1" />}
            {importStatus.message}
          </div>
        )}

        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div>
            <div className="text-sm font-medium text-amber-800">Reset to Sample Data</div>
            <div className="text-xs text-amber-600">Replace current data with built-in sample data</div>
          </div>
          {showConfirmReset ? (
            <div className="flex gap-2">
              <button onClick={() => setShowConfirmReset(false)} className="px-3 py-2 text-sm border border-tdc-gray-300 rounded-lg">Cancel</button>
              <button onClick={() => { resetToSample(); setShowConfirmReset(false); }} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-amber-500 text-white rounded-lg">
                <RefreshCw size={14} /> Confirm Reset
              </button>
            </div>
          ) : (
            <button onClick={() => setShowConfirmReset(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-amber-300 rounded-lg text-amber-700 hover:bg-amber-100">
              <RefreshCw size={14} /> Reset
            </button>
          )}
        </div>

        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
          <div>
            <div className="text-sm font-medium text-red-800">Clear All Data</div>
            <div className="text-xs text-red-600">Permanently delete all expenses, projects, and receipts</div>
          </div>
          {showConfirmClear ? (
            <div className="flex gap-2">
              <button onClick={() => setShowConfirmClear(false)} className="px-3 py-2 text-sm border border-tdc-gray-300 rounded-lg">Cancel</button>
              <button onClick={() => { clearAll(); setShowConfirmClear(false); }} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-red-500 text-white rounded-lg">
                <Trash2 size={14} /> Confirm Delete
              </button>
            </div>
          ) : (
            <button onClick={() => setShowConfirmClear(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-red-300 rounded-lg text-red-700 hover:bg-red-100">
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-xl border border-tdc-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-tdc-gray-800 mb-3 flex items-center gap-2"><Info size={16} />About</h3>
        <div className="text-sm text-tdc-gray-600 space-y-2">
          <p>TDC Expert Team Budget Tracker v1.0</p>
          <p>Budget structure based on the 2026 Expert Team Strategic Plan (v2, 12/8/2025).</p>
          <p>Data is stored in your browser's local storage. Use the Export function regularly to back up your data.</p>
          <p className="text-xs text-tdc-gray-400 mt-4">Built for the TDC Expert Team - Todd Walton, Director of Experts</p>
        </div>
      </div>
    </div>
  );
}

