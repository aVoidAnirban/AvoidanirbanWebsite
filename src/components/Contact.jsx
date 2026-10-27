import { useState } from 'react'
import { profile } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'
import { parseApiResponse } from '../utils/parseApiResponse'
import { apiFetch } from '../utils/api'
import './Contact.css'

export default function Contact() {
  const ref = useReveal()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await apiFetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      })

      const data = await parseApiResponse(response)

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send message. Please try again.')
      }

      setStatus('success')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err) {
      setStatus('error')
      const isNetwork =
        err.message === 'Failed to fetch' ||
        err.name === 'TypeError' ||
        err.message.includes('JSON.parse')
      setErrorMessage(
        isNetwork
          ? 'Cannot reach the server. Run npm run dev (starts both frontend and backend).'
          : err.message || 'Something went wrong. Please try again or email directly.'
      )
    }
  }

  const buttonLabel =
    status === 'loading'
      ? 'Sending…'
      : status === 'success'
        ? 'Message sent! ✓'
        : 'Send message'

  return (
    <section id="contact" aria-labelledby="contact-heading">
      <div ref={ref} className="reveal contact-wrapper">
        <div className="contact-info">
          <p className="section-label">Contact</p>
          <h2 id="contact-heading" className="section-title">
            Let&apos;s work together
          </h2>
          <p className="contact-text">
            Have a project in mind? Send a message and I&apos;ll get back to you as soon as I can.
          </p>
          <a href={`mailto:${profile.email}`} className="contact-email">
            {profile.email}
          </a>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <input type="checkbox" name="botcheck" className="contact-honeypot" tabIndex={-1} aria-hidden="true" />

          <label>
            <span>Name</span>
            <input
              type="text"
              name="name"
              required
              autoComplete="name"
              placeholder="Your name"
              value={form.name}
              disabled={status === 'loading'}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@email.com"
              value={form.email}
              disabled={status === 'loading'}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </label>
          <label>
            <span>Message</span>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Tell me about your project..."
              value={form.message}
              disabled={status === 'loading'}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
          </label>

          {status === 'error' && (
            <p className="form-feedback form-feedback--error" role="alert">
              {errorMessage}
            </p>
          )}
          {status === 'success' && (
            <p className="form-feedback form-feedback--success" role="status">
              Thanks! Your message was sent successfully.
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={status === 'loading' || status === 'success'}
          >
            {buttonLabel}
          </button>
        </form>
      </div>
    </section>
  )
}
