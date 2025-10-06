import {computed, inject, type InjectionKey, reactive} from 'vue'
import type {I18nApi, I18nOptions, Locale, MessageTree} from './types'
import en from './messages/en'
import uk from './messages/uk'

const I18N_TOKEN = 'wizxpert.table-configurator.i18n'
export const I18N_KEY: InjectionKey<I18nApi> =
    Symbol.for(I18N_TOKEN) as unknown as InjectionKey<I18nApi>

function deepGet(obj: MessageTree, path: string): string | MessageTree | undefined {
    const segs = path.split('.')
    let cur: any = obj
    for (const s of segs) {
        if (cur == null || typeof cur !== 'object') return undefined
        cur = cur[s]
    }
    return cur
}

function format(str: string, vars?: Record<string, unknown>): string {
    if (!vars) return str
    return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] == null ? '' : String(vars[k])))
}

function merge(a: MessageTree, b: MessageTree): MessageTree {
    const out: MessageTree = {...a}
    for (const k of Object.keys(b)) {
        const av = (a as any)[k]
        const bv = (b as any)[k]
        ;(out as any)[k] =
            av && typeof av === 'object' && bv && typeof bv === 'object' ? merge(av, bv) : bv
    }
    return out
}

export function createI18n(opts: I18nOptions = {}): I18nApi {
    const state = reactive({
        loc: (opts.locale ?? 'en') as Locale | string,
        fallback: (opts.fallbackLocale ?? 'en') as Locale | string,
        messages: {
            en,
            uk,
            ...(opts.messages ?? {})
        } as Record<string, MessageTree>
    })

    const activeMessages = computed<MessageTree>(() => {
        const current = (state.messages[state.loc] ?? ({} as MessageTree)) as MessageTree
        const fb = (state.messages[state.fallback] ?? ({} as MessageTree)) as MessageTree
        return state.loc === state.fallback ? current : merge(fb, current)
    })

    const t = (key: string, vars?: Record<string, unknown>) => {
        void state.loc
        const raw = deepGet(activeMessages.value, key)
        const str = typeof raw === 'string' ? raw : key
        return format(str, vars)
    }

    return {
        t,
        locale: () => state.loc,
        setLocale: (loc: Locale | string) => {
            state.loc = loc
        },
        mergeMessages: (more) => {
            const src = more as Record<string, MessageTree | undefined>
            for (const l of Object.keys(src)) {
                const prev = state.messages[l] ?? ({} as MessageTree)
                const next = src[l] ?? ({} as MessageTree)
                state.messages[l] = merge(prev, next)
            }
        }
    }
}

export function useI18n(): I18nApi {
    const provided = inject(I18N_KEY, null)
    if (provided) return provided

    const g = globalThis as any
    if (!g.__wx_i18n_singleton) {
        if (import.meta?.env?.DEV) {
            // eslint-disable-next-line no-console
            console.warn(
                '[wx] I18N injection missing — using fallback singleton. Most likely two copies of the module are loaded. The i18n key uses Symbol.for for cross-bundle compatibility.'
            )
        }
        g.__wx_i18n_singleton = createI18n()
    }
    return g.__wx_i18n_singleton as I18nApi
}
