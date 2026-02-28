import axios from 'axios';

// Instance Axios configurée
const api = axios.create({
    baseURL: 'http://localhost:5229', // URL de notre backend .NET
});

// Intercepteur — ajoute automatiquement le token JWT à chaque requête
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
