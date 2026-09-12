import { NextRequest, NextResponse } from "next/server";

import {
  createTask,
  getTasks,
} from "@/lib/tasks";

import {
  CreateTaskInput,
  TASK_STATUSES,
  TaskStatus,
} from "@/types/task";

function isValidStatus(
  value: unknown
): value is TaskStatus {
  return (
    typeof value === "string" &&
    TASK_STATUSES.includes(
      value as TaskStatus
    )
  );
}

export async function GET() {
  try {
    const tasks = await getTasks();

    return NextResponse.json(tasks, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "GET /api/tasks error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch tasks",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body: unknown =
      await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("title" in body) ||
      !("status" in body)
    ) {
      return NextResponse.json(
        {
          error:
            "Title and status are required",
        },
        {
          status: 400,
        }
      );
    }

    const {
      title,
      status,
    } = body as {
      title: unknown;
      status: unknown;
    };

    if (
      typeof title !== "string" ||
      title.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Task title cannot be empty",
        },
        {
          status: 400,
        }
      );
    }

    if (!isValidStatus(status)) {
      return NextResponse.json(
        {
          error:
            "Status must be todo, in-progress, or done",
        },
        {
          status: 400,
        }
      );
    }

    const input: CreateTaskInput = {
      title: title.trim(),
      status,
    };

    const task = await createTask(input);

    return NextResponse.json(task, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "POST /api/tasks error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to create task",
      },
      {
        status: 500,
      }
    );
  }
}