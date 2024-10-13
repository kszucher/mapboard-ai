const COLOR_LIGHT = {
  PAGE_BACKGROUND: '#dddddd',
}

const COLOR_DARK = {
  PAGE_BACKGROUND: '#404040', //'#444444', stone 600
}

export const getColors = (colorMode: string) => (colorMode === 'light' ? COLOR_LIGHT : COLOR_DARK)
