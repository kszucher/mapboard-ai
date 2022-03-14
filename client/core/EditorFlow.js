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

const editorState = {
    // auth
    authPageState: AUTH_PAGE_STATES.SIGN_IN,
    name: '',
    email: '',
    password: '',
    passwordAgain: '',
    confirmationCode: '',
    authFeedbackMessage: '',
    //
    pageState: PAGE_STATES.AUTH,
    paletteVisible: 0,
    frameEditorVisible: 0,
    //
    landingData: [],
    landingDataIndex: 0,
    // breadcrumbs
    breadcrumbMapNameList: [''],
    // tabs
    tabMapNameList: [],
    tabMapSelected: 0,
    //
    formatMode: '',
    // map
    mapId: '',
    mapSource: '',
    mapStorage: {},
    mapRight: MAP_RIGHTS.UNAUTHORIZED,
    // node
    node: {
        density: undefined,
        alignment: undefined,
        lineWidth: undefined,
        lineType: undefined,
        borderWidth: undefined,
        textFontSize: undefined,
        lineColor: undefined,
        borderColor: undefined,
        fillColor: undefined,
        textColor: undefined,
    },
    // frame
    frameLen: 0,
    frameSelected: 0,
    // share
    shareEmail: '',
    shareAccess: 'view',
    shareFeedbackMessage: '',
    shareDataExport: [],
    shareDataImport: [],
    // undo redo
    undoDisabled: true,
    redoDisabled: true,
};

const editorStateDefault = JSON.stringify(editorState);

const resolveActions = (state, action) => {
    const {payload} = action;
    const {SIGN_IN, SIGN_UP_STEP_1, SIGN_UP_STEP_2} = AUTH_PAGE_STATES;
    const {AUTH, DEMO, WS, WS_SHARES, WS_SHARING, WS_PROFILE} = PAGE_STATES;
    switch (action.type) {
        case 'RESET_STATE':                 return JSON.parse(editorStateDefault)
        case 'SHOW_AUTH':                   return {pageState: AUTH}
        case 'SHOW_DEMO':                   return {pageState: DEMO}
        case 'SHOW_WS':                     return {pageState: WS}
        case 'SHOW_WS_SHARING':             return {pageState: WS_SHARING}
        case 'SHOW_WS_SHARES':              return {pageState: WS_SHARES}
        case 'SHOW_WS_PROFILE':             return {pageState: WS_PROFILE}
        case 'OPEN_PALETTE':                return {formatMode: payload, paletteVisible: 1}
        case 'CLOSE_PALETTE':               return {formatMode: '', paletteVisible: 0, }
        case 'OPEN_PLAYBACK_EDITOR':        return {frameEditorVisible: 1}
        case 'CLOSE_PLAYBACK_EDITOR':       return {frameEditorVisible: 0}
        case 'SET_LANDING_DATA':            return {landingData: payload.landingData, mapRight: payload.mapRight}
        case 'SET_TAB_MAP_SELECTED':        return {tabMapSelected: payload.tabMapSelected}
        case 'PLAY_LANDING_NEXT':           return {landingDataIndex: state.landingDataIndex < state.landingData.length - 1 ? state.landingDataIndex + 1 : 0}
        case 'PLAY_LANDING_PREV':           return {landingDataIndex: state.landingDataIndex > 1 ? state.landingDataIndex - 1 : state.landingData.length - 1}
        // AUTH
        case 'SET_NAME':                    return {name: payload}
        case 'SET_EMAIL':                   return {email: payload}
        case 'SET_PASSWORD':                return {password: payload}
        case 'SET_PASSWORD_AGAIN':          return {passwordAgain: payload}
        case 'SET_CONFIRMATION_CODE':       return {confirmationCode: payload}
        case 'SET_AUTH_FEEDBACK_MESSAGE':   return {authFeedbackMessage: payload}
        case 'SIGN_IN_PANEL':               return {authPageState: SIGN_IN, authFeedbackMessage: ''}
        case 'SIGN_UP_PANEL':               return {authPageState: SIGN_UP_STEP_1, name: '', email: '', password: '', passwordAgain: '', authFeedbackMessage: ''}
        case 'SIGN_UP_STEP_1_PANEL':        return {authPageState: SIGN_UP_STEP_1}
        case 'SIGN_UP_STEP_2_PANEL':        return {authPageState: SIGN_UP_STEP_2}
        // SHARE
        case 'SET_SHARE_EMAIL':             return {shareEmail: payload}
        case 'SET_SHARE_ACCESS':            return {shareAccess: payload}
        case 'SET_SHARE_FEEDBACK_MESSAGE':  return {shareFeedbackMessage: payload}
        // UNDO REDO
        case 'SET_UNDO_DISABLED':           return {undoDisabled: payload}
        case 'SET_REDO_DISABLED':           return {redoDisabled: payload}
        //
        case 'SET_NODE_PARAMS':             return {node: {...state.node, ...payload}}
        //
        case 'PARSE_RESP_PAYLOAD':          return {...payload}
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
