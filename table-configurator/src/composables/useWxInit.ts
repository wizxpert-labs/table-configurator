import type { VNode, VNodeArrayChildren } from 'vue'
import type { ColInit as TcPreset, ColumnMeta } from '../store/WxTableStore'
import { flatten, isColumn, colKeyOf, extractText } from '../utils/wxTableConfig'

function pickHeaderFromVNodeTree(nodes: VNode[] | VNode | VNodeArrayChildren | undefined): string | null {
    const q: any[] = Array.isArray(nodes) ? [...nodes] : [nodes]
    while (q.length) {
        const n: any = q.shift()
        if (!n) continue
        if (typeof n === 'string' && n.trim()) return n.trim()
        const p = (n.props ?? {}) as Record<string, unknown>
        const v =
            (typeof (p as any).header === 'string' && (p as any).header) ||
            (typeof (p as any).headerLabel === 'string' && (p as any).headerLabel) ||
            (typeof (p as any)['header-label'] === 'string' && (p as any)['header-label']) ||
            null
        if (typeof v === 'string' && v.trim()) return v.trim()
        if (Array.isArray(n.children)) q.push(...n.children)
    }
    return null
}

export function parseInitWidthPx(v: string | number | undefined): number | undefined {
    if (v == null) return undefined
    if (typeof v === 'number' && isFinite(v) && v > 0) return v
    const s = String(v).trim().toLowerCase()
    if (!s) return undefined
    if (s.endsWith('px')) {
        const n = parseFloat(s.slice(0, -2))
        return isFinite(n) && n > 0 ? n : undefined
    }
    if (/^\d+(\.\d+)?$/.test(s)) {
        const n = parseFloat(s)
        return isFinite(n) && n > 0 ? n : undefined
    }
    return undefined
}

export function computeInitialVisibleFromPreset(all: string[], initByKey: Map<string, TcPreset>): string[] | undefined {
    const anyFlag = Array.from(initByKey.values()).some(v => typeof v?.visible === 'boolean')
    if (!anyFlag) return undefined
    const visibleSet = new Set<string>()
    for (const k of all) {
        const v = initByKey.get(k)
        if (v && typeof v.visible === 'boolean') {
            if (v.visible) visibleSet.add(k)
        } else {
            visibleSet.add(k)
        }
    }
    return Array.from(visibleSet)
}

export function collectColumnsMeta(rootDefaultSlot?: () => VNode[] | VNode): {
    meta: ColumnMeta[]
    initByKey: Map<string, TcPreset>
} {
    const meta: ColumnMeta[] = []
    const initByKey = new Map<string, TcPreset>()
    if (!rootDefaultSlot) return { meta, initByKey }

    const flat = flatten([rootDefaultSlot()].flat())
    const cols = flat.filter(isColumn)
    cols.forEach((c, idx) => {
        const p = (c.props ?? {}) as Record<string, any>
        const key = colKeyOf(c) as string
        const field = (p.field ?? null) as string | null
        const sortable = p.sortable === '' || p.sortable === true || p.sortable === 'true'
        const headerClass = (p.headerClass ?? p['header-class'] ?? null) as string | null
        const bodyClass = (p.bodyClass ?? p['body-class'] ?? p.class ?? p.className ?? null) as string | null
        const style = (typeof p.style === 'string' ? p.style : null) as string | null

        const slotObj = (c.children ?? {}) as Record<string, any>
        const headerSlot = typeof slotObj.header === 'function' ? slotObj.header : null
        const headerVNodeTree = headerSlot ? headerSlot({}) : undefined

        const headerFromVNodeProps = pickHeaderFromVNodeTree(headerVNodeTree)
        const headerFromSlotText = headerSlot ? extractText(headerVNodeTree as any) : null

        const headerProp =
            (typeof p.header === 'string' && p.header) ||
            (typeof p.headerLabel === 'string' && p.headerLabel) ||
            (typeof p['header-label'] === 'string' && p['header-label']) ||
            null

        const resolvedTitle =
            (headerFromVNodeProps && headerFromVNodeProps.trim()) ||
            (headerFromSlotText && headerFromSlotText.trim()) ||
            (headerProp && headerProp.trim()) ||
            ''

        const preset: TcPreset | undefined =
            (p.tcPreset ?? p['tc-preset']) ??
            (p.tcInit ?? p['tc-init']) ??
            (p.dkInit ?? p['dk-init'])

        if (preset) initByKey.set(key, preset)

        meta.push({ key, field, title: resolvedTitle, sortable, headerClass, bodyClass, style, order: idx })
    })

    return { meta, initByKey }
}

export function applyInitialStateFromPreset(opts: {
    storageKey: string
    store: any
    meta: ColumnMeta[]
    initByKey: Map<string, TcPreset>
    explicitVisible?: string[] | undefined
    defaultPx: number
}) {
    const { storageKey, store, meta, initByKey, explicitVisible, defaultPx } = opts
    const keys = meta.map(m => m.key)

    const initVisibleFromPreset = computeInitialVisibleFromPreset(keys, initByKey)
    const initialVisibleToPass = explicitVisible ?? initVisibleFromPreset

    const hadPersisted = store.hasPersisted(storageKey)
    store.initTable(storageKey, meta, initialVisibleToPass)

    if (!hadPersisted) {
        for (const [k, ini] of initByKey) {
            if (!ini) continue
            const patch: any = {}
            if (ini.align) patch.align = ini.align
            const boldVal = (ini as any).bold ?? (ini as any).cellBold
            if (typeof boldVal === 'boolean') patch.cellBold = boldVal
            if (ini.bg) patch.bg = ini.bg
            if (ini.fg) patch.fg = ini.fg
            if (Object.keys(patch).length) store.updateMeta(storageKey, k, patch)
        }

        const visibleNow: string[] = store.visibleKeys(storageKey)
        let sumPx = 0
        for (const k of visibleNow) {
            const ini = initByKey.get(k)
            const px = Math.max(1, Math.round(parseInitWidthPx((ini as any)?.width) ?? defaultPx))
            if (store.setAbsPx) store.setAbsPx(storageKey, k, px)
            else if (store.setWidthPx) store.setWidthPx(storageKey, k, px)
            sumPx += px
        }
        if (sumPx > 0) store.setTableStyle(storageKey, { scrollWidthPx: sumPx })
    }

    if (store.visibleKeys(storageKey).length === 0) {
        store.setVisible(storageKey, keys)
    }

    return { allKeys: keys }
}
