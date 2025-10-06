/** Plugin: i18n + warmup */
export {WxTableConfiguratorPlugin} from './plugins/WxTableConfiguratorPlugin'

/** High-level wrapper that persists widths/order/visibility for PrimeVue DataTable/TreeTable. */
export {default as WxTableConfigurator} from './components/WxTableConfigRefactoring.vue';

/** Control panel with column toggles, alignment, colors, presets for WxTableConfigurator. */
export {default as WxTableControlPanel} from './components/WxControlPanel.vue';

/** Typed table cell helper (colors, bold, overflow handling). */
export {default as WxTableCell} from './components/WxTableCell.vue';

/** Header cell with menu trigger and sorting/align hooks. */
export {default as WxTableHeader} from './components/WxTableHeader.vue';

/** Build dynamic table footers (sum/avg/etc) from a concise spec. */
export {useDynamicFooter, type FooterSpec} from './composables/useDynamicFooter';

export * from './i18n';

