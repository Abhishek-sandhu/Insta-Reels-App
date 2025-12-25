
# Insta Reels (MERN)

Modern Instagram-style reels/feed experience built with React 19 + Vite on the frontend and an Express/MongoDB API for auth, posts, reels, and media uploads.

## Features
- Authenticated flows with login/register, protected routes, and token-based API calls
- Feed, reels, profile, and messaging views with Tailwind styling and Framer Motion transitions
- Post creation with media upload (multer), comments, likes data, and searchable hashtags
- MongoDB models for users, posts, comments; static media served from `/uploads`

## Tech Stack
- Frontend: React 19, Vite, Tailwind CSS, Framer Motion, React Router
- Backend: Express, MongoDB (Mongoose), JWT auth, Multer for file uploads

## Quick Start
1) Install deps
```
npm install
```
2) Backend (from /backend)
```
npm install
npm start
```
Runs at http://localhost:5000 with MongoDB expected at mongodb://localhost:27017/insta_reels.

3) Frontend (from /frontend)
```
npm run dev
```
Vite dev server starts at http://localhost:5173 and proxies API calls to `/api` by default.

## Environment
- Frontend: `VITE_API_BASE_URL` to point axios to the API (default `/api`)
- Backend: set `PORT` (default 5000) and Mongo connection string if not using local Mongo

## Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run lint` – lint frontend code

## Folder Structure (excerpt)
- `frontend/src` – React app (pages, components, hooks, context, services)
- `backend` – Express server, routes, models, uploads storage
