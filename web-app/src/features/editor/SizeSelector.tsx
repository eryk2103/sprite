const SIZES = [8, 16, 32, 64] as const;

interface SizeSelectorProps {
    size: number;
    onSizeChange: (size: number) => void;
}

export default function SizeSelector({ size, onSizeChange }: SizeSelectorProps){
    return(
        <div className="selector">
            {SIZES.map(s => (
                <button
                    key={s}
                    className={`btn ${size === s ? 'btn--primary' : 'btn--secondary'}`}
                    onClick={() => onSizeChange(s)}
                >
                    {s}
                </button>
            ))}
        </div>
    )
}