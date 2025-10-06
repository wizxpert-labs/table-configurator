import { cloneVNode, type VNode } from 'vue'
import { colKeyOf, flatten, isColumn } from '../utils/wxTableConfig'
import { cssSafe } from '../utils/string'
import { normalizeStyle, decorateBodyStyle } from './useWxDomSizing'

export function buildColumnsSlot(opts: {
    origDefault?: () => VNode[] | VNode
    baseOrder: string[]
    storageKey: string
    store: any
    getPx: (key: string) => number | undefined
    defaultPx: number
}) {
    const raw = opts.origDefault ? opts.origDefault() : []
    const flat = flatten([raw].flat())

    const byKey = new Map<string, VNode>()
    for (const n of flat) {
        if (!isColumn(n)) continue
        const k = colKeyOf(n)
        if (k) byKey.set(k, n)
    }

    const allowed = new Set(opts.store.visibleKeys(opts.storageKey))
    const seq = opts.baseOrder.filter((k) => allowed.has(k))

    const visibleCols: VNode[] = []
    const sid = cssSafe(opts.storageKey)

    const t = (opts.store as any).table(opts.storageKey)
    const tableFontPx = t?.table?.fontSize ?? null
    const tableFontFamily = t?.table?.fontFamily ?? null
    const colMap = t?.map ?? {}

    for (const k of seq) {
        const orig = byKey.get(k)
        if (!orig) continue
        if (!orig.type || typeof orig.type !== 'object') {
            visibleCols.push(orig)
            continue
        }

        const headerMarker = `sc-h-${sid}-${cssSafe(k)}`
        const bodyMarker = `sc-b-${sid}-${cssSafe(k)}`
        const prevHeaderClass = (orig.props as any)?.headerClass ?? (orig.props as any)?.['header-class'] ?? null
        const prevBodyClass =
            (orig.props as any)?.bodyClass ??
            (orig.props as any)?.['body-class'] ??
            (orig.props as any)?.class ??
            (orig.props as any)?.className ??
            null

        const align = opts.store.alignOf(opts.storageKey, k)
        const cellBold = !!(opts.store as any).cellBoldOf?.(opts.storageKey, k)
        const alignClass = align ? `text-${align}` : ''

        const p = (orig.props ?? {}) as Record<string, any>
        const { style: _dropStyle, class: _dropClass, className: _dropClassName, ...restProps } = p

        const prevHeaderStyle = (p as any)?.headerStyle ?? (p as any)?.['header-style']
        const prevBodyStyle = (p as any)?.bodyStyle ?? (p as any)?.['body-style']
        const headerStyleObj = normalizeStyle(prevHeaderStyle)
        const bodyStyleObj = normalizeStyle(prevBodyStyle)

        const px = opts.getPx(k) ?? opts.defaultPx
        const wStr = `${px}px`
        headerStyleObj.width = wStr
        headerStyleObj.maxWidth = wStr

        const colState: any = colMap[k] ?? {}
        const colFontPx: number | null = typeof colState.fontPx === 'number' ? colState.fontPx : null
        const colFontFamily: string | null = typeof colState.fontFamily === 'string' ? colState.fontFamily : null

        const effectiveFontPx =
            typeof colFontPx === 'number' && isFinite(colFontPx) && colFontPx > 0 ? colFontPx : tableFontPx
        const effectiveFontFamily = colFontFamily && String(colFontFamily).trim() ? colFontFamily : tableFontFamily ?? null

        if (typeof effectiveFontPx === 'number' && isFinite(effectiveFontPx) && effectiveFontPx > 0) {
            headerStyleObj['--sc-font-size'] = `${Math.round(effectiveFontPx)}px`
        }
        if (effectiveFontFamily && String(effectiveFontFamily).trim()) {
            headerStyleObj['--sc-font-family'] = effectiveFontFamily
        }

        const decoratedBody = decorateBodyStyle(
            { ...bodyStyleObj, width: wStr, maxWidth: wStr },
            {
                bg: (opts.store as any).bgOf?.(opts.storageKey, k) ?? null,
                fg: (opts.store as any).fgOf?.(opts.storageKey, k) ?? null,
                fontPx: effectiveFontPx,
                fontFamily: effectiveFontFamily
            }
        )

        const coloredBgClass = (opts.store as any).bgOf?.(opts.storageKey, k) ? 'sc-colored-bg' : ''
        const coloredFgClass = (opts.store as any).fgOf?.(opts.storageKey, k) ? 'sc-colored-fg' : ''

        const headerClass = [prevHeaderClass, headerMarker, alignClass].filter(Boolean).join(' ').trim()
        const bodyClass = [prevBodyClass, bodyMarker, alignClass, cellBold ? 'font-bold' : '', coloredBgClass, coloredFgClass]
            .filter(Boolean)
            .join(' ')
            .trim()

        const hadColumnKey = 'columnKey' in p || 'column-key' in p
        const hadField = 'field' in p
        const rawColumnKey = (p as any).columnKey ?? (p as any)['column-key']
        const rawField = (p as any).field
        const columnKeyForProp = rawColumnKey ?? (typeof rawField === 'string' ? rawField : k)

        const nextProps: Record<string, any> = {
            ...restProps,
            ...(hadColumnKey ? {} : { columnKey: columnKeyForProp }),
            key: `sc-col-${cssSafe(opts.storageKey)}-${cssSafe(k)}`,
            headerClass,
            bodyClass,
            headerStyle: headerStyleObj,
            bodyStyle: decoratedBody
        }

        const hasCustomBody = typeof (orig.children as any)?.body === 'function'
        if (!hadColumnKey && hadField && hasCustomBody) {
            if (!('sortField' in nextProps)) nextProps.sortField = typeof rawField === 'string' ? rawField : columnKeyForProp
            delete nextProps['field']
        }

        visibleCols.push(cloneVNode(orig, nextProps as any, (orig.children ?? {}) as any))
    }

    return visibleCols
}
