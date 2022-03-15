const COLOR_DARK = {
    MAP_BACKGROUND: '#222529',
    TEXT_COLOR: '#dddddd'
}

const COLOR_LIGHT = {
    MAP_BACKGROUND: '#fbfafc',
    TEXT_COLOR: '#222222'
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
