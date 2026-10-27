export interface Task {
    id: number;
    title: string;
    description?: string | null;
    is_completed: boolean;
    created_at: string;
}

export type TaskFilter = "All" | "Completed" | "Pending";