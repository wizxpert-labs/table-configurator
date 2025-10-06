import {cssSafe} from "../utils/string";

export function headerTable(root: HTMLElement): HTMLTableElement | null {
    return (
        root.querySelector('.p-datatable-scrollable-header-table') ||
        root.querySelector('.p-datatable-table')
    ) as HTMLTableElement | null
}

export function bodyTable(root: HTMLElement): HTMLTableElement | null {
    return (
        root.querySelector('.p-datatable-scrollable-body-table') ||
        root.querySelector('.p-datatable-table')
    ) as HTMLTableElement | null
}

export function queryHeaderThs(root: HTMLElement) {
    const t = headerTable(root)
    if (!t) return [] as HTMLTableCellElement[]
    return Array.from(t.querySelectorAll<HTMLTableCellElement>('thead th'))
}


export function buildThMap(root: HTMLElement, storageKey: string, keys: string[]) {
    const ths = queryHeaderThs(root)
    const sid = cssSafe(storageKey)
    const map = new Map<string, { th: HTMLTableCellElement; index: number }>()
    ths.forEach((th, idx) => {
        for (const k of keys) {
            const mk = `sc-h-${sid}-${cssSafe(k)}`
            if (th.classList.contains(mk)) {
                map.set(k, { th, index: idx })
                break
            }
        }
    })
    if (map.size === 0) {
        const n = Math.min(keys.length, ths.length)
        for (let i = 0; i < n; i++) {
            const k = keys[i]!
            const th = ths[i]!
            if (k && th) {
                map.set(k, { th, index: i })
            }
        }
    }
    return { map, ths }
}
