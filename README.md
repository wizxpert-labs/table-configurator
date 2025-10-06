# Table Configurator

> Vue 3 toolkit for PrimeVue 4.x — persistent column visibility & order, px-only widths, per-column styles, and toggleable in-cell sub-fields

- **Library**: `@wizxpert/table-configurator` (ESM-only, ships raw TS + `.vue`)
- **Docs**: VitePress site inside `/docs`
- **Demo**: Vite dev server inside `/demo`
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
// All comments in English
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
    // All comments in English
    import { ref } from 'vue'
    import DataTable from 'primevue/datatable'
    import Column from 'primevue/column'
    
    import {
        WxTableConfigurator,
        WxTableHeader,
        WxTableControlPanel,
        WxTableCell
    } from '@wizxpert/table-configurator'
    
    const storageKey = 'demo.inventory.v1'
    const rows = ref([
        { id: 1, name: 'Item A', qty: 12 },
        { id: 2, name: 'Item B', qty: 3 }
    ])
</script>

<template>
    <WxTableControlPanel :storageKey="storageKey" class="mb-3" />
    
    <WxTableConfigurator :storageKey="storageKey">
        <DataTable :value="rows">
            <template #header>
                <WxTableHeader :storageKey="storageKey" />
            </template>
            
            <Column field="id" header="ID" />
            <Column field="name" header="Name" />
            <Column field="qty" header="Qty">
                <template #body="{ data }">
                    <WxTableCell :row="data" column-key="qty">
                        <template #default="{ row }">{{ row.qty }}</template>
                        <template #Delta="{ row }">(+2 today)</template>
                    </WxTableCell>
                </template>
            </Column>
        </DataTable>
    </WxTableConfigurator>
</template>
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
├─ docs/                         # VitePress site
├─ demo/                         # Vite demo app
├─ table-configurator/           # publishable package
│  ├─ table-configurator/
│  │  ├─ index.ts                # public entry (re-exports)
│  │  └─ src/                    # components, store, composables, etc.
│  ├─ LICENSE-MIT
│  ├─ LICENSE-APACHE
│  ├─ NOTICE
│  └─ package.json               # ESM-only, raw TS + .vue exports
└─ ...
```


## License

Dual-licensed under **MIT** or **Apache-2.0** at your option.  
See [`LICENSE-MIT`](./LICENSE-MIT), [`LICENSE-APACHE`](./LICENSE-APACHE), and [`NOTICE`](./NOTICE).
