# Header

## Overview

**WxTableHeader** augments the PrimeVue **DataTable/TreeTable** header with an inline tools menu. From this menu you can:
- Set **font family**
- Set **font size**
- Set **font weight**
- Change **text alignment** (including **center**)
- Pick **background color**
- Pick **text color**

All changes are **persisted** (Pinia + `localStorage`) and are applied with **higher priority** than table-level styles.

## Activation

The header renders a small **action button** in the **column’s header cell**.
**Clicking the button opens the menu** (no hover needed).

## Minimal usage

```vue
<script setup lang="ts">
    import { ref } from 'vue'
    import DataTable from 'primevue/datatable'
    import Column from 'primevue/column'
    import { WxTableConfigurator, WxTableHeader } from '@wizxpert/table-configurator'
    
    const storageKey = 'inventory.recount.v1'
    const rows = ref([
        { id: 1, name: 'Item A', qty: 12 },
        { id: 2, name: 'Item B', qty: 3 }
    ])
</script>

<template>
    <WxTableConfigurator :storageKey="storageKey">
        <DataTable :value="rows">
            <Column field="id">
                <!-- Mount WxTableHeader in this column's header slot -->
                <template #header>
                    <WxTableHeader header="ID" />
                </template>
            </Column>
            
            <Column field="name" header="Name" />
            <Column field="qty"  header="Qty" />
        </DataTable>
    </WxTableConfigurator>
</template>
```

## Props

- **`header` (required)** — text label for the column header.

 

## Behavior notes

- **Inline interaction.** The header menu is intended for quick **per-column** tweaks.
- **Non-intrusive.** The header component does not change your column templates or data; it only commands configuration **for that column**.

 

## Patterns

### A) Header-only
Use `WxTableHeader` when you want lightweight, discoverable controls directly **in the column header**.

### B) Header + Control Panel
Combine quick header controls with a full `WxTableControlPanel` placed elsewhere on the page for deeper customization.
