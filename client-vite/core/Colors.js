const COLOR_LIGHT = {
    MAP_BACKGROUND: '#fbfafc',
    TEXT_COLOR: '#222222',
    TABLE_GRID: '#dddddd',

    TASK_CIRCLE_0_ACTIVE: '#eeeeee',
    TASK_CIRCLE_0_INACTIVE: '#eeeeee',

    TASK_LINE_1: '#2c9dfc',
    TASK_FILL_1: '#d4ebfe',
    TASK_CIRCLE_1_ACTIVE: '#2c9dfc',
    TASK_CIRCLE_1_INACTIVE: '#e9f5fe',

    TASK_LINE_2: '#d5802a',
    TASK_FILL_2: '#f6e5d4',
    TASK_CIRCLE_2_ACTIVE: '#d5802a',
    TASK_CIRCLE_2_INACTIVE: '#faf2e9',

    TASK_LINE_3: '#25bf25',
    TASK_FILL_3: '#d3f2d3',
    TASK_CIRCLE_3_ACTIVE: '#25bf25',
    TASK_CIRCLE_3_INACTIVE: '#e9f8e9',

    TASK_LINE: '#eeeeee',
}

const COLOR_DARK = {
    MAP_BACKGROUND: '#222529',
    TEXT_COLOR: '#dddddd',
    TABLE_GRID: '#aaaaaa',

    TASK_CIRCLE_0_ACTIVE: '#333333',
    TASK_CIRCLE_0_INACTIVE: '#333333',

    TASK_LINE_1: '#1e6db0',
    TASK_FILL_1: '#1e6db0',
    TASK_CIRCLE_1_ACTIVE: '#1e6db0',
    TASK_CIRCLE_1_INACTIVE: '#113e64',

    TASK_LINE_2: '#95591d',
    TASK_FILL_2: '#95591d',
    TASK_CIRCLE_2_ACTIVE: '#95591d',
    TASK_CIRCLE_2_INACTIVE: '#553310',

    TASK_LINE_3: '#198519',
    TASK_FILL_3: '#198519',
    TASK_CIRCLE_3_ACTIVE: '#198519',
    TASK_CIRCLE_3_INACTIVE: '#0e4c0e',

    TASK_LINE: '#555555',
}

export const getColors = colorMode => (colorMode === 'light' ? COLOR_LIGHT : COLOR_DARK)

export var element = document.body
// element.classList.toggle("dark-mode");
// element.style.backgroundColor = '#000000'
