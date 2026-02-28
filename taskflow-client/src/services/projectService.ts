import api from './api';
import type { Project, CreateProjectRequest } from '../types';

// Récupérer tous les projets
export const getProjects = async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/api/projects');
    return response.data;
};

// Récupérer un projet par Id
export const getProject = async (id: number): Promise<Project> => {
    const response = await api.get<Project>(`/api/projects/${id}`);
    return response.data;
};

// Créer un projet
export const createProject = async (data: CreateProjectRequest): Promise<Project> => {
    const response = await api.post<Project>('/api/projects', data);
    return response.data;
};

// Modifier un projet
export const updateProject = async (id: number, data: CreateProjectRequest): Promise<Project> => {
    const response = await api.put<Project>(`/api/projects/${id}`, data);
    return response.data;
};

// Supprimer un projet
export const deleteProject = async (id: number): Promise<void> => {
    await api.delete(`/api/projects/${id}`);
};
