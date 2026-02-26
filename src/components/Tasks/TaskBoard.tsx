import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import TaskColumn from "./TaskColumn";
import { useStore } from "../../store/useStore";
import type { TaskStatus } from "../../types";

const columns: TaskStatus[] = ["Todo", "In Progress", "Completed"];

const TaskBoard = () => {
  const { tasks, updateTaskStatus } = useStore();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    updateTaskStatus(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 h-[calc(100vh-140px)] overflow-x-auto pb-4 custom-scrollbar">
        {columns.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
