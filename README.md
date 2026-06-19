# Taskora 🚀
### *Organize. Execute. Achieve.*

Taskora is a modern personal productivity and task management SaaS platform inspired by industry tools like Jira, Trello, Asana, and ClickUp. It helps users manage, track, and optimize tasks efficiently through a beautiful, responsive, and professional dashboard interface.

---

## 🛠️ Tech Stack

### Frontend
- **React 19 & TypeScript**
- **Vite** (Rapid hot reloading & development server)
- **Tailwind CSS v4** (Clean layout with HSL slate/indigo theme variables)
- **React DnD** (Highly polished drag-and-drop Kanban Board)
- **TanStack Query** (State caching & API request management)
- **React Hook Form & Zod** (Rigorous validation & secure type guards)
- **Recharts** (Visual analytics for stats ratios & creation history)

### Backend
- **PHP 8.2+ / Laravel 12**
- **Laravel Sanctum** (Secure token-based REST API authentication)
- **SOLID Architectural Patterns** (Service & Repository layers)
- **API Resources** (Standardized JSON payloads)

### Database
- **MongoDB Atlas** (Cloud NoSQL document database)
- **Laravel MongoDB Driver** (Seamless Eloquent support)

---

## 📦 Directory Structure

```
O2H---PRATICE-TASK-/
├── backend/                  # Laravel REST API Application
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/  # Auth, Task, Profile, Dashboard, Logs
│   │   │   ├── Requests/     # Zod-like Form Requests
│   │   │   └── Resources/    # API JSON formatting
│   │   ├── Models/           # MongoDB Eloquent Models
│   │   ├── Repositories/     # DB queries encapsulation
│   │   └── Services/         # Business logic layer
│   ├── config/               # Sanctum and DB configs
│   ├── database/
│   │   ├── migrations/       # MongoDB indexes creation
│   │   └── seeders/          # DatabaseSeeder (Demo User & 20 tasks)
│   └── tests/                # PHPUnit tests (Auth, Tasks)
│
├── frontend/                 # React 19 + Vite + TypeScript
│   ├── src/
│   │   ├── api/              # Axios client with interceptors
│   │   ├── components/       # Layouts, Forms, Charts, and UI blocks
│   │   ├── contexts/         # Auth and Light/Dark Theme states
│   │   ├── pages/            # Login, Register, Dashboard, Kanban, Profile
│   │   ├── test/             # Vitest globals configuration
│   │   └── types/            # TypeScript schemas (User, Task, Log)
│   └── package.json
```

---

## ⚡ Setup & Run Locally

### Prerequisites
- **Node.js** (v18+) & **npm**
- **PHP** (8.2+) with `mongodb`, `openssl`, `curl` and `mbstring` extensions enabled.
- **Composer** (PHP dependency manager)

### 1. Backend Setup (`backend/`)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Composer packages:
   ```bash
   php composer.phar install
   ```
3. Copy the environment variables template and generate your key:
   ```bash
   copy .env.example .env
   php artisan key:generate
   ```
4. Update database credentials in `.env` to connect to MongoDB:
   ```env
   DB_CONNECTION=mongodb
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskora?retryWrites=true&w=majority
   MONGODB_DATABASE=taskora
   ```
5. Install Sanctum API structures:
   ```bash
   php artisan install:api
   ```
6. Setup collection indexes and run the seeders:
   ```bash
   php artisan migrate
   ```
   To seed **1 Demo User**, **20 varied tasks** (completed, pending, overdue), and **audit logs**:
   ```bash
   php artisan db:seed
   ```
7. Fire up the development backend server:
   ```bash
   php artisan serve
   ```
   The backend API will run on `http://127.0.0.1:8000`.

### 2. Frontend Setup (`frontend/`)
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install NPM packages:
   ```bash
   npm install
   ```
3. Boot the Vite hot development server:
   ```bash
   npm run dev
   ```
   Open the browser at `http://localhost:5173`.

---

## 🔒 Environment Variables Guide

### Backend (`backend/.env`)
- `APP_ENV`: Application environment (`local` / `production`).
- `APP_KEY`: Generated decryption key.
- `DB_CONNECTION`: Must be `mongodb`.
- `MONGODB_URI`: Remote MongoDB Atlas connection DSN.
- `MONGODB_DATABASE`: Collection database name.
- `SESSION_DRIVER`: Set to `file` or `cookie` to avoid database transaction locks.
- `CACHE_STORE`: Set to `file` or `array`.

### Frontend (`frontend/.env`)
- `VITE_API_URL`: Points to the backend hosting port (e.g. `http://localhost:8000/api` for local or `https://your-api.railway.app/api` for production).

---

## 🔑 Demo Credentials

Test the application instantly using our seeded credentials:
- **Email:** `demo@taskora.com`
- **Password:** `Demo@123`

---

## 📑 API Documentation Schema

All APIs expect and return `application/json` data structure.

### 1. Authentication (`POST /api/*`)
- **`POST /api/register`**: Creates new account.
- **`POST /api/login`**: Checks credentials, returns Sanctum bearer token.
- **`POST /api/logout`**: Revokes active API token (requires Auth header).
- **`POST /api/forgot-password`**: Triggers simulation, returns recovery token.
- **`POST /api/reset-password`**: Matches simulation token and replaces password.
- **`GET /api/user`**: Returns authenticated user profile.

### 2. Tasks CRUD (`/api/tasks/*`)
- **`GET /api/tasks`**: Returns paginated, sorted lists matching search/filters.
  - Queries: `page`, `per_page`, `search` (text title search), `status`, `priority`, `sort_by`, `sort_order`.
- **`POST /api/tasks`**: Creates a new task.
- **`GET /api/tasks/{id}`**: Returns details of a specific task.
- **`PUT /api/tasks/{id}`**: Replaces task values (title, description, priority, due_date, tags).
- **`PATCH /api/tasks/{id}/status`**: Fast PATCH update to change status (Pending, In Progress, Completed).
- **`DELETE /api/tasks/{id}`**: Deletes task.

### 3. Dashboard Analytics
- **`GET /api/dashboard/stats`**: Computes counts for total, pending, in-progress, completed, and overdue tasks.
- **`GET /api/dashboard/charts`**: Aggregates pie-chart counts and weekly task histories.

### 4. Activities Log
- **`GET /api/activity`**: Returns a history of user actions (Task Created, Completed, Updated, Deleted).

---

## 🧪 Testing

### Backend Unit & Integration Tests (PHPUnit)
Validate auth and task APIs:
```bash
cd backend
php artisan test
```

### Frontend Component Tests (Vitest + React Testing Library)
Validate DOM states and styling properties:
```bash
cd frontend
npm run test
```

---

## 🚀 Unified Deployment on Koyeb

You can deploy both the React frontend and Laravel backend on a single unified platform: **Koyeb** (koyeb.com), which offers a free tier.

### 1. Backend (Laravel API)
1. Sign up on [Koyeb](https://www.koyeb.com/) using your GitHub account.
2. Click **Create Service** and select **GitHub**.
3. Choose your repository `O2H---PRATICE-TASK-`.
4. In the service settings, configure:
   - **Work Directory:** `backend`
   - **Build Command:** `composer install --no-dev --optimize-autoloader`
   - **Run Command:** `php artisan serve --host 0.0.0.0 --port $PORT`
5. Add these **Environment Variables**:
   - `APP_KEY`: (Copy the base64 key generated in your local `.env`)
   - `DB_CONNECTION`: `mongodb`
   - `MONGODB_URI`: (Your MongoDB Atlas connection DSN)
   - `MONGODB_DATABASE`: `taskora`
   - `SESSION_DRIVER`: `file`
   - `CACHE_STORE`: `file`
6. Click **Deploy**. Koyeb will compile your Laravel backend and give you a public API URL (e.g. `https://taskora-api-yourname.koyeb.app`).

### 2. Frontend (React + Vite)
1. In the same Koyeb account, click **Create Service** and select **GitHub**.
2. Choose your repository `O2H---PRATICE-TASK-`.
3. In the service settings, configure:
   - **Work Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Run Command:** `npx serve -s dist -l $PORT`
4. Add this **Environment Variable**:
   - `VITE_API_URL`: `https://taskora-api-yourname.koyeb.app/api` (The API URL from Step 1)
5. Click **Deploy**. Koyeb will build the React code and give you a live website link (e.g. `https://taskora-web-yourname.koyeb.app`).
