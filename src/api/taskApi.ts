// src/api/taskApi.ts
import { gql } from '@apollo/client/core';
import defaultClient from '../apollo-client';
import { Task as BaseTask } from '../types/type';

// Extend Task to include selected
interface Task extends BaseTask {
  attributes: BaseTask['attributes'] & {
    selected?: boolean;
  };
}

interface TaskData {
  id: string;
  attributes: {
    description: string | null;
    done: boolean | null;
    selected: boolean | null;
  };
}

const GET_TASKS = gql`
  query GetTasks {
    tasks {
      data {
        id
        attributes {
          description
          done
          selected
        }
      }
    }
  }
`;

const UPDATE_TASK_SELECTED = gql`
  mutation UpdateTask($id: ID!, $selected: Boolean!) {
    updateTask(id: $id, data: { selected: $selected }) {
      data {
        id
        attributes {
          selected
        }
      }
    }
  }
`;

export async function fetchTasks(): Promise<Task[]> {
  try {
    console.log('[TaskApi] Fetching tasks');
    const { data, errors } = await defaultClient.query<{ tasks: { data: TaskData[] } }>({
      query: GET_TASKS,
    });

    if (errors) {
      throw new Error(`GraphQL errors: ${errors.map((e: any) => e.message).join(', ')}`);
    }

    if (!data?.tasks?.data) {
      throw new Error('No tasks data returned from API');
    }

    const tasks: Task[] = data.tasks.data.map((taskData: TaskData) => ({
      id: taskData.id,
      attributes: {
        description: taskData.attributes.description ?? null,
        type: null, // Default since not fetched
        done: taskData.attributes.done ?? null,
        assignedTo: null, // Default since not fetched
        selected: taskData.attributes.selected ?? false,
      },
    }));
    console.log('[TaskApi] Transformed tasks:', tasks);
    return tasks;
  } catch (error: any) {
    console.error('[TaskApi] Error fetching tasks:', error);
    throw error;
  }
}

export async function updateTaskSelected(id: string, selected: boolean): Promise<void> {
  try {
    console.log('[TaskApi] Updating task selection, id:', id, 'selected:', selected);
    const { errors } = await defaultClient.mutate({
      mutation: UPDATE_TASK_SELECTED,
      variables: { id, selected },
    });

    if (errors) {
      throw new Error(`GraphQL errors: ${errors.map((e: any) => e.message).join(', ')}`);
    }
  } catch (error: any) {
    console.error('[TaskApi] Error updating task selection:', error);
    throw error;
  }
}