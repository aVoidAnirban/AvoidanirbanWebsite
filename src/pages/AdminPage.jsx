import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../utils/api'
import { parseApiResponse } from '../utils/parseApiResponse'
import { formatDate } from '../utils/formatDate'
import './Admin.css'

const emptyForm = { title: '', content: '', published: true }

export default function AdminPage() {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark'
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  const [authenticated, setAuthenticated] = useState(false)
  const [configured, setConfigured] = useState(true)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadPosts = () =>
    apiFetch('/api/admin/posts')
      .then(parseApiResponse)
      .then((data) => setPosts(data.posts || []))

  useEffect(() => {
    apiFetch('/api/admin/me')
      .then(parseApiResponse)
      .then((data) => {
        setAuthenticated(data.authenticated)
        setConfigured(data.configured)
        if (data.authenticated) return loadPosts()
      })
      .catch(() => setConfigured(false))
      .finally(() => setChecking(false))
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await apiFetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
      })
      const data = await parseApiResponse(res)
      if (!res.ok || !data.success) throw new Error(data.message)
      setAuthenticated(true)
      setPassword('')
      await loadPosts()
    } catch (err) {
      setLoginError(err.message || 'Login failed.')
    }
  }

  const handleLogout = async () => {
    await apiFetch('/api/admin/logout', { method: 'POST' })
    setAuthenticated(false)
    setPosts([])
    setForm(emptyForm)
    setEditingId(null)
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setMessage('')
    setError('')
  }

  const startEdit = (post) => {
    setEditingId(post.id)
    setForm({
      title: post.title,
      content: post.content,
      published: post.published,
    })
    setMessage('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const url = editingId ? `/api/admin/posts/${editingId}` : '/api/admin/posts'
      const method = editingId ? 'PUT' : 'POST'
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(form),
      })
      const data = await parseApiResponse(res)
      if (!res.ok || !data.success) throw new Error(data.message)

      setMessage(editingId ? 'Post updated.' : 'Post published.')
      setForm(emptyForm)
      setEditingId(null)
      await loadPosts()
    } catch (err) {
      setError(err.message || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return
    try {
      const res = await apiFetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
      const data = await parseApiResponse(res)
      if (!res.ok || !data.success) throw new Error(data.message)
      if (editingId === id) resetForm()
      await loadPosts()
      setMessage('Post deleted.')
    } catch (err) {
      setError(err.message || 'Failed to delete.')
    }
  }

  if (checking) {
    return (
      <div className="admin-page">
        <p className="admin-status">Loading…</p>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="admin-page">
        <div className="admin-login-card">
          <h1>Admin login</h1>
          <p className="admin-hint">Only you should know this URL and password.</p>
          {!configured && (
            <p className="admin-setup">
              First time? Run in terminal:{' '}
              <code>npm run admin:hash -- YourSecretPassword</code>
              <br />
              Then add the output to your <code>.env</code> file and restart <code>npm run dev</code>.
            </p>
          )}
          <form onSubmit={handleLogin}>
            <label>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            {loginError && (
              <p className="admin-error" role="alert">
                {loginError}
              </p>
            )}
            <button type="submit" className="btn btn-primary">
              Log in
            </button>
          </form>
          <Link to="/" className="admin-back">
            ← Back to site
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Blog admin</h1>
        <div className="admin-header-actions">
          <Link to="/blog" className="btn btn-outline">
            View blog
          </Link>
          <button type="button" className="btn btn-outline" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit post' : 'New post'}</h2>
        <label>
          <span>Headline</span>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Post title"
            required
          />
        </label>
        <label>
          <span>Content</span>
          <textarea
            rows={12}
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            placeholder="Write your post…"
            required
          />
        </label>
        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
          />
          Published (visible on blog)
        </label>
        {message && <p className="admin-success">{message}</p>}
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Update post' : 'Publish post'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-outline" onClick={resetForm}>
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <section className="admin-posts-list">
        <h2>Your posts ({posts.length})</h2>
        {posts.length === 0 && <p className="admin-status">No posts yet.</p>}
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="admin-post-item">
              <div>
                <time>{formatDate(post.createdAt)}</time>
                <strong>{post.title}</strong>
                {!post.published && <span className="admin-draft">Draft</span>}
              </div>
              <div className="admin-post-item-actions">
                <button type="button" className="btn btn-outline" onClick={() => startEdit(post)}>
                  Edit
                </button>
                <button type="button" className="btn btn-outline admin-delete" onClick={() => handleDelete(post.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
