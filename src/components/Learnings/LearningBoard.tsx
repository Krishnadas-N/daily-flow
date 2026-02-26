import { useState } from "react";
import { useStore } from "../../store/useStore";
import { BookOpen, Clock, Trash2 } from "lucide-react";
import type { LearningStatus } from "../../types";

const LearningBoard = () => {
  const { learnings, updateLearningStatus, deleteLearning } = useStore();
  const [filter, setFilter] = useState<LearningStatus | "All">("All");

  const filtered =
    filter === "All" ? learnings : learnings.filter((l) => l.status === filter);

  const statuses: (LearningStatus | "All")[] = [
    "All",
    "To Learn",
    "Learning",
    "Mastered",
  ];

  const getStatusColor = (status: LearningStatus) => {
    switch (status) {
      case "To Learn":
        return "text-sky-700 bg-sky-50 border-sky-200";
      case "Learning":
        return "text-amber-700 bg-amber-50 border-amber-200";
      case "Mastered":
        return "text-emerald-700 bg-emerald-50 border-emerald-200";
    }
  };

  return (
    <div
      className="flex flex-col h-full animate-slide-up"
      style={{ animationDelay: "0.1s" }}
    >
      <div className="flex gap-2.5 mb-8 overflow-x-auto pb-2 custom-scrollbar">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-5 py-2 rounded-2xl text-[13.5px] font-bold transition-all ${
              filter === s
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 translate-y-[-2px]"
                : "bg-white text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 shadow-sm"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
        {filtered.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-400 bg-white/50 rounded-[32px] border-2 border-slate-200 border-dashed">
            <BookOpen size={48} className="mb-6 opacity-30 text-indigo-500" />
            <p className="text-lg font-medium">
              Your knowledge vault is empty.
            </p>
            <p className="text-sm mt-1">
              Start adding topics from the quick capture bar.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-[24px] p-6 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50 transition-all flex flex-col group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 opacity-60"></div>

              <div className="flex justify-between items-start mb-4 pl-2">
                <h3 className="font-bold text-slate-800 pr-6 text-[17px] leading-tight tracking-tight">
                  {item.topic}
                </h3>
                <button
                  onClick={() => deleteLearning(item.id)}
                  className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 bg-white shadow-sm border border-slate-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {item.notes && (
                <p className="text-sm text-slate-500 mb-6 flex-1 pl-2 font-medium leading-relaxed">
                  {item.notes}
                </p>
              )}

              <div className="mt-auto pl-2 pt-5 flex items-center justify-between border-t border-slate-100">
                <select
                  value={item.status}
                  onChange={(e) =>
                    updateLearningStatus(
                      item.id,
                      e.target.value as LearningStatus,
                    )
                  }
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border appearance-none cursor-pointer outline-none transition-colors shadow-sm ${getStatusColor(item.status)}`}
                >
                  <option
                    value="To Learn"
                    className="font-semibold text-sky-800 bg-white"
                  >
                    To Learn
                  </option>
                  <option
                    value="Learning"
                    className="font-semibold text-amber-800 bg-white"
                  >
                    Learning
                  </option>
                  <option
                    value="Mastered"
                    className="font-semibold text-emerald-800 bg-white"
                  >
                    Mastered
                  </option>
                </select>

                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5 font-medium">
                  <Clock size={12} className="opacity-70" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LearningBoard;
