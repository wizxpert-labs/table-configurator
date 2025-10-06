/** Plugin: i18n + warmup */
export {WxTableConfiguratorPlugin} from './src/plugins/WxTableConfiguratorPlugin'

/** High-level wrapper that persists widths/order/visibility for PrimeVue DataTable/TreeTable. */
export {default as WxTableConfigurator} from './src/components/WxTableConfigRefactoring.vue';

/** Control panel with column toggles, alignment, colors, presets for WxTableConfigurator. */
export {default as WxTableControlPanel} from './src/components/WxControlPanel.vue';

/** Typed table cell helper (colors, bold, overflow handling). */
export {default as WxTableCell} from './src/components/WxTableCell.vue';

/** Header cell with menu trigger and sorting/align hooks. */
export {default as WxTableHeader} from './src/components/WxTableHeader.vue';

/** Build dynamic table footers (sum/avg/etc) from a concise spec. */
export {useDynamicFooter, type FooterSpec} from './src/composables/useDynamicFooter';

export * from './src/i18n';

