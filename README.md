# Inventory & Order Management System

A production-ready full-stack inventory and order management system built with FastAPI, PostgreSQL, React, Tailwind CSS, Docker, and Docker Compose.

## Project Structure

- `backend/`
  - `app/` - FastAPI application code
  - `alembic/` - database migration scripts
  - `requirements.txt` - Python dependencies
  - `Dockerfile` - backend container image
  - `.env.example` - example environment variables
- `frontend/`
  - `src/` - React application source
  - `package.json` - frontend dependencies
  - `Dockerfile` - frontend container image
- `docker-compose.yml` - orchestration for `postgres`, `backend`, and `frontend`
- `.gitignore` - ignore files for Git

## Features

- Product CRUD with unique SKU validation
- Customer creation and deletion with unique email validation
- Order creation, listing, viewing, and deleting
- Business logic prevents negative inventory and orders with insufficient stock
- PostgreSQL persistence with Alembic migrations
- Responsive React dashboard with client-side routing, form validation, error handling, and toast notifications

## Requirements

- Docker
- Docker Compose

## Run Locally with Docker Compose

From the repository root:

```bash
docker compose up --build
```

Then open:

- Frontend: `http://localhost:4173`
- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

## Backend

### Environment

Copy `.env.example` to `.env` in the `backend/` folder if you want to run the backend outside Docker.

### Run backend locally

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Alembic migrations

```bash
cd backend
alembic upgrade head
```

## Frontend

### Run frontend locally

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Products

- `POST /products`
- `GET /products`
- `GET /products/{id}`
- `PUT /products/{id}`
- `DELETE /products/{id}`

### Customers

- `POST /customers`
- `GET /customers`
- `GET /customers/{id}`
- `DELETE /customers/{id}`

### Orders

- `POST /orders`
- `GET /orders`
- `GET /orders/{id}`
- `DELETE /orders/{id}`

## Sample Data

Use the backend seed script after the database is running:

```bash
cd backend
python -m app.seed
```

## Deployment Notes

- Backend is containerized and ready for platforms like Render.
- Frontend is built with Vite and can be deployed to Vercel.
- Use environment variable `VITE_API_URL` for the frontend to point to the deployed backend.

## Notes

- The backend enforces unique constraints for SKU and customer email.
- Orders reduce stock automatically and validate inventory before creating an order.
- The React dashboard is responsive and mobile-friendly.
