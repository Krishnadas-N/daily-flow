import LearningBoard from "../components/Learnings/LearningBoard";

const LearningsPage = () => {
  return (
    <div className="h-full flex flex-col pt-4 md:pt-8 px-2 md:px-8 max-w-[1400px] mx-auto w-full animate-slide-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
          Knowledge Vault
        </h1>
        <p className="text-slate-500 font-medium">
          Track what you're learning. Categorize by status.
        </p>
      </div>

      <LearningBoard />
    </div>
  );
};

export default LearningsPage;
