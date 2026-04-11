import axios from "axios";

// Base URL for the backend API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at?: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: string;
  creator_id: string;
  assignee_id?: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
}

// Project API
export const projectApi = {
  getAll: () => api.get<{ projects: Project[] }>("/projects").then(res => res.data.projects),
  getById: (id: string) => api.get<Project>(`/projects/${id}`).then(res => res.data),
  create: (data: Partial<Project>) => api.post<Project>("/projects", data).then(res => res.data),
};

// Task API
export const taskApi = {
  getAll: () => api.get<{ tasks: Task[] }>("/tasks").then(res => res.data.tasks),
  getByProject: (projectId: string) => api.get<{ tasks: Task[] }>(`/projects/${projectId}/tasks`).then(res => res.data.tasks),
  create: (projectId: string, data: Partial<Task>) => api.post<Task>(`/projects/${projectId}/tasks`, data).then(res => res.data),
  update: (id: string, data: Partial<Task>) => api.patch<Task>(`/tasks/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

export default api;
