# Control Panel 

## Overview

**WxTableControlPanel** is an independent UI for configuring a PrimeVue **DataTable/TreeTable** wrapped by `WxTableConfigurator`. It exposes controls for:
- Column visibility and order
- Per‑column styling (font, alignment, weight, background)
- In‑cell sub‑field (slot) toggles
- Table‑level options (e.g., font family)

The panel reads and writes state to a shared Pinia store under a single **`storageKey`**. No table refs are required.



## Key characteristics

- **Independent placement.** The panel can live anywhere (sidebar, drawer, modal). It does not need to be a parent/child of the table
- **Non‑intrusive.** It does not change your column templates; it only controls configuration
- **Storage‑backed.** All changes persist via Pinia + `localStorage` under the same `storageKey` used by the table wrapper
- **Composable.** You can use the Control Panel alone, the header menu (`WxTableHeader`) alone, or both — they will stay in sync


## Data flow (at a glance)

1. User interacts with **WxTableControlPanel** (toggles columns, styles, sub‑fields).
2. The panel updates the **Pinia state** associated with `storageKey` (persisted to `localStorage`).
3. `WxTableConfigurator` **observes** state changes and applies them to the underlying DataTable/TreeTable (visibility, widths, classes, etc.).
4. `WxTableHeader` (if present) stays **in sync** because it reads/writes the same store.


## Using it outside the table subtree

Because the panel talks only through the shared store, you can place it in a **global layout**, a **sidebar**, or a **modal** opened from anywhere. For example, with a simple modal:

```vue
<script setup lang="ts">
 
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import { WxTableControlPanel } from '@wizxpert/table-configurator'

const storageKey = 'inventory.recount.v1'
const show = ref(false)
</script>

<template>
  <button class="p-button" @click="show = true">Open table settings</button>

  <Dialog v-model:visible="show" modal header="Table settings">
    <WxTableControlPanel :storageKey="storageKey" />
  </Dialog>
    
</template>
```


## Defaults & presets

Developer‑provided defaults (e.g., visibility, width, alignment) can be set on columns (see the main guide). The Control Panel will **reflect** those defaults on first load, and any subsequent user changes will be persisted.

 

## Resetting configuration

Common approaches:
- **Version bump** of `storageKey` (recommended for releases).
- **Manual clear** in the app (provide a “Reset settings” action that clears the store for this `storageKey`), if your app exposes such an action.
- **Local cleanup** during development (clear the relevant `localStorage` entry).

> Important: Using the same `storageKey` on different logical tables will cause them to share state. Keep keys unique per screen/table.

---

## Patterns

### A) Two panels controlling the same table
It is safe to render multiple `WxTableControlPanel` instances with the **same** `storageKey` (e.g., one in the header and one in a side drawer). They will stay in sync via the store.

### B) One panel controlling multiple tables
Not recommended. Use **distinct** `storageKey` values per logical table. If you intentionally want cross‑screen sharing, document that behavior for users.

### C) Sub‑fields (in‑cell slots)
When you define named slots inside `WxTableCell` for a column, the panel exposes toggles for those **sub‑fields**. Users can enable/disable them; the states persist under `parts` in the configuration.

## Accessibility & UX notes

- The package preserves native table semantics from PrimeVue.
- Ensure sufficient contrast for custom text/background colors.
- Consider a responsive layout: placing the panel in a collapsible sidebar or modal improves usability on smaller screens.

 