import {createApp} from 'vue'
import {createPinia} from 'pinia'

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

import App from './App.vue'
import {WxTableConfiguratorPlugin} from '@wizxpert/table-configurator'

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: "none",
        },
    },
    ripple: true,
});

app.use(WxTableConfiguratorPlugin, {
    locale: 'uk',
    //warmup: false
})


app.use(createPinia())
app.mount('#app')

