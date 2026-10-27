import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../utils/api'
import { parseApiResponse } from '../utils/parseApiResponse'
import { formatDate } from '../utils/formatDate'
import './Blog.css'

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    apiFetch(`/api/blog/${slug}`)
      .then(parseApiResponse)
      .then((data) => setPost(data.post))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <article className="blog-page blog-post-page">
      <Link to="/blog" className="blog-back">
        ← All posts
      </Link>

      {loading && <p className="blog-status">Loading…</p>}
      {error && <p className="blog-error">{error}</p>}

      {post && (
        <>
          <time className="blog-date" dateTime={post.createdAt}>
            {formatDate(post.createdAt)}
          </time>
          <h1 className="blog-post-title">{post.title}</h1>
          <div className="blog-post-body">
            {post.content.split('\n').map((line, i) => (
              <p key={i}>{line || '\u00A0'}</p>
            ))}
          </div>
        </>
      )}
    </article>
  )
}
