import Modal from '../../shared/Modal';

interface DeleteProjectModalProps {
    isOpen: boolean;
    projectName: string;
    deleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteProjectModal({ isOpen, projectName, deleting, onConfirm, onCancel }: DeleteProjectModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onCancel} title="Delete Project">
            <p>Delete project "{projectName}"? This cannot be undone.</p>
            <div className="form__footer">
                <button type="button" className="btn" onClick={onCancel} disabled={deleting}>
                    Cancel
                </button>
                <button type="button" className="btn btn--primary" onClick={onConfirm} disabled={deleting}>
                    {deleting ? 'Deleting…' : 'Delete'}
                </button>
            </div>
        </Modal>
    );
}
