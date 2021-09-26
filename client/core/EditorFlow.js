import {mapref, mapState, saveMap} from "./MapFlow";
import {selectionState} from "./SelectionFlow";

export const PAGE_STATES = {
    EMPTY: 'EMPTY',
    DEMO: 'DEMO',
    AUTH: 'AUTH',
    WORKSPACE: 'WORKSPACE',
    WORKSPACE_SHARES: 'WORKSPACE_SHARES',
    WORKSPACE_SHARING: 'WORKSPACE_SHARING'
}

export const editorState = {
    pageState: PAGE_STATES.AUTH,
    landingData: [],
    landingDataIndex: 0,
    breadcrumbMapNameList: [''],
    tabMapNameList: [],
    tabMapSelected: 0,
    serverAction: {serverCmd: window.location.search ==='?d=iq' ?  'getLandingData' : 'ping'},
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
    frameLen: 0,
    frameSelected: 0,
    shareDataExport: [],
    shareDataImport: [],
};

const InitEditorState = JSON.stringify(editorState);

const EditorReducer = (state, action) => {
    return {...{...state, ...resolveProps(state, action)}, ...resolvePropsServer(state, action)};
};

const resolveProps = (state, action) => {
    const {payload} = action;
    const {AUTH, DEMO, WORKSPACE, WORKSPACE_SHARES, WORKSPACE_SHARING} = PAGE_STATES;
    switch (action.type) {
        case 'RESET_STATE':               return JSON.parse(InitEditorState)
        case 'SERVER_RESPONSE':           return {...state, serverResponseCntr: state.serverResponseCntr + 1, serverResponse: payload}
        case 'SERVER_RESPONSE_TO_USER':   return {...state, serverResponseToUser: [...state.serverResponseToUser, payload]}
        case 'SHOW_AUTH':                 return {...state, pageState: AUTH}
        case 'SET_DEMO':                  return {...state, pageState: DEMO}
        case 'OPEN_MAP_FROM_HISTORY':     return {...state, pageState: WORKSPACE}
        case 'OPEN_MAP_FROM_TAB':         return {...state, tabMapSelected: payload.value}
        case 'OPEN_PALETTE':              return {...state, formatMode: payload, paletteVisible: 1}
        case 'CLOSE_PALETTE':             return {...state, formatMode: '', paletteVisible: 0, }
        case 'OPEN_PLAYBACK_EDITOR':      return {...state, frameEditorVisible: 1, isPlayback: true}
        case 'CLOSE_PLAYBACK_EDITOR':     return {...state, frameEditorVisible: 0, isPlayback: false}
        case 'SET_IS_PLAYBACK_ON':        return {...state, isPlayback: true}
        case 'SET_IS_PLAYBACK_OFF':       return {...state, isPlayback: false}
        case 'SET_LANDING_DATA':          return {...state, landingData: payload.landingData}
        case 'SET_BREADCRUMB_DATA':       return {...state, breadcrumbMapNameList: payload.breadcrumbMapNameList}
        case 'SET_TAB_DATA':              return {...state, tabMapNameList: payload.tabMapNameList, tabMapSelected: payload.tabMapSelected}
        case 'SET_FRAME_INFO':            return {...state, frameLen: payload.frameLen, frameSelected: payload.frameSelected}
        case 'SET_SHARE_DATA':            return {...state, shareDataExport: payload.shareDataExport, shareDataImport: payload.shareDataImport}
        case 'PLAY_LANDING_NEXT':         return {...state, landingDataIndex: state.landingDataIndex < state.landingData.length - 1 ? state.landingDataIndex + 1 : 0}
        case 'PLAY_LANDING_PREV':         return {...state, landingDataIndex: state.landingDataIndex > 1 ? state.landingDataIndex - 1 : state.landingData.length - 1}
        case 'SHOW_SHARES':               return {...state, pageState: WORKSPACE_SHARES}
        case 'SHOW_SHARING':              return {...state, pageState: WORKSPACE_SHARING}
        case 'CLOSE_WORKSPACE_MODAL':     return {...state, pageState: WORKSPACE}
        case 'SET_NODE_PROPS': {
            let lm = payload;
            return {...state,
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
        default: return state
    }
}

const resolvePropsServer = (state, action) => {
    const {payload} = action;
    // TODO move logic to BE to avoid priority inversion
    switch (action.type) {
        case 'SIGN_IN':                   return propsServer(state, 'signIn')
        case 'SHOW_DEMO':                 return propsServer(state, 'getLandingData')
        case 'SIGN_UP_STEP_1':            return propsServer(state, 'signUpStep1', payload)
        case 'SIGN_UP_STEP_2':            return propsServer(state, 'signUpStep2', payload)
        case 'OPEN_MAP_FROM_HISTORY':     return propsServer(state, 'openMapFromHistory')
        case 'OPEN_MAP_FROM_TAB':         return propsServer(state, 'openMapFromTab', {tabMapSelected: payload.value})
        case 'OPEN_MAP_FROM_MAP':         return propsServer(state, 'openMapFromMap', payload)
        case 'OPEN_MAP_FROM_BREADCRUMBS': return propsServer(state, 'openMapFromBreadcrumbs', {breadcrumbMapSelected: payload.index})
        case 'SAVE_MAP':                  return propsServer(state, 'saveMap')
        case 'CREATE_MAP_IN_MAP':         return propsServer(state, 'createMapInMap')
        case 'CREATE_MAP_IN_TAB':         return propsServer(state, 'createMapInTab')
        case 'REMOVE_MAP_IN_TAB':         return propsServer(state, 'removeMapInTab')
        case 'MOVE_UP_MAP_IN_TAB':        return propsServer(state, 'moveUpMapInTab')
        case 'MOVE_DOWN_MAP_IN_TAB':      return propsServer(state, 'moveDownMapInTab')
        case 'CLOSE_PLAYBACK_EDITOR':     return propsServer(state, 'openMapFromBreadcrumbs', {breadcrumbMapSelected: state.breadcrumbMapNameList.length - 1})
        case 'OPEN_FRAME':                return propsServer(state, 'openFrame')
        case 'IMPORT_FRAME':              return propsServer(state, 'importFrame')
        case 'DUPLICATE_FRAME':           return propsServer(state, 'duplicateFrame')
        case 'DELETE_FRAME':              return propsServer(state, 'deleteFrame')
        case 'PREV_FRAME':                return propsServer(state, 'openPrevFrame')
        case 'NEXT_FRAME':                return propsServer(state, 'openNextFrame')
        case 'GET_SHARES':                return propsServer(state, 'getShares')
        case 'CREATE_SHARE':              return propsServer(state, 'createShare', payload)
        case 'ACCEPT_SHARE':              return propsServer(state, 'acceptShare', payload)
        case 'WITHDRAW_SHARE':            return propsServer(state, 'withdrawShare', payload)
    }
}

const propsServer = (state, serverCmd, serverPayload = {}) => {
    let serverAction = {serverCmd, serverPayload};
    let serverActionCntr = state.serverActionCntr + 1;
    if (!['ping', 'getLandingdata', 'signUpStep1', 'signUpStep2'].includes(serverCmd)) {
        const cred = JSON.parse(localStorage.getItem('cred'));
        if (cred && cred.email && cred.password) {
            Object.assign(serverAction, {cred});
        }
    }
    if (['openMapFromTab', 'openMapFromMap', 'openMapFromBreadcrumbs', 'saveMap', 'createMapInMap', 'createMapInTab',
        'openFrame', 'openPrevFrame', 'openNextFrame', 'importFrame', 'duplicateFrame'].includes(serverCmd)) {
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
            mapId: mapState.mapId,
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

export default EditorReducer;

const mapValues = (stringArray, valueArray, conditionValue) => {
    return stringArray[valueArray.findIndex(v=>v===conditionValue)]
}
