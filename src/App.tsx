import React, { Suspense, lazy, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import Topbar from "./components/Layout/Topbar";
import { useNotifications } from "./hooks/useNotifications";
import { useStore } from "./store/useStore";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const TasksPage = lazy(() => import("./pages/TasksPage"));
const LearningsPage = lazy(() => import("./pages/LearningsPage"));
const NotesPage = lazy(() => import("./pages/NotesPage"));
const BookmarksPage = lazy(() => import("./pages/BookmarksPage"));
const WorkLogPage = lazy(() => import("./pages/WorkLogPage"));
const RemindersPage = lazy(() => import("./pages/RemindersPage"));
const ArchitecturePage = lazy(() => import("./pages/ArchitecturePage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useStore((state) => state.isSidebarCollapsed);

  return (
    <div className="app-shell flex min-h-screen text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 dark:text-slate-100 dark:selection:bg-indigo-600 dark:selection:text-white">
      <Sidebar />
      <main
        className={`flex-1 ${isSidebarCollapsed ? "md:ml-20" : "md:ml-64"} flex flex-col min-h-screen relative w-full max-w-full overflow-hidden transition-[margin-left] duration-300`}
      >
        <Topbar />
        <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
          <Suspense
            fallback={
              <div className="h-full min-h-[260px] w-full flex items-center justify-center text-sm font-medium text-slate-500 dark:text-slate-400">
                Loading...
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
};

function App() {
  useNotifications();
  const theme = useStore((state) => state.theme);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-changing");
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    requestAnimationFrame(() => {
      root.classList.remove("theme-changing");
    });
  }, [theme]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/learnings" element={<LearningsPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/worklog" element={<WorkLogPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
