export const TASK_STATUSES = [
  "todo",
  "in-progress",
  "done",
] as const;

export type TaskStatus =
  (typeof TASK_STATUSES)[number];

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  created_at: string;
}

export interface CreateTaskInput {
  title: string;
  status: TaskStatus;
}

export interface UpdateTaskInput {
  status: TaskStatus;
}

export interface ApiError {
  error: string;
}