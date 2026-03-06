import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type {
  Task,
  Learning,
  Habit,
  Idea,
  Reminder,
  Note,
  Bookmark,
  TaskStatus,
  LearningStatus,
} from "../types";

interface StoreState {
  tasks: Task[];
  learnings: Learning[];
  habits: Habit[];
  ideas: Idea[];
  reminders: Reminder[];
  notes: Note[];
  bookmarks: Bookmark[];
  isSidebarCollapsed: boolean;

  // Tasks Actions
  addTask: (
    title: string,
    needsJiraTicket?: boolean,
    priority?: "Low" | "Medium" | "High",
  ) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Learnings Actions
  addLearning: (topic: string) => void;
  updateLearningStatus: (id: string, status: LearningStatus) => void;
  updateLearning: (id: string, updates: Partial<Learning>) => void;
  deleteLearning: (id: string) => void;

  // Habits Actions
  addHabit: (name: string) => void;
  toggleHabitDate: (id: string, dateStr: string) => void;
  deleteHabit: (id: string) => void;

  // Idea Actions
  addIdea: (content: string) => void;
  deleteIdea: (id: string) => void;

  // Reminders Actions
  addReminder: (title: string, date?: string, time?: string) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;

  // Notes Actions
  addNote: (title: string, content: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Bookmarks Actions
  addBookmark: (
    url: string,
    title: string,
    group: string,
    subgroup?: string,
    description?: string,
    imageUrl?: string,
    metadata?: Record<string, string>,
  ) => string;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;

  // UI Actions
  toggleSidebarCollapse: () => void;

  // Analytics Getters (These could just be derived state, but handy to have access logic here if needed)
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      tasks: [],
      learnings: [],
      habits: [
        {
          id: uuidv4(),
          name: "Drink Water",
          completedDates: [],
          createdAt: Date.now(),
        },
        {
          id: uuidv4(),
          name: "Read 10 mins",
          completedDates: [],
          createdAt: Date.now(),
        },
      ],
      ideas: [],
      reminders: [],
      notes: [],
      bookmarks: [],
      isSidebarCollapsed: false,

      // ---- Tasks ----
      addTask: (title, needsJiraTicket = false, priority = "Medium") =>
        set((state) => {
          const newTask: Task = {
            id: uuidv4(),
            title,
            priority,
            tags: [],
            status: "Todo",
            needsJiraTicket,
            createdAt: Date.now(),
          };
          return { tasks: [newTask, ...state.tasks] };
        }),
      updateTaskStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id === id) {
              const isCompleted = status === "Completed";
              return {
                ...t,
                status,
                completedAt:
                  isCompleted && !t.completedAt ? Date.now() : t.completedAt,
              };
            }
            return t;
          }),
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t,
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      // ---- Learnings ----
      addLearning: (topic) =>
        set((state) => {
          const newLearning: Learning = {
            id: uuidv4(),
            topic,
            status: "To Learn",
            tags: [],
            createdAt: Date.now(),
          };
          return { learnings: [newLearning, ...state.learnings] };
        }),
      updateLearningStatus: (id, status) =>
        set((state) => ({
          learnings: state.learnings.map((l) =>
            l.id === id ? { ...l, status } : l,
          ),
        })),
      updateLearning: (id, updates) =>
        set((state) => ({
          learnings: state.learnings.map((l) =>
            l.id === id ? { ...l, ...updates } : l,
          ),
        })),
      deleteLearning: (id) =>
        set((state) => ({
          learnings: state.learnings.filter((l) => l.id !== id),
        })),

      // ---- Habits ----
      addHabit: (name) =>
        set((state) => {
          const newHabit: Habit = {
            id: uuidv4(),
            name,
            completedDates: [],
            createdAt: Date.now(),
          };
          return { habits: [...state.habits, newHabit] };
        }),
      toggleHabitDate: (id, dateStr) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id === id) {
              const dates = new Set(h.completedDates);
              if (dates.has(dateStr)) {
                dates.delete(dateStr);
              } else {
                dates.add(dateStr);
              }
              return { ...h, completedDates: Array.from(dates) };
            }
            return h;
          }),
        })),
      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),

      // ---- Ideas ----
      addIdea: (content) =>
        set((state) => {
          const newIdea: Idea = {
            id: uuidv4(),
            content,
            createdAt: Date.now(),
          };
          return { ideas: [newIdea, ...state.ideas] };
        }),
      deleteIdea: (id) =>
        set((state) => ({
          ideas: state.ideas.filter((i) => i.id !== id),
        })),

      // ---- Reminders ----
      addReminder: (title, date, time) =>
        set((state) => {
          const newReminder: Reminder = {
            id: uuidv4(),
            title,
            reminderDate: date,
            reminderTime: time,
            createdAt: Date.now(),
          };
          return { reminders: [newReminder, ...state.reminders] };
        }),
      updateReminder: (id, updates) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, ...updates } : r,
          ),
        })),
      deleteReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        })),

      // ---- Notes ----
      addNote: (title, content) =>
        set((state) => {
          const newNote: Note = {
            id: uuidv4(),
            title,
            content,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          return { notes: [newNote, ...state.notes] };
        }),
      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n,
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),

      // ---- Bookmarks ----
      addBookmark: (
        url,
        title,
        group,
        subgroup,
        description,
        imageUrl,
        metadata,
      ) => {
        const id = uuidv4();
        set((state) => {
          const newBookmark: Bookmark = {
            id,
            url,
            title,
            group,
            subgroup,
            description,
            imageUrl,
            metadata,
            createdAt: Date.now(),
          };
          return { bookmarks: [newBookmark, ...state.bookmarks] };
        });
        return id;
      },
      updateBookmark: (id, updates) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === id ? { ...b, ...updates } : b,
          ),
        })),
      deleteBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),

      // ---- UI ----
      toggleSidebarCollapse: () =>
        set((state) => ({
          isSidebarCollapsed: !state.isSidebarCollapsed,
        })),
    }),
    {
      name: "daily-flow-storage", // name of item in the storage (must be unique)
    },
  ),
);
