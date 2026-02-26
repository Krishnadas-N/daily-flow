import React, { useState } from "react";
import { useStore } from "../../store/useStore";
import { Plus, Trash2, Check, Target } from "lucide-react";

const HabitTracker = () => {
  const { habits, addHabit, toggleHabitDate, deleteHabit } = useStore();
  const [newHabitName, setNewHabitName] = useState("");

  // Get last 7 days
  const today = new Date();
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim());
      setNewHabitName("");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-emerald-100/60 rounded-xl text-emerald-600">
            <Target size={20} />
          </div>
          Daily Habits
        </h2>
      </div>

      <div className="overflow-x-auto custom-scrollbar pb-2">
        <div className="min-w-[600px]">
          {/* Header Row */}
          <div className="grid grid-cols-8 gap-4 mb-6">
            <div className="col-span-1"></div>
            {dates.map((date, i) => (
              <div key={i} className="text-center flex flex-col items-center">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <div
                  className={`text-sm font-bold flex items-center justify-center w-8 h-8 rounded-full ${
                    i === 6
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "text-slate-600 bg-slate-50 border border-slate-100"
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Habit Rows */}
          <div className="space-y-4">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="grid grid-cols-8 gap-4 items-center group"
              >
                <div className="col-span-1 flex items-center justify-between bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-slate-300">
                  <span
                    className="text-[14.5px] font-semibold text-slate-700 truncate pr-2"
                    title={habit.name}
                  >
                    {habit.name}
                  </span>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {dates.map((date, i) => {
                  const dateStr = date.toISOString().split("T")[0];
                  const isCompleted = habit.completedDates.includes(dateStr);

                  return (
                    <div key={i} className="flex justify-center">
                      <button
                        onClick={() => toggleHabitDate(habit.id, dateStr)}
                        className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${
                          isCompleted
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:border-emerald-600"
                            : "bg-white border-slate-200 hover:border-indigo-300 text-transparent hover:bg-indigo-50/50"
                        }`}
                      >
                        {isCompleted && <Check size={20} strokeWidth={3} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="mt-8 flex gap-3 max-w-sm">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="New habit to track..."
          className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 w-12 flex items-center justify-center rounded-2xl shadow-md shadow-indigo-200 text-white transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
        </button>
      </form>
    </div>
  );
};

export default HabitTracker;
