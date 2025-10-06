# WxTableConfigurator

`WxTableConfigurator` wraps PrimeVue **DataTable / TreeTable**, connects them to a persisted store via `storageKey`, and applies user preferences such as column visibility, order, and pixel-only widths. It also links with `WxTableControlPanel` and detects in-cell sub-fields declared through `WxTableCell`.

::: info
This toolkit extends PrimeVue tables and is **not** a standalone table
:::

---

## Props (API)

| Prop          | Type                          | Default   | Description                                                                                                                                                      |
|----------------|-------------------------------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `storageKey`  | `string`                      | —         | 🔴**<span class="req-required"> Required</span>**<br>Unique key for saving and restoring table configuration (visibility, order, px-widths, subfield visibility) |
| `disabled`     | `boolean`                     | `false`   | Completely disables all configurator logic — widths, order, and visibility tracking are skipped. The wrapped table is rendered as-is.                            |

**Visibility priority:**  
If `disabled = true`, nothing happens. Otherwise, the configurator first tries to restore from saved state. If none exists, `visible` is used as an initial default.

## Minimal usage (DataTable)

```vue

<script setup lang="ts">
    import {ref} from 'vue'
    
    const storageKey = 'demo.products.v1'
    
    const products = ref([
        {code: 'P001', name: 'Chair', category: 'Furniture', price: 120},
        {code: 'P002', name: 'Keyboard', category: 'Electronics', price: 40},
        {code: 'P003', name: 'Pen', category: 'Office', price: 3},
    ])
</script>

<template>
    
    <!-- Core wrapper: binds table to a persisted store by storageKey -->
    <WxTableConfigurator :storageKey="storageKey"> <!-- [!code ++] -->
        <DataTable
            :value="products"
            show-gridlines
            :reorderableColumns="true"
            scrollable
        >
            <Column field="name" header="Name"/>
            <Column field="category" header="Category"/>
            <Column field="price" header="Price"/>
        </DataTable>
    </WxTableConfigurator> <!-- [!code ++] -->

</template>

```

### Key points
- Both `WxTableConfigurator` and `WxTableControlPanel` must share the same `storageKey`.
- Sub-fields are declared as named slots inside `WxTableCell`.
- Column widths are **px-only** and persist per `storageKey`.


## Toggle configurator quickly (`disabled`)

<CodeToggle showText="Show full example" hideText="Hide full example">
  <template #short>

```vue
<!-- [!code ++] -->
<WxTableConfigurator storageKey="quick.toggle.v1" :disabled="disabled">  
  <DataTable :value="rows" show-gridlines>
    <Column field="a" column-key="a" />
    <Column field="b" column-key="b" />
  </DataTable>
  <!-- [!code ++] -->
</WxTableConfigurator> 
```

  </template>
  <template #full>

```vue
<script setup lang="ts">
import { ref } from 'vue'
// [!code ++]
import { WxTableConfigurator } from '@wizxpert/table-configurator'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const disabled = ref(false)
const rows = [{ a: 1, b: 2 }, { a: 3, b: 4 }]
</script>

<template>
  <label class="flex items-center gap-2 mb-2">
    <input type="checkbox" v-model="disabled" />
    <span>Disable configurator</span>
  </label>

  <!-- [!code ++] -->
  <!-- When disabled=true, configurator becomes a pass-through wrapper -->
  <!-- [!code ++] -->
  <WxTableConfigurator storageKey="quick.toggle.v1" :disabled="disabled">
    <DataTable :value="rows" show-gridlines>
      <Column field="a" column-key="a" />
      <Column field="b" column-key="b" />
    </DataTable>
    <!-- [!code ++] -->
  </WxTableConfigurator>
</template>
```

  </template>
</CodeToggle>

When `disabled = true`, the wrapper renders the table normally without saving or restoring state

## Default column visibility (`visible`)

```vue{4}
<!-- Applies only on first init (if no saved state exists) -->
<WxTableConfigurator
  storageKey="preset.visible.v1"
  :visible="['code', 'price']"
/>
```

Used to define which columns are initially visible before any user changes are saved
 