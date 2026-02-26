import React, { useState } from "react";
import { useStore } from "../../store/useStore";
import { Plus, Hash, GraduationCap, Lightbulb } from "lucide-react";
import type { ItemType } from "../../types";

const Topbar = () => {
  const [input, setInput] = useState("");
  const [type, setType] = useState<ItemType>("Task");

  const { addTask, addLearning, addIdea } = useStore();

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
    <div className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.01)] transition-all">
      <div className="hidden md:flex flex-col mb-2 md:mb-0">
        <h2 className="text-slate-800 font-semibold text-lg leading-tight tracking-tight">
          Focus Workspace
        </h2>
        <p className="text-slate-500 text-xs">Capture thoughts fast.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-slate-50 border border-slate-200 rounded-2xl flex items-center p-1.5 shadow-sm transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 focus-within:bg-white"
      >
        <div className="flex bg-slate-100 rounded-xl p-0.5 mr-2 border border-slate-200/60">
          {types.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                type === t.value
                  ? "bg-white text-indigo-600 border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/40 shadow-none border border-transparent"
              }`}
            >
              <div
                className={
                  type === t.value ? "text-indigo-500" : "text-slate-400"
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
          placeholder={`Quick add new ${type.toLowerCase()}... (Enter)`}
          className="flex-1 bg-transparent border-none outline-none text-slate-800 text-sm px-2 py-2 placeholder-slate-400 font-medium"
        />

        <button
          type="submit"
          disabled={!input.trim()}
          className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 shadow-sm"
        >
          <Plus size={18} />
        </button>
      </form>
    </div>
  );
};

export default Topbar;
