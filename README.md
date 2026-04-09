# ClubSphere

ClubSphere is a modern web app for a college tech club, built with Next.js + Tailwind CSS.
It now includes a real backend layer with secure session auth and server-side persistent storage, while keeping the original UI and page structure.

## Features

- Visitor, Member, and Admin experiences
- Firebase auth + email/password/local session flows
- Admin login with predefined credentials:
  - `admin@clubsphere.com`
  - `admin123`
- Protected admin dashboard route
- Manage clubs, events, challenges, projects, team members, users, announcements, and gallery (UI/localStorage)
- Club leaderboard ranked by points (highest first)
- Events registration for members
- Team page with filters and modal profiles
- Challenge submissions with URL validation and duplicate prevention
- Projects page + project detail pages
- Gallery page with album filters and lightbox
- Event detail pages with schedule/speakers/FAQs
- Profile settings (bio, social links, tech tags, notification preferences UI)
- Admin submission review and analytics cards
- Groq-powered AI assistant page (frontend call)
- Toasts, loading states, responsive dark UI

## Stack

- Frontend: Next.js App Router, React, Tailwind CSS
- Backend: Next.js Route Handlers (`app/api/*`)
- Authentication: secure password hashing with `bcryptjs` + signed session cookies with `jsonwebtoken`
- Persistent storage: server-side JSON data store in `data/platform.json`
- Optional integrations: Firebase Auth, EmailJS, Groq

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

On first run, the app seeds:
- default platform content
- default admin user: `admin@clubsphere.com`
- default admin password: `admin123`

## Environment

Copy `.env.example` to `.env.local` and set at least:

```bash
APP_JWT_SECRET=replace_with_a_long_random_secret
```

## Full-Stack Deploy

This full-stack version should be deployed to a platform that supports Next.js server routes, such as:

- Vercel
- Render
- Railway

Use:

```bash
npm run build
```

## GitHub Pages Deploy

GitHub Pages can only host a static frontend version. It cannot run the backend API routes added in this full-stack version.

If you still want a static UI-only export for demo purposes:

1. Build and deploy the static export:

```bash
npm run deploy:pages
```

2. In GitHub repository settings, set Pages to:
   - Source: `Deploy from a branch`
   - Branch: `gh-pages`
   - Folder: `/ (root)`

3. Make sure the published branch contains the exported site files at its root, including:
   - `index.html`
   - `_next/`
   - `.nojekyll`

Important:
- The GitHub Pages build is frontend-only.
- The backend APIs, secure sessions, and server-side persistence require a real Next.js host, not GitHub Pages.
- If Pages shows the repository README instead of the app UI, Pages is usually pointing to the wrong branch or folder.

## Groq Setup

1. Copy `.env.example` to `.env.local`
2. Add your API key:

```bash
NEXT_PUBLIC_GROQ_API_KEY=...
```

Then restart dev server.

## Real Email Delivery (Optional)

The app always stores in-app notifications for members.  
To send real emails to user inboxes, configure EmailJS:

1. Create EmailJS service + template.
2. Ensure your template uses params:
   - `to_email`
   - `subject`
   - `message`
3. Add to `.env.local`:

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```

4. Restart `npm run dev`.

## Real Google + GitHub Login (Firebase)

This app uses Firebase Authentication with popup login.

1. In Firebase Console, enable providers:
   - Google
   - GitHub

2. Configure the providers:
   - Google usually works once enabled
   - GitHub needs a GitHub OAuth app with Firebase's callback URL copied into the OAuth app settings

3. Add authorized domains in Firebase Authentication:
   - `localhost`
   - your deployed domain if applicable

4. Add Firebase web app config to `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=... # optional
```

5. Restart dev server:

```bash
npm run dev
```

If the login popup is blocked by the browser, the app automatically falls back to a redirect-based OAuth flow.
