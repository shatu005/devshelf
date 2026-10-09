import { useEffect, useState } from 'react';
import api from '../api/client';
export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [project, setProject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Fetch tasks, optionally filtered by status
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError('');
      try {
        const endpoint = filterStatus
          ? `/tasks?status=${encodeURIComponent(filterStatus)}`
          : '/tasks';
        const response = await api.get(endpoint);
        setTasks(
          Array.isArray(response.data) ? response.data : []
        );
      } catch (err) {
        setError('Could not load tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [filterStatus]);
  // Create a task
  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const response = await api.post('/tasks', {
        title,
        description,
        status: 'todo',
        priority,
        project,
      });
      // Add the task immediately if it matches the current filter
      const newTask = response.data;
      if (!filterStatus || newTask.status === filterStatus) {
        setTasks((current) => [newTask, ...current]);
      }
      setTitle('');
      setDescription('');
      setPriority('medium');
      setProject('');
      setSuccess('Task created successfully!');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.title ||
        'Could not create the task.'
      );
    } finally {
      setSaving(false);
    }
  };
  // Update only the task status using PATCH
  const handleStatusChange = async (id, newStatus) => {
    setError('');
    setSuccess('');
    try {
      const response = await api.patch(
        `/tasks/${id}/status`,
        { status: newStatus }
      );
      setTasks((current) => {
        // Remove it from the list if it no longer matches the filter
        if (filterStatus && newStatus !== filterStatus) {
          return current.filter((task) => task.id !== id);
        }
        return current.map((task) =>
          task.id === id
            ? { ...task, ...response.data, status: newStatus }
            : task
        );
      });
      setSuccess('Task status updated!');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Could not update task status.'
      );
    }
  };
  // Delete a task
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((current) =>
        current.filter((task) => task.id !== id)
      );
      setSuccess('Task deleted successfully!');
    } catch (err) {
      setError('Could not delete the task.');
    }
  };
  return (
    <main className="page-container">
      <header className="page-header">
        <div>
          <p className="eyebrow">YOUR DEVELOPER WORKSPACE</p>
          <h1>My Tasks</h1>
          <p className="page-description">
            Plan your work, track progress, and keep your
            development projects organized.
          </p>
        </div>
        <div className="resource-count">
          <strong>{tasks.length}</strong>
          <span>Tasks displayed</span>
        </div>
      </header>
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="success-message" role="status">
          {success}
        </div>
      )}
      <section className="content-card">
        <h2>Create a task</h2>
        <p className="muted">
          Break your next project into manageable tasks.
        </p>
        <form onSubmit={handleCreate} className="resource-form">
          <div className="form-group">
            <label htmlFor="task-title">Task title</label>
            <input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Build the login page"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="task-project">Project</label>
            <input
              id="task-project"
              value={project}
              onChange={(event) => setProject(event.target.value)}
              placeholder="e.g. DevShelf"
            />
          </div>
          <div className="form-group">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group full-width">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What needs to be done?"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving ? 'Creating...' : '+ Create task'}
          </button>
        </form>
      </section>
      <section className="resources-section">
        <div className="section-heading">
          <h2>Your tasks</h2>
          <div className="task-filter">
            <label htmlFor="status-filter">Filter:</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
            >
              <option value="">All tasks</option>
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>
        {loading ? (
          <p className="muted">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks found</h3>
            <p>
              Create a task above or choose a different filter.
            </p>
          </div>
        ) : (
          <div className="resource-grid">
            {tasks.map((task) => (
              <article className="resource-card" key={task.id}>
                <div className="resource-card-top">
                  <span className="type-badge">
                    {task.priority || 'medium'} priority
                  </span>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
                <h3>{task.title}</h3>
                {task.project && (
                  <p className="muted">Project: {task.project}</p>
                )}
                {task.description && (
                  <p className="muted">{task.description}</p>
                )}
                <div className="task-status">
                  <label htmlFor={`status-${task.id}`}>
                    Status
                  </label>
                  <select
                    id={`status-${task.id}`}
                    value={task.status}
                    onChange={(event) =>
                      handleStatusChange(task.id, event.target.value)
                    }
                  >
                    <option value="todo">To do</option>
                    <option value="in-progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}