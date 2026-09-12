"use client";

import { Task, TASK_STATUSES, TaskStatus } from "@/types/task";

interface TaskItemProps {
  task: Task;
  onStatusChange: (
    taskId: number,
    status: TaskStatus
  ) => void;
  onDelete: (taskId: number) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export default function TaskItem({
  task,
  onStatusChange,
  onDelete,
  isUpdating,
  isDeleting,
}: TaskItemProps) {
  return (
    <div>
      <div>
        <h3>{task.title}</h3>

        <select
          value={task.status}
          onChange={(event) =>
            onStatusChange(
              task.id,
              event.target.value as TaskStatus
            )
          }
          disabled={isUpdating}
        >
          {TASK_STATUSES.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}