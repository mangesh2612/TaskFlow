import type { Task } from '../types/task'
import TaskCard from './TaskCard'

type TaskListProps = {
    tasks : Task[]
    loading: boolean
    error: string | null
    searchText: string
    statusFilter: 'All' | 'Pending' | 'Completed'
    onToggle: (task: Task) => void
    onEdit: (task: Task) => void
    onDelete: (taskId: number) => void
}

function TaskList({
    tasks,
    loading,
    error,
    searchText,
    statusFilter,
    onToggle,
    onEdit,
    onDelete,
}: TaskListProps) {
    if (loading){
        return <p>Loading tasks...</p>
    }
    if (error) {
        return <p role="alear">{error}</p>
    }

    if (tasks.length === 0){
        const hasfilters = searchText.trim() !== '' || statusFilter !== 'All'

        return (
            <p className="empty-state">
                {hasfilters
                    ? 'No tasks match your search or selected filter.'
                    : 'No tasks yet. Create your first task!'
                }

            </p>
        )
    }
    return (
        <div className="task-list">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    />
            ))

            }
        </div>
    )
}

export default TaskList