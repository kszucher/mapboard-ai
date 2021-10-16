import {mapref, mapState, saveMap} from "./MapFlow";
import {selectionState} from "./SelectionFlow";

export const PAGE_STATES = {
    EMPTY: 'EMPTY',
    DEMO: 'DEMO',
    AUTH: 'AUTH',
    WS_EDIT: 'WS_EDIT',
    WS_VIEW: 'WS_VIEW',
    WS_SHARES: 'WS_SHARES',
    WS_SHARING: 'WS_SHARING'
}

export const MAP_RIGHTS = {
    UNAUTHORIZED: 'unauthorized',
    VIEW: 'view',
    EDIT: 'edit',
}

export const editorState = {
    pageState: PAGE_STATES.AUTH,
    landingData: [],
    landingDataIndex: 0,
    breadcrumbMapNameList: [''],
    tabMapNameList: [],
    tabMapSelected: 0,
    serverAction: {serverCmd: 'ping'},
    serverActionCntr: 0,
    serverResponse: {},
    serverResponseCntr: 0,
    serverResponseToUser: [''],
    formatMode: '',
    colorLine: '',
    colorBorder: '',
    colorFill: '',
    colorText: '',
    paletteVisible: 0,
    frameEditorVisible: 0,
    isPlayback: false,
    // map
    mapRight: MAP_RIGHTS.UNAUTHORIZED,
    // frame
    frameLen: 0,
    frameSelected: 0,
    // share
    shareDataExport: [],
    shareDataImport: [],
};

const editorStateDefault = JSON.stringify(editorState);

const resolvePageState = (mapRight) => {
    const {UNAUTHORIZED, VIEW, EDIT} = MAP_RIGHTS;
    const {WS_UNAUTHORIZED, WS_VIEW, WS_EDIT} = PAGE_STATES;
    switch (mapRight) {
        case UNAUTHORIZED: return WS_UNAUTHORIZED;
        case VIEW: return WS_VIEW;
        case EDIT: return WS_EDIT;
    }
}

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

const resolveProps = (state, action) => {
    const {payload} = action;
    const {AUTH, DEMO, WS_EDIT, WS_VIEW, WS_SHARES, WS_SHARING} = PAGE_STATES;
    const {EDIT, VIEW} = MAP_RIGHTS;
    switch (action.type) {
        case 'RESET_STATE':               return JSON.parse(editorStateDefault)
        case 'SERVER_RESPONSE':           return {serverResponseCntr: state.serverResponseCntr + 1, serverResponse: payload}
        case 'SERVER_RESPONSE_TO_USER':   return {serverResponseToUser: [...state.serverResponseToUser, payload]}
        case 'SHOW_AUTH':                 return {pageState: AUTH}
        case 'SHOW_DEMO':                 return {pageState: DEMO}
        case 'SHOW_WS':                   return {pageState: resolvePageState(state.mapRight)}
        case 'SHOW_SHARES':               return {pageState: WS_SHARES}
        case 'SHOW_SHARING':              return {pageState: WS_SHARING}
        case 'OPEN_PALETTE':              return {formatMode: payload, paletteVisible: 1}
        case 'CLOSE_PALETTE':             return {formatMode: '', paletteVisible: 0, }
        case 'OPEN_PLAYBACK_EDITOR':      return {frameEditorVisible: 1, isPlayback: true}
        case 'CLOSE_PLAYBACK_EDITOR':     return {frameEditorVisible: 0, isPlayback: false}
        case 'SET_LANDING_DATA':          return {landingData: payload.landingData}
        case 'SET_BREADCRUMB_DATA':       return {breadcrumbMapNameList: payload.breadcrumbMapNameList}
        case 'SET_TAB_DATA':              return {tabMapNameList: payload.tabMapNameList, tabMapSelected: payload.tabMapSelected}
        case 'SET_FRAME_INFO':            return {frameLen: payload.frameLen, frameSelected: payload.frameSelected}
        case 'SET_SHARE_DATA':            return {shareDataExport: payload.shareDataExport, shareDataImport: payload.shareDataImport}
        case 'PLAY_LANDING_NEXT':         return {landingDataIndex: state.landingDataIndex < state.landingData.length - 1 ? state.landingDataIndex + 1 : 0}
        case 'PLAY_LANDING_PREV':         return {landingDataIndex: state.landingDataIndex > 1 ? state.landingDataIndex - 1 : state.landingData.length - 1}
        case 'AFTER_OPEN':                return {isPlayback: payload.mapSource === 'dataPlayback', mapRight:payload.mapRight, pageState: resolvePageState(payload.mapRight)}
        case 'SET_NODE_PROPS':            return extractNodeProps(payload)
        default: return {}
    }
}

const assignMapProps = (state, shouldSaveCurrentMap, serverCmd, serverPayload = {}) => {
    let serverAction = {serverCmd, serverPayload};
    let serverActionCntr = state.serverActionCntr + 1;
    if (!['ping', 'getLandingdata', 'signUpStep1', 'signUpStep2'].includes(serverCmd)) {
        const cred = JSON.parse(localStorage.getItem('cred'));
        if (cred && cred.email && cred.password) {
            Object.assign(serverAction, {cred});
        }
    }
    if (shouldSaveCurrentMap) {
        Object.assign(serverAction.serverPayload, {
            mapIdOut: mapState.mapId,
            mapSourceOut: mapState.mapSource,
            mapStorageOut: saveMap(),
            frameSelectedOut: mapState.frameSelected
        })
    }
    if (['createMapInMap'].includes(serverCmd)) {
        Object.assign(serverAction.serverPayload, {
            lastPath: selectionState.lastPath,
            newMapName: mapref(selectionState.lastPath).content
        })
    }
    if (['deleteFrame'].includes(serverCmd)) {
        Object.assign(serverAction.serverPayload, {
            mapIdDelete: mapState.mapId,
            frameSelectedOut: mapState.frameSelected
        })
    }
    if (['createShare'].includes(serverCmd)) {
        Object.assign(serverAction.serverPayload, {
            mapId: mapState.mapId,
        })
    }
    return {serverAction, serverActionCntr}
}

const resolvePropsServer = (state, action) => {
    const {payload} = action;
    switch (action.type) {
        case 'SIGN_IN':                   return assignMapProps(state, 0, 'signIn')
        case 'OPEN_MAP_FROM_HISTORY':     return assignMapProps(state, 0, 'openMapFromHistory')
        case 'GET_LANDING_DATA':          return assignMapProps(state, 0, 'getLandingData')
        case 'SIGN_UP_STEP_1':            return assignMapProps(state, 0, 'signUpStep1', payload)
        case 'SIGN_UP_STEP_2':            return assignMapProps(state, 0, 'signUpStep2', payload)
        case 'OPEN_MAP_FROM_TAB':         return assignMapProps(state, 1, 'openMapFromTab', payload)
        case 'OPEN_MAP_FROM_MAP':         return assignMapProps(state, 1, 'openMapFromMap', payload)
        case 'OPEN_MAP_FROM_BREADCRUMBS': return assignMapProps(state, 1, 'openMapFromBreadcrumbs', payload)
        case 'SAVE_MAP':                  return assignMapProps(state, 1, 'saveMap')
        case 'CREATE_MAP_IN_MAP':         return assignMapProps(state, 1, 'createMapInMap')
        case 'CREATE_MAP_IN_TAB':         return assignMapProps(state, 1, 'createMapInTab')
        case 'REMOVE_MAP_IN_TAB':         return assignMapProps(state, 0, 'removeMapInTab')
        case 'MOVE_UP_MAP_IN_TAB':        return assignMapProps(state, 0, 'moveUpMapInTab')
        case 'MOVE_DOWN_MAP_IN_TAB':      return assignMapProps(state, 0, 'moveDownMapInTab')
        case 'OPEN_FRAME':                return assignMapProps(state, 1, 'openFrame')
        case 'IMPORT_FRAME':              return assignMapProps(state, 1, 'importFrame')
        case 'DUPLICATE_FRAME':           return assignMapProps(state, 1, 'duplicateFrame')
        case 'DELETE_FRAME':              return assignMapProps(state, 0, 'deleteFrame')
        case 'PREV_FRAME':                return assignMapProps(state, 1, 'openPrevFrame')
        case 'NEXT_FRAME':                return assignMapProps(state, 1, 'openNextFrame')
        case 'GET_SHARES':                return assignMapProps(state, 0, 'getShares')
        case 'CREATE_SHARE':              return assignMapProps(state, 0, 'createShare', payload)
        case 'ACCEPT_SHARE':              return assignMapProps(state, 0, 'acceptShare', payload)
        case 'WITHDRAW_SHARE':            return assignMapProps(state, 0, 'withdrawShare', payload)
        default: return {}
    }
}

const EditorReducer = (state, action) => {
    return {...state, ...resolveProps(state, action), ...resolvePropsServer(state, action)};
};

export default EditorReducer;
