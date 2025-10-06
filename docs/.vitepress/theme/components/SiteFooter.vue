<template>
    <footer class="wx-footer" aria-label="Site footer">
 
        <div class="wx-meta">
            <span>MIT OR Apache-2.0 Licensed</span>
            <span>© {{ year }} Valerii Kuznetsov · WizXpert</span>
        </div>
    </footer>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    const year = ref(new Date().getFullYear())
</script>

<style scoped>
    .wx-footer {
        border-top: 1px solid var(--vp-c-divider);
        padding: 32px;
        font-size: 13px;
        color: var(--vp-c-text-2);
        margin-top: 32px;
    }
    .wx-footer__top {
        display: flex; gap: 12px; align-items: center; justify-content: space-between; flex-wrap: wrap;
        margin-bottom: 8px;
    }
    .wx-brand { color: var(--vp-c-text-1); }
    .wx-cta {
        text-decoration: none; padding: 6px 10px; border-radius: 8px;
        border: 1px solid var(--vp-c-divider);
    }
    .wx-links { display: flex; gap: 8px; justify-content: center; margin: 6px 0; }
    .wx-links a { text-decoration: none; }
    .wx-meta { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; opacity: .9; }
</style>
