<script setup lang="ts">
    import { ref } from 'vue'
    import { WxTableCell, WxTableConfigurator, WxTableControlPanel, WxTableHeader } from '@wizxpert/table-configurator'
    import DataTable from 'primevue/datatable'
    import Column from 'primevue/column'
    
    const storageKey = 'docs.demo.products.v1'
    
    const rows = ref([
        { code: 'P001', name: 'Chair',    category: 'Furniture',   price: 120, unit: 'pcs' },
        { code: 'P002', name: 'Keyboard', category: 'Electronics', price: 40,  unit: 'pcs' },
        { code: 'P003', name: 'Pen',      category: 'Office',      price: 3,   unit: 'pcs' },
    ])
</script>

<template>
    <div class="demo-layout">
        <div class="table-area">
            <WxTableConfigurator :storageKey="storageKey">
                <DataTable :value="rows" show-gridlines :reorderableColumns="true">
                    <Column field="code" column-key="code">
                        <template #header>
                            <WxTableHeader header="Code" />
                        </template>
                        <template #body="{ data }">
                            <WxTableCell :row="data">
                                <template #default="{ row }">{{ row.code }}</template>
                                <template #Name="{ row }"><span class="text-xs font-bold">{{ row.name }}</span></template>
                                <template #Category="{ row }"><span class="text-xs">{{ row.category }}</span></template>
                                <template #Price="{ row }"><span class="text-xs">{{ row.price }} {{ row.unit }}</span></template>
                            </WxTableCell>
                        </template>
                    </Column>
                    
                    <Column field="name" column-key="name">
                        <template #header><WxTableHeader header="Name" /></template>
                    </Column>
                    <Column field="category" column-key="category">
                        <template #header><WxTableHeader header="Category" /></template>
                    </Column>
                    <Column field="price" column-key="price">
                        <template #header><WxTableHeader header="Price" /></template>
                    </Column>
                </DataTable>
            </WxTableConfigurator>
        </div>
        
        <div class="control-panel-area">
            <WxTableControlPanel :storage-key="storageKey" />
        </div>
    </div>
</template>

<style scoped>
    .demo-layout {
        display: flex;
        align-items: flex-start;
        gap: 20px;
    }
    
    /* Let children shrink properly inside flex */
    .table-area,
    .control-panel-area {
        min-width: 0;
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
    
    /* Mobile: stack vertically, both full width */
    @media (max-width: 768px) {
        .demo-layout {
            flex-direction: column;
            gap: 16px;
        }
        .table-area,
        .control-panel-area {
            width: 100%;
        }
        .control-panel-area {
            /* Replace left border with top border on mobile */
            border-left: 0;
            padding-left: 0;
            border-top: 1px solid #ddd;
            padding-top: 16px;
        }
    }
</style>
