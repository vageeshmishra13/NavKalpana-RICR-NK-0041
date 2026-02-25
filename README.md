# Smart Education & Learning Platforms

An end-to-end Student Learning & Progress Management Platform designed for efficient academic tracking, course management, and career growth.

## Team Members & Roles

- **Vageesh Mishra**: Team Leader & Frontend Developer
- **Subham Kumar Singh**: Backend Developer
- **Sachi Mishra**: UI/UX & PPT

## Problem Statement

Traditional educational tracking methods often lack real-time synchronization between learning activities and progress analytics. Students struggle to visualize their growth across various metrics like quiz performance, assignment consistency, and course completion. This platform solves these issues by providing a unified, real-time dashboard with advanced growth analytics.

> [!IMPORTANT]
> **Evaluation Bypass**: The login system has been bypassed for easier evaluation. The application will automatically log you in as **Vageesh Mishra** upon opening.
>
> **Manual Login Credentials (in case needed):**
> - **Email:** `test@example.com`
> - **Password:** `password123`

## Tech Stack Used

- **Frontend**: React.js, Vite, Framer Motion, Lucide React, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Vanilla CSS (Custom Design System)

## Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/vageeshmishra13/NavKalpana-RICR-NK-0041.git
   cd NavKalpana-RICR-NK-0041
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file with MONGO_URI and JWT_SECRET
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## API Endpoints

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`
- **Courses**: `GET /api/courses`, `POST /api/courses/complete`
- **Assignments**: `GET /api/assignments`, `POST /api/assignments/submit`
- **Quizzes**: `GET /api/quizzes`, `POST /api/quizzes/submit`
- **Analytics**: `GET /api/analytics/growth`

## Future Improvements

- AI-powered personalized learning paths.
- Real-time peer-to-peer collaboration tools.
- Integrated Code Compiler for assignments.
- Advanced Peer Comparison on Leaderboards.
