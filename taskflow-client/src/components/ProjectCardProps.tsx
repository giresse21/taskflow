// src/components/ProjectCard.tsx

// On définit le type des props avec une interface TypeScript
interface ProjectCardProps {
    name: string;
    description?: string; // ? = optionnel
    createdAt: string;
}

const ProjectCard = ({  name, description, createdAt }: ProjectCardProps) => {
    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '12px'
        }}>
            <h3>{name}</h3>
            {/* Affiche la description seulement si elle existe */}
            {description && <p>{description}</p>}
            <small>Créé le : {createdAt}</small>
        </div>
    );
};

export default ProjectCard;