import React, { useState } from "react";
import { useStore } from "../../store/useStore";
import { Plus, Hash, GraduationCap, Lightbulb, Moon, Sun } from "lucide-react";
import type { ItemType } from "../../types";

const Topbar = () => {
  const [input, setInput] = useState("");
  const [type, setType] = useState<ItemType>("Task");

  const { addTask, addLearning, addIdea, theme, toggleTheme } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (type === "Task") {
      addTask(input.trim(), false);
    } else if (type === "Learning") {
      addLearning(input.trim());
    } else if (type === "Idea") {
      addIdea(input.trim());
    }

    setInput("");
  };

  const types: { value: ItemType; icon: React.ReactNode; label: string }[] = [
    { value: "Task", icon: <Hash size={14} />, label: "Task" },
    { value: "Learning", icon: <GraduationCap size={14} />, label: "Learning" },
    { value: "Idea", icon: <Lightbulb size={14} />, label: "Idea" },
  ];

  return (
    <div className="w-full sticky top-0 z-30 px-3 md:px-8 py-3 md:py-4 flex flex-col md:flex-row items-center gap-3 md:justify-between transition-all border-b border-slate-200/80 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,6,23,0.04)] dark:border-slate-700/80 dark:bg-slate-900/85 dark:shadow-[0_8px_30px_rgba(2,6,23,0.6)]">
      <div className="hidden md:flex flex-col">
        <h2 className="text-slate-800 dark:text-slate-100 font-semibold text-lg leading-tight tracking-tight">
          Focus Workspace
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Capture thoughts fast.
        </p>
      </div>

      <div className="w-full md:w-auto flex items-center gap-2">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-slate-50/95 border border-slate-200 rounded-2xl flex items-center p-1.5 shadow-sm transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 focus-within:bg-white dark:bg-slate-950/80 dark:border-slate-700 dark:focus-within:bg-slate-900"
        >
          <div className="flex bg-slate-100/90 rounded-xl p-0.5 mr-1.5 border border-slate-200/60 shrink-0 dark:bg-slate-800 dark:border-slate-700">
            {types.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                  type === t.value
                    ? "bg-white text-indigo-600 border border-slate-200/50 dark:bg-slate-700 dark:text-indigo-300 dark:border-slate-600"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/40 shadow-none border border-transparent dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700/70"
                }`}
              >
                <div
                  className={
                    type === t.value
                      ? "text-indigo-500 dark:text-indigo-300"
                      : "text-slate-400 dark:text-slate-500"
                  }
                >
                  {t.icon}
                </div>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              window.innerWidth < 640
                ? "Quick add..."
                : `Quick add new ${type.toLowerCase()}...`
            }
            className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 text-sm px-1 sm:px-2 py-2 placeholder-slate-400 dark:placeholder-slate-500 font-medium min-w-0"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="ml-1 sm:ml-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 shadow-sm shrink-0"
          >
            <Plus size={18} />
          </button>
        </form>

        <button
          type="button"
          onClick={toggleTheme}
          title="Toggle theme"
          className="shrink-0 p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  );
};

export default Topbar;
