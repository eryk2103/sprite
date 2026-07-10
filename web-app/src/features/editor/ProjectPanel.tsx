import './ProjectPanel.css';

export default function ProjectPanel() {
    return(
        <div className="project-panel">
            <h4 className="label">Project</h4>
            <div className="project__empty">
                <span className='placeholder'>
                    No project selected
                </span>
                <button className="btn btn--primary">Open project</button>
            </div>
        </div>
    )
}