import { NextRequest, NextResponse } from "next/server";



import {
  deleteTask,
  updateTaskStatus,
} from "@/lib/tasks";

import {
  TASK_STATUSES,
  TaskStatus,
  UpdateTaskInput,
} from "@/types/task";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

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

function parseTaskId(
  value: string
): number | null {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: idParam } =
      await context.params;

    const id = parseTaskId(idParam);

    if (id === null) {
      return NextResponse.json(
        {
          error: "Invalid task ID",
        },
        {
          status: 400,
        }
      );
    }

    const body: unknown =
      await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("status" in body)
    ) {
      return NextResponse.json(
        {
          error: "Status is required",
        },
        {
          status: 400,
        }
      );
    }

    const { status } =
      body as {
        status: unknown;
      };

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

    const input: UpdateTaskInput = {
      status,
    };

    const task =
      await updateTaskStatus(
        id,
        input.status
      );

    if (!task) {
      return NextResponse.json(
        {
          error: "Task not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(task, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "PATCH /api/tasks/:id error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update task",
      },
      {
        status: 500,
      }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: idParam } =
      await context.params;

    const id = parseTaskId(idParam);

    if (id === null) {
      return NextResponse.json(
        {
          error: "Invalid task ID",
        },
        {
          status: 400,
        }
      );
    }

    const deleted =
      await deleteTask(id);

    if (!deleted) {
      return NextResponse.json(
        {
          error: "Task not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message:
          "Task deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "DELETE /api/tasks/:id error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete task",
      },
      {
        status: 500,
      }
    );
  }
}