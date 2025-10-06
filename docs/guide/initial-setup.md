## Initial setup

1) **Install packages (peer deps included)**
```bash
npm i @wizxpert/table-configurator primevue @primevue/themes primeicons pinia
```

2) **Add styles (icons + optional utilities)**
```ts
// main.ts (or your global entry)
import 'primeicons/primeicons.css'
// Optional: utility classes if you use them
// import 'primeflex/primeflex.css'
```

3) **PrimeVue theme preset (v4)**  
   In your `main.ts`, pass a preset from `@primevue/themes` (example uses Aura):
```ts
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

app.use(PrimeVue, {
  theme: { preset: Aura },
  ripple: true,
})
```

4) **Pinia + plugin**  
   Make sure Pinia is installed **before** the Table Configurator plugin:
```ts
import { createPinia } from 'pinia'
import { WxTableConfiguratorPlugin } from '@wizxpert/table-configurator'

app.use(createPinia())
app.use(WxTableConfiguratorPlugin, {
  locale: 'en',  // or 'uk', etc.
  // warmup: true // keep default unless you need to skip pre-init
})
```

5) **Basic wiring reminder**
- Use the **same `storageKey`** for `WxTableConfigurator`, `WxTableHeader`, and `WxTableControlPanel`.
- Prefer explicit `column-key` on each `<Column>` for stable mapping (falls back to `field` if omitted).
