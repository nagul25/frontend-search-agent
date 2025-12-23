import ReactDOM from 'react-dom';
import SettingsPage from './SettingsPage';
import { XCircle } from 'lucide-react'
import styles from '../styles/SettingModal.module.css';

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    console.log("SettingsModal rendered with isOpen:", isOpen);
    if (!isOpen) return null;
    return ReactDOM.createPortal(
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.modalCloseBtn} onClick={onClose}>
                    <XCircle size={24} />
                </button>
                <SettingsPage />,
            </div>
        </div>,
        document.body,
        "settings-modal"
    )
}
