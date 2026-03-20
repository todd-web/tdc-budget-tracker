import { createContext, useContext, useReducer, useEffect } from 'react';
import { CATEGORIES, SAMPLE_EXPENSES, SAMPLE_PROJECTS } from '../data/budgetStructure';

const BudgetContext = createContext(null);
const STORAGE_KEY = 'tdc-budget-tracker-v2';

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        expenses: parsed.expenses || [],
        projects: parsed.projects || [],
        receipts: parsed.receipts || [],
        settings: parsed.settings || { useSampleData: true },
      };
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return null;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      expenses: state.expenses,
      projects: state.projects,
      receipts: state.receipts,
      settings: state.settings,
    }));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

const initialState = loadState() || {
  expenses: SAMPLE_EXPENSES,
  projects: SAMPLE_PROJECTS,
  receipts: [],
  settings: { useSampleData: true },
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
      return { ...state, expenses: state.expenses.map(e => e.id === action.payload.id ? { ...e, ...action.payload } : e) };
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return { ...state, projects: state.projects.map(p => p.id === action.payload.id ? { ...p, ...action.payload } : p) };
    case 'DELETE_PROJECT':
      return { ...state, projects: state.projects.filter(p => p.id !== action.payload) };
    case 'ADD_RECEIPT':
      return { ...state, receipts: [...state.receipts, action.payload] };
    case 'UPDATE_RECEIPT':
      return { ...state, receipts: state.receipts.map(r => r.id === action.payload.id ? { ...r, ...action.payload } : r) };
    case 'DELETE_RECEIPT':
      return { ...state, receipts: state.receipts.filter(r => r.id !== action.payload) };
    case 'LINK_RECEIPT_TO_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(e => e.id === action.payload.expenseId ? { ...e, receiptId: action.payload.receiptId } : e),
        receipts: state.receipts.map(r => r.id === action.payload.receiptId ? { ...r, linkedExpenseId: action.payload.expenseId } : r),
      };
    case 'IMPORT_DATA':
      return { ...state, ...action.payload };
    case 'RESET_TO_SAMPLE':
      return { ...state, expenses: SAMPLE_EXPENSES, projects: SAMPLE_PROJECTS, receipts: [], settings: { useSampleData: true } };
    case 'CLEAR_ALL':
      return { ...state, expenses: [], projects: [], receipts: [], settings: { useSampleData: false } };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    default:
      return state;
  }
}

export function BudgetProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = {
    expenses: state.expenses,
    projects: state.projects,
    receipts: state.receipts,
    settings: state.settings,
    categories: CATEGORIES,
    dispatch,
    // Convenience methods
    addExpense: (expense) => dispatch({ type: 'ADD_EXPENSE', payload: expense }),
    updateExpense: (expense) => dispatch({ type: 'UPDATE_EXPENSE', payload: expense }),
    deleteExpense: (id) => dispatch({ type: 'DELETE_EXPENSE', payload: id }),
    addProject: (project) => dispatch({ type: 'ADD_PROJECT', payload: project }),
    updateProject: (project) => dispatch({ type: 'UPDATE_PROJECT', payload: project }),
    deleteProject: (id) => dispatch({ type: 'DELETE_PROJECT', payload: id }),
    addReceipt: (receipt) => dispatch({ type: 'ADD_RECEIPT', payload: receipt }),
    updateReceipt: (receipt) => dispatch({ type: 'UPDATE_RECEIPT', payload: receipt }),
    deleteReceipt: (id) => dispatch({ type: 'DELETE_RECEIPT', payload: id }),
    linkReceiptToExpense: (receiptId, expenseId) => dispatch({ type: 'LINK_RECEIPT_TO_EXPENSE', payload: { receiptId, expenseId } }),
    importData: (data) => dispatch({ type: 'IMPORT_DATA', payload: data }),
    resetToSample: () => dispatch({ type: 'RESET_TO_SAMPLE' }),
    clearAll: () => dispatch({ type: 'CLEAR_ALL' }),
    exportData: () => JSON.stringify({ expenses: state.expenses, projects: state.projects, receipts: state.receipts }, null, 2),
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudget must be used within BudgetProvider');
  return context;
}
