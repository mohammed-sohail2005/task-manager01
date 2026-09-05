# TaskFlux 3D — Intelligent Full-Stack Task Manager (MERN Stack)

TaskFlux is a modern full-stack Task Management application built on the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) featuring a **futuristic 3D Glassmorphic UI**, JWT authentication, task CRUD operations, real-time statistics dashboard with circular progress rings, advanced search/filter/sorting capabilities, and Framer Motion animations.

---

## 🌟 Key Features

### 1. Authentication & Authorization
- **User Registration**: Register with Name, Email (must be unique), and Password (hashed using `bcryptjs`).
- **User Login**: Validates credentials and returns a JSON Web Token (JWT).
- **Protected Routes**: All task APIs require a valid JWT passed in the `Authorization: Bearer <token>` header.
- **Ownership Verification**: Users can only read, update, or delete their own tasks.

### 2. Task Management (CRUD)
- **Create**: Task title (required), description, priority (`Low`, `Medium`, `High`), due date, and completion status.
- **Read**: Fetch all user tasks or a single task by ID.
- **Update**: Edit title, description, priority, due date, and status.
- **Delete**: Single task deletion or bulk-clearing of all completed tasks.
- **Status Toggle**: Switch tasks between completed and pending.

### 3. Filtering, Searching & Sorting
- **Status Filtering**: All / Pending / Completed.
- **Instant Search**: Search tasks by title or description string.
- **Flexible Sorting**: Sort by Newest First, Oldest First, Priority Level (High → Low), or Due Date.

### 4. Real-Time Task Statistics Dashboard
- **Live Metrics**: Total Tasks, Completed Tasks, Pending Tasks, Overdue Tasks.
- **Circular Progress Rings**: Animated SVG progress rings that smoothly fill based on task completion percentages.

### 5. Modern 3D Animated UI & User Experience
- **Interactive 3D Particle Background**: HTML5 Canvas rendering glowing 3D ambient floating particles and gradient mesh connections.
- **Glassmorphic Design**: Frosted glass panels (`backdrop-blur-xl`), floating navbar, and glowing border accents.
- **3D Glowing Priority Badges**: Visual indicator with glow shadow matching priority intensity (Low: Emerald, Medium: Amber, High: Rose).
- **Hover Elevation Animation**: Framer Motion 3D card tilt & shadow depth expansion on hover.
- **Animated Modal & Form Validation**: Scale + fade modal with inline animated shake validation for missing required fields.
- **Custom Toast Notifications**: Slide-in popups for instant feedback on user actions.

---

## 🛠 Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Lucide React, Axios, React Router v6.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JSON Web Token (JWT), bcryptjs, dotenv, CORS.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally (`mongodb://127.0.0.1:27017/taskmanager`) OR a MongoDB Atlas cloud URI.

### 1. Clone & Install Dependencies

Root directory installation helper:
```bash
npm run install-all
```

Or manually:
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables

Create `.env` inside `/backend` (or copy from `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
JWT_SECRET=super_secret_jwt_key_task_manager_2026
NODE_ENV=development
```

### 3. Run the Application

From root folder:
```bash
# Run both Backend & Frontend concurrently
npm run dev
```

Or individually:
```bash
# Backend (Runs on http://localhost:5000)
npm run server

# Frontend (Runs on http://localhost:3000)
npm run client
```

---

## 📡 API Documentation

### 🔑 Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | `{ name, email, password }` | Register new user & return JWT token |
| `POST` | `/api/auth/login` | Public | `{ email, password }` | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Protected | Header: `Authorization: Bearer <token>` | Get logged-in user details |

#### Registration Request Example
```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "password123"
}
```

#### Registration Response (201 Created)
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65e8a9f1...",
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "createdAt": "2026-09-04T09:00:00.000Z"
  }
}
```

---

### 📋 Task Endpoints (`/api/tasks`)

> **Note**: All task endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Query Params / Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | `?search=&status=&priority=&sortBy=` | Fetch all tasks for logged-in user with filters |
| `GET` | `/api/tasks/stats/summary` | None | Get real-time stats (Total, Completed, Pending, Overdue) |
| `GET` | `/api/tasks/:id` | None | Fetch single task by ID |
| `POST` | `/api/tasks` | `{ title, description, priority, dueDate, isCompleted }` | Create a new task |
| `PUT` | `/api/tasks/:id` | `{ title, description, priority, dueDate, isCompleted }` | Update task details |
| `PATCH` | `/api/tasks/:id/toggle` | None | Toggle completed/pending status |
| `DELETE` | `/api/tasks/:id` | None | Delete single task by ID |
| `DELETE` | `/api/tasks/completed/all` | None | Bulk delete all completed tasks |

#### Create Task Request Example
```json
{
  "title": "Design 3D Glassmorphism Interface",
  "description": "Implement floating navbar, glowing priority badges, and circular progress rings.",
  "priority": "High",
  "dueDate": "2026-09-10T00:00:00.000Z",
  "isCompleted": false
}
```

#### Task Response Object
```json
{
  "success": true,
  "task": {
    "_id": "65e8b102...",
    "user": "65e8a9f1...",
    "title": "Design 3D Glassmorphism Interface",
    "description": "Implement floating navbar...",
    "priority": "High",
    "dueDate": "2026-09-10T00:00:00.000Z",
    "isCompleted": false,
    "createdAt": "2026-09-04T09:05:00.000Z",
    "updatedAt": "2026-09-04T09:05:00.000Z"
  }
}
```

---

## 🎨 UI Architecture Highlights

- **`Background3D.jsx`**: HTML5 Canvas particle system with glowing connections and dynamic radial gradient mesh.
- **`StatsDashboard.jsx`**: Custom animated SVG circular progress rings calculating fill offsets dynamically.
- **`TaskCard.jsx`**: Framer Motion elevated card with 3D glowing priority badges and smooth entry/exit transitions.
- **`TaskModal.jsx`**: Glassmorphic modal with spring animations and form validation shake feedback.
- **`Toast.jsx`**: Auto-dismissing glowing notification popups.
