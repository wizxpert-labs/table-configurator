import { computed } from 'vue'

export function useWxStyles(opts: { storageKey: string; store: any; disabled?: boolean }) {
    const tableStyleVars = computed<Record<string, string>>(() => {
        if (opts.disabled) return {}
        const st = opts.store.table(opts.storageKey)?.table
        const style: Record<string, string> = {}
        if (typeof st?.fontSize === 'number' && Number.isFinite(st?.fontSize))
            style['--sc-font-size'] = `${Math.round(st!.fontSize!)}px`
        if (st?.fontFamily) style['--sc-font-family'] = st.fontFamily
        if (typeof st?.scrollWidthPx === 'number' && Number.isFinite(st.scrollWidthPx) && st.scrollWidthPx > 0) {
            style['--sc-scroll-width'] = `${Math.round(st.scrollWidthPx)}px`
        }
        return style
    })

    const inlineFontBase = computed(() => {
        if (opts.disabled) return {}
        const st = opts.store.table(opts.storageKey)?.table
        const style: Record<string, string> = {}
        if (typeof st?.fontSize === 'number' && Number.isFinite(st.fontSize))
            style.fontSize = `${Math.round(st.fontSize)}px`
        if (st?.fontFamily) style.fontFamily = st.fontFamily
        return style
    })

    const fontsFingerprint = computed(() => {
        const t: any = (opts.store as any).table(opts.storageKey)
        const map = t?.map ?? {}
        const keys: string[] = (opts.store as any).visibleKeys(opts.storageKey) ?? []
        return keys
            .map((k) => {
                const c = map[k] ?? {}
                const px = typeof c.fontPx === 'number' ? c.fontPx : ''
                const ff = c.fontFamily ?? ''
                return `${k}:${px}:${ff}`
            })
            .join('|')
    })

    return { tableStyleVars, inlineFontBase, fontsFingerprint }
}
