export type Sprite = {
    id: number;
    name: string;
    data: string;
}

export type SpriteSummary = {
    id: number;
    name: string;
}

export function getSpriteSize(data: string, fallback: number): number {
    try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.length;
        }
    } catch {
        // not valid pixel data, fall back
    }
    return fallback;
}