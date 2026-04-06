import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { monthlyData, categoryColors } from "../data/mockData";

function fmt(n) {
  return "₹" + Math.abs(n).toLocaleString("en-IN");
}

function SummaryCards() {
  const { balance, totalIncome, totalExpenses } = useApp();
  return (
    <div className="summary-grid">
      <div className="summary-card balance">
        <div className="card-label">Total Balance</div>
        <div className="card-value">{fmt(balance)}</div>
        <div className="card-sub" style={{ color: "#777" }}>Available funds</div>
        <div className="card-icon"><Wallet size={64} /></div>
      </div>
      <div className="summary-card">
        <div className="card-label">Total Income</div>
        <div className="card-value income">{fmt(totalIncome)}</div>
        <div className="card-sub">All time earnings</div>
        <div className="card-icon" style={{ color: "#22c55e" }}><TrendingUp size={64} /></div>
      </div>
      <div className="summary-card">
        <div className="card-label">Total Expenses</div>
        <div className="card-value expense">{fmt(totalExpenses)}</div>
        <div className="card-sub">All time spending</div>
        <div className="card-icon" style={{ color: "#f43f5e" }}><TrendingDown size={64} /></div>
      </div>
    </div>
  );
}

function BalanceTrend() {
  return (
    <div className="chart-card">
      <div className="chart-title">Balance Trend</div>
      <div className="chart-sub">Monthly income vs expenses</div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={monthlyData}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13 }} />
          <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
          <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fill="url(#expenseGrad)" name="Expenses" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function SpendingBreakdown() {
  const { transactions } = useApp();
  const expenseByCategory = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + Math.abs(t.amount);
  });
  const data = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const colors = Object.values(categoryColors).slice(1);

  return (
    <div className="chart-card">
      <div className="chart-title">Spending Breakdown</div>
      <div className="chart-sub">By category</div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
            {data.map((entry, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function RecentTransactions() {
  const { transactions, setActiveTab } = useApp();
  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  return (
    <div className="chart-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div className="chart-title">Recent Transactions</div>
          <div className="chart-sub" style={{ marginBottom: 0 }}>Latest activity</div>
        </div>
        <button onClick={() => setActiveTab("transactions")} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 12 }}>
          View all <ArrowUpRight size={12} />
        </button>
      </div>
      {recent.map(t => (
        <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{t.description}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.category} · {new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
          </div>
          <div style={{ fontWeight: 700, fontFamily: "var(--font-display)", color: t.type === "income" ? "var(--income)" : "var(--expense)", fontSize: 15 }}>
            {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div>
      <SummaryCards />
      <div className="charts-grid">
        <BalanceTrend />
        <SpendingBreakdown />
      </div>
      <RecentTransactions />
    </div>
  );
}
