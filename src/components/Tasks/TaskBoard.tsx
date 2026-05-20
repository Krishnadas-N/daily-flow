import { useMemo } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import TaskColumn from "./TaskColumn";
import { useStore } from "../../store/useStore";
import type { TaskStatus } from "../../types";

const columns: TaskStatus[] = ["Todo", "In Progress", "Completed"];

const TaskBoard = () => {
  const tasks = useStore((state) => state.tasks);
  const updateTaskStatus = useStore((state) => state.updateTaskStatus);
  const tasksByStatus = useMemo(
    () =>
      columns.reduce<Record<TaskStatus, typeof tasks>>((acc, status) => {
        acc[status] = tasks.filter((task) => task.status === status);
        return acc;
      }, { Todo: [], "In Progress": [], Completed: [] }),
    [tasks],
  );

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
            tasks={tasksByStatus[status]}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
