# API Documentation — EduTrack Platform

## Base URL
- Development: `http://localhost:5000/api`

## Authentication
All protected routes require:
```
Authorization: Bearer <jwt_token>
```
Token expires in **24 hours**.

## Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login, returns JWT token |
| GET | `/auth/me` | Get current user |
| POST | `/auth/logout` | Logout session |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Scores, streak, activity, leaderboard |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courses` | List enrolled courses |
| GET | `/courses/:id` | Course detail with modules |
| POST | `/courses/:courseId/modules/:moduleId/lessons/:lessonId/complete` | Mark lesson complete |
| POST | `/courses/:id/complete` | Mark entire course complete |

### Assignments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/assignments` | All assignments with status |
| GET | `/assignments/:id` | Assignment detail |
| POST | `/assignments/:id/submit` | Submit (file/text/link) |

### Quizzes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quizzes` | All quizzes with attempt history |
| GET | `/quizzes/:id` | Quiz questions (answers hidden) |
| POST | `/quizzes/:id/submit` | Submit answers, get scored result |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/attendance` | All courses attendance |
| GET | `/attendance/:courseId` | Per-course attendance |

### Support
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/support/doubt` | Submit doubt with optional file |
| POST | `/support/backup-class` | Request backup class |
| GET | `/support/my-requests` | Student support history |
