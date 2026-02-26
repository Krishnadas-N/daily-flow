import HabitTracker from "../components/Habits/HabitTracker";
import { useStore } from "../store/useStore";
import { Lightbulb, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { ideas, deleteIdea, tasks, learnings } = useStore();

  const pendingTasks = tasks.filter((t) => t.status !== "Completed");
  const activeLearnings = learnings.filter((l) => l.status === "Learning");

  return (
    <div className="h-full flex flex-col pt-4 md:pt-8 px-2 md:px-8 max-w-[1400px] mx-auto w-full animate-slide-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
          Good Morning
        </h1>
        <p className="text-slate-500 font-medium">
          Here's a quick overview of your day. Let's get things done.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Ideas capture */}
        <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-96 col-span-1 xl:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <div className="p-2 bg-amber-100/50 rounded-xl text-amber-500">
                <Lightbulb size={20} />
              </div>
              Inbox
            </h2>
            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
              {ideas.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
            {ideas.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
                <p>No ideas yet.</p>
                <p className="opacity-70">Use the top bar to capture</p>
              </div>
            ) : (
              ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group flex items-start gap-4 transition-all hover:bg-slate-100/50"
                >
                  <p className="text-[15px] font-medium text-slate-700 flex-1 leading-relaxed">
                    {idea.content}
                  </p>
                  <button
                    onClick={() => deleteIdea(idea.id)}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Priorities Highlights */}
        <div className="col-span-1 xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 border border-indigo-500 rounded-[28px] p-7 shadow-lg shadow-indigo-200 flex flex-col h-full text-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Current Focus</h3>
                <p className="text-indigo-200 font-medium text-sm">
                  {pendingTasks.length} pending Tasks
                </p>
              </div>
              <Link
                to="/tasks"
                className="p-2.5 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10"
              >
                <ArrowRight size={20} className="text-white" />
              </Link>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {pendingTasks.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="bg-white/10 border border-white/10 p-4 rounded-2xl backdrop-blur-sm"
                >
                  <p className="text-[15px] font-semibold line-clamp-1">
                    {t.title}
                  </p>
                  <p className="text-[11px] uppercase tracking-wider font-bold text-indigo-200 mt-2">
                    {t.status}
                  </p>
                </div>
              ))}
              {pendingTasks.length === 0 && (
                <p className="text-sm text-indigo-200 font-medium py-4">
                  All tasks completed! Great job.
                </p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 border border-teal-400/50 rounded-[28px] p-7 shadow-lg shadow-teal-100 flex flex-col h-full text-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Learning Now</h3>
                <p className="text-teal-100 font-medium text-sm">
                  {activeLearnings.length} active topics
                </p>
              </div>
              <Link
                to="/learnings"
                className="p-2.5 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10"
              >
                <ArrowRight size={20} className="text-white" />
              </Link>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {activeLearnings.slice(0, 3).map((l) => (
                <div
                  key={l.id}
                  className="bg-white/10 border border-white/10 p-4 rounded-2xl backdrop-blur-sm"
                >
                  <p className="text-[15px] font-semibold line-clamp-1">
                    {l.topic}
                  </p>
                </div>
              ))}
              {activeLearnings.length === 0 && (
                <p className="text-sm text-teal-100 font-medium py-4">
                  No active learning topics.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <HabitTracker />
    </div>
  );
};

export default DashboardPage;
