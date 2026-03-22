# ReelGrab – Instagram Reels Downloader

A full-stack web application to download public Instagram Reels in HD MP4 format.
Built with React.js, Node.js, Express, and Tailwind CSS.

## Features
- Paste & Fetch any public Instagram Reel URL
- Video Preview inside the browser before downloading
- HD MP4 Download via secure backend proxy
- Metadata: thumbnail, username, duration, likes, views
- Download History (last 10, persisted in localStorage)
- Dark / Light Mode toggle
- Paste from clipboard, Copy link button
- Rate limiting (100 req/15 min, 10 downloads/min)
- Fully mobile responsive

## Project Structure

```
instagram-reels-downloader/
├── package.json              ← root (concurrently)
├── backend/
│   ├── server.js             ← Express entry point
│   ├── routes/download.js    ← /api/download/reel & /proxy
│   └── .env.example
└── frontend/
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── App.jsx
        ├── index.js
        ├── styles/index.css
        ├── hooks/useReelDownloader.js
        └── components/
            ├── Navbar.jsx
            ├── Hero.jsx
            ├── InputSection.jsx
            ├── VideoPreview.jsx
            ├── DownloadSection.jsx
            ├── DownloadHistory.jsx
            ├── HowItWorks.jsx
            └── Footer.jsx
```

## Quick Start

```bash
# 1. Install all dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 2. Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Run (both servers in parallel)
npm run dev
```

- Frontend: http://localhost:3000
- Backend:  http://localhost:5000
- Health:   http://localhost:5000/api/health

## API

### POST /api/download/reel
Body: `{ "url": "https://www.instagram.com/reel/ABC123/" }`

### GET /api/download/proxy
Params: `?videoUrl=<cdn_url>&filename=reel.mp4`

## Deployment

**Backend** (Railway/Render): set PORT, FRONTEND_URL, NODE_ENV=production; start: `node server.js`

**Frontend** (Vercel/Netlify): set REACT_APP_API_URL to backend URL; build: `npm run build`; dir: `frontend/build`

## Tech Stack
| Layer    | Tech                              |
|----------|-----------------------------------|
| Frontend | React 18, Tailwind CSS, Lucide    |
| Backend  | Node.js, Express 4                |
| Scraping | instagram-url-direct              |
| Security | Helmet, express-rate-limit, CORS  |

## Legal
For personal use only. Respect creators' rights and Instagram's Terms of Service.
