const COLOR_LIGHT = {
  MAIN_COLOR: '#5f0a87',
  PAGE_BACKGROUND: '#dddddd',
  BUTTON_COLOR: '#EEEAF2',
  TEXT_COLOR: '#222222',
  SELECTION_COLOR: '#666666',
  TABLE_FRAME_COLOR: '#666666',
  MOVE_LINE_COLOR: '#5f0a87',
  MOVE_RECT_COLOR: '#5f0a87',
  SELECTION_RECT_COLOR: '#5f0a87',
  TABLE_GRID: '#dddddd',

  TASK_CIRCLE_0_ON: '#eeeeee',
  TASK_CIRCLE_0_OFF: '#eeeeee',

  TASK_LINE_1: '#2c9dfc',
  TASK_FILL_1: '#d4ebfe',
  TASK_CIRCLE_1_ON: '#2c9dfc',
  TASK_CIRCLE_1_OFF: '#e9f5fe',

  TASK_LINE_2: '#d5802a',
  TASK_FILL_2: '#f6e5d4',
  TASK_CIRCLE_2_ON: '#d5802a',
  TASK_CIRCLE_2_OFF: '#faf2e9',

  TASK_LINE_3: '#25bf25',
  TASK_FILL_3: '#d3f2d3',
  TASK_CIRCLE_3_ON: '#25bf25',
  TASK_CIRCLE_3_OFF: '#e9f8e9',

  TASK_LINE: '#eeeeee',
}

const COLOR_DARK = {
  MAIN_COLOR: '#dddddd',
  PAGE_BACKGROUND: '#404040', //'#444444', stone 600
  BUTTON_COLOR: '#444444',
  TEXT_COLOR: '#dddddd',
  SELECTION_COLOR: '#aaaaaa',
  TABLE_FRAME_COLOR: '#666666',
  MOVE_LINE_COLOR: '#ffffff',
  MOVE_RECT_COLOR: '#ffffff',
  SELECTION_RECT_COLOR: '#ffffff',
  TABLE_GRID: '#666666',

  TASK_CIRCLE_0_ON: '#333333',
  TASK_CIRCLE_0_OFF: '#333333',

  TASK_LINE_1: '#1e6db0',
  TASK_FILL_1: '#1e6db0',
  TASK_CIRCLE_1_ON: '#1e6db0',
  TASK_CIRCLE_1_OFF: '#113e64',

  TASK_LINE_2: '#95591d',
  TASK_FILL_2: '#95591d',
  TASK_CIRCLE_2_ON: '#95591d',
  TASK_CIRCLE_2_OFF: '#553310',

  TASK_LINE_3: '#198519',
  TASK_FILL_3: '#198519',
  TASK_CIRCLE_3_ON: '#198519',
  TASK_CIRCLE_3_OFF: '#0e4c0e',

  TASK_LINE: '#333333',
}

export const getColors = (colorMode: string) => (colorMode === 'light' ? COLOR_LIGHT : COLOR_DARK)

export const shortcutColors = ['#222222', '#999999', '#bbbbbb', '#dddddd', '#d5802a', '#1c8e1c', '#8e1c8e', '#990000', '#000099', '#ffffff']
