import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import nodemailer from 'nodemailer'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'
import { createBlogRouter, createAdminRouter } from './routes/blog.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })
const PORT = process.env.PORT || 3001
const isProd = process.env.NODE_ENV === 'production'
const clientOrigin = process.env.CLIENT_ORIGIN || (isProd ? undefined : 'http://localhost:5173')

const app = express()

app.use(
  cors({
    origin: clientOrigin || true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
)
app.use(cookieParser())
app.use(express.json({ limit: '256kb' }))

app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ success: false, message: 'Invalid request data.' })
  }
  next(err)
})

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages. Please try again later.' },
})

function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null
  }

  return nodemailer.createTransport({
    host: SMTP_HOST.trim(),
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === 'true',
    auth: {
      user: SMTP_USER.trim(),
      pass: SMTP_PASS.replace(/\s/g, ''),
    },
  })
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function sanitize(str, maxLen) {
  return String(str || '')
    .trim()
    .slice(0, maxLen)
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

app.get('/api/health', (_req, res) => {
  const configured = Boolean(createTransporter() && process.env.CONTACT_TO_EMAIL)
  res.json({ ok: true, emailConfigured: configured })
})

app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    if (req.body?.botcheck) {
      return res.json({ success: true, message: 'Message sent.' })
    }

    const transporter = createTransporter()
    const toEmail = process.env.CONTACT_TO_EMAIL

    if (!transporter || !toEmail) {
      return res.status(503).json({
        success: false,
        message: 'Email is not configured on the server. Check server .env SMTP settings.',
      })
    }

    const name = sanitize(req.body?.name, 100)
    const email = sanitize(req.body?.email, 254)
    const message = sanitize(req.body?.message, 5000)

    if (!name || name.length < 2) {
      return res.status(400).json({ success: false, message: 'Please enter your name.' })
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email.' })
    }
    if (!message || message.length < 10) {
      return res.status(400).json({ success: false, message: 'Message must be at least 10 characters.' })
    }

    const fromName = process.env.CONTACT_FROM_NAME || 'Portfolio Contact'
    const subject = `${process.env.CONTACT_SUBJECT_PREFIX || 'Portfolio message from'} ${name}`

    await transporter.sendMail({
      from: `"${fromName}" <${process.env.SMTP_USER}>`,
      to: toEmail,
      replyTo: `"${name}" <${email}>`,
      subject,
      text: [`Name: ${name}`, `Email: ${email}`, '', 'Message:', message].join('\n'),
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      `,
    })

    res.json({ success: true, message: 'Message sent successfully.' })
  } catch (err) {
    console.error('Contact form error:', err.message)
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again or email directly.',
    })
  }
})

app.use('/api', createBlogRouter({ isProd }))
app.use('/api', createAdminRouter({ isProd }))

app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, message: 'API route not found.' })
})

if (isProd) {
  const distPath = path.join(__dirname, '../dist')
  app.use(express.static(distPath))
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.use((err, _req, res, _next) => {
  console.error('Server error:', err.message)
  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  if (!isProd) {
    console.log('Admin panel: http://localhost:5173/admin')
  }
})
