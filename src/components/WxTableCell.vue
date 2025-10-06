<script setup lang="ts">
    import { computed, inject, onMounted, ref, useSlots, watch } from 'vue'
    import { useWxTableStore } from '../store/WxTableStore'
    import { WxTableContext } from '../store/WxTableContext'
    import { useBodyDomKey } from '../composables/useBodyDomKey'
    
    const props = withDefaults(defineProps<{
        columnKey?: string
        composeKey?: string
        row: any
    }>(), {})
    
    const injected = inject(WxTableContext, null)
    const storageKey = injected?.storageKey ?? ''
    const store = useWxTableStore()
    const slots = useSlots()
    
    const rootEl = ref<HTMLElement | null>(null)
    const { inferredKey, infer } = useBodyDomKey(rootEl, storageKey)
    
    const physicalKey = computed(() => props.columnKey ?? inferredKey.value ?? '')
    const effectiveKey = computed(() => (props.composeKey?.trim()) || physicalKey.value)
    
    const partKeys = computed<string[]>(() =>
        Object.keys(slots).filter(k => k !== 'default')
    )
    
    function syncPartKeys() {
        if (!storageKey) return
        const key = effectiveKey.value
        if (!key) return
        store.setCellPartKeys(storageKey, key, partKeys.value, false)
    }
    
    const partsVisible = computed<Record<string, boolean>>(() => {
        const key = effectiveKey.value
        return key && storageKey ? store.cellPartsOf(storageKey, key) : {}
    })
    
    onMounted(() => {
        if (!props.columnKey) inferredKey.value = infer()
        syncPartKeys()
    })
    
    watch([partKeys, effectiveKey], () => syncPartKeys(), { immediate: true })
</script>

<template>
    <div ref="rootEl" class="sc-cell">
        <div class="sc-cell-main">
            <slot :row="row" />
        </div>
        <template v-for="pk in partKeys" :key="pk">
            <div v-if="partsVisible[pk]" class="sc-cell-part">
                <slot :name="pk" :row="row" />
            </div>
        </template>
    </div>
</template>

<style scoped>
    .sc-cell {
        display: flex;
        flex-direction: column;
        font-family: var(--sc-font-family, inherit) !important;
        font-size: var(--sc-font-size, inherit) !important;
    }
    
    .sc-cell-main {
        display: block;
    }
    
    .sc-cell-part {
        display: block;
    }
</style>
