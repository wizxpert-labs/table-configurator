import type { VNode, VNodeArrayChildren } from 'vue'
import { Fragment } from 'vue'


export function flatten(children: VNodeArrayChildren | VNode | undefined): VNode[] {
    const arr = (Array.isArray(children) ? children : [children]).filter(Boolean) as VNode[]
    const out: VNode[] = []
    for (const n of arr) {
        if (!n) continue
        const isFrag = (n as any).type === (Symbol as any).for('v-fgt') || n.type === (Fragment as any)
        if (isFrag) {
            out.push(...flatten((n as any).children as any))
        } else {
            out.push(n)
        }
    }
    return out
}

export function extractText(nodes: VNode[] | VNode | undefined): string {
    if (!nodes) return ''
    const stack = Array.isArray(nodes) ? [...nodes] : [nodes]
    let out = ''
    while (stack.length) {
        const n: any = stack.shift()
        if (n == null) continue
        if (typeof n === 'string') {
            out += n
        } else if (typeof n.children === 'string') {
            out += n.children
        } else if (Array.isArray(n.children)) {
            stack.push(...n.children)
        } else if (n.type === (Symbol as any).for('v-fgt') && Array.isArray(n.children)) {
            stack.push(...n.children)
        }
    }
    return out.trim()
}


export function arrayMove<T>(arr: readonly T[], from: number, to: number): T[] {
    const a = arr.slice()
    const len = a.length
    if (len === 0) return a

    const clamp = (i: number) => (i < 0 ? 0 : i >= len ? len - 1 : i)
    const start = clamp(from)
    let end = clamp(to)

    if (start === end) return a

    const [item] = a.splice(start, 1)
    if (item === undefined) return a

    if (end > start) end--

    a.splice(end, 0, item)
    return a
}

export function compName(v: VNode): string {
    if (!v || typeof v.type !== 'object') return ''
    const t: any = v.type
    return (t?.name ?? t?.__name ?? '').toString().toLowerCase()
}

export function isColumn(v: VNode): boolean {
    const n = compName(v)
    if (n === 'column' || n.endsWith('column')) return true
    const p = (v.props ?? {}) as Record<string, any>
    return 'columnKey' in p || 'column-key' in p || 'field' in p
}

export function colKeyOf(v: VNode): string | null {
    const p = (v.props ?? {}) as Record<string, any>
    return (p.columnKey ?? p['column-key'] ?? p.field ?? null) as string | null
}
