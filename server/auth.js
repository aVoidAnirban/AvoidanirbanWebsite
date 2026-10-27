import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const COOKIE_NAME = 'admin_token'
const TOKEN_TTL = '8h'

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    return null
  }
  return secret
}

export function getPasswordHash() {
  return process.env.ADMIN_PASSWORD_HASH || null
}

export async function verifyPassword(password) {
  const hash = getPasswordHash()
  if (!hash || !password) return false
  return bcrypt.compare(password, hash)
}

export function signToken() {
  const secret = getJwtSecret()
  if (!secret) throw new Error('JWT_SECRET is not configured.')
  return jwt.sign({ role: 'admin' }, secret, { expiresIn: TOKEN_TTL })
}

export function verifyToken(token) {
  const secret = getJwtSecret()
  if (!secret || !token) return null
  try {
    return jwt.verify(token, secret)
  } catch {
    return null
  }
}

export function setAuthCookie(res, token, isProd) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 8 * 60 * 60 * 1000,
    path: '/',
  })
}

export function clearAuthCookie(res, isProd) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/',
  })
}

export function requireAdmin(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME]
  const payload = verifyToken(token)
  if (!payload) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' })
  }
  req.admin = payload
  next()
}

export { COOKIE_NAME }
