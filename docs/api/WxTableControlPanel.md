# WxTableControlPanel

`WxTableControlPanel` is the visual UI for managing a table’s configuration that is persisted by `WxTableConfigurator`.  
It lets users toggle **columns** on/off, reorder them, and show/hide **in-cell sub-fields** declared via `WxTableCell`.

::: info
This panel reads/writes user preferences to a persisted store by the same `storageKey` that is used by `WxTableConfigurator`
:::

## Props (API)

| Prop | Type | Default | Description                                                                                                                                                                                        |
|---|---|---|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `storageKey` | `string` | — | 🔴**<span class="req-required"> Required</span>**<br> The persistence key that links the panel with a specific table configuration (columns order/visibility, px-widths, and sub-field visibility) |


## What the panel controls

- **Columns**: toggle visibility, reflect persisted order
- **In-cell sub-fields**: toggle named slots from `WxTableCell` (e.g. `#Name`, `#Category`)
- **Table typography**: set **font family** and **font size** for the entire table; persisted per `storageKey`
- **Reset state** (if you expose it in your UI): clear saved config for the current `storageKey` and apply defaults


## Minimal usage

The panel must share the **same** `storageKey` as the table’s configurator.

<CodeToggle showText="Show full example" hideText="Hide full example">
  <template #short>

```vue
<!-- Sidebar panel controlling the table identified by storageKey -->
<!-- [!code ++] -->
<WxTableControlPanel :storage-key="storageKey" />
```

  </template>
  <template #full>

```vue

<script setup lang="ts">
  import {ref} from 'vue'

  //[!code highlight]
  import {
    //[!code highlight]
    WxTableConfigurator,
    //[!code ++]
    WxTableControlPanel,
    //[!code highlight]
    WxTableCell,
    //[!code highlight]
    WxTableHeader
    //[!code highlight]
  } from '@wizxpert/table-configurator'
  
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'

  const storageKey = 'demo.products.v1'

  const products = ref([
    {code: 'P001', name: 'Chair', category: 'Furniture', price: 120},
    {code: 'P002', name: 'Keyboard', category: 'Electronics', price: 40},
    {code: 'P003', name: 'Pen', category: 'Office', price: 3},
  ])
</script>

<template>
  <div class="demo-layout">
    <!-- Main area: table wrapped by the configurator -->
    <div class="table-area">
      <!-- [!code highlight] -->
      <WxTableConfigurator :storageKey="storageKey">
        <DataTable :value="products" show-gridlines :reorderableColumns="true" scrollable>
          <Column field="code" column-key="code">
            <template #header>
              <!-- [!code highlight] -->
              <WxTableHeader header="Code"/>
            </template>
            <template #body="{ data }">
              <!-- [!code highlight] -->
              <!-- Declare sub-fields inside WxTableCell; the panel can toggle them -->
              <!-- [!code highlight] -->
              <WxTableCell :row="data">
                <!-- [!code highlight] -->
                <template #default="{ row }">
                  <!-- [!code highlight] -->
                  {{ row.code }}
                  <!-- [!code highlight] -->
                </template>
                <!-- [!code highlight] -->
                <template #Name="{ row }">
                  <!-- [!code highlight] -->
                  <span class="text-xs font-bold">{{ row.name }}</span>
                  <!-- [!code highlight] -->
                </template>
                <!-- [!code highlight] -->
                <template #Category="{ row }">
                  <!-- [!code highlight] -->
                  <span class="text-xs">{{ row.category }}</span>
                  <!-- [!code highlight] -->
                </template>
                <!-- [!code highlight] -->
                <template #Price="{ row }">
                  <!-- [!code highlight] -->
                  <span class="text-xs">{{ row.price }}</span>
                  <!-- [!code highlight] -->
                </template>
                <!-- [!code highlight] -->
              </WxTableCell>
            </template>
          </Column>

          <Column field="name" column-key="name">
            <template #header>
              <!-- [!code highlight] -->
              <WxTableHeader header="Name"/>
            </template>
          </Column>

          <Column field="category" column-key="category">
            <template #header>
              <!-- [!code highlight] -->
              <WxTableHeader header="Category"/>
            </template>
          </Column>

          <Column field="price" column-key="price">
            <template #header>
              <!-- [!code highlight] -->
              <WxTableHeader header="Price"/>
            </template>
          </Column>
        </DataTable>
      </WxTableConfigurator>
    </div>

    <!-- Side area: the control panel bound to the same storageKey -->
    <div class="control-panel-area">
      <!-- [!code ++] -->
      <WxTableControlPanel :storage-key="storageKey"/>
    </div>
  </div>
</template>

<style scoped>

  .demo-layout {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    padding: 16px;
  }

  .table-area {
    flex: 1;
  }

  .control-panel-area {
    width: 300px;
    flex-shrink: 0;
    border-left: 1px solid #ddd;
    padding-left: 16px;
  }
</style>
```
  </template>
</CodeToggle>

### Key points
- The control panel **must** use the same `storageKey` as the table’s configurator.
- Sub-fields are detected only when declared as **named slots** inside `WxTableCell`.
- Column widths are **px-only** and persist per `storageKey` (the panel reflects visibility/order; widths are managed by the configurator).
 
  
