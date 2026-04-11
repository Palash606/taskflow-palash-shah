# TaskFlow - Minimal Task Management System

TaskFlow is a robust, relational task management system built with Java (Spring Boot 3.3.4) and React 19. It features secure JWT authentication, project organization, and a premium Task Board with drag-and-drop capabilities.

## Repository Structure
- `/backend`: Spring Boot 3.3.4 (Java 21), PostgreSQL 16, Flyway Migrations.
- `/frontend`: React 19 + TypeScript + Tailwind CSS + Radix UI (shadcn).
- `docker-compose.yml`: Orchestrates the full stack (DB, API, Web).

## 🚀 Running Locally

The entire stack is containerized. You only need Docker installed.

1. **Clone the repository**
2. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
3. **Launch the stack**
   ```bash
   docker compose up --build
   ```
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080

## 🗄️ Running Migrations
Migrations are handled by **Flyway** and run **automatically** when the backend container starts. 
- Schema: Managed in `backend/src/main/resources/db/migration`
- Seeding: A seed script runs during the first migration to create test data.

## 🔐 Test Credentials
Use these credentials to explore the app immediately without registering:
- **Email**: `test@example.com`
- **Password**: `password123`

## 🏗️ Architecture Decisions

### 1. Relational Integrity & Type Safety
- **PostgreSQL**: Chosen for strict relational consistency and robust ACID transactions.
- **UUIDs**: Used everywhere to prevent ID enumeration and ensure global uniqueness.
- **TypeScript**: Shared types/interfaces between frontend and backend contracts to ensure end-to-end type safety.

### 2. Performance & UX
- **React Query**: Used for server state management, caching, and optimistic UI updates.
- **Controlled DND**: Drag-and-drop handles are isolated to specific icons to prevent interaction conflicts with action buttons.
- **Optimistic UI**: Moving a task between columns updates the UI instantly, with an automatic roll-back on API failure.

### 3. Security
- **JWT (Stateless)**: 24-hour expiry with user identity claims.
- **BCrypt (Cost 12)**: Industry-standard hashing for passwords.
- **Server-Side Validation**: All inputs are validated via JSR-303 (Bean Validation) on the backend.

## 🛠️ What I'd Do With More Time
1. **Integration Testing**: Add exhaustive Playwright/Cypress E2E tests for the drag-and-drop flow.
2. **Real-time Engine**: Implement WebSockets for live updates when multiple users are in the same project.
3. **Advanced Filtering**: Add multi-select filters and text search across the entire project list.
4. **Activity Logs**: Implement an auditing system to track who changed what task and when.

## 📖 API Reference
- `POST /auth/register`: Create user
- `POST /auth/login`: Get JWT
- `GET /projects`: List accessible projects
- `POST /projects`: Create project
- `GET /projects/:id`: Get project details + tasks
- `PATCH /projects/:id`: Update project (Owner only)
- `DELETE /projects/:id`: Delete project (Owner only)
- `PATCH /tasks/:id`: Update task (Title, Status, Priority)
- `DELETE /tasks/:id`: Remove task
