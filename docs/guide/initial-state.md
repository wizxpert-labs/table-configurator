# Initial View & Defaults

When there is **no saved entry in `localStorage`** for a given `storageKey`, the table starts from **developer defaults** and package fallbacks:

- **Visibility:** all columns are visible **by default**, unless you hide some via presets.
- **Order:** columns follow the order they appear in your template.
- **Widths:** auto by the browser; fixed width is applied only if you set it via presets.
- **Styles:** font family/size and alignment inherit from the theme (no overrides yet).
- **Sub-fields:** all named sub-slots inside `WxTableCell` are **off by default** until the user enables them.

> After the first user change, the state is persisted (Pinia + `localStorage`) and **developer defaults are no longer applied** on subsequent loads.

### Configure the initial state

You can steer the initial view without touching user data:

1) **Control which columns are shown initially** (global):
```vue
<WxTableConfigurator
  :storageKey="storageKey"
  :visible="['id','name','qty']"  <!-- columns not listed here start hidden -->
>
  <!-- your DataTable here -->
</WxTableConfigurator>
```

2) **Per-column defaults** (widths, align, fonts, etc.):
```vue
<!-- Column developer defaults, used only on first run -->
<Column
  field="name"
  column-key="name"
  :tc-preset="{
    px: 240,               // number or '240px'
    visible: true,         // make sure it's visible initially
    align: 'left',         // 'left' | 'center' | 'right'
    bold: false,
    cellBold: false,
    bg: '#ffffff',
    fg: '#111827',
    fontPx: 14,
    fontFamily: 'Inter, Arial, sans-serif'
  }"
/>
```

3) **Stable keys matter**  
   Always set **`column-key`** explicitly (falls back to `field` if omitted). Stable keys ensure your initial presets map correctly.

4) **Reset strategy**  
   If you later change your schema or want to re-apply updated defaults to all users, **bump `storageKey`** (e.g., `demo.products.v1` → `demo.products.v2`). This creates a fresh first-run state.

> Tip: Header-level styling (via `WxTableHeader`) is not applied until the user interacts. If you want a particular look on first run, set it via column presets as shown above.
