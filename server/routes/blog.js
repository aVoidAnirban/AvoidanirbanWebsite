import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import {
  getPublishedPosts,
  getPostBySlug,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} from '../blogStore.js'
import {
  verifyPassword,
  signToken,
  setAuthCookie,
  clearAuthCookie,
  requireAdmin,
  verifyToken,
  getJwtSecret,
  getPasswordHash,
  COOKIE_NAME,
} from '../auth.js'

export function createBlogRouter({ isProd }) {
  const router = Router()

  router.get('/blog', async (_req, res) => {
    try {
      const posts = await getPublishedPosts()
      res.json({ success: true, posts })
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to load posts.' })
    }
  })

  router.get('/blog/:slug', async (req, res) => {
    try {
      const post = await getPostBySlug(req.params.slug)
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found.' })
      }
      res.json({ success: true, post })
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to load post.' })
    }
  })

  return router
}

export function createAdminRouter({ isProd }) {
  const router = Router()

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: 'Too many login attempts. Try again later.' },
  })

  router.get('/admin/me', (req, res) => {
    const token = req.cookies?.[COOKIE_NAME]
    const payload = verifyToken(token)
    const configured = Boolean(getJwtSecret() && getPasswordHash())
    res.json({
      success: true,
      authenticated: Boolean(payload),
      configured,
    })
  })

  router.post('/admin/login', loginLimiter, async (req, res) => {
    try {
      if (!getJwtSecret() || !getPasswordHash()) {
        return res.status(503).json({
          success: false,
          message: 'Admin is not configured. Run: npm run admin:hash -- YourPassword',
        })
      }

      const password = String(req.body?.password || '')
      const valid = await verifyPassword(password)

      if (!valid) {
        return res.status(401).json({ success: false, message: 'Wrong password.' })
      }

      const token = signToken()
      setAuthCookie(res, token, isProd)
      res.json({ success: true, message: 'Logged in.' })
    } catch (err) {
      res.status(500).json({ success: false, message: 'Login failed.' })
    }
  })

  router.post('/admin/logout', (req, res) => {
    clearAuthCookie(res, isProd)
    res.json({ success: true, message: 'Logged out.' })
  })

  router.get('/admin/posts', requireAdmin, async (_req, res) => {
    try {
      const posts = await getAllPosts()
      res.json({ success: true, posts })
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to load posts.' })
    }
  })

  router.post('/admin/posts', requireAdmin, async (req, res) => {
    try {
      const post = await createPost({
        title: req.body?.title,
        content: req.body?.content,
        published: req.body?.published !== false,
      })
      res.status(201).json({ success: true, post })
    } catch (err) {
      res.status(400).json({ success: false, message: err.message || 'Failed to create post.' })
    }
  })

  router.put('/admin/posts/:id', requireAdmin, async (req, res) => {
    try {
      const post = await updatePost(req.params.id, {
        title: req.body?.title,
        content: req.body?.content,
        published: req.body?.published,
      })
      res.json({ success: true, post })
    } catch (err) {
      const status = err.message === 'Post not found.' ? 404 : 400
      res.status(status).json({ success: false, message: err.message || 'Failed to update post.' })
    }
  })

  router.delete('/admin/posts/:id', requireAdmin, async (req, res) => {
    try {
      await deletePost(req.params.id)
      res.json({ success: true, message: 'Post deleted.' })
    } catch (err) {
      const status = err.message === 'Post not found.' ? 404 : 400
      res.status(status).json({ success: false, message: err.message || 'Failed to delete post.' })
    }
  })

  return router
}
