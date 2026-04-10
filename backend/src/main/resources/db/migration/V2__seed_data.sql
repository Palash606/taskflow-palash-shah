-- V2: Seed Data

-- Create a test user (password: password123)
-- Hash generated with BCrypt (cost 12)
INSERT INTO users (id, name, email, password)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Test User',
    'test@example.com',
    '$2a$12$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xdqD1Rph6idS1iPW' -- Valid BCrypt hash for 'password123'
);

-- Create a project
INSERT INTO projects (id, name, description, owner_id)
VALUES (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'TaskFlow Launch',
    'Initial project to track development of the TaskFlow platform.',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
);

-- Create 3 tasks with different statuses
INSERT INTO tasks (title, description, status, priority, project_id, creator_id, assignee_id, due_date)
VALUES 
    ('Setup Database Schema', 'Implement Flyway migrations for User, Project, and Task tables.', 'done', 'high', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', CURRENT_DATE),
    ('Implement Auth API', 'Develop registration and login endpoints with JWT.', 'in_progress', 'medium', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', CURRENT_DATE + INTERVAL '2 days'),
    ('Add Task Filtering', 'Support ?status= and ?assignee= query parameters on task list.', 'todo', 'low', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NULL, CURRENT_DATE + INTERVAL '5 days');
