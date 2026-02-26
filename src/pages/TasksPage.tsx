import TaskBoard from "../components/Tasks/TaskBoard";

const TasksPage = () => {
  return (
    <div className="h-full flex flex-col pt-4 md:pt-8 px-2 md:px-8 max-w-[1400px] mx-auto w-full animate-slide-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
          Tasks
        </h1>
        <p className="text-slate-500 font-medium">
          Manage your daily workflow, drag and drop to transition.
        </p>
      </div>

      <TaskBoard />
    </div>
  );
};

export default TasksPage;
