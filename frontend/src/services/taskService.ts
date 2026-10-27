import type { Task } from '../types/task';

const API_URL = 'http://127.0.0.1:8001';

export type CreateTaskData = {
    title: string;
    description?: string | null;
}

export type UpdateTaskData = CreateTaskData & {
    is_completed: boolean;
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed: ${response.status}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export async function getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_URL}/tasks`)
    return handleResponse<Task[]>(response);
}

export async function createTask(data: CreateTaskData): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    return handleResponse<Task>(response);
}

export async function updateTask(
  taskId: number,
  data: UpdateTaskData,
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  return handleResponse<Task>(response)
}

export async function toggleTaskCompletion(
    taskId: number,
    isCompleted: boolean,
) : Promise<Task> {
    const response = await fetch(
        `${API_URL}/tasks/${taskId}?is_completed=${isCompleted}`, {
        method: 'PATCH',
    });
    return handleResponse<Task>(response);
}

export async function deleteTask(taskId: number): Promise<void> {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
    });
    return handleResponse<void>(response);
}
