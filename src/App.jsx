import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Insights from "./components/Insights";
import "./App.css";

function AppContent() {
  const { activeTab, darkMode } = useApp();
  return (
    <div className={`app-shell ${darkMode ? "dark" : ""}`}>
      <Sidebar />
      <div className="main-area">
        <Header />
        <main className="page-content">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "transactions" && <Transactions />}
          {activeTab === "insights" && <Insights />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
