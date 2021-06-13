import {saveMap} from "./MapFlow";

export const editorState = {
    isLoggedIn: false,
    serverAction: {serverCmd: 'ping'},
    serverActionCntr: 0,
    serverResponse: {},
    serverResponseCntr: 0,
    serverResponseToUser: [''],
    tabMapSelected: 0,
    mapIdList: [],
    mapId: '',
    prevMapId: '',
    tabMapNameList: [],
    mapName: '',
    newMapName: '',
    mapStorage: [],
    breadcrumbsHistory: [],
    density: '',
    alignment: '',
    formatMode: '',
    lineWidth: '',
    lineType: '',
    borderWidth: '',
    fontSize: '',
    colorLine: '',
    colorBorder: '',
    colorFill: '',
    colorText: '',
    paletteVisible: 0,
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

const EditorReducer = (state, action) => {
    const {payload} = action;
    switch (action.type) {
        case 'RESET_STATE': {
            localStorage.setItem('cred', JSON.stringify({name: '', pass: ''}));
            return JSON.parse(InitEditorState);
        }
        case 'SERVER_RESPONSE': {
            return {...state, serverResponseCntr: state.serverResponseCntr + 1, serverResponse: payload};
        }
        case 'SERVER_RESPONSE_TO_USER': {
            return {...state, serverResponseToUser: [...state.serverResponseToUser, payload]}
        }
        case 'SIGN_IN': {
            localStorage.setItem('cred', JSON.stringify(payload));
            return {...state, ...createServerAction(state, 'signIn')};
        }
        case 'SIGN_UP_STEP_1': {
            return {...state, ...createServerAction(state, 'signUpStep1', payload)};
        }
        case 'SIGN_UP_STEP_2': {
            return {...state, ...createServerAction(state, 'signUpStep2', payload)};
        }
        case 'UPDATE_TABS': {
            let {mapIdList, tabMapNameList, tabMapSelected} = payload;
            return {...state, mapIdList, tabMapNameList, tabMapSelected};
        }
        case 'OPEN_MAP_FROM_TAB_HISTORY': {
            return {...state, isLoggedIn: true, ...createServerAction(state, 'openMapFromTabHistory')};
        }
        case 'OPEN_MAP_FROM_TAB': {
            return {...state, ...createServerAction(state, 'openMapFromTab', payload)};
        }
        case 'OPEN_MAP': {
            let {mapId, mapName, tabMapSelected, mapIdList, tabMapNameList, breadcrumbsHistory} = state;
            switch (payload.source) {
                case 'SERVER_SIGN_IN_SUCCESS':
                case 'SERVER_UPDATE_TABS_SUCCESS':
                    mapId = mapIdList[tabMapSelected];
                    mapName = tabMapNameList[tabMapSelected];
                    breadcrumbsHistory = [{mapId, mapName}];
                    break;
                case 'TAB':
                    mapId = mapIdList[payload.value];
                    mapName = tabMapNameList[payload.value];
                    tabMapSelected = payload.value;
                    breadcrumbsHistory = [{mapId, mapName}];
                    break;
                case 'BREADCRUMBS':
                    mapId = breadcrumbsHistory[payload.index].mapId;
                    mapName = breadcrumbsHistory[payload.index].mapName;
                    breadcrumbsHistory.length = payload.index + 1;
                    break;
                case 'MOUSE':
                    mapId = payload.lm.link;
                    mapName = payload.lm.content;
                    breadcrumbsHistory = [...breadcrumbsHistory, {mapId, mapName}];
                    break;
                case 'KEY':
                    switch (payload.key) {
                        case 'SPACE':
                            break;
                        case 'BACKSPACE':
                            break;
                    }
                    break;
                case 'HISTORY':
                    mapId = payload.event.state.mapId;
                    mapName = payload.event.state.mapName;
                    tabMapSelected = payload.event.state.tabMapSelected;
                    breadcrumbsHistory = payload.event.state.breadcrumbsHistory;
                    break;
            }
            if (payload.source !== 'HISTORY') {
                history.pushState({mapId, mapName, tabMapSelected, breadcrumbsHistory}, mapId, '');
            }
            let serverCmd = payload.source === 'SERVER_SIGN_IN_SUCCESS' ? 'openMap' : 'saveOpenMap';
            return {...state, mapId, mapName, tabMapSelected, breadcrumbsHistory, ...createServerAction(state, serverCmd)};
        }
        case 'OPEN_MAP_SUCCESS': {
            let {mapId, mapStorage} = payload;
            let prevMapId = state.mapId;
            return {...state, prevMapId, mapId, mapStorage};
        }
        case 'CREATE_MAP_IN_MAP': {
            return {...state, newMapName: payload, ...createServerAction(state, 'createMapInMap')};
        }
        case 'CREATE_MAP_IN_TAB': {
            return {...state, tabMapNameList: [...state.tabMapNameList, 'creating...'], ...createServerAction(state, 'createMapInTab')};
        }
        case 'REMOVE_MAP_IN_TAB': {
            let {tabMapNameList, tabMapSelected} = state;
            tabMapNameList = tabMapNameList.filter((val, i) => i !== tabMapSelected);
            tabMapSelected = tabMapSelected === 0 ? tabMapSelected : tabMapSelected - 1;
            return {...state, tabMapNameList, tabMapSelected, ...createServerAction(state, 'removeMapInTab')};
        }
        case 'MOVE_UP_MAP_IN_TAB': {
            let {tabMapSelected} = state;
            tabMapSelected = tabMapSelected === 0 ? tabMapSelected : tabMapSelected - 1;
            return {...state, tabMapSelected, ...createServerAction(state, 'moveUpMapInTab')};
        }
        case 'MOVE_DOWN_MAP_IN_TAB': {
            let {tabMapNameList, tabMapSelected} = state;
            tabMapSelected = tabMapSelected ===  tabMapNameList.length - 1? tabMapSelected : tabMapSelected + 1
            return {...state, tabMapSelected, ...createServerAction(state, 'moveDownMapInTab')};
        }
        case 'SAVE_MAP': {
            return { ...state, ...createServerAction(state, 'saveMap')}
        }
        case 'SAVE_MAP_BACKUP': {
            return { ...state, ...createServerAction(state, 'saveMapBackup')}
        }
        case 'MOVE_MAP_TO_SUBMAP': return state;
        case 'MOVE_SUBMAP_TO_MAP': return state;
        case 'MOVE_TAB_TO_SUBMAP': return state;
        case 'MOVE_SUBMAP_TO_TAB': return state;
        case 'SET_DENSITY':        return {...state, density: payload};
        case 'SET_ALIGNMENT':      return {...state, alignment: payload};
        case 'SET_LINE_WIDTH':     return {...state, lineWidth: payload};
        case 'SET_LINE_TYPE':      return {...state, lineType: payload};
        case 'SET_BORDER_WIDTH':   return {...state, borderWidth: payload};
        case 'SET_FONT_SIZE':      return {...state, fontSize: payload};
        case 'OPEN_PALETTE':       return {...state, formatMode: payload, paletteVisible: 1};
        case 'CLOSE_PALETTE':      return {...state, formatMode: '', paletteVisible: 0, };
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
            };
        }
        default: return state;
    }
};

export default EditorReducer;

const mapValues = (stringArray, valueArray, conditionValue) => {
    return stringArray[valueArray.findIndex(v=>v===conditionValue)]
}
