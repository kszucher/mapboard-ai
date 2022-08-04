import {applyMiddleware, createStore} from "redux";
import createSagaMiddleware from 'redux-saga'
import rootSaga from "./EditorSagas";

export enum FormatMode {
    text, border, fill, line
}

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
    WS_PROFILE: 'WS_PROFILE',
    WS_SETTINGS: 'WS_SETTINGS',
    WS_SHARES: 'WS_SHARES',
    WS_CREATE_TABLE: 'WS_CREATE_TABLE',
    WS_CREATE_TASK: 'WS_CREATE_TASK',
    WS_CREATE_MAP_IN_MAP: 'WS_CREATE_MAP_IN_MAP',
    WS_SHARE_THIS_MAP: 'WS_SHARE_THIS_MAP',
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

    colorMode: 'dark',

    formatMode: FormatMode.text,

    undoDisabled: true,
    redoDisabled: true,

    tabMapIdList: [],
    tabMapNameList: [],
    breadcrumbMapIdList: [],
    breadcrumbMapNameList: [''],

    tabShrink: false,

    mapId: '',
    mapSource: '',
    mapData: {},
    frameLen: 0,
    frameSelected: 0,
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
    nodeTriggersMap: false,

    formatterVisible: false,
    frameEditorVisible: false,

    shareEmail: '',
    shareAccess: 'view',
    shareFeedbackMessage: '',
    shareDataExport: [],
    shareDataImport: [],

    moreMenu: false,

    interactionDisabled: false
}

const editorStateDefault = JSON.stringify(editorState);

const resolveActions = (state: any, action: any) => {
    const {payload} = action;
    const {SIGN_IN, SIGN_UP_STEP_1, SIGN_UP_STEP_2} = AUTH_PAGE_STATES;
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

        case 'SHOW_AUTH':                   return { pageState: PAGE_STATES.AUTH }
        case 'SHOW_DEMO':                   return { pageState: PAGE_STATES.DEMO }
        case 'SHOW_WS':                     return { pageState: PAGE_STATES.WS }
        case 'SHOW_WS_PROFILE':             return { pageState: PAGE_STATES.WS_PROFILE }
        case 'SHOW_WS_SETTINGS':            return { pageState: PAGE_STATES.WS_SETTINGS }
        case 'SHOW_WS_SHARES':              return { pageState: PAGE_STATES.WS_SHARES }
        case 'SHOW_WS_CREATE_TABLE':        return { pageState: PAGE_STATES.WS_CREATE_TABLE }
        case 'SHOW_WS_CREATE_TASK':         return { pageState: PAGE_STATES.WS_CREATE_TASK }
        case 'SHOW_WS_CREATE_MAP_IN_MAP':   return { pageState: PAGE_STATES.WS_CREATE_MAP_IN_MAP }
        case 'SHOW_WS_SHARE_THIS_MAP':             return { pageState: PAGE_STATES.WS_SHARE_THIS_MAP }

        case 'SET_LANDING_DATA':            return { landingData: payload.landingData, mapRight: payload.mapRight }
        case 'PLAY_LANDING_NEXT':           return { landingDataIndex: state.landingDataIndex < state.landingData.length - 1 ? state.landingDataIndex + 1 : 0 }
        case 'PLAY_LANDING_PREV':           return { landingDataIndex: state.landingDataIndex > 1 ? state.landingDataIndex - 1 : state.landingData.length - 1 }

        case 'SET_COLOR_MODE':              return { colorMode: payload }

        case 'SET_FORMAT_MODE':             return { formatMode: payload }
        case 'SET_FORMATTER_VISIBLE':       return { formatterVisible: payload }

        case 'SET_UNDO_DISABLED':           return { undoDisabled: payload }
        case 'SET_REDO_DISABLED':           return { redoDisabled: payload }

        case 'TOGGLE_TAB_SHRINK':           return { tabShrink: !state.tabShrink }

        case 'SET_NODE_PARAMS':             return { node: {...state.node, ...payload.node}, nodeTriggersMap: payload.nodeTriggersMap }

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

const editorReducer = (state: any, action: any) => {
    return {...state, ...resolveActions(state, action) };
};

const sagaMiddleware = createSagaMiddleware()

export const store = createStore(
    editorReducer,
    editorState,
    applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga)
