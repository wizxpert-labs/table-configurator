export const cssSafe = (s: string) => String(s).replace(/[^a-zA-Z0-9_-]/g, '_')

export const humanizeKey = (s: string | null | undefined): string =>
    String(s ?? '')
        .replace(/[_-]+/g, ' ')
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\b\w/g, (m) => m.toUpperCase())
