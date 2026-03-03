import { useState, useRef } from "react";
import { useStore } from "../../store/useStore";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  BarChart3,
  Menu,
  X,
  Target,
  Bell,
  Network,
  Download,
  Upload,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSidebarCollapsed, toggleSidebarCollapse } = useStore();
  const toggleSidebar = () => setIsOpen(!isOpen);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportAllData = () => {
    const backup = {
      "daily-flow-storage": localStorage.getItem("daily-flow-storage"),
      "architecture-storage": localStorage.getItem("architecture-storage"),
    };
    const data = JSON.stringify(backup, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `daily-flux-backup-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importAllData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target?.result as string);
          if (backup["daily-flow-storage"]) {
            localStorage.setItem(
              "daily-flow-storage",
              backup["daily-flow-storage"],
            );
          }
          if (backup["architecture-storage"]) {
            localStorage.setItem(
              "architecture-storage",
              backup["architecture-storage"],
            );
          }
          alert(
            "Backup imported successfully! The application will now reload.",
          );
          window.location.reload();
        } catch (err) {
          console.error("Failed to parse", err);
          alert("Invalid backup file");
        }
      };
      reader.readAsText(file);
    }
  };

  const links = [
    { to: "/", icon: <LayoutDashboard size={18} />, label: "Overview" },
    { to: "/tasks", icon: <CheckSquare size={18} />, label: "Tasks" },
    { to: "/learnings", icon: <BookOpen size={18} />, label: "Learnings" },
    { to: "/reminders", icon: <Bell size={18} />, label: "Reminders" },
    { to: "/architecture", icon: <Network size={18} />, label: "Architecture" },
    { to: "/analytics", icon: <BarChart3 size={18} />, label: "Analytics" },
  ];

  return (
    <>
      <button
        className="fixed top-4 right-4 z-50 p-2 bg-white text-slate-800 rounded-md border border-slate-200 shadow-sm md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`sidebar fixed bg-white text-slate-700 ${isSidebarCollapsed ? "w-20" : "w-64"} h-screen border-r border-slate-200 transition-all duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 z-40 flex flex-col shadow-sm`}
      >
        <div
          className={`p-6 pb-4 flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}
        >
          <div className="flex items-center gap-2">
            <div
              className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm cursor-pointer hover:bg-indigo-700 transition"
              onClick={toggleSidebarCollapse}
              title="Toggle Sidebar"
            >
              <Target size={20} />
            </div>
            {!isSidebarCollapsed && (
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Daily Flux
              </h1>
            )}
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm border border-indigo-100/50"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <div title={isSidebarCollapsed ? link.label : undefined}>
                {link.icon}
              </div>
              {!isSidebarCollapsed && (
                <span className="text-sm">{link.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div
          className={`p-4 border-t border-slate-100 flex flex-col gap-3 ${isSidebarCollapsed ? "items-center" : ""}`}
        >
          <div
            className={`flex gap-2 w-full ${isSidebarCollapsed ? "flex-col items-center" : "flex-row"}`}
          >
            <button
              onClick={exportAllData}
              title="Export All Data"
              className="flex-1 flex justify-center items-center gap-2 p-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 rounded-lg transition-colors text-xs font-medium border border-slate-200 shadow-sm min-w-10"
            >
              <Download size={14} className="shrink-0" />{" "}
              {!isSidebarCollapsed && "Backup"}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Import All Data"
              className="flex-1 flex justify-center items-center gap-2 p-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 rounded-lg transition-colors text-xs font-medium border border-slate-200 shadow-sm min-w-10"
            >
              <Upload size={14} className="shrink-0" />{" "}
              {!isSidebarCollapsed && "Restore"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".json"
              onChange={importAllData}
            />
          </div>
          {!isSidebarCollapsed && (
            <div className="text-[10px] text-slate-400 text-center">
              <p className="font-medium text-slate-500">
                Stay focused. Your personal workspace.
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
