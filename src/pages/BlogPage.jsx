import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../utils/api'
import { parseApiResponse } from '../utils/parseApiResponse'
import { formatDate } from '../utils/formatDate'
import './Blog.css'

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch('/api/blog')
      .then(parseApiResponse)
      .then((data) => setPosts(data.posts || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="blog-page">
      <p className="section-label">Blog</p>
      <h1 className="section-title">Writing &amp; updates</h1>
      <p className="blog-intro">Thoughts on dev, projects, and things I am learning.</p>

      {loading && <p className="blog-status">Loading posts…</p>}
      {error && <p className="blog-error">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p className="blog-status">No posts yet. Check back soon.</p>
      )}

      <div className="blog-list">
        {posts.map((post) => (
          <article key={post.id} className="blog-card">
            <time className="blog-date" dateTime={post.createdAt}>
              {formatDate(post.createdAt)}
            </time>
            <h2>
              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.excerpt && <p className="blog-excerpt">{post.excerpt}</p>}
            <Link to={`/blog/${post.slug}`} className="blog-read-more">
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
