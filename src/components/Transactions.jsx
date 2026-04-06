import { useState } from "react";
import { Plus, Search, Trash2, Pencil, Download } from "lucide-react";
import { useApp } from "../context/AppContext";
import TransactionModal from "./TransactionModal";

const categories = ["All", "Food", "Housing", "Entertainment", "Utilities", "Transport", "Shopping", "Health", "Income", "Other"];

function fmt(n) { return "₹" + Math.abs(n).toLocaleString("en-IN"); }

export default function Transactions() {
  const { filteredTransactions, filters, setFilters, deleteTransaction, role } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleExport = () => {
    const csv = ["Date,Description,Category,Type,Amount",
      ...filteredTransactions.map(t => `${t.date},${t.description},${t.category},${t.type},${t.amount}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="tx-toolbar">
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input className="tx-search" style={{ paddingLeft: 34 }} placeholder="Search transactions..." value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
        </div>
        <select className="tx-select" value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="tx-select" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
          <option value="All">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="tx-select" value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
        <button className="icon-btn" onClick={handleExport} title="Export CSV"><Download size={16} /></button>
        {role === "admin" && (
          <button className="btn-primary" onClick={() => { setEditTx(null); setShowModal(true); }}>
            <Plus size={15} /> Add
          </button>
        )}
      </div>

      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
        Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""}
      </div>

      <div className="tx-table-wrap">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <Search size={32} />
            <p>No transactions found. Try adjusting your filters.</p>
          </div>
        ) : (
          <table className="tx-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th style={{ textAlign: "right" }}>Amount</th>
                {role === "admin" && <th style={{ textAlign: "right" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => (
                <tr key={t.id}>
                  <td style={{ color: "var(--text-muted)", fontSize: 13 }}>
                    {new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ fontWeight: 500 }}>{t.description}</td>
                  <td><span className="cat-pill">{t.category}</span></td>
                  <td><span className={`tx-badge ${t.type}`}>{t.type}</span></td>
                  <td style={{ textAlign: "right", fontWeight: 700, fontFamily: "var(--font-display)", color: t.type === "income" ? "var(--income)" : "var(--expense)" }}>
                    {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                  </td>
                  {role === "admin" && (
                    <td style={{ textAlign: "right" }}>
                      <button className="btn-edit" onClick={() => { setEditTx(t); setShowModal(true); }}><Pencil size={12} /></button>
                      <button className="btn-danger" onClick={() => setConfirmDelete(t.id)}><Trash2 size={12} /></button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && <TransactionModal onClose={() => { setShowModal(false); setEditTx(null); }} existing={editTx} />}

      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 360 }}>
            <div className="modal-title">Delete Transaction?</div>
            <p style={{ color: "var(--text-secondary)", marginBottom: 20, fontSize: 14 }}>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: "var(--expense)", color: "white", cursor: "pointer", fontWeight: 600 }}
                onClick={() => { deleteTransaction(confirmDelete); setConfirmDelete(null); }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
