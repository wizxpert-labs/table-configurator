# Basic Concepts

## Overview

Table Configurator is an extension built on top of PrimeVue **DataTable/TreeTable**  that adds:

- **Persistent column configuration** (visibility, order, widths)
- **Per‑column styling** (font, alignment, weight, background)
- **In‑cell sub‑field toggles**
- **State persistence** via Pinia + `localStorage`


## How it works (at a glance)

- **Non‑intrusive wrapper.** You render PrimeVue **DataTable/TreeTable** as usual, but wrap it with `WxTableConfigurator`. The wrapper **does not change** your table structure or data flow—it only observes and applies configuration (visibility, widths, styles).

- **Header add‑on, not a rewrite.** In the table’s `header` slot you mount `WxTableHeader`. This component **injects a tools menu into the header** (column toggles, styling, sub‑fields) without altering your columns or templates.

- **Independent control panel.** `WxTableControlPanel` can live **anywhere on the page** (sidebar, drawer, modal). It doesn’t need refs to the table. It talks to the same store and updates the table **out of band**.

- **One key to bind them.** All three parts—`WxTableConfigurator` and `WxTableControlPanel` — share a single `storageKey`. That key is the **contract**: use the same value and they stay in sync. Change the key (e.g., add a version suffix) to **reset** saved preferences safely.

- **State that persists.** User choices (which columns are visible, widths, fonts, alignment, sub‑field toggles, etc.) are stored in **Pinia + `localStorage`** under that `storageKey`, so the table opens exactly as the user left it.

- **Works with both scroll modes.** Whether your DataTable is scrollable or not, the configurator discovers the correct header/body tables and applies settings accordingly.


## Minimal wiring

```vue

<script setup lang="ts">
    import {ref} from 'vue'
    
    const storageKey = 'inventory.recount.v1' // single source of truth for binding
    const rows = ref([
        {id: 1, name: 'Item A', qty: 12},
        {id: 2, name: 'Item B', qty: 3}
    ])
</script>

<template>
    <!-- Independent control panel; can be placed anywhere -->
    <WxTableControlPanel :storageKey="storageKey" class="mb-3"/>
    
    <!-- Non-intrusive wrapper around your DataTable -->
    <WxTableConfigurator :storageKey="storageKey">
        <DataTable :value="rows">
            <!-- Header gets augmented by WxTableHeader (menu, styling, etc.) -->
            <template #header>
                <WxTableHeader :storageKey="storageKey"/>
            </template>
            
            <Column field="id" header="ID"/>
            <Column field="name" header="Name"/>
            <Column field="qty" header="Qty"/>
        </DataTable>
    </WxTableConfigurator>
</template>
```
### Initialization (main.ts)

```ts
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'  // or any other PrimeVue theme
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import App from './App.vue'

import { WxTableConfiguratorPlugin } from '@wizxpert/table-configurator'

const app = createApp(App)

// 1) Pinia must be available before the plugin (the plugin uses Pinia)
app.use(createPinia())

// 2) PrimeVue with theme
app.use(PrimeVue, {
    theme: {
        preset: Aura,
    },
    ripple: true,
})

// 3) Table Configurator plugin (pass options if needed)
app.use(WxTableConfiguratorPlugin, {
    locale: 'uk',   // 'en' is default; set to your preferred locale
    // warmup: false // uncomment to skip pre-initialization if you need
})

app.mount('#app')
```

## `storageKey`

**Storage Key** is a _unique identifier_ of a table configuration.  
It is used to persist user preferences (column visibility, styles, widths, etc.) in `localStorage` (via Pinia).

**Rules:**
- Must be **unique** per logical table/screen.
- May include a version suffix, e.g. `demo.products.v1`, to safely reset configurations when schema changes.
- The same `storageKey` must be used by all parts of the configurator (wrapper, control panel, cells).




## Column Map

**Column Map** is an internal structure containing metadata and settings for each column.  
It is **automatically generated** based on columns where you specify `column-key`.

> If `column-key` is not specified, it is derived from the `field` prop. **Explicitly define `column-key`** to avoid ambiguity and simplify future migrations.

**Serialized example (JSON):**

```json
{
    "v": 1,
    "cols": {
        "code":     { "visible": false, "order": 0, "title": "Code",     "absPx": 150 },
        "name":     { "visible": true,  "order": 2, "title": "Name",     "absPx": 150 },
        "category": { "visible": true,  "order": 1, "title": "Category", "cellBold": false, "absPx": 150 },
        "price":    { "visible": true,  "order": 3, "title": "Price",    "absPx": 150 }
    },
    "parts": {
        "code": { "Name": false, "Category": false, "Price": false }
    },
    "table": {
        "fontFamily": "\"PT Sans\", Arial, sans-serif",
        "scrollWidthPx": 450
    }
}
```

**Field explanations:**
- `v` — configuration schema version.
- `cols` — dictionary of column metadata:
    - `visible: boolean` — current visibility of the column.
    - `order: number` — order (left → right).
    - `title: string` — column header title (custom titles planned for future versions).
    - `absPx: number` — fixed column width in pixels.
    - `cellBold: boolean` — bold font in cell content.
- `parts` — sub-field (sub-slot) visibility map per column.
- `table` — general table-level settings (e.g., `fontFamily`, `scrollWidthPx`).

## Sub-fields

**Sub-fields** are alternate or additional content fragments inside the same cell.  
They are defined as **named slots** inside `WxTableCell` (see example above: `#Name`, `#Category`, `#Price`).  
The `WxTableControlPanel` allows users to toggle them on or off.  
Their visibility flags are stored under `parts` in the Column Map.

## Default Presets

There are two ways to predefine the default configuration:

**Global (via `WxTableConfigurator`):**
```vue
<WxTableConfigurator
    :storage-key="storageKey"
    :visible="['code', 'price']"
>
    <!-- table here -->
</WxTableConfigurator>
```

**Per-column preset:**
```vue
<Column
    field="name"
    column-key="name"
    :tc-preset="{
    px: 300,                // number or '300px'
    visible: true,
    align: 'left',          // 'left' | 'center' | 'right'
    bold: false,
    cellBold: false,
    bg: '#ffffff',
    fg: '#111827',
    fontPx: 14,
    fontFamily: 'Inter, Arial, sans-serif'
  }"
/>
```
 

## Persisted Settings

**Storage:** `localStorage` (via Pinia store).

**Saved data:** column visibility, titles, widths, fonts, colors, `align`, `bold/italic`, and sub-field states.

## Column Styling

**Supported properties:**
- `fontFamily`, `fontSize`
- `bold`, `italic`
- `align` (`left` | `center` | `right`)
- `textColor`, `bgColor`

**Priority order:**
1. User-saved settings
2. Column metadata (developer defaults)
3. Package defaults

Style changes take effect instantly and persist across sessions.

## i18n (Localization)

You can set the locale globally when installing the plugin:

```ts
// main.ts (fragment)
import { WxTableConfiguratorPlugin } from '@wizxpert/table-configurator'

app.use(WxTableConfiguratorPlugin, {
    locale: 'uk', // 'en' by default
    // warmup: false // uncomment to skip pre-initialization if needed
})
```
 

## Accessibility (a11y)

- PrimeVue semantics are preserved — the components do not break native table structure.
- Maintain sufficient contrast for text and background colors (especially with custom themes).
