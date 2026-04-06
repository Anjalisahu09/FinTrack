import { createContext, useContext, useState, useReducer } from "react";
import { transactions as initialTransactions } from "../data/mockData";

const AppContext = createContext(null);

function transactionReducer(state, action) {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return [{ ...action.payload, id: Date.now() }, ...state];
    case "DELETE_TRANSACTION":
      return state.filter((t) => t.id !== action.id);
    case "EDIT_TRANSACTION":
      return state.map((t) => (t.id === action.payload.id ? action.payload : t));
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [role, setRole] = useState("viewer");
  const [transactions, dispatch] = useReducer(transactionReducer, initialTransactions);
  const [filters, setFilters] = useState({ search: "", category: "All", type: "All", sort: "date-desc" });
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const addTransaction = (tx) => dispatch({ type: "ADD_TRANSACTION", payload: tx });
  const deleteTransaction = (id) => dispatch({ type: "DELETE_TRANSACTION", id });
  const editTransaction = (tx) => dispatch({ type: "EDIT_TRANSACTION", payload: tx });

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);
  const balance = totalIncome - totalExpenses;

  const filteredTransactions = transactions
    .filter((t) => {
      const matchSearch = t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase());
      const matchCategory = filters.category === "All" || t.category === filters.category;
      const matchType = filters.type === "All" || t.type === filters.type;
      return matchSearch && matchCategory && matchType;
    })
    .sort((a, b) => {
      if (filters.sort === "date-desc") return new Date(b.date) - new Date(a.date);
      if (filters.sort === "date-asc") return new Date(a.date) - new Date(b.date);
      if (filters.sort === "amount-desc") return Math.abs(b.amount) - Math.abs(a.amount);
      if (filters.sort === "amount-asc") return Math.abs(a.amount) - Math.abs(b.amount);
      return 0;
    });

  return (
    <AppContext.Provider value={{
      role, setRole, transactions, filteredTransactions,
      addTransaction, deleteTransaction, editTransaction,
      filters, setFilters, darkMode, setDarkMode,
      activeTab, setActiveTab,
      totalIncome, totalExpenses, balance,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
