import {defineComponent, h, nextTick, onMounted} from 'vue'
import Button from 'primevue/button'
import Popover from 'primevue/popover'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import ToggleSwitch from 'primevue/toggleswitch'
import Checkbox from 'primevue/checkbox'

export default defineComponent({
    name: 'PrimeVueStyleWarmup',
    setup() {
        onMounted(async () => {
            await nextTick()
            const mount = document.getElementById('pv-style-warmup')
            if (mount) mount.remove()
        })

        return () =>
            h(
                'div',
                {
                    id: 'pv-style-warmup',
                    style:
                        'position:absolute;left:-100000px;top:-100000px;pointer-events:none;opacity:0;'
                },
                [
                    h(Button as any, {label: 'warm'}),
                    h(Popover as any, null, {default: () => 'warm'}),
                    h(Select as any, {options: [{label: 'A', value: 'a'}], modelValue: null}),
                    h(InputNumber as any, {modelValue: null}),
                    h(ToggleSwitch as any, {
                        modelValue: false,
                        'onUpdate:modelValue': () => {
                        }
                    }),
                    h(Checkbox as any, {
                        binary: true,
                        modelValue: true,
                        'onUpdate:modelValue': () => {
                        }
                    })
                ]
            )
    }
})
