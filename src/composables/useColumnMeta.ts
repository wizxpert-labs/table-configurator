import { computed } from 'vue'
import { useWxTableStore, type AlignVal } from '../store/WxTableStore'

export function useColumnMeta(storageKey: string, getKey: () => string) {
    const store = useWxTableStore()

    const title = computed<string>({
        get: () => {
            const k = getKey()
            return k ? (store.titleOf(storageKey, k) ?? '') : ''
        },
        set: v => {
            const k = getKey()
            if (k) store.updateMeta(storageKey, k, { title: v })
        },
    })

    const align = computed<AlignVal | null>({
        get: () => {
            const k = getKey()
            return k ? (store.alignOf(storageKey, k) ?? null) : null
        },
        set: v => {
            const k = getKey()
            if (k) store.updateMeta(storageKey, k, { align: v ?? undefined })
        },
    })

    const cellBold = computed<boolean>({
        get: () => {
            const k = getKey()
            return k ? !!store.cellBoldOf(storageKey, k) : false
        },
        set: v => {
            const k = getKey()
            if (k) store.updateMeta(storageKey, k, { cellBold: v })
        },
    })

    const raw = (v?: string) => (v?.startsWith('#') ? v.slice(1) : (v ?? ''))
    const withHash = (v?: string) => (v ? (v.startsWith('#') ? v : `#${v}`) : undefined)

    const bodyBgRaw = computed<string>({
        get: () => {
            const k = getKey()
            return k ? raw(store.bgOf(storageKey, k)) : ''
        },
        set: v => {
            const k = getKey()
            if (k) store.updateMeta(storageKey, k, { bg: withHash(v) })
        },
    })

    const bodyFgRaw = computed<string>({
        get: () => {
            const k = getKey()
            return k ? raw(store.fgOf(storageKey, k)) : ''
        },
        set: v => {
            const k = getKey()
            if (k) store.updateMeta(storageKey, k, { fg: withHash(v) })
        },
    })

    function ensureTitleIfEmpty(fallback: string) {
        const k = getKey()
        if (!k) return
        const cur = (store.titleOf(storageKey, k) ?? '').trim()
        if (!cur && fallback) store.ensureTitle(storageKey, k, fallback)
    }

    function clearBg() {
        const k = getKey()
        if (k) store.updateMeta(storageKey, k, { bg: undefined })
    }

    function clearFg() {
        const k = getKey()
        if (k) store.updateMeta(storageKey, k, { fg: undefined })
    }

    return { title, align, cellBold, bodyBgRaw, bodyFgRaw, ensureTitleIfEmpty, clearBg, clearFg }
}
