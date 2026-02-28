// Types partagés dans toute l'application

// Correspond à AuthResponseDto du backend
export interface AuthResponse {
    token: string;
    email: string;
    firstName?: string;
    expiresAt: string;
}

// Correspond à ProjectResponseDto du backend
export interface Project {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    userId: number;
}

// Correspond à CreateProjectDto du backend
export interface CreateProjectRequest {
    name: string;
    description?: string;
}

// Correspond à LoginDto du backend
export interface LoginRequest {
    email: string;
    password: string;
}

// Correspond à RegisterDto du backend
export interface RegisterRequest {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

// Ajoute à la fin du fichier

// Correspond à TaskResponseDto du backend
export interface Task {
    id: number;
    title: string;
    description?: string;
    isCompleted: boolean;
    createdAt: string;
    dueDate?: string;
    projectId: number;
}

// Correspond à CreateTaskDto du backend
export interface CreateTaskRequest {
    title: string;
    description?: string;
    dueDate?: string;
}