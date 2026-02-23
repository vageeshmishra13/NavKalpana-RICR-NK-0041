# System Architecture — EduTrack Platform

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│   React 18 + Vite + TailwindCSS + Recharts                  │
│   Pages: Login | Dashboard | Courses | Assignments | Quizzes │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST (JWT Bearer Token)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       API LAYER                              │
│   Node.js + Express.js                                       │
│   Routes: /auth /dashboard /courses /assignments             │
│           /quizzes /attendance /support                      │
│   Middleware: JWT Auth | Multer (File Upload) | CORS         │
└──────────────────────────┬──────────────────────────────────┘
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                           │
│   MongoDB                                                    │
│   Collections: users | courses | enrollments | assignments   │
│                quizzes | attendance | activities | doubts    │
└─────────────────────────────────────────────────────────────┘
```

## Security
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens expire in 24 hours
- All protected routes use JWT middleware
- File uploads validated via Multer

## Scoring Formulas
- Course Progress = (Completed Lessons / Total Lessons) x 100
- Quiz Score = (Correct Answers / Total Questions) x 100
- Attendance % = (Present Days / Total Classes) x 100
