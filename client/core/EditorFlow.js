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
    frameLen: 0,
    frameSelection: [],
};

const InitEditorState = JSON.stringify(editorState);

const serv = (state, serverCmd, serverPayload) => {
    if (serverPayload === undefined) {
        serverPayload = {}
    }
    return {
        serverAction: {serverCmd, serverPayload},
        serverActionCntr: state.serverActionCntr + 1
    }
}

const mapOut = () => {
    return {
        mapIdOut: mapState.mapId,
        mapSourceOut: mapState.mapSource,
        mapStorageOut: saveMap(),
        frameSelectedOut: mapState.frameSelected,
    }
}

const getFrameOut = (state) => {
    return {
        frameSelectedOut: state.frameSelection[0]
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
        // ide gyűjteni a serv command-okat
    }



    switch (action.type) {
        case 'RESET_STATE':               return JSON.parse(InitEditorState)
        case 'SERVER_RESPONSE':           return {...state, serverResponseCntr: state.serverResponseCntr + 1, serverResponse: payload}
        case 'SERVER_RESPONSE_TO_USER':   return {...state, serverResponseToUser: [...state.serverResponseToUser, payload]}
        case 'SIGN_IN':                   return {...state, ...serv(state, 'signIn')}
        case 'SIGN_UP_STEP_1':            return {...state, ...serv(state, 'signUpStep1', payload)}
        case 'SIGN_UP_STEP_2':            return {...state, ...serv(state, 'signUpStep2', payload)}
        case 'OPEN_MAP_FROM_HISTORY':     return {...state, ...serv(state, 'openMapFromHistory'), isLoggedIn: true}
        case 'OPEN_MAP_FROM_TAB':         return {...state, ...serv(state, 'openMapFromTab',         {...payload, ...mapOut()})}
        case 'OPEN_MAP_FROM_MAP':         return {...state, ...serv(state, 'openMapFromMap',         {...payload, ...mapOut()})}
        case 'OPEN_MAP_FROM_BREADCRUMBS': return {...state, ...serv(state, 'openMapFromBreadcrumbs', {...payload, ...mapOut()})}
        case 'SAVE_MAP':                  return {...state, ...serv(state, 'saveMap',                {...payload, ...mapOut()})}
        case 'CREATE_MAP_IN_MAP':         return {...state, ...serv(state, 'createMapInMap',         {...payload, ...mapOut()})}
        case 'CREATE_MAP_IN_TAB':         return {...state, ...serv(state, 'createMapInTab',         {...payload, ...mapOut()})}
        case 'REMOVE_MAP_IN_TAB':         return {...state, ...serv(state, 'removeMapInTab')}
        case 'MOVE_UP_MAP_IN_TAB':        return {...state, ...serv(state, 'moveUpMapInTab')}
        case 'MOVE_DOWN_MAP_IN_TAB':      return {...state, ...serv(state, 'moveDownMapInTab')}
        case 'MOVE_MAP_TO_SUBMAP':        return state
        case 'MOVE_SUBMAP_TO_MAP':        return state
        case 'MOVE_TAB_TO_SUBMAP':        return state
        case 'MOVE_SUBMAP_TO_TAB':        return state
        case 'OPEN_PALETTE':              return {...state, formatMode: payload, paletteVisible: 1}
        case 'CLOSE_PALETTE':             return {...state, formatMode: '', paletteVisible: 0, }
        case 'OPEN_PLAYBACK_EDITOR':      return {...state,  playbackEditorVisible: 1, isPlayback: true,  ...serv( state, 'openFrame', {          ...mapOut(),                          frameSelected: 0                                                             })}
        case 'CLOSE_PLAYBACK_EDITOR':     return {...state,  playbackEditorVisible: 0, isPlayback: false, ...serv( state, 'openMapFromHistory', { ...mapOut()                                                                                                        })}
        case 'OPEN_FRAME':                return {...state,                                               ...serv( state, 'openFrame', {          ...mapOut(),                          frameSelected: state.frameSelection[0]                                       })}
        case 'IMPORT_FRAME':              return {...state,                                               ...serv( state, 'importFrame', {        ...mapOut(),                          frameSelected: state.frameSelection[0]                                       })}
        case 'DUPLICATE_FRAME':           return {...state,                                               ...serv( state, 'duplicateFrame', {     ...mapOut(),   ...getFrameOut(state), frameSelected: state.frameSelection[0] + 1                                   })}
        case 'DELETE_FRAME':              return {...state,                                               ...serv( state, 'deleteFrame', {        ...getMapId(), ...getFrameOut(state), frameSelected: state.frameSelection[0] > 0 ? state.frameSelection[0] - 1 : 0 })}
        case 'PREV_FRAME':                return {...state,                                               ...serv( state, 'openFrame', {          ...mapOut(),                          frameSelected: state.frameSelection[0] - 1                                   })}
        case 'NEXT_FRAME':                return {...state,                                               ...serv( state, 'openFrame', {          ...mapOut(),                          frameSelected: state.frameSelection[0] + 1                                   })}
        case 'SET_IS_PLAYBACK_ON':        return {...state, isPlayback: true}
        case 'SET_IS_PLAYBACK_OFF':       return {...state, isPlayback: false}
        case 'SET_FRAME_INFO':            return {...state, frameLen: payload.payload.frameLen, frameSelection: [payload.payload.frameSelected]}
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
