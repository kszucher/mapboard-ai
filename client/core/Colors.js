const COLOR_LIGHT = {
    MAP_BACKGROUND: '#fbfafc',
    TEXT_COLOR: '#222222',
    TABLE_GRID: '#dddddd',
    TASK_FILL_TODO: '#d4ebfe',
    TASK_FILL_IN_PROGRESS: '#f6e5d4',
    TASK_FILL_DONE: '#d4f6d4',
    TASK_LINE: '#eeeeee',

}

const COLOR_DARK = {
    MAP_BACKGROUND: '#222529',
    TEXT_COLOR: '#dddddd',
    TABLE_GRID: '#aaaaaa',
    TASK_FILL_TODO: '#d4ebfe',
    TASK_FILL_IN_PROGRESS: '#f6e5d4',
    TASK_FILL_DONE: '#d4f6d4',
    TASK_LINE: '#333333',

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
