import Modal from '../../shared/Modal';

interface UnsavedChangesModalProps {
    isOpen: boolean;
    saving: boolean;
    onSave: () => void;
    onDiscard: () => void;
    onCancel: () => void;
}

export default function UnsavedChangesModal({ isOpen, saving, onSave, onDiscard, onCancel }: UnsavedChangesModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onCancel} title="Unsaved Changes">
            <p>This sprite has unsaved changes. Save them before switching?</p>
            <div className="form__footer">
                <button type="button" className="btn" onClick={onDiscard} disabled={saving}>
                    Discard changes
                </button>
                <button type="button" className="btn btn--primary" onClick={onSave} disabled={saving}>
                    {saving ? 'Saving…' : 'Save changes'}
                </button>
            </div>
        </Modal>
    );
}
