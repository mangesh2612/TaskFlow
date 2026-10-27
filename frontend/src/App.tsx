import { useEffect, useState } from "react";
import "./App.css";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
} from "./services/taskService";

import type { UpdateTaskData } from "./services/taskService";

import type { Task, TaskFilter } from "./types/task";

import TaskToolbar from "./components/TaskToolbar";

import TaskList from './components/TaskList'

import TaskSummary from "./components/TaskSummary";

import TaskFormModal from "./components/TaskFormModal";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskFilter>("All");

  function handleEditClick(task: Task) {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description ?? "");
    setShowTaskModal(true);
  }

  async function handleUpdateTask(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingTaskId === null) return;

    try {
      const updateData: UpdateTaskData = {
        title: title.trim(),
        description: description.trim() || null,
        is_completed:
          tasks.find((task) => task.id === editingTaskId)?.is_completed ??
          false,
      };

      const updatedTask: Task = await updateTask(editingTaskId, updateData);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        ),
      );

      setTitle("");
      setDescription("");
      setEditingTaskId(null);
      setShowTaskModal(false);
      setError(null);
    } catch {
      setError("Could not update the task. Please try again.");
    }
  }

  async function handleDeleteTask(taskId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) return;

    try {
      await deleteTask(taskId);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id != taskId),
      );
      setError(null);
    } catch {
      setError("Could not delete the task. Please try again.");
    }
  }

  async function handleToggleTask(task: Task) {
    const nextStatus = !task.is_completed;
    try {
      const updatedTask = await toggleTaskCompletion(task.id, nextStatus);

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === updatedTask.id ? updatedTask : item,
        ),
      );

      setError(null);
    } catch {
      setError("Could not update the task. Please try again.");
    }
  }

  async function handleCreateTask(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const newTask = {
        title: title.trim(),
        description: description.trim() || null,
      };

      const createdTask = await createTask(newTask);

      setTasks((currentTasks) => [...currentTasks, createdTask]);
      setTitle("");
      setDescription("");
      setShowTaskModal(false);
      setError(null);
    } catch {
      setError(
        "Could not save the task. Please check the backend server and try again.",
      );
    }
  }

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await getTasks();
        setTasks(data);
        setError(null);
      } catch {
        setError("Could not load tasks. Please check the backend server.");
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const completedCount = tasks.filter((task) => task.is_completed).length;

  const remainingCount = tasks.length - completedCount;

  const filteredTasks = tasks.filter((task) => {
    const query = searchText.trim().toLowerCase();

    const matchesSearch =
      task.title.toLowerCase().includes(query) ||
      (task.description ?? "").toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Completed" && task.is_completed) ||
      (statusFilter === "Pending" && !task.is_completed);

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="taskflow">
      <header className="app-header">
        <div>
          <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
          <h1>TaskFlow</h1>
          <p className="subtitle">Plan you work. Make Progress every day.</p>
        </div>
        <button
          className="add-button"
          type="button"
          onClick={() => setShowTaskModal(true)}
        >
          + New Task
        </button>
      </header>

      <TaskFormModal 
          isOpen={showTaskModal}
          isEditing={editingTaskId !== null}
          title={title}
          description={description}
          error={error}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onSubmit={(event) => {
            event.preventDefault()

            if(editingTaskId !== null) {
              void handleUpdateTask(event)
            } else {
              void handleCreateTask(event)
            }
          }}
          onCancel={() => {
            setShowTaskModal(false)
            setEditingTaskId(null)
            setTitle('')
            setDescription('')
          }}
          
        />

      <TaskSummary 
        totalTasks={tasks.length}
        completedTasks={completedCount}
        remainingTasks={remainingCount}  
      />

      <section className="tasks-section">
        <div className="section-heading">
          <h2>My Tasks</h2>
          <span>{filteredTasks.length} tasks</span>
        </div>
        <TaskToolbar
          searchText={searchText}
          statusFilter={statusFilter}
          onSearchChange={setSearchText}
          onStatusFilterChange={setStatusFilter}
        />
        
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          error={error}
          searchText={searchText}
          statusFilter={statusFilter}
          onToggle={handleToggleTask}
          onEdit={handleEditClick}
          onDelete={handleDeleteTask} />
        
      </section>
    </main>
  );
}

export default App;
