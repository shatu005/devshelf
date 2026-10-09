import { useEffect, useState } from 'react';
import api from '../api/client';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState('docs');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch resources from the backend
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get('/resources');

        setResources(
          Array.isArray(response.data) ? response.data : []
        );
      } catch (err) {
        setError('Could not load resources. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Add a new resource
  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await api.post('/resources', {
        title,
        url,
        notes,
        type,
      });

      setResources((current) => [response.data, ...current]);

      setTitle('');
      setUrl('');
      setNotes('');
      setType('docs');

      setSuccess('Resource saved successfully!');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.title ||
        'Could not save the resource.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete a resource
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this resource?'
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');

    try {
      await api.delete(`/resources/${id}`);

      setResources((current) =>
        current.filter((resource) => resource.id !== id)
      );

      setSuccess('Resource deleted successfully!');
    } catch (err) {
      setError('Could not delete the resource.');
    }
  };

  return (
    <main className="page-container">
      <header className="page-header">
        <div>
          <p className="eyebrow">YOUR DEVELOPER LIBRARY</p>
          <h1>Resources</h1>
          <p className="page-description">
            Keep useful websites, tutorials, documentation,
            and tools in one place.
          </p>
        </div>

        <div className="resource-count">
          <strong>{resources.length}</strong>
          <span>Saved resources</span>
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
        <h2>Add a resource</h2>
        <p className="muted">
          Save a link you want to find again later.
        </p>

        <form onSubmit={handleCreate} className="resource-form">
          <div className="form-group">
            <label htmlFor="resource-title">Title</label>
            <input
              id="resource-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. React documentation"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="resource-url">URL</label>
            <input
              id="resource-url"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="resource-notes">Notes</label>
            <textarea
              id="resource-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="What makes this resource useful?"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="resource-type">Resource type</label>
            <select
              id="resource-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="docs">Documentation</option>
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="tool">Tool</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving ? 'Saving...' : '+ Save resource'}
          </button>
        </form>
      </section>

      <section className="resources-section">
        <div className="section-heading">
          <h2>Your library</h2>
          <span>{resources.length} items</span>
        </div>

        {loading ? (
          <p className="muted">Loading resources...</p>
        ) : resources.length === 0 ? (
          <div className="empty-state">
            <h3>Your library is empty</h3>
            <p>
              Add your first resource using the form above.
            </p>
          </div>
        ) : (
          <div className="resource-grid">
            {resources.map((resource) => (
              <article
                className="resource-card"
                key={resource.id}
              >
                <div className="resource-card-top">
                  <span className="type-badge">
                    {resource.type || 'other'}
                  </span>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(resource.id)}
                  >
                    Delete
                  </button>
                </div>

                <h3>{resource.title}</h3>

                {resource.notes && (
                  <p className="muted">{resource.notes}</p>
                )}

                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  Open resource ↗
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}