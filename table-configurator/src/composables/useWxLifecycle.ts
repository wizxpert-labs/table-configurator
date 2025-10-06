import { nextTick, type Ref } from 'vue'

export function useWxLifecycle(opts: {
    disabled?: boolean
    hasFullPersist: () => boolean
    measureTick: () => Promise<void>
    persistAllVisiblePxFromDOM: () => number
    persistScrollWidthPxFromDOM: () => void
    store: any
    storageKey: string
    wrapEl: Ref<HTMLElement | null>
}) {
    let ro: ResizeObserver | null = null

    async function initialApply() {
        if (opts.hasFullPersist()) return
        await opts.measureTick()
        const sumPx = opts.persistAllVisiblePxFromDOM()
        if (sumPx > 0) opts.store.setTableStyle(opts.storageKey, { scrollWidthPx: sumPx })
        await nextTick()
        opts.persistScrollWidthPxFromDOM()
    }

    function mountResizeObserver() {
        if (opts.hasFullPersist() || !('ResizeObserver' in window)) return
        ro = new ResizeObserver(async () => {
            if (opts.hasFullPersist()) return
            await opts.measureTick()
            const sumPx = opts.persistAllVisiblePxFromDOM()
            if (sumPx > 0) opts.store.setTableStyle(opts.storageKey, { scrollWidthPx: sumPx })
            await nextTick()
            opts.persistScrollWidthPxFromDOM()
        })
        queueMicrotask(() => {
            const root = opts.wrapEl.value
            const target =
                root?.querySelector<HTMLElement>(
                    '.p-datatable, .p-datatable-wrapper, .p-datatable-scrollable, .p-treetable, .p-treetable-wrapper, .p-treetable-scrollable'
                ) ?? root ?? null
            if (target) ro!.observe(target)
        })
    }

    function cleanup() {
        if (ro) {
            ro.disconnect()
            ro = null
        }
    }

    return { initialApply, mountResizeObserver, cleanup }
}
