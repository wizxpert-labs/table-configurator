
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'


import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'

import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import './custom.css'
import CodeToggle from './components/CodeToggle.vue'
import LiveWxTableDemo from './components/LiveWxTableDemo.vue'
import { WxTableConfiguratorPlugin } from '@wizxpert/table-configurator'
import {h} from "vue";
import SiteFooter from "./components/SiteFooter.vue";

const Noir = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{zinc.50}', 100: '{zinc.100}', 200: '{zinc.200}', 300: '{zinc.300}',
            400: '{zinc.400}', 500: '{zinc.500}', 600: '{zinc.600}', 700: '{zinc.700}',
            800: '{zinc.800}', 900: '{zinc.900}', 950: '{zinc.950}',
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{zinc.950}', inverseColor: '#ffffff',
                    hoverColor: '{zinc.900}', activeColor: '{zinc.800}',
                },
                highlight: {
                    background: '{zinc.950}', focusBackground: '{zinc.700}',
                    color: '#ffffff', focusColor: '#ffffff',
                },
            },
            dark: {
                primary: {
                    color: '{zinc.50}', inverseColor: '{zinc.950}',
                    hoverColor: '{zinc.100}', activeColor: '{zinc.200}',
                },
                highlight: {
                    background: 'rgba(250,250,250,.16)', focusBackground: 'rgba(250,250,250,.24)',
                    color: 'rgba(255,255,255,.87)', focusColor: 'rgba(255,255,255,.87)',
                },
            },
        },
    },
})

const theme: Theme = {
    ...DefaultTheme,

    enhanceApp({ app }) {
        app.use(WxTableConfiguratorPlugin, { locale: 'en' })
        app.use(createPinia())

        app.component('CodeToggle', CodeToggle)
        app.component('LiveWxTableDemo', LiveWxTableDemo)

        app.use(PrimeVue, {
            theme: {
                preset: Noir,
                options: { darkModeSelector: 'html.dark' },
            },
        })
    },

    Layout() {
        return h(DefaultTheme.Layout, null, {
            'doc-after': () => h(SiteFooter),
        })
    },
}

export default theme
