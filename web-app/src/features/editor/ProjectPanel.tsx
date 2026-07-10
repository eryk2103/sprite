import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/authStore';
import ProjectSelectModal from './ProjectSelectModal';
import CreateGroupModal from './CreateGroupModal';
import './ProjectPanel.css';
import type { Project, ProjectDetail } from './project';
import type { Group } from './group';

type Props = {
    project: ProjectDetail|null;
    onProjectChange: (project: ProjectDetail) => void;
}
export default function ProjectPanel({project, onProjectChange}: Props) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectOpen, setSelectOpen] = useState(false);
    const [createGroupOpen, setCreateGroupOpen] = useState(false);
    const [loadError, setLoadError] = useState('');

    const handleOpenProject = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setSelectOpen(true);
    };

    const handleGroupCreate = (group: Group) => {
        if (!project) return;
        onProjectChange({ ...project, groups: [...project.groups, group] });
        setCreateGroupOpen(false);
    };

    const handleSelect = async (selected: Project) => {
        setLoadError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${selected.id}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to load project');

            const detail: ProjectDetail = await res.json();
            onProjectChange(detail);
            setSelectOpen(false);
        } catch {
            setLoadError('Failed to load project');
        }
    };

    return(
        <div className="project-panel">
            <h4 className="label">Project</h4>
            {project === null ?
            <div className="project__empty">
                <span className='placeholder'>
                    No project selected
                </span>
                <button className="btn btn--primary" onClick={handleOpenProject}>Open project</button>
            </div>
            :
            <>
                <div>
                    <div className="project__name-row">
                        <h3>{project.name}</h3>
                        <button className="btn btn--icon" onClick={() => setCreateGroupOpen(true)}>+</button>
                    </div>
                    {project.groups.length === 0 ?
                    <span className="placeholder">No groups</span>
                    :
                    <ul className="project-list">
                        {project.groups.map(group => (
                            <li key={group.id}>{group.name}</li>
                        ))}
                    </ul>
                    }
                </div>
                <button className="btn btn--primary" onClick={handleOpenProject}>Change project</button>
            </>

            }

            {loadError && <span className="form__error">{loadError}</span>}

            <ProjectSelectModal
                isOpen={selectOpen}
                onClose={() => setSelectOpen(false)}
                onSelect={handleSelect}
            />

            {project && (
                <CreateGroupModal
                    isOpen={createGroupOpen}
                    onClose={() => setCreateGroupOpen(false)}
                    projectId={project.id}
                    onCreate={handleGroupCreate}
                />
            )}
        </div>
    )
}