import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../../types";
import { useStore } from "../../store/useStore";
import { useState } from "react";
import { Trash2, Clock, Bell, BellRing, X } from "lucide-react";

interface Props {
  task: Task;
  index: number;
}

const TaskCard = ({ task, index }: Props) => {
  const { deleteTask, updateTask } = useStore();
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [remDate, setRemDate] = useState(task.reminderDate || "");
  const [remTime, setRemTime] = useState(task.reminderTime || "");

  const handleSaveReminder = () => {
    updateTask(task.id, {
      reminderDate: remDate || undefined,
      reminderTime: remTime || undefined,
    });
    setShowReminderForm(false);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 rounded-2xl mb-3 border bg-white ${
            snapshot.isDragging
              ? "border-indigo-400 shadow-xl shadow-indigo-100 ring-2 ring-indigo-200"
              : "border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md"
          } transition-all group`}
        >
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3
              className={`text-[15px] font-semibold tracking-tight ${task.status === "Completed" ? "line-through text-slate-400" : "text-slate-800"}`}
            >
              {task.title}
            </h3>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
              <button
                onClick={() => setShowReminderForm(!showReminderForm)}
                className={`p-1.5 rounded-lg transition-all ${task.reminderDate ? "text-indigo-500 hover:bg-indigo-50" : "text-slate-400 hover:text-indigo-500 hover:bg-indigo-50"}`}
                title="Set Reminder"
              >
                {task.reminderDate ? (
                  <BellRing size={16} />
                ) : (
                  <Bell size={16} />
                )}
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all flex-shrink-0"
                title="Delete Task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {showReminderForm && (
            <div className="mb-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 relative">
              <button
                onClick={() => setShowReminderForm(false)}
                className="absolute top-2 right-2 text-indigo-400 hover:text-indigo-600"
              >
                <X size={14} />
              </button>
              <h4 className="text-xs font-bold text-indigo-900 mb-2 flex items-center gap-1">
                <BellRing size={12} /> Set Reminder
              </h4>
              <div className="flex flex-col gap-2">
                <input
                  type="date"
                  value={remDate}
                  onChange={(e) => setRemDate(e.target.value)}
                  className="text-xs px-2 py-1.5 rounded bg-white border border-indigo-200 text-slate-700 outline-none focus:border-indigo-400"
                />
                <input
                  type="time"
                  value={remTime}
                  onChange={(e) => setRemTime(e.target.value)}
                  className="text-xs px-2 py-1.5 rounded bg-white border border-indigo-200 text-slate-700 outline-none focus:border-indigo-400"
                />
                <div className="flex justify-between items-center mt-1">
                  <button
                    onClick={() => {
                      setRemDate("");
                      setRemTime("");
                      updateTask(task.id, {
                        reminderDate: undefined,
                        reminderTime: undefined,
                      });
                      setShowReminderForm(false);
                    }}
                    className="text-[10px] text-red-500 font-medium hover:underline"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleSaveReminder}
                    className="text-[10px] bg-indigo-500 text-white px-3 py-1 rounded-md font-medium hover:bg-indigo-600 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {task.description && (
            <p className="text-sm text-slate-500 mb-3 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const priorities: ("Low" | "Medium" | "High")[] = [
                    "Low",
                    "Medium",
                    "High",
                  ];
                  const currentIndex = priorities.indexOf(task.priority);
                  const nextIndex = (currentIndex + 1) % priorities.length;
                  updateTask(task.id, { priority: priorities[nextIndex] });
                }}
                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border transition-all hover:scale-105 active:scale-95 ${
                  task.priority === "High"
                    ? "bg-red-50 text-red-600 border-red-100"
                    : task.priority === "Medium"
                      ? "bg-amber-50 text-amber-600 border-amber-100"
                      : "bg-slate-50 text-slate-500 border-slate-200"
                }`}
              >
                {task.priority}
              </button>

              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Clock size={10} className="text-slate-300" />
                {new Date(task.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              {task.reminderDate && (
                <span
                  className={`text-[10px] flex items-center gap-1 font-bold px-1.5 py-0.5 rounded border ${new Date(task.reminderDate) < new Date() ? "bg-red-50 text-red-600 border-red-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"}`}
                >
                  <BellRing size={10} />
                  {new Date(task.reminderDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                  {task.reminderTime ? ` ${task.reminderTime}` : ""}
                </span>
              )}
            </div>

            {task.needsJiraTicket && (
              <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded border border-indigo-100">
                JIRA
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
