import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../services/authService';

const LoginPage = () => {
    // State du formulaire
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Récupère la fonction login depuis le Context
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        // Empêche le rechargement de la page
        e.preventDefault();
        
        setLoading(true);
        setError('');

        try {
            // Appel API login
            const response = await authService.login({ email, password });
            
            // Sauvegarde le token dans le Context
            login(response);
            
            // Redirect vers les projets
            window.location.href = '/projects';
            
        } catch (err) {
            setError('Email ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>TaskFlow</h1>
                <h2 style={styles.subtitle}>Connexion</h2>

                {/* Affiche l'erreur si elle existe */}
                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Champ Email */}
                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            placeholder="giresse@test.com"
                            required
                        />
                    </div>

                    {/* Champ Password */}
                    <div style={styles.field}>
                        <label style={styles.label}>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Bouton Submit */}
                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                {/* Lien vers Register */}
                <p style={styles.link}>
                    Pas encore de compte ?{' '}
                    <a href="/register">S'inscrire</a>
                </p>
            </div>
        </div>
    );
};

// Styles inline
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
    },
    title: {
        textAlign: 'center' as const,
        color: '#333',
        marginBottom: '8px'
    },
    subtitle: {
        textAlign: 'center' as const,
        color: '#666',
        fontWeight: 'normal' as const,
        marginBottom: '24px'
    },
    error: {
        backgroundColor: '#fee',
        color: '#c33',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px'
    },
    field: {
        marginBottom: '16px'
    },
    label: {
        display: 'block',
        marginBottom: '6px',
        color: '#333',
        fontSize: '14px',
        fontWeight: 'bold' as const
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px',
        boxSizing: 'border-box' as const
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '8px'
    },
    link: {
        textAlign: 'center' as const,
        marginTop: '16px',
        color: '#666',
        fontSize: '14px'
    }
};

export default LoginPage;