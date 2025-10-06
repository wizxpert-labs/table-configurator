import {type App as VueApp, createApp, type Plugin} from 'vue'
import PrimeVueStyleWarmup from './PrimeVueStyleWarmup'
import {createI18n as createWxI18n, I18N_KEY} from '../i18n'

export interface WxConfiguratorPluginOptions {
    provideI18n?: boolean
    locale?: string
    warmup?: boolean
}

function shouldCreateI18n(app: VueApp, opts: WxConfiguratorPluginOptions): boolean {
    const hasProvider = !!(app as any)._context.provides[I18N_KEY as any]
    if (hasProvider) return false
    if (opts.provideI18n === true) return true
    if (opts.locale && opts.provideI18n !== false) return true
    return false
}

export const WxTableConfiguratorPlugin: Plugin = {
    install(app: VueApp, opts: WxConfiguratorPluginOptions = {}) {
        const {
            provideI18n = undefined,
            locale = undefined,
            warmup = true,
        } = opts

        // --- i18n ---
        const existing = (app as any)._context.provides[I18N_KEY as any]
        if (shouldCreateI18n(app, opts)) {
            const loc = (locale && typeof locale === 'string' ? locale : 'en')
            const i18n = createWxI18n({locale: loc})
            app.provide(I18N_KEY, i18n)
        } else if (existing && locale) {
            existing?.setLocale?.(locale)
        }

        if (warmup && typeof window !== 'undefined' && typeof document !== 'undefined') {
            queueMicrotask(() => {
                if (document.getElementById('pv-style-warmup')) return

                const el = document.createElement('div')
                el.id = 'pv-style-warmup'
                el.style.cssText =
                    'position:absolute;left:-100000px;top:-100000px;pointer-events:none;opacity:0;'
                document.body.appendChild(el)

                const warmupApp = createApp(PrimeVueStyleWarmup)
                ;(warmupApp as any)._context.provides = (app as any)._context.provides
                warmupApp.config.globalProperties = app.config.globalProperties

                warmupApp.mount(el)

                setTimeout(() => {
                    try {
                        warmupApp.unmount()
                    } catch {
                    }
                    el.remove()
                }, 0)
            })
        }

    }
}
