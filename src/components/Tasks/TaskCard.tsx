import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../../types";
import { useStore } from "../../store/useStore";
import { Trash2, Clock } from "lucide-react";

interface Props {
  task: Task;
  index: number;
}

const TaskCard = ({ task, index }: Props) => {
  const { deleteTask } = useStore();

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
            <button
              onClick={() => deleteTask(task.id)}
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {task.description && (
            <p className="text-sm text-slate-500 mb-3 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              <Clock size={12} className="text-slate-400" />
              {new Date(task.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
