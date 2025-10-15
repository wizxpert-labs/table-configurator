<script setup lang="ts">
    /* All comments in English */
    import { computed, inject, onMounted, ref, watch, useAttrs, type CSSProperties } from 'vue'
    import Button from 'primevue/button'
    import Popover from 'primevue/popover'
    import Select from 'primevue/select'
    import InputNumber from 'primevue/inputnumber'
    import { type AlignVal, useWxTableStore } from '../store/WxTableStore'
    import { WxTableContext } from '../store/WxTableContext'
    import { COLOR_GRID, COLOR_PALETTE, COLOR_PALETTE_STRONG } from '../constants/colors'
    import { FONT_OPTIONS, type FontOpt } from '../constants/fonts'
    import { useHeaderDomKey } from '../composables/useHeaderDomKey'
    import { useColumnMeta } from '../composables/useColumnMeta'
    import { useHeaderMenuModel } from '../composables/useHeaderMenuModel'
    import { useI18n } from '../i18n'
    
    /* We take control of class/style forwarding to apply them to both wrapper and title */
    defineOptions({ inheritAttrs: false })
    const attrs = useAttrs()
    const userClass = computed(() => (attrs.class as any) ?? null)
    const userStyle = computed(() => (attrs.style as CSSProperties | undefined) ?? undefined)
    
    const { t, locale } = useI18n()
    console.log('wx locale =', locale())
    
    const props = withDefaults(defineProps<{
        storageKey?: string
        columnKey?: string
        header?: string
        variant?: 'toolbar' | 'menu'
        fontOptions?: ReadonlyArray<FontOpt>
    }>(), { variant: 'toolbar' })
    
    const injected = inject(WxTableContext, null)
    const sk = props.storageKey ?? injected?.storageKey ?? ''
    const store = useWxTableStore()
    
    const rootEl = ref<HTMLElement | null>(null)
    const { inferredKey, infer } = useHeaderDomKey(rootEl, sk)
    const effectiveColumnKey = computed(() => props.columnKey ?? inferredKey.value ?? '')
    
    onMounted(() => {
        if (!props.columnKey) inferredKey.value = infer()
    })
    
    const meta = useColumnMeta(sk, () => effectiveColumnKey.value)
    watch(() => props.header, (h) => {
        if (h) meta.ensureTitleIfEmpty(h)
    }, { immediate: true })
    
    function displayTitle(): string {
        return props.header ?? ''
    }
    
    const tableFontPx = computed(() => store.tableFontSize(sk))
    
    const sizeModel = computed<number | null>({
        get: () => store.fontPxOf(sk, effectiveColumnKey.value) ?? null,
        set: (v) => store.setColumnFontPx(sk, effectiveColumnKey.value, v ?? undefined),
    })
    
    const familyModel = computed<string | null>({
        get: () => store.fontFamilyOf(sk, effectiveColumnKey.value) ?? null,
        set: (v) => store.setColumnFontFamily(sk, effectiveColumnKey.value, (v ?? undefined) as string | undefined),
    })
    
    const { COLS, SWATCH, GAP } = COLOR_GRID
    const GRID_WIDTH = COLS * SWATCH + (COLS - 1) * GAP
    
    const previewBgStyle = computed(() => {
        const c = meta.bodyBgRaw.value?.trim()
        const hex = c ? (c.startsWith('#') ? c : `#${c}`) : ''
        return { background: hex || 'transparent', border: '1px solid #e5e7eb' }
    })
    
    const previewFgStyle = computed(() => {
        const c = meta.bodyFgRaw.value?.trim()
        const hex = c ? (c.startsWith('#') ? c : `#${c}`) : ''
        return { color: hex || 'inherit' }
    })
    
    const menu = ref<any>(null)
    const opToolbar = ref<any>(null)
    const opBg = ref<any>(null)
    const opFg = ref<any>(null)
    
    const items = useHeaderMenuModel({
        getTitle: () => displayTitle(),
        getBold: () => meta.cellBold.value,
        toggleBold: () => (meta.cellBold.value = !meta.cellBold.value),
        setAlign: (v: AlignVal) => (meta.align.value = v),
        pickColor: (hex) => {
            meta.bodyBgRaw.value = hex.startsWith('#') ? hex.slice(1) : hex
            ;(menu.value as any)?.hide?.()
        },
        clearColor: () => meta.clearBg(),
        pickTextColor: (hex) => {
            meta.bodyFgRaw.value = hex.startsWith('#') ? hex.slice(1) : hex
            ;(opFg.value as any)?.hide?.()
        },
        clearTextColor: () => meta.clearFg(),
    })
    
    function openTrigger(e: MouseEvent) {
        e.stopPropagation()
        if (props.variant === 'menu') (menu.value as any)?.toggle?.(e)
        else (opToolbar.value as any)?.toggle?.(e)
    }
    
    function openBg(e: MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
        ;(opBg.value as any)?.show?.(e)
    }
    
    function openFg(e: MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
        ;(opFg.value as any)?.show?.(e)
    }
    
    const isAlign = (a: AlignVal) => meta.align.value === a
    
    function setAlign(a: AlignVal) {
        meta.align.value = a
    }
    
    const isBold = computed(() => meta.cellBold.value)
    
    function toggleBold() {
        meta.cellBold.value = !meta.cellBold.value
    }
    
    const fontOptionsComputed = computed<FontOpt[]>(() => {
        const base = props.fontOptions ?? FONT_OPTIONS
        const arr = base.slice() as FontOpt[]
        if (arr.length) arr[0] = { ...arr[0], label: t('header.font.default') }
        return arr
    })
</script>

<template>
    <!-- Apply user class/style to the wrapper to allow global control -->
    <div ref="rootEl" class="header-wrapper" :class="userClass" :style="userStyle">
        <div class="menu-button-wrapper">
            <Button
                type="button"
                icon="pi pi-ellipsis-v"
                style="height: 32px;width: 32px;"
                rounded text
                aria-haspopup="true"
                aria-controls="dtkit_header_menu"
                :aria-label="t('header.menu.ariaColumnMenu')"
                @click.stop="openTrigger"
                @mousedown.stop @mouseup.stop @pointerdown.stop @pointerup.stop
            />
        </div>
        
        <!-- Apply the SAME user class/style to the title so it becomes the main styling hook -->
        <div
            class="header-title text-center"
            :class="userClass"
            :style="userStyle"
            :title="displayTitle()"
        >
            {{ displayTitle() }}
        </div>
        
        <Popover
            ref="opToolbar"
            appendTo="body"
            :dismissable="true"
            :showCloseIcon="false"
            class="toolbar-popover popover-test"
            :pt="{ content: { class: 'p-1' } }"
        >
            <div class="toolbar-buttons">
                <Button
                    label="B"
                    :severity="isBold ? 'primary' : undefined"
                    :outlined="!isBold"
                    class="btn-square"
                    :aria-pressed="isBold"
                    :title="t('header.menu.bold')"
                    @click="toggleBold"
                />
                <div class="divider-vertical" />
                <Button
                    icon="pi pi-align-left"
                    :outlined="!isAlign('left')"
                    :severity="isAlign('left') ? 'primary' : undefined"
                    class="btn-square"
                    :title="t('header.menu.alignLeft')"
                    @click="setAlign('left')"
                />
                <Button
                    icon="pi pi-align-center"
                    :outlined="!isAlign('center')"
                    :severity="isAlign('center') ? 'primary' : undefined"
                    class="btn-square"
                    :title="t('header.menu.alignCenter')"
                    @click="setAlign('center')"
                />
                <Button
                    icon="pi pi-align-right"
                    :outlined="!isAlign('right')"
                    :severity="isAlign('right') ? 'primary' : undefined"
                    class="btn-square"
                    :title="t('header.menu.alignRight')"
                    @click="setAlign('right')"
                />
                <div class="divider-vertical" />
                <Button text class="btn-square p-0" @click="openBg" :title="t('header.menu.cellBg')">
                    <span class="color-preview" :style="previewBgStyle"></span>
                </Button>
                <Button text class="btn-square p-0" @click="openFg" :title="t('header.menu.textColor')">
                    <span class="color-preview text-preview" :style="previewFgStyle">A</span>
                </Button>
            </div>
            
            <div class="font-select-panel" @click.stop>
                <div class="font-controls">
                    <Select
                        class="font-select"
                        :options="fontOptionsComputed"
                        optionLabel="label"
                        optionValue="css"
                        :filter="true"
                        :showClear="false"
                        v-model="familyModel"
                        :placeholder="t('header.font.default')"
                        :panelStyle="{ maxWidth: '260px' }"
                    >
                        <template #value="slotProps">
                            <div v-if="slotProps.value !== null">
                <span :style="{ fontFamily: slotProps.value || 'inherit' }">
                  {{ fontOptionsComputed.find(o => o.css === slotProps.value)?.label || t('header.font.default') }}
                </span>
                            </div>
                            <span v-else class="font-placeholder">{{ t('header.font.default') }}</span>
                        </template>
                        
                        <template #option="slotProps">
              <span :style="{ fontFamily: slotProps.option.css || 'inherit' }">
                {{ slotProps.option.label }}
              </span>
                        </template>
                    </Select>
                    
                    <InputNumber
                        class="font-size-input"
                        v-model="sizeModel"
                        :min="8" :max="64" :step="1"
                        :placeholder="tableFontPx != null ? String(tableFontPx) : ''"
                    />
                </div>
            </div>
        </Popover>
        
        <Popover ref="opBg" appendTo="body" :dismissable="true" :showCloseIcon="true" class="fs-11">
            <div class="px-2 py-2 dtkit-color-grid-wrap bg-white" @click.stop>
                <div
                    class="dtkit-color-grid mx-auto"
                    :style="{ width: GRID_WIDTH + 'px', gridTemplateColumns: `repeat(${COLS}, ${SWATCH}px)`, gap: GAP + 'px' }"
                >
                    <Button
                        v-for="c in COLOR_PALETTE" :key="'bg-'+c" type="button"
                        class="rounded border cursor-pointer"
                        :style="{ width: SWATCH + 'px', height: SWATCH + 'px', background: c, borderColor: '#e5e7eb' }"
                        @click.stop="() => { meta.bodyBgRaw.value = c.startsWith('#') ? c.slice(1) : c; (opBg as any)?.hide?.() }"
                    />
                </div>
                <div class="mt-2 flex">
                    <Button size="small" variant="outlined" icon="pi pi-times"
                            class="w-full text-xs" :label="t('header.color.clearFill')" @click="meta.clearBg()"/>
                </div>
            </div>
        </Popover>
        
        <Popover ref="opFg" appendTo="body" :dismissable="true" :showCloseIcon="true" class="fs-11">
            <div class="px-2 py-2 dtkit-color-grid-wrap bg-white" @click.stop>
                <div
                    class="dtkit-color-grid mx-auto"
                    :style="{ width: GRID_WIDTH + 'px', gridTemplateColumns: `repeat(${COLS}, ${SWATCH}px)`, gap: GAP + 'px' }"
                >
                    <Button
                        v-for="c in COLOR_PALETTE_STRONG" :key="'fg-'+c" type="button"
                        class="rounded border cursor-pointer"
                        :style="{ width: SWATCH + 'px', height: SWATCH + 'px', background: c, borderColor: '#e5e7eb' }"
                        @click.stop="() => { meta.bodyFgRaw.value = c.startsWith('#') ? c.slice(1) : c; (opFg as any)?.hide?.() }"
                    />
                </div>
                <div class="mt-2 flex justify-end">
                    <Button size="small" variant="outlined" icon="pi pi-times"
                            class="w-full text-xs" :label="t('header.color.resetText')" @click="meta.clearFg()"/>
                </div>
            </div>
        </Popover>
    </div>
</template>

<style scoped>
    .header-wrapper {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        user-select: none;
    }
    
    .menu-button-wrapper {
        display: flex;
        align-items: center;
        flex-shrink: 0;
    }
    
    .header-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        min-width: 0;
        font-weight: bold;
        font-size: 11px;
        text-align: left;
        font-family: inherit;
    }
    
    .toolbar-buttons {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 8px;
    }
    
    .btn-square {
        height: 32px;
        width: 32px;
    }
    
    .divider-vertical {
        width: 1px;
        height: 24px;
        background-color: #e5e7eb;
        margin: 0 4px;
    }
    
    .color-preview {
        display: inline-block;
        width: 100%;
        height: 100%;
        border-radius: 4px;
        border: 1px solid #e5e7eb;
    }
    
    .text-preview {
        line-height: 1.2;
        text-align: center;
        font-size: 13px;
        padding-top: 4px;
    }
    
    .font-select-panel {
        padding: 0 5px 12px;
        max-width: 250px;
    }
    
    .font-controls {
        display: flex;
        gap: 8px;
        align-items: center;
    }
    
    .font-select {
        flex: 1;
        font-size: 14px;
        min-width: 0;
    }
    
    .font-size-input {
        width: 50px;
        max-width: 50px !important;
        text-align: center;
    }
    
    .font-placeholder {
        opacity: 0.7;
    }
    
    :deep(.p-menu), :deep(.p-menu .p-menu-list) {
        background: #fff !important;
    }
    
    .dtkit-color-grid {
        display: grid !important;
    }
    
    :deep(.p-popover .p-button) {
        padding: 0.25rem;
    }
    
    :deep(.font-size-input > input) {
        max-width: 50px !important;
        text-align: center;
    }
</style>
