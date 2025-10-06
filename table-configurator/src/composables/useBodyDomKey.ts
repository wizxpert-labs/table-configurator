import { ref } from 'vue'
import type { Ref } from 'vue'
import { cssSafe } from '../utils/string'

export function useBodyDomKey(rootEl: Ref<HTMLElement | null>, storageKey: string) {
    const inferredKey = ref<string>('')

    function infer(): string {
        const el = rootEl.value as HTMLElement | null
        if (!el || !storageKey) return ''
        const td = el.closest('td')
        if (!td) return ''
        const sid = cssSafe(storageKey)
        const prefix = `sc-b-${sid}-`
        for (const cls of Array.from(td.classList)) {
            if (cls.startsWith(prefix)) return cls.slice(prefix.length) || ''
        }
        return ''
    }

    return { inferredKey, infer }
}
