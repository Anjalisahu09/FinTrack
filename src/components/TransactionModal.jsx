import { useState } from "react";
import { X } from "lucide-react";
import { useApp } from "../context/AppContext";

const categories = ["Food", "Housing", "Entertainment", "Utilities", "Transport", "Shopping", "Health", "Income", "Other"];

const empty = { description: "", amount: "", category: "Food", type: "expense", date: new Date().toISOString().split("T")[0] };

export default function TransactionModal({ onClose, existing }) {
  const { addTransaction, editTransaction } = useApp();
  const [form, setForm] = useState(existing || empty);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = "Enter valid amount";
    if (!form.date) e.date = "Required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const tx = {
      ...form,
      amount: form.type === "expense" ? -Math.abs(Number(form.amount)) : Math.abs(Number(form.amount)),
    };
    if (existing) editTransaction({ ...tx, id: existing.id });
    else addTransaction(tx);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div className="modal-title">{existing ? "Edit Transaction" : "Add Transaction"}</div>
          <button onClick={onClose} className="icon-btn"><X size={16} /></button>
        </div>

        <div className="form-row">
          <label className="form-label">Description</label>
          <input className="form-input" value={form.description} onChange={e => set("description", e.target.value)} placeholder="e.g. Grocery shopping" />
          {errors.description && <div style={{ color: "var(--expense)", fontSize: 11, marginTop: 4 }}>{errors.description}</div>}
        </div>

        <div className="form-row-2">
          <div className="form-row" style={{ marginBottom: 0 }}>
            <label className="form-label">Amount (₹)</label>
            <input className="form-input" type="number" value={form.amount} onChange={e => set("amount", e.target.value)} placeholder="0.00" min="0" />
            {errors.amount && <div style={{ color: "var(--expense)", fontSize: 11, marginTop: 4 }}>{errors.amount}</div>}
          </div>
          <div className="form-row" style={{ marginBottom: 0 }}>
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
            {errors.date && <div style={{ color: "var(--expense)", fontSize: 11, marginTop: 4 }}>{errors.date}</div>}
          </div>
        </div>

        <div className="form-row-2" style={{ marginTop: 16 }}>
          <div className="form-row" style={{ marginBottom: 0 }}>
            <label className="form-label">Type</label>
            <select className="form-input" value={form.type} onChange={e => set("type", e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-row" style={{ marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <select className="form-input" value={form.category} onChange={e => set("category", e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>{existing ? "Save Changes" : "Add Transaction"}</button>
        </div>
      </div>
    </div>
  );
}
