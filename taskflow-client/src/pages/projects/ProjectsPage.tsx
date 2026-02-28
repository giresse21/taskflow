import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as projectService from '../../services/projectService';
import type { Project } from '../../types';
import { useNavigate } from 'react-router-dom';

const ProjectsPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // States
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');

    // Charger les projets au démarrage
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (err) {
            setError('Erreur lors du chargement des projets');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const project = await projectService.createProject({
                name: newProjectName,
                description: newProjectDescription
            });
            // Ajoute le nouveau projet à la liste
            setProjects([...projects, project]);
            // Réinitialise le formulaire
            setNewProjectName('');
            setNewProjectDescription('');
            setShowForm(false);
        } catch (err) {
            setError('Erreur lors de la création du projet');
        }
    };

    const handleDeleteProject = async (id: number) => {
        try {
            await projectService.deleteProject(id);
            // Supprime le projet de la liste
            setProjects(projects.filter(p => p.id !== id));
        } catch (err) {
            setError('Erreur lors de la suppression');
        }
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>TaskFlow</h1>
                <div style={styles.userInfo}>
                    <span>Bonjour {user?.firstName || user?.email} !</span>
                    <button onClick={logout} style={styles.logoutButton}>
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Contenu */}
            <div style={styles.content}>
                <div style={styles.projectsHeader}>
                    <h2>Mes Projets ({projects.length})</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        style={styles.addButton}
                    >
                        {showForm ? 'Annuler' : '+ Nouveau Projet'}
                    </button>
                </div>

                {/* Formulaire création projet */}
                {showForm && (
                    <form onSubmit={handleCreateProject} style={styles.form}>
                        <input
                            type="text"
                            placeholder="Nom du projet"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            style={styles.input}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description (optionnelle)"
                            value={newProjectDescription}
                            onChange={(e) => setNewProjectDescription(e.target.value)}
                            style={styles.input}
                        />
                        <button type="submit" style={styles.submitButton}>
                            Créer
                        </button>
                    </form>
                )}

                {/* Message d'erreur */}
                {error && <div style={styles.error}>{error}</div>}

                {/* Loading */}
                {loading && <p style={styles.loading}>Chargement...</p>}

                {/* Liste des projets */}
                {!loading && projects.length === 0 && (
                    <div style={styles.empty}>
                        <p>Aucun projet pour l'instant</p>
                        <p>Créez votre premier projet !</p>
                    </div>
                )}

                {projects.map(project => (
                    <div key={project.id} style={styles.projectCard}>
                        <div style={styles.projectInfo}>
                            <h3 style={styles.projectName}>{project.name}</h3>
                            {project.description && (
                                <p style={styles.projectDescription}>
                                    {project.description}
                                </p>
                            )}
                            <small style={styles.projectDate}>
                                Créé le : {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                            </small>
                        </div>
                        <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/projects/${project.id}/tasks`)}
                    >
                        Voir les tâches
                    </button>
                        <button
                            onClick={() => handleDeleteProject(project.id)}
                            style={styles.deleteButton}
                        >
                            Supprimer
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
    },
    header: {
        backgroundColor: 'white',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    title: {
        margin: 0,
        color: '#333'
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        color: '#666'
    },
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: '#ff4444',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
    },
    content: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '32px 16px'
    },
    projectsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
    },
    addButton: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    form: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '12px'
    },
    input: {
        padding: '10px 12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px'
    },
    submitButton: {
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    error: {
        backgroundColor: '#fee',
        color: '#c33',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px'
    },
    loading: {
        textAlign: 'center' as const,
        color: '#666'
    },
    empty: {
        textAlign: 'center' as const,
        color: '#666',
        padding: '48px',
        backgroundColor: 'white',
        borderRadius: '12px'
    },
    projectCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    projectInfo: {
        flex: 1
    },
    projectName: {
        margin: '0 0 8px 0',
        color: '#333'
    },
    projectDescription: {
        margin: '0 0 8px 0',
        color: '#666',
        fontSize: '14px'
    },
    projectDate: {
        color: '#999',
        fontSize: '12px'
    },
    deleteButton: {
        padding: '8px 16px',
        backgroundColor: '#ff4444',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
    }
};

export default ProjectsPage;