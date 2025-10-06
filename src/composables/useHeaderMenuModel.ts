import { computed } from 'vue'

export function useHeaderMenuModel(opts: {
    getTitle: () => string
    getBold: () => boolean
    toggleBold: () => void
    setAlign: (v: 'left' | 'center' | 'right') => void
    pickColor: (hex: string) => void
    clearColor: () => void
    pickTextColor: (hex: string) => void
    clearTextColor: () => void
}) {
    return computed(() => ([
        { label: opts.getTitle(), class: 'text-xs opacity-60 pointer-events-none', disabled: true },
        { separator: true },
        {
            label: opts.getBold() ? 'Вимкнути жирний текст' : 'Увімкнути жирний текст',
            isBold: true,
            command: () => opts.toggleBold(),
        },
        { separator: true },
        {
            label: 'Вирівнювання',
            icon: 'pi pi-align-left',
            items: [
                { label: 'Ліворуч',   icon: 'pi pi-align-left',   command: () => opts.setAlign('left') },
                { label: 'По центру', icon: 'pi pi-align-center', command: () => opts.setAlign('center') },
                { label: 'Праворуч',  icon: 'pi pi-align-right',  command: () => opts.setAlign('right') },
            ],
        },
        { separator: true },
            {
                label: 'Колір клітинок',
                icon: 'pi pi-palette',
                items: [
                    { type: 'colorGridBg' },
                    { separator: true },
                    { label: 'Без заливки', icon: 'pi pi-times', command: () => opts.clearColor() },
                ],
            },
        { separator: true },
        { type: 'colorTextSingle' },
    ]))
}
