import { pool } from "./db";

import {
  CreateTaskInput,
  Task,
  TaskStatus,
} from "@/types/task";

export async function getTasks(): Promise<Task[]> {
  const result = await pool.query<Task>(
    `
      SELECT
        id,
        title,
        status,
        created_at
      FROM tasks
      ORDER BY created_at DESC
    `
  );

  return result.rows;
}

export async function createTask(
  input: CreateTaskInput
): Promise<Task> {
  const result = await pool.query<Task>(
    `
      INSERT INTO tasks (title, status)
      VALUES ($1, $2)
      RETURNING
        id,
        title,
        status,
        created_at
    `,
    [input.title, input.status]
  );

  return result.rows[0];
}

export async function updateTaskStatus(
  id: number,
  status: TaskStatus
): Promise<Task | null> {
  const result = await pool.query<Task>(
    `
      UPDATE tasks
      SET status = $1
      WHERE id = $2
      RETURNING
        id,
        title,
        status,
        created_at
    `,
    [status, id]
  );

  return result.rows[0] ?? null;
}

export async function deleteTask(
  id: number
): Promise<boolean> {
  const result = await pool.query(
    `
      DELETE FROM tasks
      WHERE id = $1
    `,
    [id]
  );

  return result.rowCount === 1;
}