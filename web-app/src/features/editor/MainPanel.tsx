import { useNavigate } from 'react-router';
import { useAuth } from '../auth/authStore';
import Canvas from './Canvas';
import './MainPanel.css';

interface MainPanelProps {
    size: number;
    color: string;
    tool: string;
}

export default function MainPanel({ size, color, tool }: MainPanelProps) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSave = () => {
        if (!user) {
            navigate('/login');
            return;
        }
    };

    return (
        <div className="main-panel">
            <div className='sprite__header'>
                <span className="label sprite__name">sprite_01</span>
                <button className='btn btn--primary' onClick={handleSave}>Save</button>
            </div>
            <div className="sprite">
                <Canvas size={size} color={color} tool={tool} />
            </div>
        </div>
    );
}
