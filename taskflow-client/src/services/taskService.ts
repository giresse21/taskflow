import api from './api';
import type { Task, CreateTaskRequest } from '../types';

// Récupérer toutes les tâches d'un projet
export const getTasks = async (projectId: number): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/api/projects/${projectId}/tasks`);
    return response.data;
};

// Créer une tâche
export const createTask = async (projectId: number, data: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>(`/api/projects/${projectId}/tasks`, data);
    return response.data;
};

// Modifier une tâche
export const updateTask = async (projectId: number, id: number, data: CreateTaskRequest): Promise<Task> => {
    const response = await api.put<Task>(`/api/projects/${projectId}/tasks/${id}`, data);
    return response.data;
};

// Toggle complété/non complété
export const toggleTask = async (projectId: number, id: number): Promise<Task> => {
    const response = await api.patch<Task>(`/api/projects/${projectId}/tasks/${id}/toggle`);
    return response.data;
};

// Supprimer une tâche
export const deleteTask = async (projectId: number, id: number): Promise<void> => {
    await api.delete(`/api/projects/${projectId}/tasks/${id}`);
};