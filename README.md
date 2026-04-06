# FinTrack — Finance Dashboard UI

A clean, interactive personal finance dashboard built with **React + Vite**.

**Live Demo:** https://Anjalisahu09.github.io/FinTrack

## Features

### Core Requirements ✅
1. **Dashboard Overview** — Summary cards (Balance, Income, Expenses), area chart (balance trend), donut chart (spending breakdown)
2. **Transactions Section** — Full list with date, amount, category, type; search, filter by category/type, sort by date/amount
3. **Role-Based UI** — Viewer (read-only) and Admin (add/edit/delete); toggle via sidebar dropdown
4. **Insights Section** — Top spending category, savings rate, monthly comparison bar chart, category breakdown, key observations
5. **State Management** — React `useReducer` + `useContext` for transactions, filters, role, dark mode

### Optional Enhancements ✅
- Dark mode toggle
- CSV export
- Responsive design (mobile/tablet/desktop)
- Confirmation dialogs for destructive actions
- Form validation for adding transactions

## Tech Stack
- **React 18** + **Vite**
- **Recharts** — charting
- **Lucide React** — icons
- **CSS Variables** — theming (no extra CSS framework)
- **Context API + useReducer** — state management

## Setup & Run

### Prerequisites
- Node.js 18+ installed

### Steps

```bash
# 1.clone the repository
git clone https://github.com/Anjalisahu09/FinTrack.git

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# → http://localhost:5173
```

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx      # Overview with charts & summary cards
│   ├── Transactions.jsx   # Transaction list with filters
│   ├── Insights.jsx       # Analytics & observations
│   ├── Sidebar.jsx        # Navigation + role switcher
│   ├── Header.jsx         # Top bar with dark mode toggle
│   └── TransactionModal.jsx # Add/Edit transaction form
├── context/
│   └── AppContext.jsx     # Global state (Context + useReducer)
├── data/
│   └── mockData.js        # Static mock transactions & chart data
├── App.jsx
└── App.css                # Full design system with CSS variables
```

## Role Behavior

1. Viewer: can view dashboard, export csv file
2. ⁠Analyst: can view dashboard, insight, and export csv file
3. ⁠Admin: can manage transactions, view dashboard and export csv file
   
Switch roles using the dropdown at the bottom of the sidebar.

## Design Decisions
- **Font**: DM Sans — distinctive and readable
- **Color**: Dark sidebar with lime-green accent (#c8f135) for a fintech feel
- **No external CSS framework** — custom design system via CSS variables for full control
