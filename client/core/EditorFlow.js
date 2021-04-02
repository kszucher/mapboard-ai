import {getDefaultMap, mapState, saveMap} from "./MapFlow";

export const editorState = {
    isLoggedIn: false,
    serverAction: ['ping'],
    serverResponse: {},
    mapSelected: 0,
    mapIdList: [],
    mapId: '',
    mapNameList: [],
    mapName: '',
    mapStorage: [],
    mapStorageOut: [],
    breadcrumbsHistory: [],
    density: '',
    alignment: '',
    fontSize: '',
    lineWidth: '',
    lineType: '',
    colorMode: 'highlight',
    colorText: '',
    colorBorder: '',
    colorHighlight: '',
    colorLine: '',
    colorCellFrame: '',
    mapAction: ''
};

// TODO:
// - get rid of mapAction, and use the appropriate dispatch DIRECTLY
// - get rid of serverAction, and make a CommunicationFlow instead

const InitEditorState = JSON.stringify(editorState);

const EditorReducer = (state, action) => {
    const {payload} = action;
    switch (action.type) {
        case 'RESET_STATE':
            localStorage.setItem('cred', JSON.stringify({name: '', pass: ''}));
            return JSON.parse(InitEditorState);
        case 'SERVER_RESPONSE': return {...state, serverResponse: payload};
        case 'SIGN_IN':
            localStorage.setItem('cred', JSON.stringify(payload));
            return {...state, serverAction: [...state.serverAction, 'signIn']};
        case 'OPEN_WORKSPACE':
            return {...state, isLoggedIn: true};
        case 'UPDATE_TABS':
            return {...state, ...payload}; // includes mapIdList, mapNameList, mapSelected
        // OPEN --------------------------------------------------------------------------------------------------------
        case 'OPEN_MAP':
            let {mapId, mapName, mapSelected, mapIdList, mapNameList, breadcrumbsHistory} = state;
            switch (payload.source) {
                case 'SERVER':
                    mapId = mapIdList[mapSelected];
                    mapName = mapNameList[mapSelected];
                    breadcrumbsHistory = [{mapId, mapName}];
                    break;
                case 'TAB':
                    mapId = mapIdList[payload.value];
                    mapName = mapNameList[payload.value];
                    mapSelected = payload.value;
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
                    breadcrumbsHistory.push({mapId, mapName});
                    break;
                case 'KEY':
                    switch (payload.key) {
                        case 'SPACE': break;
                        case 'BACKSPACE': break;
                    }
                    break;
                case 'HISTORY':
                    mapId = payload.event.state.mapId;
                    mapName = payload.event.state.mapName;
                    mapSelected = payload.event.state.mapSelected;
                    breadcrumbsHistory = payload.event.state.breadcrumbsHistory;
                    break;
            }
            if (payload.source !== 'HISTORY') {
                history.pushState({mapId, mapName, mapSelected, breadcrumbsHistory}, mapId, '');
            }
            return {...state,
                mapId, mapName, mapSelected, breadcrumbsHistory,
                serverAction: [...state.serverAction, 'openMap']
            };
        case 'SET_MAPSTORAGE':
            return {...state,
                mapStorage: payload,
                density: payload.density,
                alignment: payload.alignment,
            };
        // CREATE ------------------------------------------------------------------------------------------------------
        case 'CREATE_MAP_IN_MAP':
            return {...state,
                mapStorageOut: {
                    data: getDefaultMap(payload),
                    density: mapState.density,
                    alignment: mapState.alignment,
                },
                serverAction: [...state.serverAction, 'createMapInMap']
            };
        case 'CREATE_MAP_IN_TAB':
            return {...state,
                mapStorageOut: {
                    data: getDefaultMap(payload.mapName),
                    density: mapState.density,
                    alignment: mapState.alignment,
                },
                serverAction: [...state.serverAction, 'createMapInTab']
            };
        case 'APPEND_MAP_ID_LIST': {
            return {...state,
                mapIdList: [...state.mapIdList, payload],
                // mapSelected: state.mapIdList.length - 1,
                serverAction: [...state.serverAction, 'saveUserMapData']
            };
        }
        // SAVE --------------------------------------------------------------------------------------------------------
        case 'SAVE_MAP':
            return {...state,
                mapStorageOut: {
                    data: saveMap(),
                    density: mapState.density,
                    alignment: mapState.alignment,
                },
                serverAction: [...state.serverAction, 'saveMap']
            };
        // DELETE ------------------------------------------------------------------------------------------------------
        case 'REMOVE_MAP_FROM_TAB': {
            let {mapSelected, mapIdList} = state;
            return {...state,
                mapIdList: mapIdList.filter((val, i) => i !== mapSelected),
                mapSelected: mapSelected === 0 ? mapSelected : mapSelected - 1,
                serverAction: [...state.serverAction, 'saveUserMapData']
            };
        }
        // MOVE --------------------------------------------------------------------------------------------------------
        case 'MOVE_MAP_TO_SUBMAP': {
            return state;
        }
        case 'MOVE_SUBMAP_TO_MAP': {
            return state;
        }
        case 'MOVE_TAB_TO_SUBMAP': {
            return state;
        }
        case 'MOVE_SUBMAP_TO_TAB': {
            return state;
        }
        // PREFERENCES -------------------------------------------------------------------------------------------------
        case 'SET_NODE_PROPS': {
            let fontSize = '';
            switch (payload.sTextFontSize) {
                case 54: fontSize = 'h1'; break;
                case 36: fontSize = 'h2'; break;
                case 24: fontSize = 'h3'; break;
                case 18: fontSize = 'h4'; break;
                case 16: fontSize = 'h5'; break;
                case 14: fontSize = 'h6'; break;
            }
            let lineWidth = '';
            switch (payload.lineWidth) {
                case 1: lineWidth = 'p1'; break;
                case 2: lineWidth = 'p2'; break;
                case 3: lineWidth = 'p3'; break;
            }
            let lineType = '';
            switch (payload.lineWidth) {
                case 1: lineType = 'bezier'; break;
                case 2: lineType = 'bezierCircle'; break;
                case 3: lineType = 'edge'; break;
            }
            return {...state,
                fontSize,
                lineWidth,
                lineType,
                colorText: payload.sTextColor,
                colorBorder: payload.ellipseBorderColor,
                colorHighlight: payload.ellipseFillColor,
                colorLine: payload.lineColor,
            };
        }
        case 'SET_DENSITY':     return {...state, density: payload};
        case 'SET_ALIGNMENT':   return {...state, alignment: payload};
        case 'SET_FONT_SIZE':   return {...state, fontSize: payload};
        case 'SET_LINE_WIDTH':  return {...state, lineWidth: payload};
        case 'SET_LINE_TYPE':   return {...state, lineType: payload};
        case 'SET_COLOR_MODE':  return {...state, colorMode: payload};
        case 'SET_MOUSE_MODE':  return {...state, mouseMode: payload};
        case 'SET_MAP_ACTION':  return {...state, mapAction: [...state.mapAction, payload]};
        default: return state;
    }
};

export default EditorReducer;
