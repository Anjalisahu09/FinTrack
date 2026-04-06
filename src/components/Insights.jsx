import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { useApp } from "../context/AppContext";
import { monthlyData, categoryColors } from "../data/mockData";
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

function fmt(n) { return "₹" + Math.abs(n).toLocaleString("en-IN"); }

export default function Insights() {
  const { transactions, totalIncome, totalExpenses } = useApp();

  // Spending by category
  const expenseByCategory = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + Math.abs(t.amount);
  });
  const sortedCategories = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0] || ["N/A", 0];
  const colors = Object.values(categoryColors).slice(1);

  // Monthly comparison
  const lastMonth = monthlyData[monthlyData.length - 2];
  const thisMonth = monthlyData[monthlyData.length - 1];
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0;
  const avgMonthlyExpense = (monthlyData.reduce((s, m) => s + m.expenses, 0) / monthlyData.length).toFixed(0);

  const observations = [
    { icon: TrendingUp, color: "#22c55e", text: `Your top spending category is ${topCategory[0]} at ${fmt(topCategory[1])}` },
    { icon: CheckCircle, color: "#3b82f6", text: `Savings rate: ${savingsRate}% of total income saved` },
    { icon: AlertCircle, color: "#f59e0b", text: `Average monthly expense: ${fmt(Number(avgMonthlyExpense))}` },
    {
      icon: thisMonth.expenses < lastMonth.expenses ? CheckCircle : AlertCircle,
      color: thisMonth.expenses < lastMonth.expenses ? "#22c55e" : "#f43f5e",
      text: `Expenses ${thisMonth.expenses < lastMonth.expenses ? "decreased" : "increased"} ${Math.abs(((thisMonth.expenses - lastMonth.expenses) / lastMonth.expenses) * 100).toFixed(1)}% vs last month`
    },
  ];

  return (
    <div>
      {/* Key metrics */}
      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-label">Top Spending Category</div>
          <div className="insight-value" style={{ color: "#f97316" }}>{topCategory[0]}</div>
          <div className="insight-sub">{fmt(topCategory[1])} total spent</div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: "100%", background: "#f97316" }} /></div>
        </div>
        <div className="insight-card">
          <div className="insight-label">Savings Rate</div>
          <div className="insight-value" style={{ color: "#22c55e" }}>{savingsRate}%</div>
          <div className="insight-sub">Of total income</div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${savingsRate}%`, background: "#22c55e" }} /></div>
        </div>
        <div className="insight-card">
          <div className="insight-label">Expense vs Income Ratio</div>
          <div className="insight-value" style={{ color: "#f43f5e" }}>
            {totalIncome > 0 ? (totalExpenses / totalIncome * 100).toFixed(1) : 0}%
          </div>
          <div className="insight-sub">Of income spent</div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min(totalExpenses / totalIncome * 100, 100)}%`, background: "#f43f5e" }} /></div>
        </div>
      </div>

      {/* Monthly comparison chart */}
      <div className="chart-card" style={{ marginBottom: 16 }}>
        <div className="chart-title">Monthly Income vs Expenses</div>
        <div className="chart-sub">7-month comparison</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13 }} />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="Income" />
            <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Savings trend */}
      <div className="chart-card" style={{ marginBottom: 16 }}>
        <div className="chart-title">Savings Trend</div>
        <div className="chart-sub">Monthly net savings</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13 }} />
            <Line type="monotone" dataKey="balance" stroke="#c8f135" strokeWidth={3} dot={{ fill: "#c8f135", r: 5 }} name="Net Savings" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown */}
      <div className="chart-card" style={{ marginBottom: 16 }}>
        <div className="chart-title">Spending by Category</div>
        <div className="chart-sub">All time breakdown</div>
        {sortedCategories.map(([cat, amount], i) => (
          <div key={cat} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
              <span style={{ fontWeight: 500 }}>{cat}</span>
              <span style={{ color: "var(--text-muted)" }}>{fmt(amount)}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(amount / sortedCategories[0][1]) * 100}%`, background: colors[i % colors.length] }} />
            </div>
          </div>
        ))}
      </div>

      {/* Observations */}
      <div className="chart-card">
        <div className="chart-title" style={{ marginBottom: 16 }}>Key Observations</div>
        {observations.map(({ icon: Icon, color, text }, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: i < observations.length - 1 ? "1px solid var(--border)" : "none" }}>
            <Icon size={18} style={{ color, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
