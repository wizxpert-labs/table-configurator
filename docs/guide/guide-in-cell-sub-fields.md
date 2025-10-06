# In-cell Sub-Fields (Composite Content)

## Overview

`WxTableCell` lets you render **composite content inside a single table cell**:

- A **main** (default) slot for the primary value.
- Any number of **named sub-slots** (sub-fields) that users can toggle on/off via the Control Panel
- **Per-cell styling hooks** (`--sc-font-family`, `--sc-font-size`) so header/table styles propagate into cells

All sub-field visibility is persisted

## Minimal usage

```vue

<script setup lang="ts">
    
    import {computed} from 'vue'
    import DataTable from 'primevue/datatable'
    import Column from 'primevue/column'
    import {WxTableConfigurator, WxTableCell} from '@wizxpert/table-configurator'
    
    const storageKey = 'inventory.recount.v1'
    
    const rows = [
        {id: 1, name: 'Item A', price: 12, vendor: 'Acme', tags: ['metal', 'm8']},
        {id: 2, name: 'Item B', price: 3, vendor: 'Globex', tags: ['plastic']}
    ]
</script>

<template>
    <WxTableConfigurator :storageKey="storageKey">
        <DataTable :value="rows" dataKey="id">
            <Column field="name">
                <template #body="{ data: row }">
                    <!-- One cell with multiple sub-fields -->
                    <WxTableCell :row="row" columnKey="name">
                        <!-- Main content -->
                        <template #default="{ row }">
                            <strong>{{ row.name }}</strong>
                        </template>
                        
                        <!-- Sub-field: vendor -->
                        <template #vendor="{ row }">
                            <span>Vendor: {{ row.vendor }}</span>
                        </template>
                        
                        <!-- Sub-field: tags (can be composite Vue) -->
                        <template #tags="{ row }">
                            <ul class="m-0 p-0" style="list-style: none;">
                                <li v-for="t in row.tags" :key="t">• {{ t }}</li>
                            </ul>
                        </template>
                    </WxTableCell>
                </template>
            </Column>
            
            <Column field="price" header="Price"/>
        </DataTable>
    </WxTableConfigurator>
</template>
```

## Using complex, composite Vue content

You can place **any complex Vue components** inside the sub-slots (forms, chips, tooltips, nested components). Example:

```vue
<!-- Inside a WxTableCell -->
<template #analytics="{ row }">
    <ProductAnalytics :product-id="row.id"/>
</template>

<template #actions="{ row }">
    <ActionBar :item="row" @edit="openEditor(row)" @delete="confirmDelete(row)"/>
</template>
```

> The cell gives each slot the `row` prop (`:row="row"`), so sub-components can render rich, contextual UI

  