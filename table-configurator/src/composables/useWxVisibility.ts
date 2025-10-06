import { computed, type Ref } from 'vue'

export function useWxVisibility(opts: {
    storageKey: string
    store: any
    discoveredKeys: Ref<string[]>
    propVisible: string[] | string | null | undefined
    disabled?: boolean
}) {
    const { storageKey, store, discoveredKeys } = opts

    const allKeys = () =>
        store.orderedKeys(storageKey).length ? store.orderedKeys(storageKey) : discoveredKeys.value

    const visibleKeysComputed = computed<string[]>(() => store.visibleKeys(storageKey))

    const visibleOrderedKeys = () => {
        const allowed = new Set(visibleKeysComputed.value)
        return allKeys().filter((k: string) => allowed.has(k))
    }

    const currentVisible = computed<string[]>({
        get() {
            if (opts.disabled) return []
            const ext = opts.propVisible
            const base =
                ext == null ||
                (Array.isArray(ext) && ext.length === 0) ||
                (!Array.isArray(ext) && !ext)
                    ? store.visibleKeys(storageKey)
                    : Array.isArray(ext)
                        ? ext
                        : [ext]
            return base ?? []
        },
        set(next) {
            if (opts.disabled) return
            if (opts.propVisible != null) {
                // родитель управляет
                // эмитить извне компонента — в самом компоненте
            } else {
                store.setVisible(storageKey, next ?? [])
            }
        }
    })

    function setVisible(key: string, on: boolean) {
        if (opts.disabled) return
        const s = new Set(currentVisible.value)
        on ? s.add(key) : s.delete(key)
        currentVisible.value = Array.from(s)
    }

    function titleForKey(k: string): string {
        const t = (store as any)?.table(storageKey)?.map?.[k]?.title
        return typeof t === 'string' ? t : k
    }

    return {
        allKeys,
        visibleKeysComputed,
        visibleOrderedKeys,
        currentVisible,
        setVisible,
        titleForKey
    }
}
