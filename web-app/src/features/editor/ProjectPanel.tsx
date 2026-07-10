import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/authStore';
import ProjectSelectModal from './ProjectSelectModal';
import './ProjectPanel.css';
import type { Project } from './project';

type Props = {
    project: Project|null;
    onProjectChange: (project: Project) => void;
}
export default function ProjectPanel({project, onProjectChange}: Props) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectOpen, setSelectOpen] = useState(false);

    const handleOpenProject = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setSelectOpen(true);
    };

    const handleSelect = (project: Project) => {
        onProjectChange(project);
        setSelectOpen(false);
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
                    <h3>{project.name}</h3>
                </div>
                <button className="btn btn--primary" onClick={handleOpenProject}>Change project</button>
            </>

            }

            <ProjectSelectModal
                isOpen={selectOpen}
                onClose={() => setSelectOpen(false)}
                onSelect={handleSelect}
            />
        </div>
    )
}