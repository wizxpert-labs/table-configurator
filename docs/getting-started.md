# Getting Started

## Overview
 
`@wizxpert/table-configurator` is an open-source wrapper for PrimeVue's `DataTable` and `TreeTable`.  
It provides a flexible, customizable interface for controlling column visibility, per-column styling, and embedded in-cell elements.

You can use it as-is, style it to match your design system, or extend it freely — the full source code is available.

> This package is **not** a standalone table — it extends existing PrimeVue components through pluggable features.

### Key Features

- **Persistent user preferences**  
  Automatically saves column visibility, order, widths, and sub-field toggles using a `storageKey`.

- **Control Panel Component**  
  A configurable UI element that lets users manage table columns and embedded fields visually.

- **In-Cell Subfields**  
  Add dynamic controls or values inside a cell that users can show/hide interactively.

- **Per-Column Styling**  
  Override global table styles for individual columns using props or slots.

- **Works with both DataTable and TreeTable**  
  Use the same configuration pattern for flat and hierarchical data.

## Requirements
- Vue `^3.5.0`
- PrimeVue `^4.3.0`
- @primevue/themes `^4.3.0`
- primeicons `^7.0.0`
- Pinia `^3.0.0`
> This package is a PrimeVue add-on for DataTable/TreeTable (not a standalone table)

## Installation

## Option 1: Install into your existing project

### If you already have a Vue + PrimeVue project
Install the package (peers should already be present in your project):

```bash
npm i @wizxpert/table-configurator
```

### Fresh install (no peers installed yet)

#### 1) Create a new Vue project with TypeScript and Pinia enabled
 
```bash
npm create vue@latest my-app

# During the interactive prompts select:
# - Add TypeScript?            → Yes
# - Add Pinia for state?       → Yes
# (the rest is up to you)
cd my-app
npm install

```

#### 2) Install PrimeVue peers
```bash
npm i primevue@^4.3.0 
npm i @primevue/themes@^4.3.0 
npm i primeicons@^7.0.0 
npm i primeflex@^4.0.0
```
#### 3) Install the Table Configurator
```bash
npm i @wizxpert/table-configurator
```

## Minimal setup (main.ts)
```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'  // or any other PrimeVue theme   
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import App from './App.vue'

// [!code ++]
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

// [!code ++]
// 3) Table Configurator plugin (yes — pass options here)
// [!code ++]
app.use(WxTableConfiguratorPlugin, {
  locale: 'uk',   // 'en' is default; set to your preferred locale
  // warmup: false // uncomment to skip pre-initialization if you need
})

app.mount('#app')

```

## Option 2: Try a demo project
```bash
git clone https://github.com/wizxpert/table-configurator-demo
cd table-configurator-demo
npm install
npm run dev
```
>This will launch a live demo using PrimeVue 4.x and Table Configurator

## Option 3: Embed the source in your app (fully customizable)

A great approach for teams that want **full control**: ship the library’s **source code as part of your project**.  
You can tweak anything — defaults, locales, UI, store shape, feature flags — and keep everything versioned together with your app.

### How to embed
Pick any of these ways (all are fine):

- **Drop-in copy**: copy the library’s `src` into your app, e.g. `src/modules/table-configurator`.
- **Git submodule / subtree**: track the upstream repo but keep the code in your repo tree.
- **Monorepo workspace**: add the package as a local workspace and import it via an alias.
