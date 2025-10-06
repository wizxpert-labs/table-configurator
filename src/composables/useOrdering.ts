import { nextTick, type Ref } from 'vue'
import { arrayMove } from '../utils/wxTableConfig'
import { buildThMap } from './useDomTables'

type StoreApi = {
    visibleKeys: (sk: string) => string[]
    orderedKeys: (sk: string) => string[]
    setOrder: (sk: string, order: string[]) => void
}

export function mergeVisibleOrder(currentAll: string[], visibleOrdered: string[]): string[] {
    const vis = [...visibleOrdered]
    const visSet = new Set(vis)
    const queue = [...vis]
    return currentAll.map(k => (visSet.has(k) ? queue.shift()! : k))
}

export function createOrderingManager(deps: {
    wrapEl: Ref<HTMLElement | null>
    store: StoreApi
    storageKey: string
    applyWidthsWithRetries: (times?: number) => Promise<void>
    doubleRaf: () => Promise<void>
}) {
    const { wrapEl, store, storageKey, applyWidthsWithRetries, doubleRaf } = deps

    async function measureAndPersistOrderFromDOM() {
        const root = wrapEl.value
        if (!root) return
        const vis = store.visibleKeys(storageKey)
        if (!vis.length) return
        const { map: thMap } = buildThMap(root, storageKey, vis)
        if (thMap.size === 0) return

        const visibleOrdered = Array.from(thMap.entries())
            .sort((a, b) => a[1].index - b[1].index)
            .map(([k]) => k)

        const currentAll = store.orderedKeys(storageKey)
        const nextOrder = mergeVisibleOrder(currentAll, visibleOrdered)

        if (nextOrder.join('|') !== currentAll.join('|')) {
            store.setOrder(storageKey, nextOrder)
            await nextTick()
            await applyWidthsWithRetries(2)
        }
    }

    async function handleColumnReorder(evt: any) {
        try {
            const drag = evt?.dragIndex ?? evt?.draggedIndex ?? evt?.fromIndex
            const drop = evt?.dropIndex ?? evt?.toIndex
            if (Number.isFinite(drag) && Number.isFinite(drop)) {
                const vis = store.visibleKeys(storageKey)
                const moved = arrayMove(vis, drag as number, drop as number)

                const currentAll = store.orderedKeys(storageKey)
                const nextOrder = mergeVisibleOrder(currentAll, moved)

                store.setOrder(storageKey, nextOrder)
                await nextTick()
                await applyWidthsWithRetries(2)
                return
            }
        } finally {
            await doubleRaf()
            await measureAndPersistOrderFromDOM()
        }
    }

    return { measureAndPersistOrderFromDOM, handleColumnReorder }
}
