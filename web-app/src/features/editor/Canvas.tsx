import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import './Canvas.css';

const CANVAS_SIZE = 600;

interface CanvasProps {
    size: number;
    color: string;
    tool: string;
    data?: string;
}

export interface CanvasHandle {
    getData: () => string;
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

const Canvas = forwardRef<CanvasHandle, CanvasProps>(function Canvas({ size, color, tool, data }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pixels = useRef<string[][]>([]);
    const isDrawing = useRef(false);

    useImperativeHandle(ref, () => ({
        getData: () => JSON.stringify(pixels.current),
    }));

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
        isDrawing.current = true;
        const [row, col] = getCell(e);

        if (tool === 'fill') {
            const target = pixels.current[row]?.[col] ?? '';
            if (target === color) return;
            const stack: [number, number][] = [[row, col]];
            while (stack.length) {
                const [r, c] = stack.pop()!;
                if (r < 0 || r >= size || c < 0 || c >= size) continue;
                if (pixels.current[r][c] !== target) continue;
                pixels.current[r][c] = color;
                stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);
            }
        } else {
            if (row < 0 || row >= size || col < 0 || col >= size) return;
            pixels.current[row][col] = tool === 'eraser' ? '' : color;
        }
        drawCanvas();
    }, [color, tool, size, getCell, drawCanvas]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing.current || tool === 'fill') return;
        const [row, col] = getCell(e);
        if (row < 0 || row >= size || col < 0 || col >= size) return;
        pixels.current[row][col] = tool === 'eraser' ? '' : color;
        drawCanvas();
    }, [color, tool, size, getCell, drawCanvas]);

    const handleMouseUp = useCallback(() => {
        isDrawing.current = false;
    }, []);

    return (
        <div className="sprite__canvas">
            <canvas
                ref={canvasRef}
                id="canvas"
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />
            <span className="sprite__size label">{size} x {size}</span>
        </div>
    );
});

export default Canvas;
