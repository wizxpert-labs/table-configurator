// const { footerCells } = useDynamicFooter(storageKey, specs)
// const storageKey = 'nomenclatures'
// const specs = computed<FooterSpec[]>(() => [
//     { footer: 'Totals:' },
//     { key: 'type_name', footer: 'type_name' },
//     { key: 'lastColumnKey', footer: 'thisYearTotal' },
// ])
// <ColumnGroup type="footer" v-if="footerCells.length">
//     <Row>
//         <template v-for="(c, i) in footerCells" :key="i">
//     <Column :footer="c.footer" :colspan="c.colspan" />
//     </template>
//     </Row>
//     </ColumnGroup>

import {computed, type ComputedRef} from 'vue'
import {useWxTableStore} from '../store/WxTableStore'

export type FooterSpec = { footer: any; key?: string }
export type FooterCell = { footer: any; colspan: number }

function build(visible: string[], specs: FooterSpec[]): FooterCell[] {
    const cells: FooterCell[] = []
    let cursor = 0
    const nextTargetIndexFrom = (start: number) => {
        let best = visible.length
        for (let s = start; s < specs.length; s++) {
            const k = specs[s]?.key
            if (typeof k !== 'string' || k.length === 0) continue
            const i = visible.indexOf(k)
            if (i !== -1 && i < best) best = i
        }
        return best
    }

    for (let si = 0; si < specs.length; si++) {
        const spec = specs[si] as { key?: string; footer?: string }; // легчайшая подсказка TS

        if (!spec.key) {
            const nextIdx = nextTargetIndexFrom(si + 1)
            const span = Math.max(nextIdx - cursor, 0)
            if (span > 0) {
                cells.push({footer: spec.footer ?? '', colspan: span})
                cursor = nextIdx
            }
            continue
        }

        const target = visible.indexOf(spec.key!)
        if (target === -1) continue

        if (target > cursor) cells.push({footer: '', colspan: target - cursor})
        cells.push({footer: spec.footer ?? '', colspan: 1})
        cursor = target + 1
    }

    if (cursor < visible.length) cells.push({footer: '', colspan: visible.length - cursor})
    return cells
}

export function useDynamicFooter(
    storageKey: string,
    footerSpecs: ComputedRef<FooterSpec[]> | FooterSpec[],
    visibleOverride?: ComputedRef<string[]> | string[],
) {
    const store = useWxTableStore()
    const visibleKeys = computed(() =>
        Array.isArray(visibleOverride)
            ? visibleOverride
            : (visibleOverride as any)?.value ?? store.visibleKeys(storageKey)
    )
    const specsComputed = computed(() =>
        Array.isArray(footerSpecs) ? footerSpecs : (footerSpecs as any).value
    )
    const footerCells = computed<FooterCell[]>(() => build(visibleKeys.value, specsComputed.value))
    return {footerCells}
}
