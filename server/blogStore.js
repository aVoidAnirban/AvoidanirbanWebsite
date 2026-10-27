import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_FILE = path.join(__dirname, 'data/blog.json')

async function readBlog() {
  try {
    const raw = await fs.readFile(BLOG_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { posts: [] }
  }
}

async function writeBlog(data) {
  await fs.mkdir(path.dirname(BLOG_FILE), { recursive: true })
  await fs.writeFile(BLOG_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

function makeExcerpt(content, maxLen = 160) {
  const plain = content.replace(/\s+/g, ' ').trim()
  if (plain.length <= maxLen) return plain
  return `${plain.slice(0, maxLen).trim()}…`
}

function sortPosts(posts) {
  return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export async function getPublishedPosts() {
  const { posts } = await readBlog()
  return sortPosts(posts.filter((p) => p.published)).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }))
}

export async function getPostBySlug(slug) {
  const { posts } = await readBlog()
  const post = posts.find((p) => p.slug === slug && p.published)
  return post || null
}

export async function getAllPosts() {
  const { posts } = await readBlog()
  return sortPosts(posts)
}

export async function createPost({ title, content, published = true }) {
  const titleClean = String(title || '').trim().slice(0, 200)
  const contentClean = String(content || '').trim().slice(0, 50000)

  if (titleClean.length < 3) throw new Error('Title must be at least 3 characters.')
  if (contentClean.length < 10) throw new Error('Content must be at least 10 characters.')

  const data = await readBlog()
  let slug = slugify(titleClean) || 'post'
  const base = slug
  let n = 1
  while (data.posts.some((p) => p.slug === slug)) {
    slug = `${base}-${n}`
    n += 1
  }

  const now = new Date().toISOString()
  const post = {
    id: crypto.randomUUID(),
    slug,
    title: titleClean,
    content: contentClean,
    excerpt: makeExcerpt(contentClean),
    published: Boolean(published),
    createdAt: now,
    updatedAt: now,
  }

  data.posts.push(post)
  await writeBlog(data)
  return post
}

export async function updatePost(id, { title, content, published }) {
  const data = await readBlog()
  const index = data.posts.findIndex((p) => p.id === id)
  if (index === -1) throw new Error('Post not found.')

  const post = data.posts[index]
  const titleClean = title !== undefined ? String(title).trim().slice(0, 200) : post.title
  const contentClean = content !== undefined ? String(content).trim().slice(0, 50000) : post.content

  if (titleClean.length < 3) throw new Error('Title must be at least 3 characters.')
  if (contentClean.length < 10) throw new Error('Content must be at least 10 characters.')

  post.title = titleClean
  post.content = contentClean
  post.excerpt = makeExcerpt(contentClean)
  post.published = published !== undefined ? Boolean(published) : post.published
  post.updatedAt = new Date().toISOString()

  if (title !== undefined) {
    const newSlug = slugify(titleClean)
    if (newSlug && !data.posts.some((p) => p.id !== id && p.slug === newSlug)) {
      post.slug = newSlug
    }
  }

  data.posts[index] = post
  await writeBlog(data)
  return post
}

export async function deletePost(id) {
  const data = await readBlog()
  const before = data.posts.length
  data.posts = data.posts.filter((p) => p.id !== id)
  if (data.posts.length === before) throw new Error('Post not found.')
  await writeBlog(data)
}
