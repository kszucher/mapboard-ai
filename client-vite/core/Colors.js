const COLOR_LIGHT = {
    MAIN_COLOR: '#5f0a87',
    PAGE_BACKGROUND: '#dddddd',
    MAP_BACKGROUND: '#fbfafc',
    BUTTON_BG: '#EEEAF2',
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
    MAIN_COLOR: '#dddddd',
    PAGE_BACKGROUND: '#333333',
    MAP_BACKGROUND: '#222529',
    BUTTON_BG: '#444444',
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

export const colorList = [
    ['#D3EBCE', '#ECFDDF', '#FDFFEB', '#FFECD6', '#FED3D0', '#FED3D0'],
    ['#EFEFEF', '#DEDEE8', '#F3F0E0', '#E4EADE', '#DCE5E6', '#DCE5E6'],
    ['#9086A6', '#E0C1D2', '#EFF0ED', '#9DD4C9', '#75A3BA', '#75A3BA'],
    ['#A0D7D9', '#FBE7A3', '#F4CBA1', '#F8FDDF', '#AE99BF', '#AE99BF'],
    ['#1C5D6C', '#70A18F', '#B7CFAE', '#EDDDCF', '#B25C6D', '#B25C6D'],
    ['#B2CFC9', '#95BABD', '#9292B0', '#F6A7A7', '#FFD6C9', '#FFD6C9'],
    ['#04A4B5', '#30BFBF', '#56D3CB', '#EEEE99', '#EBD295', '#fafafa'],
    ['#285588', '#E36273', '#FCC40F', '#ECE7C7', '#A8875E', '#347ab7'],
    ['#605E85', '#6CCC86', '#F7D36F', '#FD7780', '#994D80', '#aa0011'],
    ['#B4C2D6', '#BFE3DA', '#F5FCDC', '#FEFFF7', '#C0DDBE', '#f2dede'],
    ['#FFD6DE', '#E8CEE3', '#C7BAE1', '#BBD3EC', '#ECE4C5', '#82c5e2'],
    ['#391F19', '#B68E63', '#F2DFA9', '#E58119', '#746839', '#09415A'],
]
