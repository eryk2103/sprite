const TOOLS = ['pencil', 'fill', 'eraser'] as const;

interface ToolPickerProps {
    tool: string;
    onToolChange: (tool: string) => void;
}

export default function ToolPicker({ tool, onToolChange }: ToolPickerProps) {
    return(
        <div className="selector">
            {TOOLS.map(t => (
                <button
                    key={t}
                    className={`btn${tool === t ? ' btn--active' : ''}`}
                    onClick={() => onToolChange(t)}
                >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
            ))}
        </div>
    )
}