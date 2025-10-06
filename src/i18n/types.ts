export type Locale = 'en' | 'uk' | 'ua'

export interface MessageTree {
    [key: string]: string | MessageTree
}

export interface I18nApi {
    t: (key: string, vars?: Record<string, unknown>) => string
    locale: () => Locale | string
    setLocale: (loc: Locale | string) => void
    mergeMessages: (more: Record<string, MessageTree>) => void
}

export interface I18nOptions {
    locale?: Locale | string
    fallbackLocale?: Locale | string
    messages?: Record<string, MessageTree>
}
