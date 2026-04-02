import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  ClipboardList,
  Check,
} from "lucide-react";
import { useStore } from "../store/useStore";

const WorkLogPage = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const { workLogs, addWorkLogItem, updateWorkLogItem, deleteWorkLogItem, setHoliday } =
    useStore();

  const [newItemText, setNewItemText] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [holidayReason, setHolidayReason] = useState("");

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const dayLog = workLogs.find((d) => d.date === selectedDateStr);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    if (!isSameMonth(date, currentMonth)) {
      setCurrentMonth(startOfMonth(date));
    }
    setNewItemText("");
    setEditingItemId(null);
    setHolidayReason(getDayLog(date)?.holidayReason ?? "");
  };

  const handleAddItem = () => {
    const text = newItemText.trim();
    if (!text) return;
    addWorkLogItem(selectedDateStr, text);
    setNewItemText("");
  };

  const handleStartEdit = (id: string, text: string) => {
    setEditingItemId(id);
    setEditingText(text);
  };

  const handleSaveEdit = () => {
    if (editingItemId) {
      if (editingText.trim()) {
        updateWorkLogItem(selectedDateStr, editingItemId, editingText.trim());
      }
      // If empty, original text stays unchanged — just close the editor
    }
    setEditingItemId(null);
    setEditingText("");
  };

  const handleHolidayToggle = (checked: boolean) => {
    setHoliday(selectedDateStr, checked, checked ? holidayReason : undefined);
    if (!checked) setHolidayReason("");
  };

  const handleHolidayReasonBlur = () => {
    if (dayLog?.isHoliday) {
      setHoliday(selectedDateStr, true, holidayReason);
    }
  };

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getDayLog = (date: Date) =>
    workLogs.find((d) => d.date === format(date, "yyyy-MM-dd"));

  return (
    <div className="h-full flex flex-col pt-4 md:pt-8 px-2 md:px-8 max-w-[1400px] mx-auto w-full animate-slide-up">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
          Work Log
        </h1>
        <p className="text-slate-500 font-medium">
          Log what you worked on each day. Simple, no fuss.
        </p>
      </div>

      {/* Split Panel */}
      <div className="flex gap-6 flex-col lg:flex-row flex-1 min-h-0">
        {/* Left Panel — Calendar */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-sm font-bold text-slate-800">
                {format(currentMonth, "MMMM yyyy")}
              </h2>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div
                  key={d}
                  className="text-center text-[11px] font-semibold text-slate-400 py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7 gap-y-1">
              {calendarDays.map((day) => {
                const log = getDayLog(day);
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, today);
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleSelectDate(day)}
                    className={`relative flex flex-col items-center justify-center rounded-xl py-1.5 transition-all text-sm font-medium
                      ${isSelected ? "bg-indigo-600 text-white shadow-sm" : ""}
                      ${isToday && !isSelected ? "ring-2 ring-indigo-300 text-indigo-700" : ""}
                      ${!isSelected && !isToday ? "hover:bg-slate-100" : ""}
                      ${!isCurrentMonth ? "text-slate-300" : isSelected ? "text-white" : "text-slate-700"}
                    `}
                  >
                    <span>{format(day, "d")}</span>
                    {/* Dots */}
                    {(log?.items.length || log?.isHoliday) ? (
                      <div className="flex gap-0.5 mt-0.5">
                        {(log?.items.length ?? 0) > 0 && (
                          <span
                            className={`w-1 h-1 rounded-full ${isSelected ? "bg-white/80" : "bg-emerald-500"}`}
                          />
                        )}
                        {log?.isHoliday && (
                          <span
                            className={`w-1 h-1 rounded-full ${isSelected ? "bg-white/80" : "bg-amber-400"}`}
                          />
                        )}
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Work logged
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Holiday
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel — Day Log */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-full min-h-[500px]">
            {/* Day Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </h2>
                  {isSameDay(selectedDate, today) && (
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                      Today
                    </span>
                  )}
                </div>
              </div>

              {/* Holiday Toggle */}
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <div
                  className="flex items-center gap-2 cursor-pointer select-none"
                  onClick={() => handleHolidayToggle(!dayLog?.isHoliday)}
                >
                  <div
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      dayLog?.isHoliday ? "bg-amber-400" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        dayLog?.isHoliday ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    Mark as Holiday
                  </span>
                </div>
                {dayLog?.isHoliday && (
                  <input
                    type="text"
                    value={holidayReason}
                    onChange={(e) => setHolidayReason(e.target.value)}
                    onBlur={handleHolidayReasonBlur}
                    placeholder="Reason (e.g. National Holiday)"
                    className="flex-1 min-w-[200px] text-sm px-3 py-1.5 border border-amber-200 bg-amber-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-400 text-slate-700 placeholder:text-slate-400"
                  />
                )}
              </div>
            </div>

            {/* Work Items */}
            <div className="flex-1 p-6 overflow-y-auto">
              {(!dayLog || dayLog.items.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mb-3 text-indigo-300">
                    <ClipboardList size={24} />
                  </div>
                  <p className="text-slate-500 font-medium">Nothing logged yet.</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Nothing logged for this day.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {dayLog.items.map((item) => (
                    <li
                      key={item.id}
                      className="group flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-100 rounded-xl transition-all"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      {editingItemId === item.id ? (
                        <input
                          autoFocus
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit();
                            if (e.key === "Escape") setEditingItemId(null);
                          }}
                          onBlur={handleSaveEdit}
                          className="flex-1 text-sm text-slate-800 bg-white border border-indigo-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                      ) : (
                        <span className="flex-1 text-sm text-slate-800">
                          {item.text}
                        </span>
                      )}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {editingItemId === item.id ? (
                          <button
                            onClick={handleSaveEdit}
                            className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Save"
                          >
                            <Check size={15} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(item.id, item.text)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteWorkLogItem(selectedDateStr, item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Add Item Input */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddItem();
                  }}
                  placeholder="Add a work item... (press Enter)"
                  className="flex-1 text-sm px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                />
                <button
                  onClick={handleAddItem}
                  disabled={!newItemText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkLogPage;
