import {applyMiddleware, createStore} from "redux";
import createSagaMiddleware from 'redux-saga'
import rootSaga from "./EditorSagas";

export const AUTH_PAGE_STATES = {
    SIGN_IN: 'SIGN_IN',
    SIGN_UP_STEP_1: 'SIGN_UP_STEP_1',
    SIGN_UP_STEP_2: 'SIGN_UP_STEP_2'
}

export const PAGE_STATES = {
    EMPTY: 'EMPTY',
    DEMO: 'DEMO',
    AUTH: 'AUTH',
    WS: 'WS',
    WS_SHARES: 'WS_SHARES',
    WS_SHARING: 'WS_SHARING',
    WS_PROFILE: 'WS_PROFILE'
}

export const MAP_RIGHTS = {
    UNAUTHORIZED: 'unauthorized',
    VIEW: 'view',
    EDIT: 'edit',
}

// PHILOSOPHY
// central state lesz megtartva <-- ebbol kovetkezik minden ami ez alatt van !!!
// kozvetlenul ide reducer-elodik be a BE reply
// emiatt az AUTH és a SHARING flow-t ide be kell mozgatni, ami mint state ua-zon a useEffect-en frissíti a local state-et
// továbbá, lokálisan egy reducer-t kell majd ehelyett használni
const editorState = {
    // auth
    authPageState: AUTH_PAGE_STATES.SIGN_IN,
    name: '',
    email: '',
    password: '',
    passwordAgain: '',
    confirmationCode: '',
    feedbackMessage: '',
    //
    pageState: PAGE_STATES.AUTH,
    landingData: [],
    landingDataIndex: 0,
    breadcrumbMapNameList: [''],
    tabMapNameList: [],
    tabMapSelected: 0,
    formatMode: '',
    colorLine: '',
    colorBorder: '',
    colorFill: '',
    colorText: '',
    paletteVisible: 0,
    frameEditorVisible: 0,
    // map
    mapId: '',
    mapSource: '',
    mapStorage: {},
    mapRight: MAP_RIGHTS.UNAUTHORIZED,
    // frame
    frameLen: 0,
    frameSelected: 0,
    // share
    shareDataExport: [],
    shareDataImport: [],
    //
    profileName: '',
};

const editorStateDefault = JSON.stringify(editorState);

const mapValues = (stringArray, valueArray, conditionValue) => {
    return stringArray[valueArray.findIndex(v=>v===conditionValue)]
}

const extractNodeProps = (payload) => {
    let lm = payload;
    return {
        lineWidth:   mapValues(['w1', 'w2', 'w3'],            [1, 2, 3],            lm.lineWidth),
        lineType:    mapValues(['bezier', 'edge'],            [1, 3],               lm.lineType),
        borderWidth: mapValues(['w1', 'w2', 'w3'],            [1, 2, 3],            lm.selection === 's' ? lm.ellipseNodeBorderWidth : lm.ellipseBranchBorderWidth),
        fontSize:    mapValues(['h1', 'h2', 'h3', 'h4', 't'], [36, 24, 18, 16, 14], lm.sTextFontSize),
        colorLine:   lm.lineColor,
        colorBorder: lm.selection === 's' ? lm.ellipseNodeBorderColor : lm.ellipseBranchBorderColor,
        colorFill:   lm.selection === 's'? lm.ellipseNodeFillColor : lm.ellipseBranchFillColor,
        colorText:   lm.sTextColor,
    }
}

const resolveActions = (state, action) => {
    const {payload} = action;
    const {SIGN_IN, SIGN_UP_STEP_1, SIGN_UP_STEP_2} = AUTH_PAGE_STATES;
    const {AUTH, DEMO, WS, WS_SHARES, WS_SHARING, WS_PROFILE} = PAGE_STATES;
    switch (action.type) {
        case 'RESET_STATE':               return JSON.parse(editorStateDefault)
        case 'SHOW_AUTH':                 return {pageState: AUTH}
        case 'SHOW_DEMO':                 return {pageState: DEMO}
        case 'SHOW_WS':                   return {pageState: WS}
        case 'SHOW_WS_SHARING':           return {pageState: WS_SHARING}
        case 'SHOW_WS_SHARES':            return {pageState: WS_SHARES}
        case 'SHOW_WS_PROFILE':           return {pageState: WS_PROFILE}
        case 'OPEN_PALETTE':              return {formatMode: payload, paletteVisible: 1}
        case 'CLOSE_PALETTE':             return {formatMode: '', paletteVisible: 0, }
        case 'OPEN_PLAYBACK_EDITOR':      return {frameEditorVisible: 1}
        case 'CLOSE_PLAYBACK_EDITOR':     return {frameEditorVisible: 0}
        case 'SET_LANDING_DATA':          return {landingData: payload.landingData, mapRight: payload.mapRight}
        case 'SET_TAB_MAP_SELECTED':      return {tabMapSelected: payload.tabMapSelected}
        case 'PLAY_LANDING_NEXT':         return {landingDataIndex: state.landingDataIndex < state.landingData.length - 1 ? state.landingDataIndex + 1 : 0}
        case 'PLAY_LANDING_PREV':         return {landingDataIndex: state.landingDataIndex > 1 ? state.landingDataIndex - 1 : state.landingData.length - 1}
        case 'SET_NODE_PROPS':            return extractNodeProps(payload)
        case 'SET_PROFILE_NAME':          return {profileName: payload}
        case 'SET_AUTH_PAGE_STATE':       return {authPageState: payload}
        case 'SIGN_IN_PANEL':             return {}
        case 'SIGN_UP_PANEL':             return {authPageState: SIGN_UP_STEP_1, name: '', email: '', password: '', passwordAgain: ''}
        case 'PARSE_RESP_PAYLOAD':        return {...payload}
        default: return {}
    }
}

const editorReducer = (state, action) => {
    return {...state, ...resolveActions(state, action) };
};

const sagaMiddleware = createSagaMiddleware()

export const store = createStore(
    editorReducer,
    editorState,
    applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga)
