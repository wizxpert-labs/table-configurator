<script setup lang="ts">
    
    import {computed} from 'vue'
    import ToggleSwitch from 'primevue/toggleswitch'
    import Checkbox from 'primevue/checkbox'
    import {useWxTableStore} from '../store/WxTableStore'
    import DtKitFontControls from './WxFontPanel.vue'
    import {useI18n} from '../i18n'
    
    const {t} = useI18n()
    
    const props = withDefaults(defineProps<{
        storageKey: string
        composeKey?: string
        showFontControls?: boolean
    }>(), {showFontControls: true})
    
    const store = useWxTableStore()
    
    const tableState = computed(() => store.table(props.storageKey))
    const columnsMeta = computed(() => tableState.value?.columns ?? [])
    const allKeys = computed(() => store.orderedKeys(props.storageKey))
    const visibleSet = computed(() => store.visibleSet(props.storageKey))
    
    function labelFor(key: string): string {
        const persisted = (store.titleOf(props.storageKey, key) ?? '').trim()
        if (persisted) return persisted
        const meta = columnsMeta.value.find(c => c.key === key)
        const discovered = (meta?.title ?? '').trim()
        return discovered || ''
    }
    
    const items = computed(() => {
        if (!tableState.value) return []
        return allKeys.value
            .filter(k => k !== 'fillSpace')
            .map(k => ({key: k, label: labelFor(k)}))
            .filter(it => it.label.length > 0)
    })
    
    function toggleColumn(key: string, on: boolean) {
        store.toggle(props.storageKey, key, on)
    }
    
    const partsByColumn = computed<Record<string, Record<string, boolean>>>(() => tableState.value?.parts ?? {})
    
    function partKeysFor(colKey: string): string[] {
        const map = partsByColumn.value[colKey] || {}
        const keys = Object.keys(map)
        if (!keys.length) return []
        if (props.composeKey && props.composeKey !== colKey) return []
        return keys
    }
    
    function partsVisFor(colKey: string): Record<string, boolean> {
        return store.cellPartsOf(props.storageKey, colKey) ?? {}
    }
    
    function setPart(colKey: string, partKey: string, on: boolean) {
        store.setCellPartVisible(props.storageKey, colKey, partKey, on)
    }

</script>

<template>
    
    <div class="wx-panel">
        
        <DtKitFontControls v-if="showFontControls" :storageKey="storageKey"/>
        
        <div class="wx-panel-header">
            <div class="wx-panel-title">{{ t('table.visibility') }}</div>
        </div>
        
        <div v-if="items.length" class="wx-columns">
            <div v-for="it in items" :key="it.key" class="wx-column-section">
                <!-- Main toggle -->
                <div class="wx-column-toggle">
                    <ToggleSwitch
                        :modelValue="visibleSet.has(it.key)"
                        @update:modelValue="(v:boolean)=>toggleColumn(it.key, v)"
                        :pt="{
                          slider: { style: { borderRadius: '4px !important' } },
                          handle: { style: { borderRadius: '4px !important' } }
                        }"
                    >
                        <template #handle="{ checked }">
                            <i :class="['pi', { 'pi-check': checked, 'pi-times': !checked }]"/>
                        </template>
                    </ToggleSwitch>
                    <span class="wx-column-label">{{ it.label }}</span>
                </div>
                
                <!-- Nested subfields -->
                <div
                    v-if="partKeysFor(it.key).length"
                    class="wx-column-subparts"
                >
                    <div
                        v-for="pk in partKeysFor(it.key)"
                        :key="it.key + ':' + pk"
                        class="wx-subpart-row"
                        :class="{ 'disabled': !visibleSet.has(it.key) }"
                    >
                        <Checkbox
                            :binary="true"
                            :modelValue="partsVisFor(it.key)[pk]"
                            :disabled="!visibleSet.has(it.key)"
                            @update:modelValue="(v:boolean)=>setPart(it.key, pk, v)"
                        />
                        <span class="wx-subpart-label">{{ pk }}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-else class="wx-panel-empty">
            {{ t('table.noColumns') }}
        </div>
    </div>
</template>
<style scoped>
    
    .wx-panel {
        display: flex;
        flex-direction: column;
        padding: 4px;
    }
    
    .wx-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px dotted #ccc;
        padding-bottom: 6px;
        margin-bottom: 6px;
    }
    
    .wx-panel-title {
        font-weight: 600;
        font-size: 13px;
    }
    
    .wx-columns {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    
    .wx-column-section {
        border-bottom: 1px dotted #ccc;
        padding: 0 0 4px 0;
    }
    
    .wx-column-toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
    }
    
    .wx-column-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
    }
    
    .wx-column-subparts {
        margin-left: 40px;
        margin-top: 6px;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    
    .wx-subpart-row {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 12px;
    }
    
    .wx-subpart-row.disabled {
        opacity: 0.5;
        pointer-events: none;
    }
    
    .wx-subpart-label {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    
    .wx-panel-empty {
        font-size: 12px;
        opacity: 0.6;
        margin-top: 10px;
    }

</style>
