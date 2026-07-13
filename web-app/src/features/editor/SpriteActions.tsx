import styles from './MainPanel.module.css';

type Props = {
    dirty: boolean;
    saving: boolean;
    onSave: () => void;
    onDownload: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function SpriteActions({ dirty, saving, onSave, onDownload, onEdit, onDelete }: Props) {
    return (
        <div className={styles['sprite__actions']}>
            <button className='btn btn--primary' onClick={onSave} disabled={saving}>
                {dirty && <span className={styles['sprite__unsaved-dot']} aria-hidden="true" />}
                {saving ? 'Saving…' : 'Save'}
            </button>
            <button className='btn btn--outline btn--secondary' onClick={onDownload}>
                Download PNG
            </button>
            <button className='btn btn--outline btn--secondary' onClick={onEdit}>
                Edit
            </button>
            <button className='btn btn--outline btn--danger' onClick={onDelete}>
                Delete
            </button>
        </div>
    );
}
