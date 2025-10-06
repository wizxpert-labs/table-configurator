<script setup lang="ts">
    import { ref } from 'vue'
    
    const props = withDefaults(defineProps<{
        expanded?: boolean
        showText?: string
        hideText?: string
    }>(), {
        expanded: false,
        showText: 'Show full example',
        hideText: 'Hide full example'
    })
    
    const open = ref<boolean>(props.expanded)
</script>

<template>
    <div class="code-toggle">
        <button
            class="vp-button"
            type="button"
            @click="open = !open"
            :aria-expanded="open"
        >
        {{ open ? props.hideText : props.showText }}
        </button>
        
        <div v-if="!open" class="code-slot">
            <slot name="short" />
        </div>
        <div v-else class="code-slot">
            <slot name="full" />
        </div>
    </div>
</template>

<style scoped>
    .code-toggle { margin: 1rem 0; }
    .vp-button {
        display: inline-flex; align-items: center; gap: .5rem;
        padding: .45rem .8rem; border: 1px solid var(--vp-c-divider);
        border-radius: .5rem; cursor: pointer; user-select: none;
        background: var(--vp-c-bg-soft);
        color: var(--vp-c-text-1);
        font-weight: 500;
    }
    .vp-button:hover {
        background: var(--vp-c-bg-mute);
        border-color: var(--vp-c-brand-2, var(--vp-c-divider));
    }
    
</style>
