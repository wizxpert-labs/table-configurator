<script setup lang="ts">
    import { h, nextTick, onBeforeUnmount, onMounted, provide, ref, type VNode, watch } from 'vue'
    import { useWxTableStore } from '../store/WxTableStore'
    import { WxTableContext } from '../store/WxTableContext'
    import { applyInitialStateFromPreset, collectColumnsMeta } from '../composables/useWxInit'
    import { findTableVNodeDeep } from '../composables/useWxDetect'
    import { createDomSizing } from '../composables/useWxDomSizing'
    import { useWxVisibility } from '../composables/useWxVisibility'
    import { useWxStyles } from '../composables/useWxStyles'
    import { buildColumnsSlot } from '../composables/useWxColumnsSlot'
    import { mergePrimeEvents } from '../composables/useWxPrimeEvents'
    import { useWxLifecycle } from '../composables/useWxLifecycle'
    import { createOrderingManager } from '../composables/useOrdering'
    
    const DEFAULT_PX = 150
    
    const props = withDefaults(defineProps<{
        storageKey: string
        visible?: string | string[] | null
        renderTable?: boolean
        disabled?: boolean
    }>(), { visible: null, renderTable: true, disabled: false })
    
    if (!props.disabled) provide(WxTableContext, { storageKey: props.storageKey })
    
    const emit = defineEmits<{
        (e: 'update:visible', value: string[]): void
        (e: 'init', payload: { allKeys: string[] }): void
        (e: 'column-resize-end', payload: any): void
    }>()
    
    const store = useWxTableStore()
    const wrapEl = ref<HTMLDivElement | null>(null)
    const discoveredKeys = ref<string[]>([])
    
    const { measureTick, persistAllVisiblePxFromDOM, persistScrollWidthPxFromDOM } = createDomSizing({
        wrapEl,
        storageKey: props.storageKey,
        store,
        visibleOrderedKeys: () => visibility.visibleOrderedKeys(),
        titleForKey: (k) => visibilityTitleFor(k),
        setPx
    })
    
    function getPx(key: string): number | undefined {
        return (store as any).absPxOf?.(props.storageKey, key) ?? (store as any).widthPxOf?.(props.storageKey, key)
    }
    
    function setPx(key: string, px: number) {
        if ((store as any).setAbsPx) (store as any).setAbsPx(props.storageKey, key, px)
        else if ((store as any).setWidthPx) (store as any).setWidthPx(props.storageKey, key, px)
    }
    
    const visibility = useWxVisibility({
        storageKey: props.storageKey,
        store,
        discoveredKeys,
        propVisible: props.visible,
        disabled: props.disabled
    })
    
    function visibilityTitleFor(k: string) {
        const t = (store as any)?.table(props.storageKey)?.map?.[k]?.title
        return typeof t === 'string' ? t : k
    }
    
    const { tableStyleVars, inlineFontBase, fontsFingerprint } = useWxStyles({
        storageKey: props.storageKey,
        store,
        disabled: props.disabled
    })
    
    function hasFullPersist(): boolean {
        if (props.disabled) return true
        const t = store.table(props.storageKey)
        if (!t) return false
        const hasScroll = typeof t.table?.scrollWidthPx === 'number' && t.table!.scrollWidthPx! > 0
        const vis = store.visibleKeys(props.storageKey)
        const hasAllPx = vis.length > 0 && vis.every((k) => typeof getPx(k) === 'number')
        return hasScroll && hasAllPx
    }
    
    const { initialApply, mountResizeObserver, cleanup } = useWxLifecycle({
        disabled: props.disabled,
        hasFullPersist,
        measureTick,
        persistAllVisiblePxFromDOM,
        persistScrollWidthPxFromDOM,
        store,
        storageKey: props.storageKey,
        wrapEl
    })
    
    function ensureDiscovered(origDefault?: () => VNode[] | VNode) {
        if (props.disabled) return
        if (!origDefault || discoveredKeys.value.length) return
        const { meta, initByKey } = collectColumnsMeta(origDefault)
        const explicitVisible = props.visible != null && (Array.isArray(props.visible) ? props.visible.length > 0 : !!props.visible) ? Array.isArray(props.visible) ? props.visible : [props.visible as string] : undefined
        const { allKeys } = applyInitialStateFromPreset({
            storageKey: props.storageKey,
            store,
            meta,
            initByKey,
            explicitVisible,
            defaultPx: DEFAULT_PX
        })
        discoveredKeys.value = allKeys
        emit('init', { allKeys: [...allKeys] })
    }
    
    function onGlobalPointerUp() {
        if (props.disabled || hasFullPersist()) return
        requestAnimationFrame(async () => {
            await nextTick()
            await measureAndPersistOrderFromDOM()
            const sumPx = persistAllVisiblePxFromDOM()
            if (sumPx > 0) store.setTableStyle(props.storageKey, { scrollWidthPx: sumPx })
            persistScrollWidthPxFromDOM()
        })
    }
    
    const { measureAndPersistOrderFromDOM, handleColumnReorder } = createOrderingManager({
        wrapEl,
        store,
        storageKey: props.storageKey,
        applyWidthsWithRetries: async () => {},
        doubleRaf: async () => measureTick()
    })
    
    watch(
        () => store.visibleKeys(props.storageKey).join('|'),
        async () => {
            if (props.disabled || hasFullPersist()) return
            await measureTick()
            const sumPx = persistAllVisiblePxFromDOM()
            if (sumPx > 0) store.setTableStyle(props.storageKey, { scrollWidthPx: sumPx })
            await nextTick()
            persistScrollWidthPxFromDOM()
        }
    )
    
    watch(
        () => store.orderedKeys(props.storageKey).join('|'),
        async () => {
            if (props.disabled || hasFullPersist()) return
            await measureTick()
            const sumPx = persistAllVisiblePxFromDOM()
            if (sumPx > 0) store.setTableStyle(props.storageKey, { scrollWidthPx: sumPx })
        }
    )
    
    const slots = defineSlots<{
        default: () => VNode[] | VNode
        controls?: (args: { allKeys: string[]; visible: string[]; setVisible: (k: string, on: boolean) => void }) => VNode[] | VNode
    }>()
    
    function renderDisabled() {
        const root = slots.default?.() ?? []
        const arr = Array.isArray(root) ? root : [root]
        return h('div', { ref: wrapEl, class: 'w-full h-full' }, arr)
    }
    
    const render = () => {
        if (props.disabled) return renderDisabled()
        const root = slots.default?.() ?? []
        const arr = Array.isArray(root) ? root : [root]
        const detect = findTableVNodeDeep(arr)
        const tableVNode = detect?.vnode
        if (!tableVNode) {
            return h('div', {
                ref: wrapEl,
                'data-sc-root': '',
                'data-sc-fontsig': fontsFingerprint.value,
                class: 'smart-columns w-full h-full flex flex-col gap-2',
                style: { ...tableStyleVars.value, ...inlineFontBase.value }
            }, arr)
        }
        
        const tableChildrenRaw: any = tableVNode.children ?? {}
        const origDefault = typeof tableChildrenRaw?.default === 'function' ? (tableChildrenRaw.default as () => VNode[] | VNode) : undefined
        
        ensureDiscovered(origDefault)
        let controls: VNode[] = []
        const baseOrder = visibility.allKeys()
        
        if (slots.controls) {
            const api = { allKeys: baseOrder, visible: store.visibleKeys(props.storageKey), setVisible: visibility.setVisible }
            const c = slots.controls(api)
            controls = Array.isArray(c) ? c : [c]
        }
        
        if (!props.renderTable) {
            return h('div', {
                ref: wrapEl,
                'data-sc-root': '',
                'data-sc-fontsig': fontsFingerprint.value,
                class: 'smart-columns w-full h-full flex flex-col gap-2',
                style: { ...tableStyleVars.value, ...inlineFontBase.value }
            }, controls)
        }
        
        const newSlotsObj: Record<string, any> = { ...(tableChildrenRaw || {}) }
        newSlotsObj.default = () => buildColumnsSlot({
            origDefault,
            baseOrder,
            storageKey: props.storageKey,
            store,
            getPx,
            defaultPx: DEFAULT_PX
        })
        
        const mergedProps = mergePrimeEvents({
            tableVNodeProps: tableVNode.props as any,
            measureTick,
            persistAllVisiblePxFromDOM,
            persistScrollWidthPxFromDOM,
            store,
            storageKey: props.storageKey,
            emit: (e, p) => emit(e, p)
        })
        
        const finalProps = {
            ...mergedProps,
            onColumnReorder: (e: any) => {
                mergedProps.onColumnReorder?.(e)
                void handleColumnReorder(e)
            }
        }
        
        const clonedTable = h(tableVNode.type as any, finalProps, newSlotsObj)
        
        return h('div', {
            ref: wrapEl,
            'data-sc-root': '',
            'data-sc-fontsig': fontsFingerprint.value,
            class: 'smart-columns w-full h-full flex flex-col gap-2',
            style: { ...tableStyleVars.value, ...inlineFontBase.value }
        }, [...controls, clonedTable])
    }
    
    onMounted(async () => {
        if (props.disabled) return
        if (discoveredKeys.value.length === 0) {
            try {
                const df = () => (typeof (slots as any)?.default === 'function' ? (slots as any).default() : [])
                ensureDiscovered(df as any)
            } catch {}
        }
        window.addEventListener('mouseup', onGlobalPointerUp, { passive: true })
        window.addEventListener('pointerup', onGlobalPointerUp, { passive: true })
        mountResizeObserver()
        await initialApply()
    })
    
    onBeforeUnmount(() => {
        window.removeEventListener('mouseup', onGlobalPointerUp)
        window.removeEventListener('pointerup', onGlobalPointerUp)
        cleanup()
    })
</script>

<template>
    <component :is="render" />
</template>


<style scoped>
    :deep([data-sc-root]),
    :deep([data-sc-root] *) {
        font-family: var(--sc-font-family, inherit) !important;
        font-size: var(--sc-font-size, inherit) !important;
    }
    
    :deep(th[class*="sc-h-"]),
    :deep(td[class*="sc-b-"]) {
        font-family: var(--sc-font-family, inherit) !important;
        font-size: var(--sc-font-size, inherit) !important;
    }
    
    .smart-columns {
        min-width: 0;
    }
    
    :deep(.p-datatable), :deep(.p-treetable) {
        width: 100%;
    }
    
    :deep(.p-datatable-wrapper), :deep(.p-datatable-scrollable),
    :deep(.p-treetable-wrapper), :deep(.p-treetable-scrollable) {
        width: 100%;
    }
    
    :deep(.p-datatable-scrollable-table) {
        min-width: var(--sc-scroll-width, auto);
        width: var(--sc-scroll-width, auto);
    }
    
    :deep(.p-datatable-scrollable-header-table),
    :deep(.p-datatable-scrollable-body-table) {
        table-layout: fixed;
        width: var(--sc-scroll-width, 100%);
        min-width: var(--sc-scroll-width, 100%);
    }
    
    :deep(.p-treetable-scrollable-table) {
        min-width: var(--sc-scroll-width, auto);
        width: var(--sc-scroll-width, auto);
    }
    
    :deep(.p-treetable-scrollable-header-table),
    :deep(.p-treetable-scrollable-body-table) {
        table-layout: fixed;
        width: var(--sc-scroll-width, 100%);
        min-width: var(--sc-scroll-width, 100%);
    }
    
    :deep(.p-datatable thead th), :deep(.p-datatable tbody td),
    :deep(.p-treetable thead th), :deep(.p-treetable tbody td) {
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        overflow-wrap: anywhere;
        min-width: 0;
    }
    
    :deep(th.p-datatable-column-sorted [data-sc-menu]),
    :deep(th.p-highlight [data-sc-menu]),
    :deep(.p-treetable th.p-treetable-column-sorted [data-sc-menu]) {
        --p-button-text-color: #fff;
        --p-button-icon-color: #fff;
        --p-button-text-hover-color: #fff;
        --p-button-icon-hover-color: #fff;
        color: #fff;
    }
    
    :deep(th.p-datatable-column-sorted [data-sc-menu] .p-button),
    :deep(th.p-datatable-column-sorted [data-sc-menu] .p-button *),
    :deep(th.p-highlight [data-sc-menu] .p-button),
    :deep(th.p-highlight [data-sc-menu] .p-button *),
    :deep(.p-treetable th.p-treetable-column-sorted [data-sc-menu] .p-button),
    :deep(.p-treetable th.p-treetable-column-sorted [data-sc-menu] .p-button *) {
        color: #fff !important;
    }
    
    :deep(.p-datatable .p-datatable-tbody > tr.p-highlight > td:not(.sc-colored-bg)),
    :deep(.p-datatable .p-datatable-tbody > tr[aria-selected="true"] > td:not(.sc-colored-bg)),
    :deep(.p-treetable .p-treetable-tbody > tr.p-highlight > td:not(.sc-colored-bg)),
    :deep(.p-treetable .p-treetable-tbody > tr[aria-selected="true"] > td:not(.sc-colored-bg)) {
        color: #fff !important;
    }
    
    :deep(.p-datatable .p-datatable-tbody > tr.p-highlight > td.sc-colored-bg),
    :deep(.p-datatable .p-datatable-tbody > tr[aria-selected="true"] > td.sc-colored-bg),
    :deep(.p-treetable .p-treetable-tbody > tr.p-highlight > td.sc-colored-bg),
    :deep(.p-treetable .p-treetable-tbody > tr[aria-selected="true"] > td.sc-colored-bg) {
        color: #000 !important;
    }
    
    :deep(.p-datatable .p-datatable-tbody > tr.p-highlight > td.sc-colored-bg *),
    :deep(.p-datatable .p-datatable-tbody > tr[aria-selected="true"] > td.sc-colored-bg *),
    :deep(.p-treetable .p-treetable-tbody > tr.p-highlight > td.sc-colored-bg *),
    :deep(.p-treetable .p-treetable-tbody > tr[aria-selected="true"] > td.sc-colored-bg *) {
        color: #000 !important;
    }
    
    :deep(.p-datatable .p-datatable-tbody > tr.p-highlight > td.sc-colored-fg),
    :deep(.p-datatable .p-datatable-tbody > tr[aria-selected="true"] > td.sc-colored-fg),
    :deep(.p-treetable .p-treetable-tbody > tr.p-highlight > td.sc-colored-fg),
    :deep(.p-treetable .p-treetable-tbody > tr[aria-selected="true"] > td.sc-colored-fg) {
        color: inherit !important;
    }
    
    :deep(.p-datatable .p-datatable-tbody > tr.p-highlight > td.sc-colored-bg),
    :deep(.p-datatable .p-datatable-tbody > tr[aria-selected="true"] > td.sc-colored-bg),
    :deep(.p-treetable .p-treetable-tbody > tr.p-highlight > td.sc-colored-bg),
    :deep(.p-treetable .p-treetable-tbody > tr[aria-selected="true"] > td.sc-colored-bg) {
        box-shadow: inset 0 0 0 9999px rgba(0, 0, 0, .30) !important;
    }
    
    :deep(.p-datatable .p-datatable-tbody > tr:not(.p-highlight)[aria-selected="false"] > td.sc-colored-bg),
    :deep(.p-datatable .p-datatable-tbody > tr:not(.p-highlight):not([aria-selected]) > td.sc-colored-bg),
    :deep(.p-treetable .p-treetable-tbody > tr:not(.p-highlight)[aria-selected="false"] > td.sc-colored-bg),
    :deep(.p-treetable .p-treetable-tbody > tr:not(.p-highlight):not([aria-selected]) > td.sc-colored-bg) {
        box-shadow: none !important;
    }
</style>
