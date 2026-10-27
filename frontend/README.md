# TaskFlow — Task & Habit Management

TaskFlow is a full-stack task management application built with React, TypeScript, FastAPI, and PostgreSQL. It helps users organize tasks, track completion, and view a summary of their progress.

## Features

- Create, view, update, and delete tasks
- Mark tasks as completed or pending
- Filter tasks by All, Pending, and Completed
- View a task summary
- Validate task input
- REST API with structured responses and error handling
- Database schema migrations with Alembic
- Automated API tests with pytest

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- ESLint

**Backend**
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic

**Database and testing**
- PostgreSQL
- pytest
- FastAPI TestClient
- SQLite in-memory database for isolated API tests

## Project Structure

```text
TaskFlow/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── base.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── migrations/
│   ├── tests/
│   │   └── test_api.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
├── alembic.ini
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before setting up the project:

- Python 3.11 or compatible version
- Node.js and npm
- PostgreSQL
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd TaskFlow
```

### 2. Configure PostgreSQL

Create a PostgreSQL database named `taskflow_db`. Configure the connection details in `backend/.env` using `backend/.env.example` as a template.

Example configuration:

```dotenv
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=127.0.0.1
DB_PORT=5433
DB_NAME=taskflow_db
```

Use your own PostgreSQL credentials and port.

### 3. Set up the backend

From the project root, create and activate a Python virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
python -m pip install -r backend/requirements.txt
python -m pip install pytest httpx
```

Apply database migrations:

```powershell
python -m alembic -c alembic.ini upgrade head
```

Start the API:

```powershell
python -m uvicorn app.main:app --reload --app-dir backend --port 8001
```

The API will be available at `http://127.0.0.1:8001`.

Interactive API documentation: `http://127.0.0.1:8001/docs`

Health check: `http://127.0.0.1:8001/health`

### 4. Set up the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### 5. Run automated tests

From the project root, with the virtual environment activated:

```powershell
python -m pytest backend/tests -v
```

The API test suite covers health checks, task creation and retrieval, updates, completion toggling, deletion, missing tasks, and input validation.

### 6. Build the frontend

From the `frontend` directory:

```powershell
npm run build
npm run lint
```

The build command runs TypeScript checks and creates a production build.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/health` | Health check |
| POST | `/tasks` | Create a task |
| GET | `/tasks` | List tasks |
| GET | `/tasks/{task_id}` | Retrieve one task |
| PUT | `/tasks/{task_id}` | Update task details |
| PATCH | `/tasks/{task_id}?is_completed=true` | Update completion status |
| DELETE | `/tasks/{task_id}` | Delete a task |

The API validates task titles and descriptions and returns appropriate HTTP status codes for successful requests, invalid input, and missing tasks.

## Database Migrations

TaskFlow uses Alembic to manage schema changes.

View migration history:

```powershell
python -m alembic -c alembic.ini history
```

Apply migrations:

```powershell
python -m alembic -c alembic.ini upgrade head
```

Create a new migration after changing the SQLAlchemy models:

```powershell
python -m alembic -c alembic.ini revision --autogenerate -m "describe schema change"
```

Review generated migration files before applying them.

## Testing

The API tests use an in-memory SQLite database through a FastAPI dependency override. This keeps the basic CRUD tests isolated from the development PostgreSQL database.

PostgreSQL-specific integration behavior should be tested separately.

## Future Improvements

- User authentication and personal task ownership
- Habit tracking and recurring tasks
- Due dates, priorities, and reminders
- Improved accessibility and responsive UI
- Continuous integration for automated tests and builds
- Deployment with managed PostgreSQL and a production frontend

## License

Choose and add a license before distributing this project publicly.
