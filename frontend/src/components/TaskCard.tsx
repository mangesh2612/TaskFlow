import type { Task } from "../types/task";

type TaskCardProps = {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
};

function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  return (
    <article className="task-card">
      <div className="task-details">
        <label className="completion-control">
          <input
            type="checkbox"
            checked={task.is_completed}
            onChange={() => onToggle(task)}
             aria-label={`Mark ${task.title} as ${
              task.is_completed ? 'pending' : 'completed'
            }`}
          />
          <span className={task.is_completed ? 'task-title completed-title' : 'task-title'}>
            {task.title}
          </span>
        </label>
        <p>{task.description || "No description provided."}</p>
      </div>
      <div className="task-actions">
        <span
          className={`status ${task.is_completed ? "completed" : "pending"}`}
        >
          {task.is_completed ? "Completed" : "Pending"}
        </span>
        <button
          type="button"
          className="cancel-button"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        <button
          type="button"
          className="cancel-button"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskCard
