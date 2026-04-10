# TaskFlow - Minimal Task Management System

TaskFlow is a robust, relational task management system built with Java (Spring Boot) and React. It features secure authentication, project organization, and task tracking with ownership logic.

## Repository Structure
- `/backend`: Spring Boot 3.3.4 (Java 21), PostgreSQL, Flyway.
- `/frontend`: React + Tailwind (Pending).
- `docker-compose.yml`: Orchestrates the full stack.

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Java 21 (for local development)

### One-Command Setup
1. Clone the repo.
2. Create a `.env` file (see `.env.example`).
3. Run:
   ```bash
   docker compose up --build
   ```
The backend will be available at `http://localhost:8080`.

## Architecture Decisions

### 1. Relational Design
- Used **PostgreSQL** for strict relational integrity.
- **UUIDs** are used for all IDs to prevent ID enumeration and improve scalability.
- Custom **ENUMs** for Task Status and Priority to ensure data consistency at the DB level.

### 2. Security
- **JWT Authentication**: Stateless authentication using signed tokens.
- **BCrypt (Cost 12)**: Maximum security for password hashing as per requirements.
- **Ownership Logic**: Multi-tiered permission checks (e.g., only project owners can delete projects).

### 3. Production Readiness
- **Flyway**: Manual migrations with zero `ddl-auto` in production.
- **Structured Logging**: Logstash JSON encoder for machine-readable logs.
- **Graceful Shutdown**: 30-second timeout for active connections.

## API Reference

### Authentication
- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Get a JWT token.

### Projects
- `GET /projects`: List owned or assigned projects.
- `POST /projects`: Create a project.
- `GET /projects/:id`: Get project + tasks.
- `PATCH /projects/:id`: Update project (Owner only).
- `DELETE /projects/:id`: Delete project (Owner only).
- `GET /projects/:id/stats`: **(Bonus)** Statistics by status/assignee.

### Tasks
- `GET /projects/:id/tasks`: List tasks with filters (`?status=`, `?assignee=`).
- `POST /projects/:id/tasks`: Create task.
- `PATCH /tasks/:id`: Update task attributes.
- `DELETE /tasks/:id`: Delete task (Owner or Creator only).

## Testing
Run integration tests locally:
```bash
cd backend
./mvnw test
```
