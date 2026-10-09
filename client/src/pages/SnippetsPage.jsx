import { useEffect, useState } from 'react';
import api from '../api/client';
export default function SnippetsPage() {
  const [snippets, setSnippets] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Load snippets from the backend
  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await api.get('/snippets');
        setSnippets(
          Array.isArray(response.data) ? response.data : []
        );
      } catch (err) {
        setError('Could not load snippets. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchSnippets();
  }, []);
  // Create a snippet
  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const response = await api.post('/snippets', {
        title,
        description,
        code,
        language,
        tags,
      });
      setSnippets((current) => [response.data, ...current]);
      setTitle('');
      setDescription('');
      setCode('');
      setLanguage('javascript');
      setTags('');
      setSuccess('Snippet saved successfully!');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.title ||
        'Could not save the snippet.'
      );
    } finally {
      setSaving(false);
    }
  };
  // Delete a snippet
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this snippet?')) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      await api.delete(`/snippets/${id}`);
      setSnippets((current) =>
        current.filter((snippet) => snippet.id !== id)
      );
      setSuccess('Snippet deleted successfully!');
    } catch (err) {
      setError('Could not delete the snippet.');
    }
  };
  return (
    <main className="page-container">
      <header className="page-header">
        <div>
          <p className="eyebrow">YOUR CODE LIBRARY</p>
          <h1>Code Snippets</h1>
          <p className="page-description">
            Keep reusable code blocks organized and ready
            whenever you need them.
          </p>
        </div>
        <div className="resource-count">
          <strong>{snippets.length}</strong>
          <span>Saved snippets</span>
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
        <h2>Add a snippet</h2>
        <p className="muted">
          Save a useful code example for future projects.
        </p>
        <form onSubmit={handleCreate} className="resource-form">
          <div className="form-group">
            <label htmlFor="snippet-title">Title</label>
            <input
              id="snippet-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. React useState example"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="snippet-language">
              Programming language
            </label>
            <select
              id="snippet-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="jsx">JSX / React</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="csharp">C#</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="sql">SQL</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="snippet-description">Description</label>
            <textarea
              id="snippet-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What does this code do?"
              rows={2}
            />
          </div>
          <div className="form-group">
            <label htmlFor="snippet-tags">Tags</label>
            <input
              id="snippet-tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="e.g. react, hooks, frontend"
            />
          </div>
          <div className="form-group full-width">
            <label htmlFor="snippet-code">Code</label>
            <textarea
              id="snippet-code"
              className="code-input"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder={'function greet() {\n  return "Hello!";\n}'}
              rows={7}
              required
              spellCheck={false}
            />
          </div>
          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving ? 'Saving...' : '+ Save snippet'}
          </button>
        </form>
      </section>
      <section className="resources-section">
        <div className="section-heading">
          <h2>Your snippets</h2>
          <span>{snippets.length} items</span>
        </div>
        {loading ? (
          <p className="muted">Loading snippets...</p>
        ) : snippets.length === 0 ? (
          <div className="empty-state">
            <h3>No snippets yet</h3>
            <p>
              Add your first reusable code example above.
            </p>
          </div>
        ) : (
          <div className="resource-grid">
            {snippets.map((snippet) => (
              <article className="resource-card" key={snippet.id}>
                <div className="resource-card-top">
                  <span className="type-badge">
                    {snippet.language || 'other'}
                  </span>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(snippet.id)}
                  >
                    Delete
                  </button>
                </div>
                <h3>{snippet.title}</h3>
                {snippet.description && (
                  <p className="muted">{snippet.description}</p>
                )}
                <pre className="code-preview">
                  <code>{snippet.code}</code>
                </pre>
                {snippet.tags && (
                  <p className="snippet-tags">
                    Tags: {snippet.tags}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}