import { Moon, Sun, Bell } from "lucide-react";
import { useApp } from "../context/AppContext";

const titles = { dashboard: "Dashboard", transactions: "Transactions", insights: "Insights" };

export default function Header() {
  const { activeTab, darkMode, setDarkMode, role } = useApp();
  const now = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return (
    <header className="header">
      <div>
        <div className="header-title">
          {titles[activeTab]}
          <span>{now}</span>
        </div>
      </div>
      <div className="header-actions">
        <div style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8, background: role === "admin" ? "#fef9c3" : "#f0fdf4", color: role === "admin" ? "#854d0e" : "#166534", fontWeight: 600 }}>
          {role === "admin" ? "Admin" : role === "analyst"? "Analyst" : "Viewer"}
        </div>
        <button className={`icon-btn ${darkMode ? "active" : ""}`} onClick={() => setDarkMode(!darkMode)} title="Toggle dark mode">
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button className="icon-btn" title="Notifications">
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}
