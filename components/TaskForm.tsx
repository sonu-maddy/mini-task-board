"use client";

import { FormEvent, useState } from "react";

import {
  TASK_STATUSES,
  TaskStatus,
} from "@/types/task";

interface TaskFormProps {
  onTaskCreated: () => void;
}

export default function TaskForm({
  onTaskCreated,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] =
    useState<TaskStatus>("todo");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Task title cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch(
        "/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: trimmedTitle,
            status,
          }),
        }
      );

      const data: unknown =
        await response.json();

      if (!response.ok) {
        if (
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
        ) {
          throw new Error(data.error);
        }

        throw new Error(
          "Failed to create task"
        );
      }

      setTitle("");
      setStatus("todo");
      onTaskCreated();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="task-title">
          Task title
        </label>

        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="Enter task title"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="task-status">
          Status
        </label>

        <select
          id="task-status"
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as TaskStatus
            )
          }
          disabled={isSubmitting}
        >
          {TASK_STATUSES.map((taskStatus) => (
            <option
              key={taskStatus}
              value={taskStatus}
            >
              {taskStatus}
            </option>
          ))}
        </select>
      </div>

      {error && (
        
          <p role="alert">
            {error}
          </p>
     
      )}

      <button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Adding..."
          : "Add Task"}
      </button>
    </form>
  );
}