import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import Topbar from "./components/Layout/Topbar";
import TasksPage from "./pages/TasksPage";
import LearningsPage from "./pages/LearningsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import DashboardPage from "./pages/DashboardPage";
import RemindersPage from "./pages/RemindersPage";
import ArchitecturePage from "./pages/ArchitecturePage";
import NotesPage from "./pages/NotesPage";
import { useNotifications } from "./hooks/useNotifications";
import { useStore } from "./store/useStore";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useStore((state) => state.isSidebarCollapsed);

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar />
      <main
        className={`flex-1 ${isSidebarCollapsed ? "md:ml-20" : "md:ml-64"} flex flex-col min-h-screen relative w-full max-w-full overflow-hidden transition-all duration-300`}
      >
        <Topbar />
        <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  useNotifications();

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/learnings" element={<LearningsPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
