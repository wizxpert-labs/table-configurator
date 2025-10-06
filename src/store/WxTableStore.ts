import {defineStore} from 'pinia'

export type ColumnMeta = {
    key: string
    field: string | null
    title: string | null
    sortable: boolean
    headerClass: string | null
    bodyClass: string | null
    style: string | null
    order: number
}

export type AlignVal = 'left' | 'center' | 'right'

export type ColumnPersist = {
    visible: boolean
    order: number
    title?: string
    align?: AlignVal
    cellBold?: boolean
    headerBold?: boolean
    bg?: string
    headerBg?: string
    fg?: string
    fontPx?: number
    fontFamily?: string
    absPx?: number
}

export type ColInit = Partial<{
    visible: boolean
    px: number | string
    align: 'left' | 'center' | 'right'
    bold: boolean
    cellBold: boolean
    bg: string
    fg: string
    fontPx: number
    fontFamily: string
}>


export type TableStylePersist = {
    fontSize?: number
    fontFamily?: string
    scrollWidthPx?: number
}

type PersistedV1 = {
    v: 1
    cols: Record<string, ColumnPersist & { width?: number }>
    parts?: Record<string, Record<string, boolean>>
    table?: TableStylePersist
}

type TableState = {
    columns: ColumnMeta[]
    map: Record<string, ColumnPersist>
    parts: Record<string, Record<string, boolean>>
    table: TableStylePersist
}
type TablesMap = Record<string, TableState>

const LS_PREFIX = 'wx.table.config:'
const PERSIST_VERSION = 1 as const
const lsKey = (id: string) => `${LS_PREFIX}${id}`

const DEFAULT_ABS_PX = 50
const clampNonNegativeInt = (v: number) => Math.max(0, Math.round(v))

function getLS(): Storage | null {
    try {
        if (typeof window === 'undefined') return null
        if (!('localStorage' in window)) return null
        return window.localStorage
    } catch {
        return null
    }
}

function loadRawFromLS(id: string): PersistedV1 | null {
    const ls = getLS()
    if (!ls) return null
    try {
        const raw = ls.getItem(lsKey(id))
        if (!raw) return null
        const parsed = JSON.parse(raw)
        if (!parsed || typeof parsed !== 'object') return null
        if (parsed.v !== PERSIST_VERSION) return null
        return parsed as PersistedV1
    } catch {
        return null
    }
}

function saveToLS(id: string, state: TableState) {
    const ls = getLS()
    if (!ls) return
    try {
        const payload: PersistedV1 = {
            v: PERSIST_VERSION,
            cols: state.map,
            parts: state.parts,
            table: state.table,
        }
        ls.setItem(lsKey(id), JSON.stringify(payload))
    } catch {
    }
}

function buildMapFrom(
    columns: ColumnMeta[],
    persisted: PersistedV1 | null,
    initialVisible?: string[]
): {
    map: Record<string, ColumnPersist>
    parts: Record<string, Record<string, boolean>>
    table: TableStylePersist
} {
    const metaOrder = new Map<string, number>()
    columns.forEach((c, i) => metaOrder.set(c.key, i))

    const map: Record<string, ColumnPersist> = {}
    for (const c of columns) map[c.key] = {visible: true, order: metaOrder.get(c.key) ?? 0}

    const parts: Record<string, Record<string, boolean>> = {}
    const table: TableStylePersist = {}

    if (persisted?.v === PERSIST_VERSION) {
        for (const [k, val] of Object.entries(persisted.cols ?? {})) {
            if (!(k in map)) continue
            const v = val as Partial<ColumnPersist> & { width?: number }

            const hasAlign = v.align === 'left' || v.align === 'center' || v.align === 'right'

            const cellBold =
                typeof v.cellBold === 'boolean'
                    ? v.cellBold
                    : typeof v.headerBold === 'boolean'
                        ? v.headerBold
                        : undefined

            const rawAbs = v.absPx
            const absPx =
                rawAbs != null && Number.isFinite(rawAbs) && rawAbs > 0
                    ? clampNonNegativeInt(rawAbs)
                    : undefined

            const fp = v.fontPx
            const fontPx =
                fp != null && Number.isFinite(fp) && fp > 0 ? Math.round(fp) : undefined

            const ff = (v.fontFamily ?? '').toString().trim()
            const fontFamily = ff ? ff : undefined

            map[k] = {
                visible: typeof v.visible === 'boolean' ? v.visible : true,
                order:
                    v.order != null && Number.isFinite(v.order)
                        ? v.order
                        : (metaOrder.get(k) ?? 0),
                title: typeof v.title === 'string' ? v.title : undefined,
                align: hasAlign ? (v.align as AlignVal) : undefined,
                cellBold,
                headerBold: typeof v.headerBold === 'boolean' ? v.headerBold : undefined,
                bg: typeof v.bg === 'string' ? v.bg : undefined,
                headerBg: typeof v.headerBg === 'string' ? v.headerBg : undefined,
                fg: typeof v.fg === 'string' ? v.fg : undefined,
                fontPx,
                fontFamily,
                absPx,
            }
        }

        if (persisted.parts && typeof persisted.parts === 'object') {
            for (const [colKey, visMap] of Object.entries(persisted.parts)) {
                if (!parts[colKey]) parts[colKey] = {}
                for (const [partKey, on] of Object.entries(visMap ?? {})) {
                    parts[colKey][partKey] = on
                }
            }
        }

        if (persisted.table && typeof persisted.table === 'object') {
            const fs = persisted.table.fontSize
            if (fs != null && Number.isFinite(fs)) table.fontSize = fs

            const ff = persisted.table.fontFamily
            if (ff && ff.trim()) table.fontFamily = ff

            const sw = persisted.table.scrollWidthPx
            if (sw != null && Number.isFinite(sw)) {
                table.scrollWidthPx = Math.max(0, Math.round(sw))
            }
        }
    }

    for (const c of columns) {
        const t = (c.title ?? '').trim()
        if (!t) continue
        const cur = (map[c.key]?.title ?? '').trim()
        if (!cur) {
            map[c.key]!.title = t;
        }
    }

    if (!persisted && initialVisible) {
        const allowed = new Set(initialVisible)
        for (const k of Object.keys(map)) map[k]!.visible = allowed.has(k)
    }

    const normalized = Object.entries(map)
        .sort((a, b) => a[1].order - b[1].order)
        .map(([k], i) => ({k, i}))
    for (const {k, i} of normalized) map[k]!.order = i

    return {map, parts, table}
}

function orderedKeys(map: Record<string, ColumnPersist>): string[] {
    return Object.keys(map).sort((a, b) => map[a]!.order - map[b]!.order)
}

function visibleKeysFrom(map: Record<string, ColumnPersist>): string[] {
    return Object.keys(map)
        .filter(k => map[k]!.visible)
        .sort((a, b) => map[a]!.order - map[b]!.order)
}

function adjustTableScrollWidthPx(t: TableState, delta: number) {
    const cur = t.table.scrollWidthPx ?? 0
    const next = clampNonNegativeInt(cur + delta)
    if (next <= 0) delete t.table.scrollWidthPx
    else t.table.scrollWidthPx = next
}

export const useWxTableStore = defineStore('smartColumns', {
    state: (): { tables: TablesMap } => ({tables: {}}),

    getters: {
        table: (s) => (id: string): TableState | undefined => s.tables[id],
        orderedKeys: (s) => (id: string): string[] => s.tables[id] ? orderedKeys(s.tables[id].map) : [],
        visibleKeys: (s) => (id: string): string[] => s.tables[id] ? visibleKeysFrom(s.tables[id].map) : [],
        visibleSet: (s) => (id: string): Set<string> => new Set(s.tables[id] ? visibleKeysFrom(s.tables[id].map) : []),
        titleOf: (s) => (id: string, key: string): string | undefined => s.tables[id]?.map[key]?.title,
        alignOf: (s) => (id: string, key: string): AlignVal | undefined => s.tables[id]?.map[key]?.align,
        cellBoldOf: (s) => (id: string, key: string): boolean | undefined => s.tables[id]?.map[key]?.cellBold,
        headerBoldOf: (s) => (id: string, key: string): boolean | undefined => s.tables[id]?.map[key]?.headerBold,
        bgOf: (s) => (id: string, key: string): string | undefined => s.tables[id]?.map[key]?.bg,
        headerBgOf: (s) => (id: string, key: string): string | undefined => s.tables[id]?.map[key]?.headerBg,
        fgOf: (s) => (id: string, key: string): string | undefined => s.tables[id]?.map[key]?.fg,
        fontPxOf: (s) => (id: string, key: string): number | undefined => s.tables[id]?.map[key]?.fontPx,
        fontFamilyOf: (s) => (id: string, key: string): string | undefined => s.tables[id]?.map[key]?.fontFamily,
        tableFontSize: (s) => (id: string): number | undefined => s.tables[id]?.table?.fontSize,
        tableFontFamily: (s) => (id: string): string | undefined => s.tables[id]?.table?.fontFamily,
        tableScrollWidth: (s) => (id: string): number | undefined => s.tables[id]?.table?.scrollWidthPx,
        cellPartsOf: (s) => (id: string, columnKey: string): Record<string, boolean> =>
            s.tables[id]?.parts?.[columnKey] ?? {},
        columnPartKeysOf: (s) => (id: string, columnKey: string): string[] =>
            Object.keys(s.tables[id]?.parts?.[columnKey] ?? {}),
        absPxOf: (s) => (id: string, key: string): number | undefined => s.tables[id]?.map[key]?.absPx,
    },

    actions: {
        hasPersisted(id: string): boolean {
            return !!loadRawFromLS(id)
        },

        initTable(id: string, columns: ColumnMeta[], initialVisible?: string[]) {
            const persisted = loadRawFromLS(id)
            const {map, parts, table} = buildMapFrom(columns, persisted, initialVisible)
            this.tables[id] = {columns, map, parts, table}
            saveToLS(id, this.tables[id])
        },

        setVisible(id: string, list: string[]) {
            const t: any = this.tables[id]
            if (!t) return

            const prevVisible = new Set(visibleKeysFrom(t.map))
            const nextVisible = new Set(list)

            for (const k of Object.keys(t.map)) {
                const was = prevVisible.has(k)
                const now = nextVisible.has(k)

                if (was && !now) {
                    const px = t.map[k].absPx ?? DEFAULT_ABS_PX
                    t.map[k].absPx = clampNonNegativeInt(px)
                    adjustTableScrollWidthPx(t, -px)
                } else if (!was && now) {
                    const px = t.map[k].absPx ?? DEFAULT_ABS_PX
                    adjustTableScrollWidthPx(t, +px)
                }
            }

            for (const k of Object.keys(t.map)) t.map[k].visible = nextVisible.has(k)
            saveToLS(id, t)
        },

        toggle(id: string, key: string, on: boolean) {
            const t: any = this.tables[id]
            if (!t || !(key in t.map)) return
            const was = !!t.map[key].visible
            if (was === on) return

            if (on) {
                const px = t.map[key].absPx ?? DEFAULT_ABS_PX
                adjustTableScrollWidthPx(t, +px)
                t.map[key].visible = true
            } else {
                const px = t.map[key].absPx ?? DEFAULT_ABS_PX
                t.map[key].absPx = clampNonNegativeInt(px)
                adjustTableScrollWidthPx(t, -px)
                t.map[key].visible = false
            }

            saveToLS(id, t)
        },

        setOrder(id: string, keysInOrder: string[]) {
            const t: any = this.tables[id]
            if (!t) return
            keysInOrder.forEach((k, idx) => {
                if (k in t.map) t.map[k].order = idx
            })
            saveToLS(id, t)
        },

        updateMeta(
            id: string,
            key: string,
            patch: Partial<Pick<ColumnPersist, 'title' | 'align' | 'cellBold' | 'bg' | 'headerBg' | 'fg' | 'fontPx' | 'fontFamily'>>
        ) {
            const t: any = this.tables[id]
            if (!t || !(key in t.map)) return

            const p: Partial<ColumnPersist> = {...patch}

            if ('fontPx' in p) {
                const v = p.fontPx
                p.fontPx = (v != null && Number.isFinite(v) && v > 0) ? Math.round(v) : undefined
            }
            if ('fontFamily' in p) {
                const v = (p.fontFamily ?? '').toString().trim()
                p.fontFamily = v ? v : undefined
            }

            Object.assign(t.map[key], p)
            saveToLS(id, t)
        },

        setColumnFontPx(id: string, key: string, px: number | undefined) {
            const t: any = this.tables[id]
            if (!t || !(key in t.map)) return
            if (px != null && Number.isFinite(px) && px > 0) {
                t.map[key].fontPx = Math.round(px)
            } else {
                delete t.map[key].fontPx
            }
            saveToLS(id, t)
        },

        setColumnFontFamily(id: string, key: string, family: string | undefined) {
            const t: any = this.tables[id]
            if (!t || !(key in t.map)) return
            const v = (family ?? '').toString().trim()
            if (v) t.map[key].fontFamily = v
            else delete t.map[key].fontFamily
            saveToLS(id, t)
        },

        setTableStyle(id: string, patch: TableStylePersist) {
            const t = this.tables[id]
            if (!t) return
            t.table = {...(t.table || {}), ...(patch || {})}

            const fs = t.table.fontSize
            if (fs != null && Number.isFinite(fs) && fs > 0) {
                t.table.fontSize = Math.round(fs)
            } else {
                delete t.table.fontSize
            }

            const ff = t.table.fontFamily
            if (ff && ff.trim()) {
                t.table.fontFamily = ff
            } else {
                delete t.table.fontFamily
            }

            const sw = t.table.scrollWidthPx
            if (sw != null && Number.isFinite(sw) && sw > 0) {
                t.table.scrollWidthPx = Math.round(sw)
            } else {
                delete t.table.scrollWidthPx
            }

            saveToLS(id, t)
        },

        ensureCellParts(id: string, columnKey: string, partKeys: string[], defaultVisible = false) {
            const t = this.tables[id]
            if (!t) return
            if (!t.parts[columnKey]) t.parts[columnKey] = {}
            for (const pk of partKeys) {
                if (!(pk in t.parts[columnKey])) t.parts[columnKey][pk] = defaultVisible
            }
            saveToLS(id, t)
        },

        setCellPartKeys(id: string, columnKey: string, partKeys: string[], defaultVisible = false) {
            const t = this.tables[id]
            if (!t) return
            if (!t.parts[columnKey]) t.parts[columnKey] = {}
            const vis = t.parts[columnKey]
            for (const pk of partKeys) {
                if (!(pk in vis)) vis[pk] = defaultVisible
            }
            for (const existing of Object.keys(vis)) {
                if (!partKeys.includes(existing)) delete vis[existing]
            }
            saveToLS(id, t)
        },

        setCellPartVisible(id: string, columnKey: string, partKey: string, on: boolean) {
            const t = this.tables[id]
            if (!t) return
            if (!t.parts[columnKey]) t.parts[columnKey] = {}
            t.parts[columnKey][partKey] = on
            saveToLS(id, t)
        },

        setAbsPx(id: string, key: string, px: number | undefined) {
            const t: any = this.tables[id]
            if (!t || !(key in t.map)) return
            if (px != null && Number.isFinite(px) && px > 0) {
                t.map[key].absPx = clampNonNegativeInt(px)
            } else {
                delete t.map[key].absPx
            }
            saveToLS(id, t)
        },

        // reset(id: string) {
        //     const t: any = this.tables[id]
        //     if (!t) return
        //     const ordered = t.columns.map(c => c.key).filter(k => k in t.map)
        //     ordered.forEach((k, idx) => {
        //         t.map[k].visible = true
        //         t.map[k].order = idx
        //         delete t.map[k].title
        //         delete t.map[k].align
        //         delete t.map[k].cellBold
        //         delete t.map[k].headerBold
        //         delete t.map[k].bg
        //         delete t.map[k].headerBg
        //         delete t.map[k].fg
        //         delete t.map[k].fontPx
        //         delete t.map[k].fontFamily
        //         delete t.map[k].absPx
        //     })
        //     t.parts = {}
        //     t.table = {}
        //     saveToLS(id, t)
        // },
        //
        // drop(id: string) {
        //     if (this.tables[id]) delete this.tables[id]
        //     try {
        //         const ls = getLS()
        //         ls?.removeItem(lsKey(id))
        //     } catch {
        //     }
        // },

        ensureTitle(id: string, key: string, fallback: string | null | undefined) {
            const t: any = this.tables[id]
            if (!t || !(key in t.map)) return
            if (!t.map[key].title && fallback && fallback.trim().length) {
                t.map[key].title = fallback.trim()
                saveToLS(id, t)
            }
        },
    },
})
