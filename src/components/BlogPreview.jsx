import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../utils/api'
import { parseApiResponse } from '../utils/parseApiResponse'
import { formatDate } from '../utils/formatDate'
import { useReveal } from '../hooks/useReveal'
import '../pages/Blog.css'

export default function BlogPreview() {
  const ref = useReveal()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    apiFetch('/api/blog')
      .then(parseApiResponse)
      .then((data) => setPosts((data.posts || []).slice(0, 3)))
      .catch(() => setPosts([]))
  }, [])

  if (posts.length === 0) return null

  return (
    <section id="blog" className="blog-preview">
      <div ref={ref} className="reveal">
        <p className="section-label">Blog</p>
        <h2 className="section-title">Latest posts</h2>
        <div className="blog-list blog-list--compact">
          {posts.map((post) => (
            <article key={post.id} className="blog-card">
              <time className="blog-date" dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
              <h3>
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
            </article>
          ))}
        </div>
        <Link to="/blog" className="btn btn-outline blog-preview-link">
          View all posts →
        </Link>
      </div>
    </section>
  )
}
