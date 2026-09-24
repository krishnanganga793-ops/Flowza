# flowza

flowza is a full-stack MERN productivity application for task planning, focus sessions, habit tracking, time reports, and analytics.

## Stack

- React, React Router, Redux Toolkit, React Query, Axios, Tailwind CSS, Recharts
- Node.js, Express.js, MongoDB Atlas, Mongoose
- JWT access tokens, refresh tokens, bcrypt password hashing

## Quick Start

```bash
npm run install:all
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Environment

Backend variables live in `backend/.env`.

```bash
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/focusflow
MONGODB_SERVER_SELECTION_TIMEOUT_MS=5000
JWT_ACCESS_SECRET=replace_with_long_random_secret
JWT_REFRESH_SECRET=replace_with_another_long_random_secret
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
COOKIE_SECRET=replace_cookie_secret
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=flowza <noreply@flowza.app>
```

Frontend variables live in `frontend/.env`.

For local development, `MONGODB_URI=mongodb://127.0.0.1:27017/focusflow` requires MongoDB to be installed and running on your machine. If you are using MongoDB Atlas, replace `MONGODB_URI` in `backend/.env` with your Atlas connection string.

```bash
VITE_API_URL=http://localhost:5000/api
```

## Deployment

### Backend on Render or Railway

1. Create a MongoDB Atlas cluster and copy its connection string.
2. Deploy the `backend` folder as a Node service.
3. Set the environment variables from `backend/.env.example`.
4. Set `CLIENT_URL` to the deployed Vercel URL.
5. Use `npm install` as the build command and `npm start` as the start command.

### Frontend on Vercel

1. Import the repository in Vercel.
2. Set the root directory to `frontend`.
3. Set `VITE_API_URL` to `https://your-api-host.com/api`.
4. Use `npm run build` and deploy the generated `dist` folder.

## API

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PUT /api/auth/profile`

Tasks:

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/tasks/:id/duplicate`

Habits:

- `GET /api/habits`
- `POST /api/habits`
- `PUT /api/habits/:id`
- `DELETE /api/habits/:id`
- `POST /api/habits/:id/complete`

Timer:

- `POST /api/timer/start`
- `POST /api/timer/stop`
- `POST /api/timer/manual`
- `GET /api/timer/report`

Analytics:

- `GET /api/analytics/summary`
