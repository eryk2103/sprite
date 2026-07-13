import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return createPortal(
        <div className={styles['modal-overlay']} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles['modal__header']}>
                    <span className={`${styles['modal__title']} label`}>{title}</span>
                    <button className="btn btn--ghost btn--secondary btn--sm btn--icon" onClick={onClose}>✕</button>
                </div>
                <div className={styles['modal__body']}>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
