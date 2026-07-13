import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { getProject } from '../../api/projects';
import type { ProjectDetail } from '../../types/project';

export function useProject(projectId: string | undefined) {
    const location = useLocation();
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const prevPathRef = useRef(location.pathname);

    const fetchProject = (id: string) => {
        setLoading(true);
        setError('');

        getProject(id)
            .then(setProject)
            .catch(() => setError('Failed to load project'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!projectId) {
            setProject(null);
            return;
        }

        fetchProject(projectId);
    }, [projectId]);

    useEffect(() => {
        const base = projectId ? `/gallery/${projectId}` : null;
        const cameFromSubRoute = base !== null
            && prevPathRef.current.startsWith(`${base}/`)
            && location.pathname === base;
        prevPathRef.current = location.pathname;
        if (cameFromSubRoute && projectId) fetchProject(projectId);
    }, [location.pathname, projectId]);

    return {
        project,
        loading,
        error,
        refetch: () => { if (projectId) fetchProject(projectId); },
    };
}
