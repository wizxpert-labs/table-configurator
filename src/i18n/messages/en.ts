import type {MessageTree} from '../types'

export default {
    table: {
        config: 'Table settings',
        columns: 'Columns',
        visibility: 'Column visibility',
        width: 'Width',
        reset: 'Reset',
        apply: 'Apply',
        showInColumn: 'Show in column «{name}»:',
        noColumns: 'No columns found',
        style: 'Table style',
        fontSize: 'Font size',
        fontFamilyDefault: 'Font (default)',
        px: 'px',
    },
    header: {
        menu: {
            ariaColumnMenu: 'Column menu',
            bold: 'Bold',
            alignLeft: 'Align left',
            alignCenter: 'Align center',
            alignRight: 'Align right',
            cellBg: 'Cell background color',
            textColor: 'Text color',
        },
        font: {
            default: 'Font (default)',
        },
        color: {
            clearFill: 'No fill',
            resetText: 'Default',
        },
    },
} as MessageTree
