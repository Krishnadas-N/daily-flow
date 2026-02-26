import React, { useState } from "react";
import { useStore } from "../store/useStore";
import { Bell, BellRing, Trash2, Plus, Calendar } from "lucide-react";

const RemindersPage = () => {
  const { reminders, addReminder, deleteReminder } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    addReminder(title.trim(), date, time || undefined);
    setTitle("");
    setDate("");
    setTime("");
    setShowAddForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full animate-fade-in pb-20 md:pb-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <div className="bg-indigo-100/50 p-2.5 rounded-2xl text-indigo-600">
            <BellRing size={28} />
          </div>
          Reminders
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Set personal reminders for things like "take the bike key".
        </p>
      </header>

      <div className="mb-6">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all active:scale-[0.98]"
          >
            <Plus size={20} className="text-indigo-500" />
            Create New Reminder
          </button>
        ) : (
          <form
            onSubmit={handleAddSubmit}
            className="bg-white p-5 rounded-3xl border border-indigo-200 shadow-xl shadow-indigo-100/50 flex flex-col gap-4 animate-scale-in"
          >
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Bell size={20} className="text-indigo-500" /> New Reminder
            </h3>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="What to remember? (e.g. Take bike keys)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50/50 font-medium"
                autoFocus
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    required
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
                    Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end mt-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 text-slate-500 hover:text-slate-800 font-semibold hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !date}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                Save Reminder
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reminders
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((reminder) => {
            const reminderDateTimeStr =
              reminder.reminderDate +
              (reminder.reminderTime ? "T" + reminder.reminderTime : "");
            const isPassed =
              new Date(reminderDateTimeStr).getTime() < new Date().getTime();

            return (
              <div
                key={reminder.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col relative overflow-hidden"
              >
                {isPassed && (
                  <div className="absolute top-0 right-0 left-0 h-1 bg-red-400"></div>
                )}
                {!isPassed && (
                  <div className="absolute top-0 right-0 left-0 h-1 bg-indigo-400"></div>
                )}

                <div className="flex justify-between items-start mb-3 mt-1">
                  <h3 className="font-bold text-slate-800 text-lg pr-8">
                    {reminder.title}
                  </h3>
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all absolute right-4 top-5"
                    title="Delete Reminder"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-auto pt-4 text-sm font-medium">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${isPassed ? "bg-red-50 text-red-600 border-red-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"}`}
                  >
                    <Calendar size={14} />
                    <span>
                      {new Date(reminder.reminderDate!).toLocaleDateString(
                        undefined,
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  {reminder.reminderTime && (
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${isPassed ? "bg-red-50 text-red-600 border-red-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"}`}
                    >
                      <BellRing size={14} />
                      <span>{reminder.reminderTime}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        {reminders.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
            <Bell size={48} className="text-slate-300 mb-4" />
            <p className="font-medium text-lg">No reminders set</p>
            <p className="text-sm mt-1">Create one above to get notified</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemindersPage;
