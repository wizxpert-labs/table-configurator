# WxTableCell (Sub-Fields)

`WxTableCell` is a tiny wrapper used **inside a column body** to declare the cell’s **main content** and any number of *
*named sub-fields**.  
These sub-fields are discovered by `WxTableControlPanel`, where users can toggle them on/off

::: info

- Place `WxTableCell` **inside** the column’s `#body` slot
- The **default** slot is your always-visible main content
- Each **named** slot (e.g. `#Name`, `#Category`, `#Price`) becomes a toggle in the Control Panel
  :::

## Props (API)

| Prop  | Type  | Default | Description                                                                             |
|-------|-------|---------|-----------------------------------------------------------------------------------------|
| `row` | `any` | —       | The current row object passed down from the DataTable/TreeTable body slot. **Required** |

## Slots (API)

| Slot name   | Receives | Description                                                                                                                       |
|-------------|----------|-----------------------------------------------------------------------------------------------------------------------------------|
| `default`   | row      | Main content of the cell (always rendered unless you add your own conditions).                                                    |
| `*` (named) | row      | Declares a **sub-field**. The slot name becomes the **label** in the Control Panel toggles (e.g. `#Name`, `#Category`, `#Price`). |

> **Note:** Use short, human-readable names for sub-fields — they appear as labels in the Control Panel. You can
> localize them (e.g. `#Name`, `#Price`).

## Minimal usage

<CodeToggle showText="Show full example" hideText="Hide full example">
<template #short>

```vue
<!-- Inside a Column body: main + sub-fields -->
<template #body="{ data }">
    <WxTableCell :row="data">
        <template #default="{ row }">
            {{ row.code }}
        </template>
        <template #Name="{ row }">
            <span class="text-xs font-bold">{{ row.name }}</span>
        </template>
        <template #Category="{ row }">
            <span class="text-xs">{{ row.category }}</span>
        </template>
    </WxTableCell>
</template>
```

  </template>
  <template #full>

```vue

<script setup lang="ts">
    import {ref} from 'vue'
    import {WxTableConfigurator, WxTableControlPanel, WxTableCell, WxTableHeader} from '@wizxpert/table-configurator'
    import DataTable from 'primevue/datatable'
    import Column from 'primevue/column'
    
    const storageKey = 'demo.subfields.v1'
    const rows = ref([
        {code: 'P001', name: 'Chair', category: 'Furniture', price: 120, unit: 'pcs'},
        {code: 'P002', name: 'Keyboard', category: 'Electronics', price: 40, unit: 'pcs'},
        {code: 'P003', name: 'Pen', category: 'Office', price: 3, unit: 'pcs'},
    ])
</script>

<template>
    <div class="demo-layout">
        <div class="table-area">
            <WxTableConfigurator :storageKey="storageKey">
                <DataTable :value="rows" show-gridlines :reorderableColumns="true" scrollable>
                    <Column field="code" column-key="code" class="p-0">
                        <template #header>
                            <WxTableHeader header="Code"/>
                        </template>
                        
                        <template #body="{ data }">
                            <!-- Declare sub-fields inside WxTableCell so the panel can toggle them -->
                            <WxTableCell :row="data">
                                <!-- Main cell content -->
                                <template #default="{ row }">
                                    {{ row.code }}
                                </template>
                                
                                <!-- Named sub-fields (labels shown in the Control Panel) -->
                                <template #Name="{ row }">
                                    <span class="text-xs font-bold">{{ row.name }}</span>
                                </template>
                                
                                <template #Category="{ row }">
                                    <span class="text-xs">{{ row.category }}</span>
                                </template>
                                
                                <template #Price="{ row }">
                                    <span class="text-xs">{{ row.price }} {{ row.unit }}</span>
                                </template>
                            </WxTableCell>
                        </template>
                    </Column>
                    
                    <Column field="name" column-key="name">
                        <template #header>
                            <WxTableHeader header="Name"/>
                        </template>
                    </Column>
                    <Column field="category" column-key="category">
                        <template #header>
                            <WxTableHeader header="Category"/>
                        </template>
                    </Column>
                    <Column field="price" column-key="price">
                        <template #header>
                            <WxTableHeader header="Price"/>
                        </template>
                    </Column>
                </DataTable>
            </WxTableConfigurator>
        </div>
        
        <div class="control-panel-area">
            <!-- Must share the same storageKey -->
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

## TreeTable example (optional)

<CodeToggle showText="Show TreeTable example" hideText="Hide TreeTable example">
<template #short>

```vue
<!-- Same idea: WxTableCell inside TreeTable column body -->
<template #body="{ node }">
    <WxTableCell :row="node.data">
        <template #default="{ row }">{{ row.name }}</template>
        <template #Status="{ row }"><span class="text-xs">{{ row.status }}</span></template>
    </WxTableCell>
</template>
```

  </template>
  <template #full>

```vue

<script setup lang="ts">
    import {ref} from 'vue'
    import {WxTableConfigurator, WxTableControlPanel, WxTableCell, WxTableHeader} from '@wizxpert/table-configurator'
    import TreeTable from 'primevue/treetable'
    import Column from 'primevue/column'
    
    const storageKey = 'demo.subfields.tree.v1'
    const nodes = ref([
        {
            key: '0',
            data: {name: 'Group 1', status: 'Active'},
            children: [
                {key: '0-0', data: {name: 'Item A', status: 'Active'}},
                {key: '0-1', data: {name: 'Item B', status: 'Inactive'}},
            ],
        },
    ])
</script>

<template>
    <div class="demo-layout">
        <div class="table-area">
            <WxTableConfigurator :storageKey="storageKey">
                <TreeTable :value="nodes" tableStyle="min-width: 40rem">
                    <Column field="name" column-key="name" expander>
                        <template #header>
                            <WxTableHeader header="Name"/>
                        </template>
                        <template #body="{ node }">
                            <WxTableCell :row="node.data">
                                <template #default="{ row }">{{ row.name }}</template>
                                <template #Status="{ row }"><span class="text-xs">{{ row.status }}</span></template>
                            </WxTableCell>
                        </template>
                    </Column>
                    
                    <Column field="status" column-key="status">
                        <template #header>
                            <WxTableHeader header="Status"/>
                        </template>
                        <template #body="{ node }">{{ node.data.status }}</template>
                    </Column>
                </TreeTable>
            </WxTableConfigurator>
        </div>
        
        <div class="control-panel-area">
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

 
