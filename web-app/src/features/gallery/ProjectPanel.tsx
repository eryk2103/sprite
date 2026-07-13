import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import styles from './ProjectPanel.module.css';
import { getProjects } from '../../api/projects';
import type { Project } from '../../types/project';

export default function ProjectPanel() {
    const navigate = useNavigate();
    const location = useLocation();
    const { projectId } = useParams();
    const selectedProjectId = projectId ? Number(projectId) : null;

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const prevPathRef = useRef(location.pathname);

    const fetchProjects = () => {
        setLoading(true);
        setError('');

        getProjects()
            .then(setProjects)
            .catch(() => setError('Failed to load projects'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        const prevPath = prevPathRef.current;
        const currPath = location.pathname;
        const cameFromMutation =
            (prevPath === '/gallery/new' && currPath !== '/gallery/new') ||
            (/^\/gallery\/\d+\/edit$/.test(prevPath) && currPath !== prevPath) ||
            (/^\/gallery\/\d+$/.test(prevPath) && currPath === '/gallery');
        prevPathRef.current = currPath;
        if (cameFromMutation) fetchProjects();
    }, [location.pathname]);

    return (
        <div className={styles['gallery-project-panel']}>
            <h3 className="label">Projects</h3>
            {loading && <span className="placeholder">Loading…</span>}
            {!loading && error && <span className="form__error">{error}</span>}
            {!loading && !error && projects.length === 0 && (
                <span className="placeholder">No projects found</span>
            )}
            {!loading && !error && projects.length > 0 && (
                <ul className={styles['gallery-project-list']}>
                    {projects.map(project => (
                        <li
                            key={project.id}
                            className={`card ${styles['gallery-project-list__item']}${project.id === selectedProjectId ? ' card--selected' : ''}`}
                            onClick={() => navigate(`/gallery/${project.id}`)}
                        >
                            {project.name}
                        </li>
                    ))}
                </ul>
            )}
            <button
                className={`btn btn--primary ${styles['gallery-project-panel__add-btn']}`}
                onClick={() => navigate('/gallery/new')}
            >
                Add project
            </button>
        </div>
    );
}
