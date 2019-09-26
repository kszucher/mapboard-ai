function getWinSize() {
    let body = document.getElementsByTagName('body')[0];
    return {
        x: parseInt(window.getComputedStyle(body, null).getPropertyValue("width"), 10),
        y: parseInt(window.getComputedStyle(body, null).getPropertyValue("height"), 10)
    }
}

let dim;

export function getDim() {
    return dim;
}

export function initDim() {
    let w = 1366;
    let gw = getWinSize().x;
    dim = {
        'uh': 96,
        'lw': (gw - w)/2,
        'mw': w,
        'rw': (gw - w)/2,
        'ss': 17,
    };
}