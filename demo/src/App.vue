<script setup lang="ts">
    import { ref } from 'vue'
    import { WxTableConfigurator, WxTableHeader, WxTableCell, WxTableControlPanel } from '@wizxpert/table-configurator'
    
    import DataTable from 'primevue/datatable'
    import Column from 'primevue/column'
    
    const products = ref([
        { code: 'P001', name: 'Chair', category: 'Furniture', price: 120 },
        { code: 'P002', name: 'Keyboard', category: 'Electronics', price: 40 },
        { code: 'P003', name: 'Pen', category: 'Office', price: 3 }
    ])
    
    const columns = [
        { key: 'code', title: 'Code',  },
        { key: 'name', title: 'Name',  },
        { key: 'category', title: 'Category', },
        { key: 'price', title: 'Price',  }
    ]
</script>


<template>
    
    
    
    <div class="demo-layout">
        <!-- Table + Configurator -->
        <div class="table-area">
            <WxTableConfigurator storageKey="ddd1">
                
                <DataTable
                    :value="products"
                    show-gridlines
                    :reorderableColumns="true"
                >
                    <Column field="code" column-key="code" class="p-0">
                        <template #header>
                            <WxTableHeader header="Code" />
                        </template>
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
                                <template #Price="{ row }">
                                    <span class="text-xs">{{ row.price }}</span>
                                </template>
                            
                            </WxTableCell>
                        </template>
                    </Column>
                    <Column field="name" columnKey="name">
                        <template #header>
                            <WxTableHeader header="Name" />
                        </template>
                    </Column>
                    <Column field="category" columnKey="category">
                        <template #header>
                            <WxTableHeader header="Category" />
                        </template>
                    </Column>
                    <Column field="price" columnKey="price">
                        <template #header>
                            <WxTableHeader header="Price" />
                        </template>
                    </Column>
                </DataTable>
            </WxTableConfigurator>
        </div>
        
        <!-- Control Panel -->
        <div class="control-panel-area">
            <WxTableControlPanel storage-key="ddd1" />
        </div>
    </div>
</template>


<style  scoped>
    
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
