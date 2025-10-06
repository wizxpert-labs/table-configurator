export function mergePrimeEvents(opts: {
    tableVNodeProps: Record<string, any> | undefined
    measureTick: () => Promise<void>
    persistAllVisiblePxFromDOM: () => number
    persistScrollWidthPxFromDOM: () => void
    store: any
    storageKey: string
    emit: (e: 'column-resize-end', payload: any) => void
}) {
    const userResizeEnd = (opts.tableVNodeProps as any)?.onColumnResizeEnd
    const userColumnReorder = (opts.tableVNodeProps as any)?.onColumnReorder

    const mergedProps: Record<string, any> = {
        ...opts.tableVNodeProps,
        resizableColumns: true,
        'resizable-columns': true,
        columnResizeMode: 'expand',
        scrollable:true,
        'column-resize-mode': 'expand',
        onColumnResizeEnd: async (e: any) => {
            try {
                userResizeEnd?.(e)
            } finally {
                await opts.measureTick()
                const sumPx = opts.persistAllVisiblePxFromDOM()
                if (sumPx > 0) opts.store.setTableStyle(opts.storageKey, { scrollWidthPx: sumPx })
                opts.persistScrollWidthPxFromDOM()
                opts.emit('column-resize-end', e)
            }
        },
        onColumnReorder: (e: any) => {
            userColumnReorder?.(e)
        }
    }

    return mergedProps
}
