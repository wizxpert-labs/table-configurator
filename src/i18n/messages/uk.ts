import type {MessageTree} from '../types'

export default {
    table: {
        config: 'Налаштування таблиці',
        columns: 'Стовпчики',
        visibility: 'Керування відображенням стовпчиків',
        width: 'Ширина',
        reset: 'Скинути',
        apply: 'Застосувати',
        showInColumn: 'Вивести у стовпчику «{name}»:',
        noColumns: 'Стовпчики не знайдено',
        style: 'Стиль таблиці',
        fontSize: 'Розмір шрифту',
        fontFamilyDefault: 'Шрифт (за замовчуванням)',
        px: 'px',
    },
    header: {
        menu: {
            ariaColumnMenu: 'Меню стовпця',
            bold: 'Жирний',
            alignLeft: 'Вирівняти ліворуч',
            alignCenter: 'Вирівняти по центру',
            alignRight: 'Вирівняти праворуч',
            cellBg: 'Колір клітинок',
            textColor: 'Колір тексту',
        },
        font: {
            default: 'Шрифт (за замовчуванням)',
        },
        color: {
            clearFill: 'Без заливки',
            resetText: 'Стандартний',
        },
    },

} as MessageTree
