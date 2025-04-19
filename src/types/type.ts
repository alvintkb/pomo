// src/types/task.ts
export interface Task {
    id: string;
    attributes: {
      description: string | null;
      type: string | null;
      done: boolean | null;
      assignedTo: string | null;
    };
  }

  