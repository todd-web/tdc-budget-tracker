import { useState, useRef } from 'react';
import { useBudget } from '../store/BudgetContext';
import { formatCurrency, formatDate, generateId } from '../utils/helpers';
import { Upload, Image, Link2, Trash2, ExternalLink, X, FileText, Check } from 'lucide-react';

export default function Receipts() {
  const { receipts, expenses, addReceipt, deleteReceipt, updateReceipt, linkReceiptToExpense } = useBudget();
  const [showUpload, setShowUpload] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const fileRef = useRef(null);

  const handleFileUpload = (files) => {
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const receipt = {
          id: generateId(),
          filename: file.name,
          dataUrl: e.target.result,
          driveUrl: null,
          uploadDate: new Date().toISOString(),
          vendor: '',
          amount: null,
          ocrText: '',
          ocrStatus: null,
          linkedExpenseId: null,
          notes: '',
        };
        addReceipt(receipt);
      };
      reader.readAsDataURL(file);
    }
    setShowUpload(false);
  };

  const handleUrlUpload = (url) => {
    if (!url) return;
    const receipt = {
      id: generateId(),
      filename: url.split('/').pop() || 'receipt',
      dataUrl: null,
      driveUrl: url,
      uploadDate: new Date().toISOString(),
      vendor: '',
      amount: null,
      ocrText: '',
      ocrStatus: 'pending',
      linkedExpenseId: null,
      notes: '',
    };
    addReceipt(receipt);
    setShowUpload(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDelete = (id) => {
    if (confirmDelete === id) { deleteReceipt(id); setConfirmDelete(null); }
    else { setConfirmDelete(id); setTimeout(() => setConfirmDelete(null), 3000); }
  };

  const unlinkedExpenses = expenses.filter(e => !e.receiptId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-tdc-gray-800">Receipt Manager</h2>
          <p className="text-sm text-tdc-gray-500">{receipts.length} receipts uploaded, {receipts.filter(r => r.linkedExpenseId).length} linked to expenses</p>
          <p className="text-xs text-tdc-orange mt-1">Google Drive storage and OCR auto-processing coming in Phase 2</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-tdc-blue text-white rounded-lg hover:bg-tdc-blue-light shadow-sm">
          <Upload size={14} /> Upload Receipt
        </button>
      </div>

      {/* Upload Modal */}
      {showUpload && <UploadModal onFileUpload={handleFileUpload} onUrlUpload={handleUrlUpload} onClose={() => setShowUpload(false)} fileRef={fileRef} onDrop={handleDrop} />}

      {/* Receipt Grid */}
      {receipts.length === 0 ? (
        <div className="bg-white rounded-xl border border-tdc-gray-200 p-12 text-center shadow-sm">
          <Image size={48} className="mx-auto text-tdc-gray-300 mb-3" />
          <h3 className="font-medium text-tdc-gray-700 mb-1">No receipts yet</h3>
          <p className="text-sm text-tdc-gray-500 mb-4">Upload receipts via image file or URL to get started</p>
          <button onClick={() => setShowUpload(true)} className="px-4 py-2 text-sm bg-tdc-blue text-white rounded-lg hover:bg-tdc-blue-light">Upload First Receipt</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {receipts.map(receipt => {
            const linkedExpense = receipt.linkedExpenseId ? expenses.find(e => e.id === receipt.linkedExpenseId) : null;
            return (
              <div key={receipt.id} className="bg-white rounded-xl border border-tdc-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Receipt Preview */}
                <div className="h-40 bg-tdc-gray-100 flex items-center justify-center cursor-pointer" onClick={() => setSelectedReceipt(receipt)}>
                  {receipt.dataUrl ? (
                    <img src={receipt.dataUrl} alt={receipt.filename} className="w-full h-full object-cover" />
                  ) : receipt.driveUrl ? (
                    <div className="text-center">
                      <ExternalLink size={24} className="mx-auto text-tdc-gray-400 mb-1" />
                      <span className="text-xs text-tdc-gray-500">External URL</span>
                    </div>
                  ) : (
                    <FileText size={32} className="text-tdc-gray-300" />
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-tdc-gray-800 truncate" title={receipt.filename}>{receipt.filename}</span>
                  </div>
                  <div className="text-xs text-tdc-gray-500">{new Date(receipt.uploadDate).toLocaleDateString()}</div>

                  {receipt.vendor && <div className="text-xs text-tdc-gray-600">Vendor: {receipt.vendor}</div>}
                  {receipt.amount && <div className="text-xs font-medium text-tdc-gray-700">{formatCurrency(receipt.amount)}</div>}

                  {/* Link Status */}
                  {linkedExpense ? (
                    <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg flex items-center gap-1">
                      <Check size={12} /> Linked: {linkedExpense.description?.substring(0, 30)}
                    </div>
                  ) : (
                    <button onClick={() => setShowLinkModal(receipt.id)} className="text-xs text-tdc-blue hover:underline flex items-center gap-1">
                      <Link2 size={12} /> Link to expense
                    </button>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-tdc-gray-100">
                    <EditableField label="Vendor" value={receipt.vendor} onChange={v => updateReceipt({ ...receipt, vendor: v })} />
                    <button onClick={() => handleDelete(receipt.id)} className={`p-1 rounded ${confirmDelete === receipt.id ? 'text-tdc-red bg-red-50' : 'text-tdc-gray-400 hover:text-tdc-red'}`}>
                      {confirmDelete === receipt.id ? <Check size={14} /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-tdc-gray-200">
              <h3 className="font-semibold">Link Receipt to Expense</h3>
              <button onClick={() => setShowLinkModal(null)} className="text-tdc-gray-400 hover:text-tdc-gray-600"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-2">
              {unlinkedExpenses.length === 0 ? (
                <p className="text-sm text-tdc-gray-500 text-center py-4">All expenses already have receipts linked</p>
              ) : unlinkedExpenses.map(exp => (
                <button key={exp.id} onClick={() => { linkReceiptToExpense(showLinkModal, exp.id); setShowLinkModal(null); }}
                  className="w-full text-left p-3 rounded-lg border border-tdc-gray-200 hover:bg-tdc-gray-50 transition-colors">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{exp.description}</span>
                    <span className="text-sm font-medium">{formatCurrency(exp.amount)}</span>
                  </div>
                  <div className="text-xs text-tdc-gray-500 mt-0.5">{exp.date} - {exp.vendor}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Image Preview */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedReceipt(null)}>
          <div className="max-w-3xl max-h-[90vh] overflow-auto bg-white rounded-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3 border-b border-tdc-gray-200">
              <span className="text-sm font-medium">{selectedReceipt.filename}</span>
              <button onClick={() => setSelectedReceipt(null)} className="text-tdc-gray-400 hover:text-tdc-gray-600"><X size={20} /></button>
            </div>
            {selectedReceipt.dataUrl ? (
              <img src={selectedReceipt.dataUrl} alt={selectedReceipt.filename} className="max-w-full" />
            ) : (
              <div className="p-12 text-center text-tdc-gray-500">
                <ExternalLink size={32} className="mx-auto mb-2" />
                <a href={selectedReceipt.driveUrl} target="_blank" rel="noopener noreferrer" className="text-tdc-blue hover:underline">Open external URL</a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function UploadModal({ onFileUpload, onUrlUpload, onClose, fileRef, onDrop }) {
  const [mode, setMode] = useState('file');
  const [url, setUrl] = useState('');

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-5 border-b border-tdc-gray-200">
          <h3 className="font-semibold">Upload Receipt</h3>
          <button onClick={onClose} className="text-tdc-gray-400 hover:text-tdc-gray-600"><X size={20} /></button>
        </div>
        <div className="p-5">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setMode('file')} className={`flex-1 py-2 text-sm rounded-lg ${mode === 'file' ? 'bg-tdc-blue text-white' : 'bg-tdc-gray-100 text-tdc-gray-600'}`}>
              <Image size={14} className="inline mr-1.5" />Upload File
            </button>
            <button onClick={() => setMode('url')} className={`flex-1 py-2 text-sm rounded-lg ${mode === 'url' ? 'bg-tdc-blue text-white' : 'bg-tdc-gray-100 text-tdc-gray-600'}`}>
              <Link2 size={14} className="inline mr-1.5" />URL
            </button>
          </div>

          {mode === 'file' ? (
            <div onDragOver={e => e.preventDefault()} onDrop={onDrop}
              className="border-2 border-dashed border-tdc-gray-300 rounded-xl p-8 text-center hover:border-tdc-blue transition-colors cursor-pointer"
              onClick={() => fileRef.current?.click()}>
              <Upload size={32} className="mx-auto text-tdc-gray-400 mb-2" />
              <p className="text-sm text-tdc-gray-600 mb-1">Drag and drop or click to browse</p>
              <p className="text-xs text-tdc-gray-400">JPG, PNG, PDF up to 10MB</p>
              <input ref={fileRef} type="file" multiple accept="image/*,.pdf" className="hidden"
                onChange={e => e.target.files?.length && onFileUpload(e.target.files)} />
            </div>
          ) : (
            <div className="space-y-3">
              <input type="url" placeholder="https://drive.google.com/..." value={url} onChange={e => setUrl(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-tdc-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tdc-blue/20" />
              <button onClick={() => onUrlUpload(url)} disabled={!url} className="w-full py-2 text-sm bg-tdc-blue text-white rounded-lg hover:bg-tdc-blue-light disabled:opacity-50">
                Add Receipt from URL
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EditableField({ label, value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value || '');

  if (editing) {
    return (
      <input autoFocus type="text" value={val} onChange={e => setVal(e.target.value)}
        onBlur={() => { onChange(val); setEditing(false); }}
        onKeyDown={e => { if (e.key === 'Enter') { onChange(val); setEditing(false); } }}
        className="text-xs px-2 py-1 border border-tdc-gray-200 rounded w-28 focus:outline-none focus:ring-1 focus:ring-tdc-blue/20" />
    );
  }
  return (
    <button onClick={() => setEditing(true)} className="text-xs text-tdc-gray-500 hover:text-tdc-blue">
      {value || `Add ${label.toLowerCase()}`}
    </button>
  );
}
