import styles from './ActionPanel.module.css';
import ColorPicker from './ColorPicker';
import SizeSelector from './SizeSelector';
import ToolPicker from './ToolPicker';

interface ActionPanelProps {
    color: string;
    onColorChange: (color: string) => void;
    tool: string;
    onToolChange: (tool: string) => void;
    size: number;
    onSizeChange: (size: number) => void;
}

export default function ActionPanel({ color, onColorChange, tool, onToolChange, size, onSizeChange }: ActionPanelProps) {
    return(
        <div className={styles['action-panel']}>
            <h3 className="label">Tool panel</h3>
            <section className={styles.section}>
                <h4 className={`label ${styles['section__title']}`}>Color</h4>
                <ColorPicker color={color} onColorChange={onColorChange}/>
            </section>
            <section className={styles.section}>
                <h4 className={`label ${styles['section__title']}`}>Tools</h4>
                <ToolPicker tool={tool} onToolChange={onToolChange}/>
            </section>
            <section className={styles.section}>
                <h4 className={`label ${styles['section__title']}`}>Size</h4>
                <SizeSelector size={size} onSizeChange={onSizeChange}/>
            </section>
        </div>
    )
}
