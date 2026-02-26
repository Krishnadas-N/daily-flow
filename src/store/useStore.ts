import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Task, Learning, Habit, Idea, TaskStatus, LearningStatus } from '../types';


interface StoreState {
  tasks: Task[];
  learnings: Learning[];
  habits: Habit[];
  ideas: Idea[];
  
  // Tasks Actions
  addTask: (title: string, needsJiraTicket?: boolean) => void;
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
  
  // Analytics Getters (These could just be derived state, but handy to have access logic here if needed)
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      tasks: [],
      learnings: [],
      habits: [
        { id: uuidv4(), name: 'Drink Water', completedDates: [], createdAt: Date.now() },
        { id: uuidv4(), name: 'Read 10 mins', completedDates: [], createdAt: Date.now() }
      ],
      ideas: [],

      // ---- Tasks ----
      addTask: (title, needsJiraTicket = false) => set((state) => {
        const newTask: Task = {
          id: uuidv4(),
          title,
          priority: 'Medium',
          tags: [],
          status: 'Todo',
          needsJiraTicket,
          createdAt: Date.now()
        };
        return { tasks: [newTask, ...state.tasks] };
      }),
      updateTaskStatus: (id, status) => set((state) => ({
        tasks: state.tasks.map(t => {
          if (t.id === id) {
            const isCompleted = status === 'Completed';
            return {
              ...t,
              status,
              completedAt: isCompleted && !t.completedAt ? Date.now() : t.completedAt
            };
          }
          return t;
        })
      })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),

      // ---- Learnings ----
      addLearning: (topic) => set((state) => {
        const newLearning: Learning = {
          id: uuidv4(),
          topic,
          status: 'To Learn',
          tags: [],
          createdAt: Date.now()
        };
        return { learnings: [newLearning, ...state.learnings] };
      }),
      updateLearningStatus: (id, status) => set((state) => ({
        learnings: state.learnings.map(l => l.id === id ? { ...l, status } : l)
      })),
      updateLearning: (id, updates) => set((state) => ({
        learnings: state.learnings.map(l => l.id === id ? { ...l, ...updates } : l)
      })),
      deleteLearning: (id) => set((state) => ({
        learnings: state.learnings.filter(l => l.id !== id)
      })),

      // ---- Habits ----
      addHabit: (name) => set((state) => {
        const newHabit: Habit = {
          id: uuidv4(),
          name,
          completedDates: [],
          createdAt: Date.now()
        };
        return { habits: [...state.habits, newHabit] };
      }),
      toggleHabitDate: (id, dateStr) => set((state) => ({
        habits: state.habits.map(h => {
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
        })
      })),
      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter(h => h.id !== id)
      })),

      // ---- Ideas ----
      addIdea: (content) => set((state) => {
        const newIdea: Idea = {
          id: uuidv4(),
          content,
          createdAt: Date.now()
        };
        return { ideas: [newIdea, ...state.ideas] };
      }),
      deleteIdea: (id) => set((state) => ({
        ideas: state.ideas.filter(i => i.id !== id)
      })),

    }),
    {
      name: 'daily-flow-storage', // name of item in the storage (must be unique)
    }
  )
);
