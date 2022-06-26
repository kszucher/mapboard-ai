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
    WS_PROFILE: 'WS_PROFILE',
    WS_CREATE_MAP_IN_MAP: 'WS_CREATE_MAP_IN_MAP'
}

export const MAP_RIGHTS = {
    UNAUTHORIZED: 'unauthorized',
    VIEW: 'view',
    EDIT: 'edit',
}

const editorState = {
    authPageState: AUTH_PAGE_STATES.SIGN_IN,

    name: '',
    email: '',
    password: '',
    passwordAgain: '',
    confirmationCode: '',
    authFeedbackMessage: '',

    pageState: PAGE_STATES.AUTH,

    landingData: [],
    landingDataIndex: 0,

    colorMode: 'light',

    formatMode: '',

    undoDisabled: true,
    redoDisabled: true,

    tabMapNameList: [],
    tabMapSelected: 0,
    tabShrink: false,

    breadcrumbMapNameList: [''],

    mapId: '',
    mapSource: '',
    mapStorage: {},
    mapIdSaved: '',
    mapSourceSaved: '',
    mapStorageSaved: {},
    mapRight: MAP_RIGHTS.UNAUTHORIZED,

    node: {
        density: undefined,
        alignment: undefined,
        selection: undefined,
        lineWidth: undefined,
        lineType: undefined,
        lineColor: undefined,
        borderWidth: undefined,
        borderColor: undefined,
        fillColor: undefined,
        textFontSize: undefined,
        textColor: undefined,
        taskStatus: undefined,
    },

    frameEditorVisible: 0,
    frameLen: 0,
    frameSelected: 0,

    shareEmail: '',
    shareAccess: 'view',
    shareFeedbackMessage: '',
    shareDataExport: [],
    shareDataImport: [],

    moreMenu: false,

    interactionDisabled: false
}

const editorStateDefault = JSON.stringify(editorState);

const resolveActions = (state, action) => {
    const {payload} = action;
    const {SIGN_IN, SIGN_UP_STEP_1, SIGN_UP_STEP_2} = AUTH_PAGE_STATES;
    const {AUTH, DEMO, WS, WS_SHARES, WS_SHARING, WS_PROFILE, WS_CREATE_MAP_IN_MAP} = PAGE_STATES;
    switch (action.type) {
        case 'RESET_STATE':                 return JSON.parse(editorStateDefault)

        case 'SIGN_IN_PANEL':               return { authPageState: SIGN_IN, authFeedbackMessage: '' }
        case 'SIGN_UP_PANEL':               return { authPageState: SIGN_UP_STEP_1, name: '', email: '', password: '', passwordAgain: '', authFeedbackMessage: '' }
        case 'SIGN_UP_STEP_1_PANEL':        return { authPageState: SIGN_UP_STEP_1 }
        case 'SIGN_UP_STEP_2_PANEL':        return { authPageState: SIGN_UP_STEP_2 }

        case 'SET_NAME':                    return { name: payload }
        case 'SET_EMAIL':                   return { email: payload }
        case 'SET_PASSWORD':                return { password: payload }
        case 'SET_PASSWORD_AGAIN':          return { passwordAgain: payload }
        case 'SET_CONFIRMATION_CODE':       return { confirmationCode: payload }
        case 'SET_AUTH_FEEDBACK_MESSAGE':   return { authFeedbackMessage: payload }

        case 'SHOW_AUTH':                   return { pageState: AUTH }
        case 'SHOW_DEMO':                   return { pageState: DEMO }
        case 'SHOW_WS':                     return { pageState: WS }
        case 'SHOW_WS_SHARING':             return { pageState: WS_SHARING }
        case 'SHOW_WS_SHARES':              return { pageState: WS_SHARES }
        case 'SHOW_WS_PROFILE':             return { pageState: WS_PROFILE }
        case 'SHOW_WS_CREATE_MAP_IN_MAP':   return { pageState: WS_CREATE_MAP_IN_MAP }

        case 'SET_LANDING_DATA':            return { landingData: payload.landingData, mapRight: payload.mapRight }
        case 'PLAY_LANDING_NEXT':           return { landingDataIndex: state.landingDataIndex < state.landingData.length - 1 ? state.landingDataIndex + 1 : 0 }
        case 'PLAY_LANDING_PREV':           return { landingDataIndex: state.landingDataIndex > 1 ? state.landingDataIndex - 1 : state.landingData.length - 1 }

        case 'SET_COLOR_MODE':              return { colorMode: payload }

        case 'SET_FORMAT_MODE':             return { formatMode: payload }
        case 'CLOSE_FORMATTER':             return { formatMode: '' }

        case 'SET_UNDO_DISABLED':           return { undoDisabled: payload }
        case 'SET_REDO_DISABLED':           return { redoDisabled: payload }

        case 'SET_TAB_MAP_SELECTED':        return { tabMapSelected: payload.tabMapSelected }
        case 'TOGGLE_TAB_SHRINK':           return { tabShrink: !state.tabShrink }

        case 'SET_NODE_PARAMS':             return { node: {...state.node, ...payload} }

        case 'SET_FRAME_EDITOR_VISIBLE':    return { frameEditorVisible: payload }

        case 'SET_SHARE_EMAIL':             return { shareEmail: payload }
        case 'SET_SHARE_ACCESS':            return { shareAccess: payload }
        case 'SET_SHARE_FEEDBACK_MESSAGE':  return { shareFeedbackMessage: payload }

        case 'OPEN_MORE_MENU':              return { moreMenu: payload.currentTarget }
        case 'CLOSE_MORE_MENU':             return { moreMenu: null }

        case 'PARSE_RESP_PAYLOAD':          return {...payload }
        case 'INTERACTION_ENABLED':         return { interactionDisabled: false }
        case 'INTERACTION_DISABLED':        return { interactionDisabled: true }

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
