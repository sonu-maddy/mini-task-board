"use client";

import { useCallback, useEffect, useState } from "react";

import TaskForm from "@/components/TaskForm";
import TaskItem from "@/components/TaskItem";

import {
  Task,
  TaskStatus,
} from "@/types/task";

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>(
    []
  );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [updatingTaskId, setUpdatingTaskId] =
    useState<number | null>(null);

  const [deletingTaskId, setDeletingTaskId] =
    useState<number | null>(null);

  const fetchTasks = useCallback(
    async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          "/api/tasks"
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
            "Failed to fetch tasks"
          );
        }

        if (!Array.isArray(data)) {
          throw new Error(
            "Invalid task response"
          );
        }

        setTasks(data as Task[]);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleStatusChange(
    taskId: number,
    status: TaskStatus
  ) {
    try {
      setUpdatingTaskId(taskId);
      setError("");

      const response = await fetch(
        `/api/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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
          "Failed to update task"
        );
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status,
              }
            : task
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update task"
      );
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function handleDelete(
    taskId: number
  ) {
    try {
      setDeletingTaskId(taskId);
      setError("");

      const response = await fetch(
        `/api/tasks/${taskId}`,
        {
          method: "DELETE",
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
          "Failed to delete task"
        );
      }

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== taskId
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete task"
      );
    } finally {
      setDeletingTaskId(null);
    }
  }

  return (
    <main>
      <h1>Mini Task Board</h1>

      <TaskForm
        onTaskCreated={fetchTasks}
      />

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {isLoading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <section>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={
                handleStatusChange
              }
              onDelete={handleDelete}
              isUpdating={
                updatingTaskId === task.id
              }
              isDeleting={
                deletingTaskId === task.id
              }
            />
          ))}
        </section>
      )}
    </main>
  );
}