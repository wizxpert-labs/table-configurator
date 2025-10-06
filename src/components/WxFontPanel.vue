<script setup lang="ts">
    import { computed } from 'vue'
    import Select from 'primevue/select'
    import InputNumber from 'primevue/inputnumber'
    import { useWxTableStore } from '../store/WxTableStore'
    import { FONT_OPTIONS, type FontOpt } from '../constants/fonts'
    import { useI18n } from '../i18n'
    
    const { t } = useI18n()
    
    const props = withDefaults(defineProps<{
        storageKey: string
        heading?: string
        fontOptions?: ReadonlyArray<FontOpt>
    }>(), { heading: undefined })
    
    const store = useWxTableStore()
    
    const options = computed<FontOpt[]>(() => {
        const base = props.fontOptions ?? FONT_OPTIONS
        const arr = base.slice() as FontOpt[]
        if (arr.length) arr[0] = { ...arr[0], label: t('header.font.default') }
        return arr
    })
    
    /** Font size: allow number >=8 or '' for default */
    const tableFontSize = computed<number | null>({
        get: () => {
            const val = store.tableFontSize(props.storageKey)
            return typeof val === 'number' && val > 0 ? val : null
        },
        set: (v) => {
            if (typeof v === 'number' && v >= 8) {
                store.setTableStyle(props.storageKey, { fontSize: Math.round(v) })
            } else {
                // null or below min = reset to default
                store.setTableStyle(props.storageKey, { fontSize: undefined })
            }
        }
    })
    
    const tableFontFamily = computed<string>({
        get: () => store.tableFontFamily(props.storageKey) ?? 'inherit',
        set: (v) => {
            const val = (v ?? '').toString().trim() || 'inherit'
            store.setTableStyle(props.storageKey, { fontFamily: val })
        }
    })
    
    function makeFitter() {
        const MIN = 10
        const STEP = 1
        const MAX_STEPS = 12
        const fit = (el: HTMLElement) => {
            el.style.fontSize = ''
            const base = parseFloat(getComputedStyle(el).fontSize || '12') || 12
            let current = base
            let steps = 0
            while (steps < MAX_STEPS && current > MIN && el.scrollHeight > el.clientHeight) {
                current -= STEP
                el.style.fontSize = `${current}px`
                steps++
            }
        }
        const mounted = (el: HTMLElement) => {
            const ro = new ResizeObserver(() => fit(el))
            ro.observe(el)
            ;(el as any).__fit_ro = ro
            const onW = () => fit(el)
            window.addEventListener('resize', onW)
            ;(el as any).__fit_onw = onW
            requestAnimationFrame(() => fit(el))
        }
        const updated = (el: HTMLElement) => { requestAnimationFrame(() => fit(el)) }
        const unmounted = (el: HTMLElement) => {
            const ro: ResizeObserver | undefined = (el as any).__fit_ro
            const onW: (() => void) | undefined = (el as any).__fit_onw
            ro?.disconnect()
            if (onW) window.removeEventListener('resize', onW)
        }
        return { mounted, updated, unmounted }
    }
    
    const vFitTwoLines = makeFitter()
    
    const headingText = computed(() => props.heading ?? t('table.style'))
    const fontSizeLabel = computed(() => t('table.fontSize'))
    const fontDefaultText = computed(() => t('table.fontFamilyDefault'))
    const pxText = computed(() => t('table.px'))
</script>

<template>
    <div class="wx-font-controls">
        <div class="wx-heading">{{ headingText }}</div>
        
        <!-- Font size row -->
        <div class="wx-row">
            <label class="wx-label">{{ fontSizeLabel }}</label>
            <InputNumber
                class="font-size-input"
                :min="8"
                :max="48"
                :step="1"
                :useGrouping="false"
                :allowEmpty="true"
                :modelValue="tableFontSize"
                @update:modelValue="(v: number | null) => tableFontSize = v"
                placeholder="Default"
            />
            <span class="wx-unit-label">{{ pxText }}</span>
        </div>
        
        <!-- Font family selector -->
        <div class="wx-row">
            <Select
                class="wx-select"
                :options="options"
                optionLabel="label"
                optionValue="css"
                :filter="true"
                :showClear="true"
                :modelValue="tableFontFamily"
                @update:modelValue="(v: string | null) => tableFontFamily = (v ?? 'inherit')"
                :pt="{ label:{ class:'p-2' } }"
            >
                <template #value="slotProps">
                    <div v-if="slotProps.value !== null" class="wx-select-value">
                        <span
                            v-fit-two-lines
                            class="wx-select-text"
                            :style="{ fontFamily: slotProps.value || 'inherit' }"
                        >
                            {{ options.find(o => o.css === slotProps.value)?.label || fontDefaultText }}
                        </span>
                    </div>
                    <span v-else class="wx-muted">{{ fontDefaultText }}</span>
                </template>
                
                <template #option="slotProps">
                    <div class="wx-option">
                        <span
                            class="wx-option-text"
                            :style="{ fontFamily: slotProps.option.css || 'inherit' }"
                        >
                            {{ slotProps.option.label }}
                        </span>
                    </div>
                </template>
            </Select>
        </div>
    </div>
</template>

<style scoped>
    .wx-font-controls {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-bottom: 12px;
        margin-bottom: 8px;
    }
    
    .wx-heading {
        font-weight: 600;
        font-size: 13px;
        margin-bottom: 4px;
    }
    
    .wx-row {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
    }
    
    .wx-label {
        font-size: 12px;
        flex: 2;
    }
    
    .font-size-input {
        width: 60px;
        text-align: center;
    }
    
    .wx-unit-label {
        font-size: 12px;
        opacity: 0.6;
    }
    
    .wx-select {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        font-size: 13px;
    }
    
    .wx-select-value {
        width: 100%;
        min-width: 0;
    }
    
    .wx-select-text {
        display: inline-block;
        width: 100%;
        font-size: 13px;
        padding: 0;
    }
    
    .wx-option {
        width: 100%;
        min-width: 0;
    }
    
    .wx-option-text {
        font-size: 13px;
        padding: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        white-space: normal;
        word-break: break-word;
    }
    
    .wx-muted {
        opacity: 0.7;
        font-size: 13px;
    }
    
    :deep(.font-size-input>input) {
        max-width: 50px !important;
        text-align: center;
    }
</style>
