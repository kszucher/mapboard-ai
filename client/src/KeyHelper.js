class KeyHelper {
    constructor() {
        this.lut = {
            VK_CANCEL:              {'value': 3},
            VK_HELP:                {'value': 6},
            VK_BACK_SPACE:          {'value': 8},
            VK_TAB:                 {'value': 9},
            VK_CLEAR:               {'value': 12},
            VK_RETURN:              {'value': 13},
            VK_ENTER:               {'value': 14},
            VK_SHIFT:               {'value': 16},
            VK_CONTROL:             {'value': 17},
            VK_ALT:                 {'value': 18},
            VK_PAUSE:               {'value': 19},
            VK_CAPS_LOCK:           {'value': 20},
            VK_ESCAPE:              {'value': 27},
            VK_SPACE:               {'value': 32},
            VK_PAGE_UP:             {'value': 33},
            VK_PAGE_DOWN:           {'value': 34},
            VK_END:                 {'value': 35},
            VK_HOME:                {'value': 36},
            VK_LEFT:                {'value': 37},
            VK_UP:                  {'value': 38},
            VK_RIGHT:               {'value': 39},
            VK_DOWN:                {'value': 40},
            VK_PRINTSCREEN:         {'value': 44},
            VK_INSERT:              {'value': 45},
            VK_DELETE:              {'value': 46},
            VK_0:                   {'value': 48},
            VK_1:                   {'value': 49},
            VK_2:                   {'value': 50},
            VK_3:                   {'value': 51},
            VK_4:                   {'value': 52},
            VK_5:                   {'value': 53},
            VK_6:                   {'value': 54},
            VK_7:                   {'value': 55},
            VK_8:                   {'value': 56},
            VK_9:                   {'value': 57},
            VK_SEMICOLON:           {'value': 59},
            VK_EQUALS:              {'value': 61},
            VK_A:                   {'value': 65},
            VK_B:                   {'value': 66},
            VK_C:                   {'value': 67},
            VK_D:                   {'value': 68},
            VK_E:                   {'value': 69},
            VK_F:                   {'value': 70},
            VK_G:                   {'value': 71},
            VK_H:                   {'value': 72},
            VK_I:                   {'value': 73},
            VK_J:                   {'value': 74},
            VK_K:                   {'value': 75},
            VK_L:                   {'value': 76},
            VK_M:                   {'value': 77},
            VK_N:                   {'value': 78},
            VK_O:                   {'value': 79},
            VK_P:                   {'value': 80},
            VK_Q:                   {'value': 81},
            VK_R:                   {'value': 82},
            VK_S:                   {'value': 83},
            VK_T:                   {'value': 84},
            VK_U:                   {'value': 85},
            VK_V:                   {'value': 86},
            VK_W:                   {'value': 87},
            VK_X:                   {'value': 88},
            VK_Y:                   {'value': 89},
            VK_Z:                   {'value': 90},
            VK_CONTEXT_MENU:        {'value': 93},
            VK_NUMPAD0:             {'value': 96},
            VK_NUMPAD1:             {'value': 97},
            VK_NUMPAD2:             {'value': 98},
            VK_NUMPAD3:             {'value': 99},
            VK_NUMPAD4:             {'value': 100},
            VK_NUMPAD5:             {'value': 101},
            VK_NUMPAD6:             {'value': 102},
            VK_NUMPAD7:             {'value': 103},
            VK_NUMPAD8:             {'value': 104},
            VK_NUMPAD9:             {'value': 105},
            VK_MULTIPLY:            {'value': 106},
            VK_ADD:                 {'value': 107},
            VK_SEPARATOR:           {'value': 108},
            VK_SUBTRACT:            {'value': 109},
            VK_DECIMAL:             {'value': 110},
            VK_DIVIDE:              {'value': 111},
            VK_F1:                  {'value': 112},
            VK_F2:                  {'value': 113},
            VK_F3:                  {'value': 114},
            VK_F4:                  {'value': 115},
            VK_F5:                  {'value': 116},
            VK_F6:                  {'value': 117},
            VK_F7:                  {'value': 118},
            VK_F8:                  {'value': 119},
            VK_F9:                  {'value': 120},
            VK_F10:                 {'value': 121},
            VK_F11:                 {'value': 122},
            VK_F12:                 {'value': 123},
            VK_F13:                 {'value': 124},
            VK_F14:                 {'value': 125},
            VK_F15:                 {'value': 126},
            VK_F16:                 {'value': 127},
            VK_F17:                 {'value': 128},
            VK_F18:                 {'value': 129},
            VK_F19:                 {'value': 130},
            VK_F20:                 {'value': 131},
            VK_F21:                 {'value': 132},
            VK_F22:                 {'value': 133},
            VK_F23:                 {'value': 134},
            VK_F24:                 {'value': 135},
            VK_NUM_LOCK:            {'value': 144},
            VK_SCROLL_LOCK:         {'value': 145},
            VK_COMMA:               {'value': 188},
            VK_PERIOD:              {'value': 190},
            VK_SLASH:               {'value': 191},
            VK_BACK_QUOTE:          {'value': 192},
            VK_OPEN_BRACKET:        {'value': 219},
            VK_BACK_SLASH:          {'value': 220},
            VK_CLOSE_BRACKET:       {'value': 221},
            VK_QUOTE:               {'value': 222},
            VK_META:                {'value': 224}
        };
        this.init();
    }

    init() {
        let keyLutFields = Object.keys(this.lut);
        for (let i = 0; i < keyLutFields.length; i++) {
            this.lut[keyLutFields[i]].status = false;
        }
    }

    getKey(keyCode) {
        let retVal = '';
        let keyLutFields = Object.keys(this.lut);
        for (let i = 0; i < keyLutFields.length; i++) {
            let currKey = this.lut[keyLutFields[i]];
            if (currKey.value === keyCode)
                retVal = keyLutFields[i];
        }
        return retVal;
    }
}

export let keyHelper = new KeyHelper();
