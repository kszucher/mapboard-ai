import {mapState, saveMap} from "./MapFlow";

export const editorState = {
    isLoggedIn: false,
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
    playbackEditorVisible: 0,
    isPlayback: false,
};

const InitEditorState = JSON.stringify(editorState);

const createServerAction = (state, serverCmd, serverPayload) => {
    if (serverPayload === undefined) {
        serverPayload = {}
    }
    return {
        serverAction: {serverCmd, serverPayload},
        serverActionCntr: state.serverActionCntr + 1
    }
}

const getMapOut = () => {
    return {
        mapIdOut: mapState.mapId,
        mapStorageOut: saveMap(),
        mapSourceOut: mapState.mapSource,
        mapSourcePosOut: mapState.mapSourcePos,
    }
}

const getMapId = () => {
    return {
        mapId: mapState.mapId
    }
}

const mapValues = (stringArray, valueArray, conditionValue) => {
    return stringArray[valueArray.findIndex(v=>v===conditionValue)]
}

const EditorReducer = (state, action) => {
    const {payload} = action;
    switch (action.type) {
        case 'RESET_STATE':                     return JSON.parse(InitEditorState)
        case 'SERVER_RESPONSE':                 return {...state, serverResponseCntr: state.serverResponseCntr + 1, serverResponse: payload}
        case 'SERVER_RESPONSE_TO_USER':         return {...state, serverResponseToUser: [...state.serverResponseToUser, payload]}
        case 'SIGN_IN':                         return {...state, ...createServerAction(state, 'signIn')}
        case 'SIGN_UP_STEP_1':                  return {...state, ...createServerAction(state, 'signUpStep1', payload)}
        case 'SIGN_UP_STEP_2':                  return {...state, ...createServerAction(state, 'signUpStep2', payload)}
        case 'OPEN_MAP_FROM_TAB_HISTORY':       return {...state, ...createServerAction(state, 'openMapFromTabHistory'), isLoggedIn: true}
        case 'OPEN_MAP_FROM_TAB':               return {...state, ...createServerAction(state, 'openMapFromTab',             {...payload, ...getMapOut()})}
        case 'OPEN_MAP_FROM_MAP':               return {...state, ...createServerAction(state, 'openMapFromMap',             {...payload, ...getMapOut()})}
        case 'OPEN_MAP_FROM_BREADCRUMBS':       return {...state, ...createServerAction(state, 'openMapFromBreadcrumbs',     {...payload, ...getMapOut()})}
        case 'SAVE_MAP':                        return {...state, ...createServerAction(state, 'saveMap',                    {...payload, ...getMapOut()})}
        case 'CREATE_MAP_IN_MAP':               return {...state, ...createServerAction(state, 'createMapInMap',             {...payload, ...getMapOut()})}
        case 'CREATE_MAP_IN_TAB':               return {...state, ...createServerAction(state, 'createMapInTab',             {...payload, ...getMapOut()})}
        case 'REMOVE_MAP_IN_TAB':               return {...state, ...createServerAction(state, 'removeMapInTab')}
        case 'MOVE_UP_MAP_IN_TAB':              return {...state, ...createServerAction(state, 'moveUpMapInTab')}
        case 'MOVE_DOWN_MAP_IN_TAB':            return {...state, ...createServerAction(state, 'moveDownMapInTab')}
        case 'MOVE_MAP_TO_SUBMAP':              return state
        case 'MOVE_SUBMAP_TO_MAP':              return state
        case 'MOVE_TAB_TO_SUBMAP':              return state
        case 'MOVE_SUBMAP_TO_TAB':              return state
        case 'OPEN_PALETTE':                    return {...state, formatMode: payload, paletteVisible: 1}
        case 'CLOSE_PALETTE':                   return {...state, formatMode: '', paletteVisible: 0, }
        case 'OPEN_PLAYBACK_EDITOR':            return {...state, ...createServerAction(state, 'getFrameLen',                {...payload, ...getMapId()}), playbackEditorVisible: 1}
        case 'OPEN_FRAME':                      return {...state, ...createServerAction(state, 'openFrame',                  {...payload, ...getMapId()})}
        case 'IMPORT_FRAME':                    return {...state, ...createServerAction(state, 'importFrame',                {...payload, ...getMapOut()})}
        case 'DELETE_FRAME':                    return {...state, ...createServerAction(state, 'deleteFrame',                {...payload, ...getMapId()})}
        case 'CLOSE_PLAYBACK_EDITOR':           return {...state, /*TODO open*/ playbackEditorVisible: 0, isPlayback: false}
        case 'SET_IS_PLAYBACK_ON':              return {...state, isPlayback: true}
        case 'SET_IS_PLAYBACK_OFF':             return {...state, isPlayback: false}
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
