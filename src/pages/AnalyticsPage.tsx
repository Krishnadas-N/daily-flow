import { useMemo } from "react";
import { useStore } from "../store/useStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, CheckCircle, Brain, BookOpen } from "lucide-react";

const AnalyticsPage = () => {
  const { tasks, learnings, habits } = useStore();

  const taskStats = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString("en-US", { weekday: "short" });
    });

    const data = last7Days.map((dayStr) => {
      return {
        name: dayStr,
        tasksCompleted: tasks.filter(
          (t) =>
            t.status === "Completed" &&
            t.completedAt &&
            new Date(t.completedAt).toLocaleDateString("en-US", {
              weekday: "short",
            }) === dayStr,
        ).length,
        learningsAdded: learnings.filter(
          (l) =>
            new Date(l.createdAt).toLocaleDateString("en-US", {
              weekday: "short",
            }) === dayStr,
        ).length,
      };
    });

    return data;
  }, [tasks, learnings]);

  const totalCompletedTasks = tasks.filter(
    (t) => t.status === "Completed",
  ).length;
  const totalMasteredLearnings = learnings.filter(
    (l) => l.status === "Mastered",
  ).length;

  return (
    <div className="h-full flex flex-col pt-4 md:pt-8 px-2 md:px-8 max-w-[1400px] mx-auto w-full animate-slide-up">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
          Weekly Analytics
        </h1>
        <p className="text-slate-500 font-medium text-lg">
          Visualize your productivity and learning metrics over the past 7 days.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        <div className="bg-white border border-slate-200 rounded-[28px] p-5 md:p-7 flex flex-col items-center shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
          <div className="absolute -top-6 -right-6 text-blue-500/10 group-hover:scale-110 transition-transform">
            <CheckCircle size={100} className="md:w-[120px] md:h-[120px]" />
          </div>
          <p className="text-slate-500 text-[11px] md:text-sm font-bold uppercase tracking-wider mb-2 z-10 w-full text-left">
            Tasks Done
          </p>
          <div className="w-full flex items-end gap-3 z-10">
            <p className="text-4xl md:text-5xl font-black text-blue-600 tracking-tighter">
              {totalCompletedTasks}
            </p>
            <p className="text-blue-500/70 font-bold text-xs md:text-sm mb-1 md:mb-1.5 leading-none">
              total
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[28px] p-5 md:p-7 flex flex-col items-center shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
          <div className="absolute -top-6 -right-6 text-purple-500/10 group-hover:scale-110 transition-transform">
            <Brain size={100} className="md:w-[120px] md:h-[120px]" />
          </div>
          <p className="text-slate-500 text-[11px] md:text-sm font-bold uppercase tracking-wider mb-2 z-10 w-full text-left">
            Mastered
          </p>
          <div className="w-full flex items-end gap-3 z-10">
            <p className="text-4xl md:text-5xl font-black text-purple-600 tracking-tighter">
              {totalMasteredLearnings}
            </p>
            <p className="text-purple-500/70 font-bold text-xs md:text-sm mb-1 md:mb-1.5 leading-none">
              topics
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[28px] p-5 md:p-7 flex flex-col items-center shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
          <div className="absolute -top-6 -right-6 text-emerald-500/10 group-hover:scale-110 transition-transform">
            <TrendingUp size={100} className="md:w-[120px] md:h-[120px]" />
          </div>
          <p className="text-slate-500 text-[11px] md:text-sm font-bold uppercase tracking-wider mb-2 z-10 w-full text-left">
            Habits
          </p>
          <div className="w-full flex items-end gap-3 z-10">
            <p className="text-4xl md:text-5xl font-black text-emerald-600 tracking-tighter">
              {habits.length}
            </p>
            <p className="text-emerald-500/70 font-bold text-xs md:text-sm mb-1 md:mb-1.5 leading-none">
              active
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[28px] p-5 md:p-7 flex flex-col items-center shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
          <div className="absolute -top-6 -right-6 text-amber-500/10 group-hover:scale-110 transition-transform">
            <BookOpen size={100} className="md:w-[120px] md:h-[120px]" />
          </div>
          <p className="text-slate-500 text-[11px] md:text-sm font-bold uppercase tracking-wider mb-2 z-10 w-full text-left">
            Learnings
          </p>
          <div className="w-full flex items-end gap-3 z-10">
            <p className="text-4xl md:text-5xl font-black text-amber-500 tracking-tighter">
              {learnings.length}
            </p>
            <p className="text-amber-500/70 font-bold text-xs md:text-sm mb-1 md:mb-1.5 leading-none">
              total
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 pb-10">
        <div className="bg-white border border-slate-200 rounded-[32px] p-5 md:p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-shadow h-[350px] md:h-[420px] flex flex-col">
          <h2 className="text-lg md:text-xl font-extrabold text-slate-800 mb-6 md:mb-8 flex items-center gap-3">
            <div className="w-2.5 md:w-3 h-6 md:h-8 bg-blue-500 rounded-full"></div>
            Tasks Completed
          </h2>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={taskStats}
                margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  stroke="#cbd5e1"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "16px",
                    fontWeight: "bold",
                    color: "#1e293b",
                    fontSize: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="tasksCompleted"
                  fill="#3b82f6"
                  radius={[6, 6, 2, 2]}
                  barSize={window.innerWidth < 640 ? 24 : 40}
                  name="Tasks"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[32px] p-5 md:p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-shadow h-[350px] md:h-[420px] flex flex-col">
          <h2 className="text-lg md:text-xl font-extrabold text-slate-800 mb-6 md:mb-8 flex items-center gap-3">
            <div className="w-2.5 md:w-3 h-6 md:h-8 bg-purple-500 rounded-full"></div>
            Learnings Added
          </h2>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={taskStats}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  stroke="#cbd5e1"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "16px",
                    fontWeight: "bold",
                    color: "#1e293b",
                    fontSize: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="learningsAdded"
                  stroke="#a855f7"
                  strokeWidth={4}
                  dot={{
                    r: 4,
                    fill: "#ffffff",
                    strokeWidth: 2,
                    stroke: "#a855f7",
                  }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#9333ea" }}
                  name="Learnings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
