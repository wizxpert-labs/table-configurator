# Table Configurator

> Vue 3 toolkit for PrimeVue 4.x — persistent column visibility & order, px-only widths, per-column styles, and toggleable in-cell sub-fields

- **Library**: `@wizxpert/table-configurator` (ESM-only, ships raw `.ts` + `.vue`)
- **Docs**: [Documentation site](https://wizxpert.net)
- **Repository**: [GitHub › wizxpert-labs/table-configurator](https://github.com/wizxpert-labs/table-configurator)
- **License**: MIT OR Apache-2.0

---

## Features

- Persistent column configuration (visibility, order, widths)
- Per-column styling (font, weight, alignment, bg/fg)
- Toggleable **in-cell sub-fields** via named slots
- Works with PrimeVue **DataTable/TreeTable**
- State persistence via **Pinia + localStorage**
- Non-intrusive: wrap your table; header/control panel are add-ons

## Requirements

- `vue` ^3.5.0
- `primevue` ^4.3.0
- `@primevue/themes` ^4.3.0
- `pinia` ^3.0.0
- `primeicons` ^7.0.0 (optional)
- `primeflex` ^4.0.0 (optional)

> **Bundler note:** The package is ESM-only and ships raw `.ts` + `.vue`. Use Vite (recommended) with `@vitejs/plugin-vue`, or another bundler configured to compile Vue SFCs from `node_modules`.

---

## Installation

```bash
# once published to npm
npm i @wizxpert/table-configurator
```

> Local dev alternative (if you work from this repo): use a Vite alias to `table-configurator/table-configurator/index.ts` or install the local folder.

---

## Quick start

```ts
// main.ts (Vue 3)
import {createApp} from 'vue'
import {createPinia} from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import App from './App.vue'

// Library
import {WxTableConfiguratorPlugin} from '@wizxpert/table-configurator'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {theme: {preset: Aura}})
app.use(WxTableConfiguratorPlugin, {locale: 'en'})

app.mount('#app')
```

```vue
<!-- App.vue -->
<script setup lang="ts">
    import {ref} from 'vue'
    
    const products = ref([
        {code: 'P001', name: 'Chair', category: 'Furniture', price: 120},
        {code: 'P002', name: 'Keyboard', category: 'Electronics', price: 40},
        {code: 'P003', name: 'Pen', category: 'Office', price: 3}
    ])
    
    
</script>


<template>
    
    
    <div class="demo-layout">
        <!-- Table + Configurator -->
        <div class="table-area">
            <WxTableConfigurator storageKey="table.v1">
                
                <DataTable
                    :value="products"
                    show-gridlines
                    :reorderableColumns="true"
                >
                    <Column field="code" column-key="code" class="p-0">
                        <template #header>
                            <WxTableHeader header="Code"/>
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
                            <WxTableHeader header="Name"/>
                        </template>
                    </Column>
                    <Column field="category" columnKey="category">
                        <template #header>
                            <WxTableHeader header="Category"/>
                        </template>
                    </Column>
                    <Column field="price" columnKey="price">
                        <template #header>
                            <WxTableHeader header="Price"/>
                        </template>
                    </Column>
                </DataTable>
            </WxTableConfigurator>
        </div>
        
        <!-- Control Panel -->
        <div class="control-panel-area">
            <WxTableControlPanel storage-key="table.v1"/>
        </div>
    </div>
```

---

## Run the demo

```bash
cd demo
npm i
npm run dev
```

The demo uses local source via Vite alias and shows the control panel + header menu.

---

## Documentation (local)

```bash
npm run docs:dev     # dev server
npm run docs:build   # builds to docs/.vitepress/dist
npm run docs:preview # preview static build
```

> If you deploy to GitHub Pages under `/table-configurator/`, set `base: '/table-configurator/'` in `docs/.vitepress/config.ts`.

---

## Project structure

```
.
├─ docs/                      # VitePress site
├─ demo/                      # Vite demo app
├─ src/                       # package
│  ├─ index.ts                # public entry (re-exports)
│  └─ src/                    # components, store, composables, etc.
├─  ...
├─ LICENSE-MIT
├─ LICENSE-APACHE
├─ NOTICE
└─ package.json
```


## License

Dual-licensed under **MIT** or **Apache-2.0** at your option.  
See [`LICENSE-MIT`](./LICENSE-MIT), [`LICENSE-APACHE`](./LICENSE-APACHE), and [`NOTICE`](./NOTICE).
