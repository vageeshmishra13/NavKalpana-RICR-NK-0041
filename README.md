# EduTrack — Student Learning & Progress Platform
### NavKalpana Hackathon | Team Code: RICR-NK-0041

> A full-stack educational platform built with MERN stack for the NavKalpana hackathon.
> Theme: **Innovative Solutions for the Education Sector**

---

## Team Members

| Member | GitHub | Role |
|--------|--------|------|
| Vageesh Mishra | [@vageeshmishra13](https://github.com/vageeshmishra13) | Team Leader / UI-UX Designer |
| Subham Kumar Singh | [@subham-kr-singh](https://github.com/subham-kr-singh) | Backend Developer |

---

## Problem Statement

**Student Learning & Progress Platform (Student Module)**
Build a secure web-based system providing students with course tracking, assignment submission, timed quizzes, attendance monitoring, and learning support tools.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (24h session), bcryptjs |
| File Upload | Multer |

---

## Project Structure

```
NavKalpana-RICR-NK-0041/
├── frontend/          # React + Vite (UI/UX by vageeshmishra13)
├── backend/           # Node.js + Express (by subham-kr-singh)
└── docs/              # Architecture, API docs, presentation
```

---

## Quick Start

```bash
# Backend
cd backend && npm install
cp .env.example .env
npm run seed
npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Student | student@slpp.com | student123 |
| Admin | admin@slpp.com | admin123 |

---

## API Base URL
- Development: `http://localhost:5000/api`

---

*NavKalpana Hackathon — Education Innovation Track*
