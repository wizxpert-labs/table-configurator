import { nextTick, type Ref } from 'vue'
import { cssSafe } from '../utils/string'

export function createDomSizing(opts: {
    wrapEl: Ref<HTMLElement | null>
    storageKey: string
    store: any
    visibleOrderedKeys: () => string[]
    titleForKey: (k: string) => string
    setPx: (k: string, px: number) => void
}) {
    const doubleRaf = () =>
        new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
    const measureTick = async () => {
        await nextTick()
        await doubleRaf()
    }

    const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase()

    function resolveKeyByTh(th: HTMLElement | null): string | null {
        if (!th) return null
        const sid = cssSafe(opts.storageKey)
        for (const k of opts.visibleOrderedKeys()) {
            const cls = `sc-h-${sid}-${cssSafe(k)}`
            if (th.classList.contains(cls)) return k
        }
        const txt = norm(th.textContent ?? '')
        if (!txt) return null
        for (const k of opts.visibleOrderedKeys()) {
            if (norm(opts.titleForKey(k)) === txt) return k
        }
        return null
    }

    function persistAllVisiblePxFromDOM(): number {
        const root = opts.wrapEl.value
        if (!root) return 0
        const pxByKey = new Map<string, number>()
        let sumPx = 0

        const ths = root.querySelectorAll<HTMLElement>('.p-datatable thead th, .p-treetable thead th')
        ths.forEach((th) => {
            const key = resolveKeyByTh(th)
            if (!key || pxByKey.has(key)) return
            const px = Math.max(1, Math.round(th.getBoundingClientRect().width))
            pxByKey.set(key, px)
            if (opts.store.visibleSet(opts.storageKey).has(key)) sumPx += px
        })

        pxByKey.forEach((px, key) => opts.setPx(key, px))
        return sumPx
    }

    function persistScrollWidthPxFromDOM() {
        const root = opts.wrapEl.value
        if (!root) return
        const w = (el: HTMLElement | null): number => {
            if (!el) return 0
            const r = el.getBoundingClientRect()
            const cs = getComputedStyle(el)
            const w1 = r.width
            const w2 = parseFloat(cs.width) || 0
            const w3 = parseFloat(cs.minWidth) || 0
            const w4 = (el as any).scrollWidth ? Number((el as any).scrollWidth) : 0
            return Math.round(Math.max(w1, w2, w3, w4))
        }

        const dtFrozen = root.querySelector<HTMLElement>('.p-datatable-frozen-view table.p-datatable-scrollable-table')
        const dtUnfrozen = root.querySelector<HTMLElement>('.p-datatable-unfrozen-view table.p-datatable-scrollable-table')
        const dtSingle = root.querySelector<HTMLElement>('.p-datatable-table-container > table.p-datatable-scrollable-table')
        const dtHeader = root.querySelector<HTMLElement>('table.p-datatable-scrollable-header-table')
        const dtBody = root.querySelector<HTMLElement>('table.p-datatable-scrollable-body-table')

        const ttFrozen = root.querySelector<HTMLElement>('.p-treetable-frozen-view table.p-treetable-scrollable-table')
        const ttUnfrozen = root.querySelector<HTMLElement>('.p-treetable-unfrozen-view table.p-treetable-scrollable-table')
        const ttSingle = root.querySelector<HTMLElement>('.p-treetable-table-container > table.p-treetable-scrollable-table')
        const ttHeader = root.querySelector<HTMLElement>('table.p-treetable-scrollable-header-table')
        const ttBody = root.querySelector<HTMLElement>('table.p-treetable-scrollable-body-table')

        let total = 0
        if (dtFrozen || dtUnfrozen) total = w(dtFrozen) + w(dtUnfrozen)
        else if (ttFrozen || ttUnfrozen) total = w(ttFrozen) + w(ttUnfrozen)
        else if (dtSingle) total = w(dtSingle)
        else if (ttSingle) total = w(ttSingle)
        else if (dtHeader || dtBody) total = Math.max(w(dtHeader), w(dtBody))
        else if (ttHeader || ttBody) total = Math.max(w(ttHeader), w(ttBody))

        if (total > 0) opts.store.setTableStyle(opts.storageKey, { scrollWidthPx: total })
    }

    return { measureTick, persistAllVisiblePxFromDOM, persistScrollWidthPxFromDOM }
}

/** style helpers */
export function normalizeStyle(input: unknown): Record<string, any> {
    if (!input) return {}
    if (typeof input === 'object') return { ...(input as Record<string, any>) }
    if (typeof input === 'string') return stringStyleToObject(input as string)
    return {}
}

export function withHash(hex?: string | null): string | undefined {
    if (!hex) return undefined
    const s = hex.trim()
    if (!s) return undefined
    return s.startsWith('#') ? s : `#${s}`
}

export function decorateBodyStyle(
    base: Record<string, any>,
    opts: { bg?: string | null; fg?: string | null; fontPx?: number | null; fontFamily?: string | null }
) {
    const out = { ...base }
    const bg = withHash(opts.bg ?? undefined)
    const fg = withHash(opts.fg ?? undefined)
    if (bg) {
        out.background = bg
        out.backgroundColor = bg
    }
    if (fg) out.color = fg
    if (typeof opts.fontPx === 'number' && opts.fontPx > 0) out['--sc-font-size'] = `${Math.round(opts.fontPx)}px`
    if (opts.fontFamily && opts.fontFamily.trim()) out['--sc-font-family'] = opts.fontFamily
    return out
}

function stringStyleToObject(s?: string): Record<string, string> {
    if (!s) return {}
    const out: Record<string, string> = {}
    s.split(';').forEach((pair) => {
        const [k, v] = pair.split(':')
        if (!k || !v) return
        out[k.trim()] = v.trim()
    })
    return out
}
