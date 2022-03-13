let colorMode = 'dark'
export const getColorMode = _ => colorMode
export var element = document.body

const COLOR_DARK = {
    MAP_BACKGROUND: '#222529',
}

const COLOR_LIGHT = {
    MAP_BACKGROUND: '#fbfafc',
}

const getColors = (colorMode) => {
    if (colorMode === 'light') {
        return COLOR_LIGHT
    } else if (colorMode === 'dark') {
        return COLOR_DARK
    }
}
export const COLORS = getColors(colorMode)


// element.classList.toggle("dark-mode");

// element.style.backgroundColor = '#000000'

