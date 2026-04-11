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

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ProjectStats {
  tasksByStatus: Record<string, number>;
  tasksByAssignee: Record<string, number>;
}

// Project API
export const projectApi = {
  getAll: (page = 1, limit = 10) => 
    api.get<PaginatedResponse<Project>>(`/projects?page=${page}&limit=${limit}`).then(res => res.data),
  getById: (id: string) => api.get<Project>(`/projects/${id}`).then(res => res.data),
  create: (data: Partial<Project>) => api.post<Project>("/projects", data).then(res => res.data),
  update: (id: string, data: Partial<Project>) => api.patch<Project>(`/projects/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  getStats: (id: string) => api.get<ProjectStats>(`/projects/${id}/stats`).then(res => res.data),
};

// Task API
export const taskApi = {
  getAll: () => api.get<{ tasks: Task[] }>("/tasks").then(res => res.data.tasks),
  getByProject: (projectId: string, page = 1, limit = 100) => 
    api.get<PaginatedResponse<Task>>(`/projects/${projectId}/tasks?page=${page}&limit=${limit}`).then(res => res.data),
  create: (projectId: string, data: Partial<Task>) => api.post<Task>(`/projects/${projectId}/tasks`, data).then(res => res.data),
  update: (id: string, data: Partial<Task>) => api.patch<Task>(`/tasks/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

export default api;
