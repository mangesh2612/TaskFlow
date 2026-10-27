import type { SyntheticEvent } from 'react'

type TaskFormModalProps = {
  isOpen: boolean;
  isEditing: boolean;
  title: string;
  description: string;
  error: string | null;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

function TaskFormModal({
  isOpen,
  isEditing,
  title,
  description,
  error,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  onCancel,
}: TaskFormModalProps) {
  if (!isOpen) {
    return null;
  }
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditing ? "Edit Task" : "Create a New Task"}</h2>
        <form className="task-form" onSubmit={onSubmit}>
          <label htmlFor="title">Task Title</label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Enter task title"
            required
            maxLength={200}
          />
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="Enter task description"
            rows={4}
          />
          {error && <p className="error-message">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="add-button">
              {isEditing ? "Save Changes" : "Save Task"}
            </button>
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskFormModal
