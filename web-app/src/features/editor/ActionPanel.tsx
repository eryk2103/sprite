import './ActionPanel.css';
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
        <div className="action-panel">
            <section className='section'>
                <h4 className='label section__title'>Color</h4>
                <ColorPicker color={color} onColorChange={onColorChange}/>
            </section>
            <section className='section'>
                <h4 className='label section__title'>Tools</h4>
                <ToolPicker tool={tool} onToolChange={onToolChange}/>
            </section>
            <section className='section'>
                <h4 className='label section__title'>Size</h4>
                <SizeSelector size={size} onSizeChange={onSizeChange}/>
            </section>
        </div>
    )
}