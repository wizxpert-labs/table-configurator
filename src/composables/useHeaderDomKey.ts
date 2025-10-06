import { ref } from 'vue'
import type { Ref } from 'vue'
import { cssSafe } from '../utils/string'

export function useHeaderDomKey(rootEl: Ref<HTMLElement | null>, storageKey: string) {
    const inferredKey = ref<string>('')

    function infer(): string {
        const el = rootEl.value as HTMLElement | null
        if (!el || !storageKey) return ''
        const th = el.closest('th')
        if (!th) return ''
        const sid = cssSafe(storageKey)
        const prefix = `sc-h-${sid}-`
        for (const cls of Array.from(th.classList)) {
            if (cls.startsWith(prefix)) return cls.slice(prefix.length) || ''
        }
        return ''
    }

    return { inferredKey, infer }
}
