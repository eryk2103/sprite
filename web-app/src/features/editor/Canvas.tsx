import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import styles from './Canvas.module.css';
import { floodFill, pixelsToPngBlob } from './pixelGrid';

const CANVAS_SIZE = 512;

interface CanvasProps {
    size: number;
    color: string;
    tool: string;
    data?: string;
    onDirtyChange?: (dirty: boolean) => void;
    onColorPick?: (color: string) => void;
    onColorUse?: (color: string) => void;
}

export interface CanvasHandle {
    getData: () => string;
    isDirty: () => boolean;
    markSaved: () => void;
    toBlob: () => Promise<Blob | null>;
}

function parsePixels(data: string | undefined, size: number): string[][] | null {
    if (!data) return null;
    try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length === size && parsed.every(row => Array.isArray(row) && row.length === size)) {
            return parsed;
        }
    } catch {
        return null;
    }
    return null;
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>(function Canvas({ size, color, tool, data, onDirtyChange, onColorPick, onColorUse }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pixels = useRef<string[][]>([]);
    const isDrawing = useRef(false);
    const dirty = useRef(false);

    const setDirty = useCallback((value: boolean) => {
        dirty.current = value;
        onDirtyChange?.(value);
    }, [onDirtyChange]);

    useImperativeHandle(ref, () => ({
        getData: () => JSON.stringify(pixels.current),
        isDirty: () => dirty.current,
        markSaved: () => setDirty(false),
        toBlob: () => pixelsToPngBlob(pixels.current, size),
    }), [size, setDirty]);

    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        const cs = CANVAS_SIZE / size;

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const c = pixels.current[row]?.[col];
                if (c) {
                    ctx.fillStyle = c;
                    ctx.fillRect(col * cs, row * cs, cs, cs);
                }
            }
        }

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= size; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cs, 0);
            ctx.lineTo(i * cs, CANVAS_SIZE);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * cs);
            ctx.lineTo(CANVAS_SIZE, i * cs);
            ctx.stroke();
        }
    }, [size]);

    useEffect(() => {
        pixels.current = parsePixels(data, size) ?? Array.from({ length: size }, () => Array(size).fill(''));
        drawCanvas();
    }, [size, data, drawCanvas]);

    const getCell = useCallback((e: React.MouseEvent<HTMLCanvasElement>): [number, number] => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const cs = CANVAS_SIZE / size;
        const col = Math.floor(((e.clientX - rect.left) * (CANVAS_SIZE / rect.width)) / cs);
        const row = Math.floor(((e.clientY - rect.top) * (CANVAS_SIZE / rect.height)) / cs);
        return [row, col];
    }, [size]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const [row, col] = getCell(e);

        if (tool === 'dropper') {
            if (row < 0 || row >= size || col < 0 || col >= size) return;
            const sampled = pixels.current[row][col];
            if (sampled) onColorPick?.(sampled);
            return;
        }

        isDrawing.current = true;

        if (tool === 'fill') {
            floodFill(pixels.current, row, col, color, size);
            onColorUse?.(color);
        } else {
            if (row < 0 || row >= size || col < 0 || col >= size) return;
            pixels.current[row][col] = tool === 'eraser' ? '' : color;
            if (tool !== 'eraser') onColorUse?.(color);
        }
        setDirty(true);
        drawCanvas();
    }, [color, tool, size, getCell, drawCanvas, setDirty, onColorPick, onColorUse]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing.current || tool === 'fill') return;
        const [row, col] = getCell(e);
        if (row < 0 || row >= size || col < 0 || col >= size) return;
        pixels.current[row][col] = tool === 'eraser' ? '' : color;
        setDirty(true);
        drawCanvas();
    }, [color, tool, size, getCell, drawCanvas, setDirty]);

    const handleMouseUp = useCallback(() => {
        isDrawing.current = false;
    }, []);

    return (
        <div className={styles['sprite__canvas']}>
            <canvas
                ref={canvasRef}
                className={styles['sprite__canvas-surface']}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />
            <span className={`${styles['sprite__size']} label`}>{size} x {size}</span>
        </div>
    );
});

export default Canvas;
