import type { VNode } from 'vue'
import { flatten } from '../utils/wxTableConfig'

export type TableKind = 'datatable' | 'treetable'
export type TableDetect = { vnode: VNode; kind: TableKind } | null

function isVNodeNamed(n: VNode, needle: string) {
    const t: any = n?.type
    const name = (t?.name || t?.__name || '').toString().toLowerCase()
    return name.includes(needle)
}

export function findTableVNodeDeep(nodes: VNode[] | VNode): TableDetect {
    const arr = flatten([Array.isArray(nodes) ? nodes : [nodes]].flat())
    for (const n of arr) {
        if (!n || typeof n !== 'object') continue
        if (isVNodeNamed(n, 'datatable')) return { vnode: n, kind: 'datatable' }
        if (isVNodeNamed(n, 'treetable')) return { vnode: n, kind: 'treetable' }
    }
    return null
}
