import {defineConfig} from 'vitepress'


const SIDEBAR = [
    {
        text: 'Getting Started',
        items: [
            {text: 'Overview', link: '/getting-started'},
            {text: 'Requirements', link: '/getting-started#requirements'},
            {text: 'Installation', link: '/getting-started#installation'},
            {text: 'Minimal setup (main.ts)', link: '/getting-started#minimal-setup-main-ts'},
            {text: 'Try a demo project', link: '/getting-started#option-2-try-a-demo-project'},
            {text: 'Embed the source in your app (fully customizable)', link: '/getting-started#option-3-embed-the-source-in-your-app-fully-customizable'},
        ]
    },
    {
        text: 'Guide',
        items: [
            {text: 'Basic Concepts', link: '/guide/basic-concepts'},
            {text: 'Control Panel', link: '/guide/guide-control-panel'},
            {text: 'Header (menu)', link: '/guide/guide-header'},
            {text: 'In Cell Sub-Fields', link: '/guide/guide-in-cell-sub-fields'},
            {text: 'Initial View & Defaults', link: '/guide/initial-state'},
            {text: 'Initial Setup', link: '/guide/initial-setup'},
        ]
    },
    {
        text: 'API Reference',
        items: [
            {text: 'WxTableConfigurator', link: '/api/WxTableConfigurator'},
            {text: 'WxTableControlPanel', link: '/api/WxTableControlPanel'},
            {text: 'WxTableHeader', link: '/api/WxTableHeader'},
            {text: 'WxTableCell', link: '/api/WxTableCell'}
        ]
    },
    {
        text: 'Live Example',
        items: [{ text: 'Playground', link: '/guide/live' }]
    }
]

export default defineConfig({
    title: 'Table Configurator',
    description: 'Vue 3 toolkit for PrimeVue (required) — columns visibility & order, px-only widths, column-level styles, and toggleable in-cell sub-fields.',
    lang: 'en-US',
    lastUpdated: true,
    base: '/',
    markdown: {
        theme: {
            light: 'github-light',
            dark: 'github-dark'
        }
    },
    themeConfig: {
        logo: '/assets/logo.svg',
        siteTitle: 'Table Configurator',
        outline: [2, 3],
        nav: [
            {text: 'Getting Started', link: '/getting-started'},
            {text: 'Guide', link: '/guide/basic-concepts'},
            {text: 'API', link: '/api/WxTableConfigurator'},
            {text: 'GitHub', link: `https://github.com/wizxpert-labs/table-configurator`},
            {text: 'npm', link: 'https://www.npmjs.com/package/@wizxpert/table-configurator'}
        ],
        sidebar: SIDEBAR,
        socialLinks: [
            {icon: 'github', link: `https://github.com/wizxpert-labs/table-configurator`}
        ],
        footer: {
            message: 'MIT OR Apache-2.0 Licensed',
            copyright: '© 2025 Valerii Kuznetsov · WizXpert'
        }
    }
})
