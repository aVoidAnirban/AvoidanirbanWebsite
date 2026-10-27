import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const password = process.argv[2]

if (!password || password.length < 8) {
  console.error('Usage: npm run admin:hash -- YourPasswordHere')
  console.error('Password must be at least 8 characters.')
  process.exit(1)
}

const hash = await bcrypt.hash(password, 12)
console.log('\nAdd these lines to your .env file:\n')
console.log(`ADMIN_PASSWORD_HASH=${hash}`)
console.log(`JWT_SECRET=${crypto.randomUUID()}${crypto.randomUUID()}\n`)
console.log('Keep these secret. Never commit .env to Git.\n')
