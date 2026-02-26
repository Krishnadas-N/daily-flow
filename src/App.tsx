import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import Topbar from "./components/Layout/Topbar";
import TasksPage from "./pages/TasksPage";
import LearningsPage from "./pages/LearningsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import DashboardPage from "./pages/DashboardPage";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex bg-slate-50 min-h-screen text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">
    <Sidebar />
    <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative w-full max-w-full overflow-hidden">
      <Topbar />
      <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
        {children}
      </div>
    </main>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/learnings" element={<LearningsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
