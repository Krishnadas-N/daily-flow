import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  BarChart3,
  Menu,
  X,
  Target,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const links = [
    { to: "/", icon: <LayoutDashboard size={18} />, label: "Overview" },
    { to: "/tasks", icon: <CheckSquare size={18} />, label: "Tasks" },
    { to: "/learnings", icon: <BookOpen size={18} />, label: "Learnings" },
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
        className={`sidebar fixed bg-white text-slate-700 w-64 h-screen border-r border-slate-200 transition-transform transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 z-40 flex flex-col shadow-sm`}
      >
        <div className="p-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
              <Target size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Flowstate
            </h1>
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
              {link.icon}
              <span className="text-sm">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-center flex flex-col items-center">
          <p className="font-medium text-slate-500 mb-1">Stay focused.</p>
          <p>Your personal workspace.</p>
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
