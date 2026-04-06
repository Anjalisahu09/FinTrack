import { LayoutDashboard, ArrowLeftRight, Lightbulb, TrendingUp } from "lucide-react";
import { useApp } from "../context/AppContext";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "insights", label: "Insights", icon: Lightbulb },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, role, setRole } = useApp();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo"><TrendingUp size={18} style={{ display: "inline", marginRight: 6 }} /><span>Fin</span>Track</div>
      <div className="sidebar-tagline">Personal Finance Manager</div>
      <div className="nav-section-label">Menu</div>
      {navItems.map(({ id, label, icon: Icon }) => (
        <div key={id} className={`nav-item ${activeTab === id ? "active" : ""}`} onClick={() => setActiveTab(id)}>
          <Icon size={16} /> {label}
        </div>
      ))}
      <div className="sidebar-spacer" />
      <div className="role-badge">
        <strong>Current Role</strong>
        <select className="role-select" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="analyst">Analyst</option>
          <option value="viewer">Viewer</option>
        </select>
        <div style={{ marginTop: 8, fontSize: 11, color: "#555" }}>
          {role === "admin" ? "Can manage transactions" : role === "analyst" ? "Can access insight and read transaction" : "Read-only access"}
        </div>
      </div>
    </aside>
  );
}
