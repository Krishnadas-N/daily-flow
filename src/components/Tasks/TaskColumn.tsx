import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from "../../types";
import { useStore } from "../../store/useStore";
import { Plus } from "lucide-react";

interface Props {
  status: TaskStatus;
  tasks: Task[];
}

const TaskColumn = ({ status, tasks }: Props) => {
  const { addTask } = useStore();
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const getBadgeColor = () => {
    switch (status) {
      case "Todo":
        return "bg-slate-100 text-slate-600 border-slate-200";
      case "In Progress":
        return "bg-amber-100/50 text-amber-700 border-amber-200";
      case "Completed":
        return "bg-emerald-100/50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    // Quick hack for status since store always defaults to Todo:
    // Actually, we need to update the store to allow passing status,
    // but default addTask uses Todo. We can add it and then immediately update its status!
    // Or we simply show Quick Add only in the 'Todo' column.

    // For now, let's just use addTask.
    // I will call addTask and it will go to Todo. If we are in another column,
    // we should update the store if needed. I will just rely on standard addTask for now.
    addTask(newTaskTitle.trim(), false);
    setNewTaskTitle("");
    setAddingTask(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-[28px] border border-slate-200 shadow-sm overflow-hidden min-w-[280px] sm:min-w-[320px] max-w-[360px] flex-1">
      <div className="p-5 pb-3 flex items-center justify-between">
        <h2 className="font-bold text-slate-800 text-lg">{status}</h2>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeColor()}`}
        >
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-4 overflow-y-auto custom-scrollbar transition-colors ${
              snapshot.isDraggingOver ? "bg-indigo-50/50" : "bg-transparent"
            }`}
          >
            {tasks
              .sort((a, b) => {
                const priorityWeight = { High: 3, Medium: 2, Low: 1 };
                if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
                  return (
                    priorityWeight[b.priority] - priorityWeight[a.priority]
                  );
                }
                return b.createdAt - a.createdAt;
              })
              .map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
            {provided.placeholder}

            {status === "Todo" && (
              <div className="mt-2">
                {addingTask ? (
                  <form
                    onSubmit={handleAddSubmit}
                    className="bg-white border-2 border-indigo-400 rounded-xl p-3 shadow-sm ring-4 ring-indigo-100"
                  >
                    <input
                      title="New task title"
                      autoFocus
                      type="text"
                      className="w-full text-sm font-medium text-slate-800 outline-none placeholder-slate-400"
                      placeholder="Enter task name..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onBlur={() =>
                        !newTaskTitle.trim() && setAddingTask(false)
                      }
                    />
                  </form>
                ) : (
                  <button
                    onClick={() => setAddingTask(true)}
                    className="w-full flex items-center gap-2 justify-center py-3 text-sm font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 border-2 border-dashed border-slate-300 hover:border-indigo-300 rounded-2xl transition-all"
                  >
                    <Plus size={16} /> Add Task
                  </button>
                )}
              </div>
            )}

            {tasks.length === 0 && status !== "Todo" && (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm py-10 rounded-2xl border-2 border-dashed border-slate-200/60 font-medium">
                Drop here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
