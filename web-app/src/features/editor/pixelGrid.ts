export function floodFill(pixels: string[][], row: number, col: number, color: string, size: number): void {
    const target = pixels[row]?.[col] ?? '';
    if (target === color) return;

    const stack: [number, number][] = [[row, col]];
    while (stack.length) {
        const [r, c] = stack.pop()!;
        if (r < 0 || r >= size || c < 0 || c >= size) continue;
        if (pixels[r][c] !== target) continue;
        pixels[r][c] = color;
        stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);
    }
}

export function pixelsToPngBlob(pixels: string[][], size: number): Promise<Blob | null> {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = size;
    exportCanvas.height = size;
    const ctx = exportCanvas.getContext('2d')!;

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const c = pixels[row]?.[col];
            if (c) {
                ctx.fillStyle = c;
                ctx.fillRect(col, row, 1, 1);
            }
        }
    }

    return new Promise<Blob | null>(resolve => exportCanvas.toBlob(resolve, 'image/png'));
}
