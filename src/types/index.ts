export type TaskStatus = "Todo" | "In Progress" | "Completed";
export type LearningStatus = "To Learn" | "Learning" | "Mastered";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  tags: string[];
  status: TaskStatus;
  needsJiraTicket: boolean;
  createdAt: number;
  completedAt?: number;
  reminderDate?: string;
  reminderTime?: string;
}

export interface Learning {
  id: string;
  topic: string;
  notes?: string;
  status: LearningStatus;
  tags: string[];
  createdAt: number;
}

export interface Habit {
  id: string;
  name: string;
  completedDates: string[]; // ISO date strings like "2023-10-25"
  createdAt: number;
}

export interface Idea {
  id: string;
  content: string;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface Reminder {
  id: string;
  title: string;
  reminderDate?: string;
  reminderTime?: string;
  createdAt: number;
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
  group: string;
  subgroup?: string;
  metadata?: Record<string, string>;
  createdAt: number;
}

export type ItemType = "Task" | "Learning" | "Idea" | "Reminder" | "Bookmark";

export interface ArchitectureNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
}
