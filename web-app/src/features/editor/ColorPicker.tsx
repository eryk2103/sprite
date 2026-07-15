import styles from './ColorPicker.module.css';

interface ColorPickerProps {
    color: string;
    onColorChange: (color: string) => void;
    recentColors: string[];
}

export default function ColorPicker({ color, onColorChange, recentColors }: ColorPickerProps) {
    return(
        <div>
            <div className={styles['color-picker']}>
                <input
                    type="color"
                    value={color}
                    onChange={e => onColorChange(e.target.value)}
                />
                <span className={`label ${styles['color-picker__hex']}`}>{color.toUpperCase()}</span>
            </div>
            {recentColors.length > 0 && (
                <div className={styles['recent-colors']}>
                    {recentColors.map((c, i) => (
                        <span key={`${c}-${i}`} className={styles['recent-colors__item']} data-hex={c.toUpperCase()}>
                            <button
                                type="button"
                                className={styles['recent-colors__swatch']}
                                style={{ backgroundColor: c }}
                                aria-label={`Use color ${c.toUpperCase()}`}
                                onClick={() => onColorChange(c)}
                            />
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}