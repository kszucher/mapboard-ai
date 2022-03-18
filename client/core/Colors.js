const COLOR_LIGHT = {
    MAP_BACKGROUND: '#fbfafc',
    TEXT_COLOR: '#222222',
    TABLE_GRID: '#dddddd',

    TASK_LINE_0: '#bbbbbb',
    TASK_LINE_1: '#2c9dfc',
    TASK_LINE_2: '#d5802a',
    TASK_LINE_3: '#25bf25',
    TASK_FILL_1: '#d4ebfe',
    TASK_FILL_2: '#f6e5d4',
    TASK_FILL_3: '#d4f6d4',
    TASK_CIRCLE_0_ACTIVE: '#eeeeee',
    TASK_CIRCLE_1_ACTIVE: '#2c9dfc',
    TASK_CIRCLE_2_ACTIVE: '#d5802a',
    TASK_CIRCLE_3_ACTIVE: '#25bf25',
    TASK_CIRCLE_0_INACTIVE: '#eeeeee',
    TASK_CIRCLE_1_INACTIVE: '#e5f3fe',
    TASK_CIRCLE_2_INACTIVE: '#f6e5d4',
    TASK_CIRCLE_3_INACTIVE: '#e5f9e5',
    TASK_LINE: '#eeeeee',
}

const COLOR_DARK = {
    MAP_BACKGROUND: '#222529',
    TEXT_COLOR: '#dddddd',
    TABLE_GRID: '#aaaaaa',
    // TODO define
    TASK_LINE_0: '#bbbbbb',
    TASK_LINE_1: '#2c9dfc',
    TASK_LINE_2: '#d5802a',
    TASK_LINE_3: '#25bf25',
    TASK_FILL_1: '#d4ebfe',
    TASK_FILL_2: '#f6e5d4',
    TASK_FILL_3: '#d4f6d4',
    TASK_CIRCLE_0_ACTIVE: '#eeeeee',
    TASK_CIRCLE_1_ACTIVE: '#2c9dfc',
    TASK_CIRCLE_2_ACTIVE: '#d5802a',
    TASK_CIRCLE_3_ACTIVE: '#25bf25',
    TASK_CIRCLE_0_INACTIVE: '#eeeeee',
    TASK_CIRCLE_1_INACTIVE: '#e5f3fe',
    TASK_CIRCLE_2_INACTIVE: '#f6e5d4',
    TASK_CIRCLE_3_INACTIVE: '#e5f9e5',
    TASK_LINE: '#eeeeee',
}

export const getColors = (colorMode) => {
    if (colorMode === 'light') {
        return COLOR_LIGHT
    } else if (colorMode === 'dark') {
        return COLOR_DARK
    }
}

export var element = document.body
// element.classList.toggle("dark-mode");
// element.style.backgroundColor = '#000000'
