# WxTableHeader

`WxTableHeader` injects a compact **column header UI** (caption + action menu) into a PrimeVue `<Column>` header slot.  
From this per-column menu, users can set **font family, font size, font weight, text alignment (including centering), background color, and text color** — **all persisted** and applied with **higher priority** than table-level styles.

::: info
Per-column styles configured via `WxTableHeader` **override** global table typography/colors.  
Persistence is keyed by the same `storageKey` + the column’s `column-key`.
:::

---

## Props (API)

| Prop | Type | Default | Description |
|---|---|---|---|
| <span class="prop-required">header</span> | `string` | — | Display text shown in the column header |



## What the header menu controls

- **Typography (per column):** **font family**, **font size**, **font weight**.
- **Alignment:** left / **center** / right (affects header and cell body for that column).
- **Colors:** **background color** (column) and **text color**.
- **Persistence:** all choices are saved per `storageKey` + `column-key` and restored on reload.
- **Precedence:** per-column styles > table styles > theme defaults.

---

## Minimal usage

```vue

<script setup lang="ts">
    
    import {ref} from 'vue'
    
    //[!code highlight]
    import {
        //[!code highlight]
        WxTableConfigurator,
        // [!code ++]  
        WxTableHeader
        //[!code highlight]
    } from '@wizxpert/table-configurator'
    
    const storageKey = 'demo.header.v1'
    const rows = ref([
        {code: 'P001', name: 'Chair', category: 'Furniture', price: 120},
        {code: 'P002', name: 'Keyboard', category: 'Electronics', price: 40},
        {code: 'P003', name: 'Pen', category: 'Office', price: 3},
    ])
</script>

<template>
    
    <!-- Wrap the table so column styles are persisted under storageKey -->
    <!-- [!code highlight] -->
    <WxTableConfigurator :storageKey="storageKey">
        
        <DataTable :value="rows" show-gridlines :reorderableColumns="true" scrollable>
            <Column field="name" column-key="name">
                <template #header>
                    <!-- Injects caption + per-column style menu -->
                    <!-- [!code ++] -->
                    <WxTableHeader header="Name"/> 
                </template>
            </Column>
        </DataTable>
        
        <!-- [!code highlight] -->
    </WxTableConfigurator>


</template>

```
 