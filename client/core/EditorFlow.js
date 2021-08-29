import {mapref, mapState, saveMap} from "./MapFlow";
import {selectionState} from "./SelectionFlow";

export const PAGE_STATES = {
    EMPTY: 'EMPTY',
    DEMO: 'DEMO',
    AUTH: 'AUTH',
    WORKSPACE: 'WORKSPACE',
    WORKSPACE_SHARING: 'WORKSPACE_SHARING'
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
    frameLen: 0,
    frameSelection: [],
};

const InitEditorState = JSON.stringify(editorState);

const serv = (state, serverCmd, serverPayload = {}) => {
    let serverAction = {serverCmd, serverPayload};
    let serverActionCntr = state.serverActionCntr + 1;
    if (!['ping', 'getLandingdata', 'signUpStep1', 'signUpStep2'].includes(serverCmd)) {
        const cred = JSON.parse(localStorage.getItem('cred'));
        if (cred && cred.email && cred.password) {
            Object.assign(serverAction, {cred});
        }
    }
    if (['openMapFromTab', 'openMapFromMap', 'openMapFromBreadcrumbs', 'saveMap', 'createMapInMap', 'createMapInTab',
        'openFrame', 'importFrame', 'duplicateFrame'].includes(serverCmd)) {
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
            frameSelectedOut: state.frameSelection[0]
        })
    }
    if (['duplicateFrame'].includes(serverCmd)) {
        Object.assign(serverAction.serverPayload, {
            frameSelectedOut: state.frameSelection[0]
        })
    }
    return {serverAction, serverActionCntr}
}

const EditorReducer = (state, action) => {
    const {payload} = action;
    switch (action.type) {
        case 'RESET_STATE':               return JSON.parse(InitEditorState)
        case 'SERVER_RESPONSE':           return {...state, serverResponseCntr: state.serverResponseCntr + 1, serverResponse: payload}
        case 'SERVER_RESPONSE_TO_USER':   return {...state, serverResponseToUser: [...state.serverResponseToUser, payload]}
        case 'SIGN_IN':                   return {...state,                                           ...serv(state, 'signIn')}
        case 'SHOW_AUTH':                 return {...state, pageState: PAGE_STATES.AUTH}
        case 'SHOW_DEMO':                 return {...state, pageState: PAGE_STATES.DEMO,              ...serv(state, 'getLandingData')}
        case 'SIGN_UP_STEP_1':            return {...state,                                           ...serv(state, 'signUpStep1', payload)}
        case 'SIGN_UP_STEP_2':            return {...state,                                           ...serv(state, 'signUpStep2', payload)}
        case 'OPEN_MAP_FROM_HISTORY':     return {...state, pageState: PAGE_STATES.WORKSPACE,         ...serv(state, 'openMapFromHistory')}
        case 'OPEN_MAP_FROM_TAB':         return {...state, tabMapSelected: payload.value,            ...serv(state, 'openMapFromTab', {            tabMapSelected: payload.value})}
        case 'OPEN_MAP_FROM_MAP':         return {...state,                                           ...serv(state, 'openMapFromMap', payload)}
        case 'OPEN_MAP_FROM_BREADCRUMBS': return {...state,                                           ...serv(state, 'openMapFromBreadcrumbs', {    breadcrumbMapSelected: payload.index})}
        case 'SAVE_MAP':                  return {...state,                                           ...serv(state, 'saveMap')}
        case 'CREATE_MAP_IN_MAP':         return {...state,                                           ...serv(state, 'createMapInMap')}
        case 'CREATE_MAP_IN_TAB':         return {...state,                                           ...serv(state, 'createMapInTab')}
        case 'REMOVE_MAP_IN_TAB':         return {...state,                                           ...serv(state, 'removeMapInTab')}
        case 'MOVE_UP_MAP_IN_TAB':        return {...state,                                           ...serv(state, 'moveUpMapInTab')}
        case 'MOVE_DOWN_MAP_IN_TAB':      return {...state,                                           ...serv(state, 'moveDownMapInTab')}
        case 'MOVE_MAP_TO_SUBMAP':        return state
        case 'MOVE_SUBMAP_TO_MAP':        return state
        case 'MOVE_TAB_TO_SUBMAP':        return state
        case 'MOVE_SUBMAP_TO_TAB':        return state
        case 'OPEN_PALETTE':              return {...state, formatMode: payload, paletteVisible: 1}
        case 'CLOSE_PALETTE':             return {...state, formatMode: '', paletteVisible: 0, }
        case 'OPEN_PLAYBACK_EDITOR':      return {...state, frameEditorVisible: 1, isPlayback: true,  ...serv( state, 'openFrame', {                frameSelected: 0                                                             })}
        case 'CLOSE_PLAYBACK_EDITOR':     return {...state, frameEditorVisible: 0, isPlayback: false, ...serv( state, 'openMapFromBreadcrumbs', {   breadcrumbMapSelected: state.breadcrumbMapNameList.length - 1})}
        case 'OPEN_FRAME':                return {...state,                                           ...serv( state, 'openFrame', {                frameSelected: state.frameSelection[0]                                       })}
        case 'IMPORT_FRAME':              return {...state,                                           ...serv( state, 'importFrame')}
        case 'DUPLICATE_FRAME':           return {...state,                                           ...serv( state, 'duplicateFrame', {           frameSelected: state.frameSelection[0] + 1                                   })}
        case 'DELETE_FRAME':              return {...state,                                           ...serv( state, 'deleteFrame', {              frameSelected: state.frameSelection[0] > 0 ? state.frameSelection[0] - 1 : 0 })}
        case 'PREV_FRAME':                return {...state,                                           ...serv( state, 'openFrame', {                frameSelected: state.frameSelection[0] - 1                                   })}
        case 'NEXT_FRAME':                return {...state,                                           ...serv( state, 'openFrame', {                frameSelected: state.frameSelection[0] + 1                                   })}
        case 'SET_IS_PLAYBACK_ON':        return {...state, isPlayback: true}
        case 'SET_IS_PLAYBACK_OFF':       return {...state, isPlayback: false}
        case 'SET_LANDING_DATA':          return {...state, landingData: payload.landingData}
        case 'SET_BREADCRUMB_DATA':       return {...state, breadcrumbMapNameList: payload.breadcrumbMapNameList}
        case 'SET_TAB_DATA':              return {...state, tabMapNameList: payload.tabMapNameList, tabMapSelected: payload.tabMapSelected}
        case 'SET_FRAME_INFO':            return {...state, frameLen: payload.frameLen, frameSelection: [payload.frameSelected]}
        case 'PLAY_LANDING_NEXT':         return {...state, landingDataIndex: state.landingDataIndex < state.landingData.length - 1 ? state.landingDataIndex + 1 : 0}
        case 'PLAY_LANDING_PREV':         return {...state, landingDataIndex: state.landingDataIndex > 1 ? state.landingDataIndex - 1 : state.landingData.length - 1}
        case 'OPEN_SHARING_EDITOR':       return {...state, pageState: PAGE_STATES.WORKSPACE_SHARING}
        case 'CLOSE_SHARING_EDITOR':      return {...state, pageState: PAGE_STATES.WORKSPACE}
        case 'CHECK_VALIDITY':            return {...state,                                           ...serv(state, 'checkValidity', payload)}
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
};

export default EditorReducer;

const mapValues = (stringArray, valueArray, conditionValue) => {
    return stringArray[valueArray.findIndex(v=>v===conditionValue)]
}
