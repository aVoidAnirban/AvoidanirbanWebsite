# Interactive Portfolio

A modern portfolio built with **React**, **Vite**, and an **Express** backend for the contact form.

## WARNING: This project is actively maintained. If you encounter a bug, please open an issue — confirmed fixes will credit the reporter in the changelog. More features are planned for future releases.

## Quick start

```bash
npm install
copy .env.example .env
```

Edit `.env` with your SMTP settings (see below), then:

```bash
npm run dev
```

This starts **both**:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001 (Vite proxies `/api` to it)

## Contact form (backend + email)

The server sends email using **Nodemailer** and your SMTP account.

### Gmail setup

1. Turn on 2-Step Verification for your Google account.
2. Create an **App Password**: https://myaccount.google.com/apppasswords
3. In `.env`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=your_16_char_app_password
CONTACT_TO_EMAIL=your@gmail.com
```

4. Restart `npm run dev` and test the contact form.

### Production (single server)

```bash
npm run build
npm run start
```

Opens at http://localhost:3001 — serves the built site and `/api/contact`.

Set `NODE_ENV=production` in `.env` on your host (Railway, Render, VPS, etc.).

## Blog & admin panel

### Public blog

- **http://localhost:5173/blog** — all posts (date + headline)
- Homepage shows the latest 3 posts

### Posting (only you)

1. Create an admin password (one time):

   ```bash
   npm run admin:hash -- YourSecretPassword123
   ```

2. Copy the printed `ADMIN_PASSWORD_HASH` and `JWT_SECRET` into your `.env` file.

3. Restart `npm run dev`.

4. Open **http://localhost:5173/admin** — log in with your password.

5. Write a **headline**, **content**, click **Publish post**.

Posts are saved in `server/data/blog.json`.

### Security

- Password is stored as a **bcrypt hash** (not plain text)
- Login uses an **httpOnly cookie** + **JWT** (JavaScript cannot read it easily)
- Login is **rate-limited** (blocks brute force)
- `/admin` is not linked on the public site — bookmark it privately
- Use a **strong password** (12+ characters)

## Customize your content

Edit **`src/data/portfolio.js`** — name, bio, projects, skills, SEO, etc.

## Features

- Blog with admin panel
- Express backend with rate limiting and validation
- Contact form emails via SMTP
- Optimized frontend performance
- Dark / light theme
- SEO meta tags, sitemap, JSON-LD
- Fully responsive
