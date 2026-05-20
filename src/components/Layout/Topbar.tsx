import React, { useState } from "react";
import { useStore } from "../../store/useStore";
import {
  Plus,
  Hash,
  GraduationCap,
  Lightbulb,
  Moon,
  Sun,
  Cloud,
  LogOut,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { ItemType } from "../../types";
import { useCloudSync } from "../../hooks/useCloudSync";

const Topbar = () => {
  const [input, setInput] = useState("");
  const [type, setType] = useState<ItemType>("Task");
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const addTask = useStore((state) => state.addTask);
  const addLearning = useStore((state) => state.addLearning);
  const addIdea = useStore((state) => state.addIdea);
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const {
    session,
    syncState,
    lastSyncedAt,
    isSyncing,
    sendMagicLink,
    signOut,
    syncNow,
  } = useCloudSync();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (type === "Task") {
      addTask(input.trim(), false);
    } else if (type === "Learning") {
      addLearning(input.trim());
    } else if (type === "Idea") {
      addIdea(input.trim());
    }

    setInput("");
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!emailInput.trim()) return;
    try {
      await sendMagicLink(emailInput);
      setEmailInput("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to send magic link. Check Supabase config.";
      window.alert(message);
    }
  };

  const handleSync = async () => {
    try {
      await syncNow();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Cloud sync failed.";
      window.alert(message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowConnectForm(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Sign out failed.";
      window.alert(message);
    }
  };

  const statusTone =
    syncState === "syncing"
      ? "text-sky-600 bg-sky-50 border-sky-200 dark:text-sky-300 dark:bg-sky-500/10 dark:border-sky-400/30"
      : syncState === "error"
        ? "text-rose-600 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-500/10 dark:border-rose-400/30"
        : "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-400/30";

  const types: { value: ItemType; icon: React.ReactNode; label: string }[] = [
    { value: "Task", icon: <Hash size={14} />, label: "Task" },
    { value: "Learning", icon: <GraduationCap size={14} />, label: "Learning" },
    { value: "Idea", icon: <Lightbulb size={14} />, label: "Idea" },
  ];

  return (
    <div className="w-full sticky top-0 z-30 px-3 md:px-8 py-1.5 md:py-2 border-b border-slate-200 bg-slate-100/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="hidden md:block">
            <h2 className="text-slate-800 dark:text-slate-100 font-semibold text-sm leading-tight tracking-tight">
              Focus Workspace
            </h2>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={toggleTheme}
              title="Toggle theme"
              className="shrink-0 p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {session ? (
              <>
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={isSyncing}
                  title="Sync across devices"
                  className="shrink-0 p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-60 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {isSyncing ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Cloud size={17} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign out from cloud sync"
                  className="hidden sm:flex shrink-0 p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <LogOut size={17} />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowConnectForm((prev) => !prev)}
                title="Connect cloud sync"
                className="shrink-0 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors text-xs font-semibold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Connect Cloud
              </button>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl flex items-center p-1 shadow-sm transition-colors focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 focus-within:bg-white dark:bg-slate-900 dark:border-slate-700 dark:focus-within:bg-slate-900"
        >
          <div className="flex bg-slate-100/90 rounded-lg p-0.5 mr-1.5 border border-slate-200/60 shrink-0 dark:bg-slate-800 dark:border-slate-700">
            {types.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-semibold transition-colors shadow-sm ${
                  type === t.value
                    ? "bg-white text-indigo-600 border border-slate-200/50 dark:bg-slate-700 dark:text-indigo-300 dark:border-slate-600"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/40 shadow-none border border-transparent dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700/70"
                }`}
              >
                <div
                  className={
                    type === t.value
                      ? "text-indigo-500 dark:text-indigo-300"
                      : "text-slate-400 dark:text-slate-500"
                  }
                >
                  {t.icon}
                </div>
                <span className="hidden lg:inline">{t.label}</span>
              </button>
            ))}
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Quick add new ${type.toLowerCase()}...`}
            className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 text-sm px-1 sm:px-2 py-1.5 placeholder-slate-400 dark:placeholder-slate-500 font-medium min-w-0"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="ml-1 sm:ml-2 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 shadow-sm shrink-0"
          >
            <Plus size={18} />
          </button>
        </form>

        {showConnectForm && !session ? (
          <form
            onSubmit={handleSignIn}
            className="mt-1.5 w-full flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700"
          >
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-indigo-400"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              Send Link
            </button>
          </form>
        ) : null}

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
          {session ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-indigo-200 text-indigo-700 bg-indigo-50 dark:border-indigo-400/40 dark:text-indigo-300 dark:bg-indigo-500/10">
              <Cloud size={13} />
              {session.user.email}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 text-slate-600 bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:bg-slate-800">
              <Cloud size={13} />
              Local only
            </span>
          )}

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${statusTone}`}
          >
            {syncState === "syncing" ? (
              <Loader2 size={13} className="animate-spin" />
            ) : syncState === "error" ? (
              <AlertCircle size={13} />
            ) : (
              <CheckCircle2 size={13} />
            )}
            {isSyncing
              ? "Syncing..."
              : syncState === "error"
                ? "Sync issue"
                : "Ready"}
          </span>

          {lastSyncedAt ? (
            <span className="text-slate-500 dark:text-slate-400">
              Last sync {new Date(lastSyncedAt).toLocaleTimeString()}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
