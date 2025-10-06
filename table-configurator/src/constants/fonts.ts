export type FontOpt = { label: string; css?: string }

export const FONT_OPTIONS: ReadonlyArray<FontOpt> = Object.freeze([
    { label: 'Font (default)', css: 'inherit ' },

    { label: 'Inter',          css: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif' },
    { label: 'Roboto',         css: 'Roboto, "Helvetica Neue", Arial, sans-serif' },
    { label: 'Open Sans',      css: '"Open Sans", Arial, sans-serif' },
    { label: 'PT Sans',        css: '"PT Sans", Arial, sans-serif' },
    { label: 'Montserrat',     css: 'Montserrat, Arial, sans-serif' },
    { label: 'Nunito',         css: 'Nunito, Arial, sans-serif' },
    { label: 'Lato',           css: 'Lato, Arial, sans-serif' },
    { label: 'Source Sans 3',  css: '"Source Sans 3","Source Sans Pro", Arial, sans-serif' },
    { label: 'Segoe UI',       css: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' },
    { label: 'SF UI (system)', css: 'system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif' },
    { label: 'Helvetica Neue', css: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
    { label: 'Ubuntu',         css: 'Ubuntu, system-ui, Arial, sans-serif' },
    { label: 'Arial',          css: 'Arial, Helvetica, sans-serif' },
    { label: 'Verdana',        css: 'Verdana, Geneva, sans-serif' },
    { label: 'Tahoma',         css: 'Tahoma, Verdana, sans-serif' },
    { label: 'Trebuchet MS',   css: '"Trebuchet MS", Tahoma, Arial, sans-serif' },

    { label: 'Times New Roman', css: '"Times New Roman", Times, serif' },
    { label: 'Georgia',         css: 'Georgia, "Times New Roman", Times, serif' },
    { label: 'Garamond',        css: 'Garamond, Georgia, serif' },
    { label: 'Merriweather',    css: 'Merriweather, Georgia, serif' },
    { label: 'PT Serif',        css: '"PT Serif", Georgia, serif' },
    { label: 'Cambria',         css: 'Cambria, Georgia, serif' },

    { label: 'JetBrains Mono',  css: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
    { label: 'Fira Code',       css: '"Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
    { label: 'Consolas',        css: 'Consolas, "Courier New", monospace' },
    { label: 'Menlo',           css: 'Menlo, Monaco, Consolas, monospace' },
    { label: 'SF Mono',         css: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, Consolas, monospace' },
    { label: 'Courier New',     css: '"Courier New", Courier, monospace' },
])
