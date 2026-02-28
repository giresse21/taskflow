import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as taskService from '../../services/taskService';
import type { Task } from '../../types';

const TasksPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // States
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    // State formulaire
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    // State édition
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // Charger les tâches au démarrage
    useEffect(() => {
        if (projectId) {
            fetchTasks();
        }
    }, [projectId]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await taskService.getTasks(Number(projectId));
            setTasks(data);
        } catch (err) {
            setError('Erreur lors du chargement des tâches');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingTask) {
                // Modifier une tâche existante
                const updated = await taskService.updateTask(
                    Number(projectId),
                    editingTask.id,
                    { title, description, dueDate: dueDate || undefined }
                );
                setTasks(tasks.map(t => t.id === updated.id ? updated : t));
            } else {
                // Créer une nouvelle tâche
                const created = await taskService.createTask(
                    Number(projectId),
                    { title, description, dueDate: dueDate || undefined }
                );
                setTasks([created, ...tasks]);
            }
            resetForm();
        } catch (err) {
            setError('Erreur lors de la sauvegarde');
        }
    };

    const handleToggle = async (task: Task) => {
        try {
            const updated = await taskService.toggleTask(Number(projectId), task.id);
            setTasks(tasks.map(t => t.id === updated.id ? updated : t));
        } catch (err) {
            setError('Erreur lors de la mise à jour');
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description || '');
        setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Supprimer cette tâche ?')) return;
        try {
            await taskService.deleteTask(Number(projectId), id);
            setTasks(tasks.filter(t => t.id !== id));
        } catch (err) {
            setError('Erreur lors de la suppression');
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDueDate('');
        setEditingTask(null);
        setShowForm(false);
    };

    // Stats des tâches
    const completedCount = tasks.filter(t => t.isCompleted).length;
    const totalCount = tasks.length;
    const progressPercent = totalCount > 0
        ? Math.round((completedCount / totalCount) * 100)
        : 0;

    return (
        <div className="min-vh-100 bg-light">

            {/* Navbar Bootstrap */}
            <nav className="navbar navbar-dark bg-dark px-4">
                <span className="navbar-brand fw-bold">TaskFlow</span>
                <div className="d-flex align-items-center gap-3">
                    <span className="text-white-50">
                        {user?.firstName || user?.email}
                    </span>
                    <button
                        className="btn btn-outline-light btn-sm"
                        onClick={() => navigate('/projects')}
                    >
                        ← Projets
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={logout}
                    >
                        Déconnexion
                    </button>
                </div>
            </nav>

            <div className="container py-4">

                {/* Header avec stats */}
                <div className="row mb-4">
                    <div className="col">
                        <h2 className="fw-bold">Tâches du projet</h2>
                    </div>
                </div>

                {/* Cards stats Bootstrap */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="card text-center border-0 shadow-sm">
                            <div className="card-body">
                                <h3 className="text-primary fw-bold">{totalCount}</h3>
                                <p className="text-muted mb-0">Total</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card text-center border-0 shadow-sm">
                            <div className="card-body">
                                <h3 className="text-success fw-bold">{completedCount}</h3>
                                <p className="text-muted mb-0">Complétées</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card text-center border-0 shadow-sm">
                            <div className="card-body">
                                <h3 className="text-warning fw-bold">
                                    {totalCount - completedCount}
                                </h3>
                                <p className="text-muted mb-0">En cours</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Barre de progression */}
                {totalCount > 0 && (
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="fw-bold">Progression</span>
                                <span className="text-muted">{progressPercent}%</span>
                            </div>
                            <div className="progress" style={{ height: '10px' }}>
                                <div
                                    className="progress-bar bg-success"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Bouton + Formulaire */}
                <div className="d-flex justify-content-end mb-3">
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            resetForm();
                            setShowForm(!showForm);
                        }}
                    >
                        {showForm ? 'Annuler' : '+ Nouvelle Tâche'}
                    </button>
                </div>

                {/* Formulaire Bootstrap */}
                {showForm && (
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-3">
                                {editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
                            </h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">
                                        Titre *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Titre de la tâche"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">
                                        Description
                                    </label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Description (optionnelle)"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">
                                        Date limite
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                    >
                                        {editingTask ? 'Modifier' : 'Créer'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={resetForm}
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Erreur */}
                {error && (
                    <div className="alert alert-danger alert-dismissible">
                        {error}
                        <button
                            className="btn-close"
                            onClick={() => setError('')}
                        />
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" />
                        <p className="mt-2 text-muted">Chargement...</p>
                    </div>
                )}

                {/* Liste vide */}
                {!loading && tasks.length === 0 && (
                    <div className="text-center py-5">
                        <p className="text-muted fs-5">Aucune tâche pour ce projet</p>
                        <p className="text-muted">Créez votre première tâche !</p>
                    </div>
                )}

                {/* Liste des tâches */}
                <div className="row g-3">
                    {tasks.map(task => (
                        <div key={task.id} className="col-12">
                            <div className={`card border-0 shadow-sm ${task.isCompleted ? 'opacity-75' : ''}`}>
                                <div className="card-body">
                                    <div className="d-flex align-items-start gap-3">

                                        {/* Checkbox Toggle */}
                                        <div className="form-check mt-1">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={task.isCompleted}
                                                onChange={() => handleToggle(task)}
                                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                            />
                                        </div>

                                        {/* Contenu */}
                                        <div className="flex-grow-1">
                                            <h5 className={`mb-1 ${task.isCompleted ? 'text-decoration-line-through text-muted' : ''}`}>
                                                {task.title}
                                            </h5>
                                            {task.description && (
                                                <p className="text-muted mb-1 small">
                                                    {task.description}
                                                </p>
                                            )}
                                            <div className="d-flex gap-3">
                                                <small className="text-muted">
                                                    Créé le {new Date(task.createdAt).toLocaleDateString('fr-FR')}
                                                </small>
                                                {task.dueDate && (
                                                    <small className={`${new Date(task.dueDate) < new Date() && !task.isCompleted ? 'text-danger fw-bold' : 'text-muted'}`}>
                                                        📅 Échéance : {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                                                    </small>
                                                )}
                                            </div>
                                        </div>

                                        {/* Badge statut */}
                                        <div className="d-flex flex-column align-items-end gap-2">
                                            <span className={`badge ${task.isCompleted ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                {task.isCompleted ? '✓ Complété' : 'En cours'}
                                            </span>

                                            {/* Boutons actions */}
                                            <div className="d-flex gap-1">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => handleEdit(task)}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleDelete(task.id)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default TasksPage;