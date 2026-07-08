interface ColorPickerProps {
    color: string;
    onColorChange: (color: string) => void;
}

export default function ColorPicker({ color, onColorChange }: ColorPickerProps) {
    return(
        <div>
            <input
                type="color"
                value={color}
                onChange={e => onColorChange(e.target.value)}
            />
        </div>
    )
}