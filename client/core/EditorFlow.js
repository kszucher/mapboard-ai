import {getDefaultMap, mapState, saveMap} from "./MapFlow";

export const editorState = {
    isLoggedIn: false,
    userName: '',
    userEmail: '',
    userPassword: '',
    serverAction: ['ping'],
    serverResponse: {},
    serverResponseToUser: [''],
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
    formatMode: '',
    lineWidth: '',
    lineType: '',
    borderWidth: '',
    fontSize: '',
    color: '',
    colorLine: '',
    colorBorder: '',
    colorFill: '',
    colorText: '',
    mapAction: '',
    paletteVisible: 0,
};

const InitEditorState = JSON.stringify(editorState);

const EditorReducer = (state, action) => {
    const {payload} = action;
    switch (action.type) {
        case 'RESET_STATE':
            localStorage.setItem('cred', JSON.stringify({name: '', pass: ''}));
            return JSON.parse(InitEditorState);
        case 'SERVER_RESPONSE': return {...state, serverResponse: payload};
        case 'SERVER_RESPONSE_TO_USER': return {...state, serverResponseToUser: [...state.serverResponseToUser, payload]}
        case 'SIGN_IN':
            localStorage.setItem('cred', JSON.stringify(payload));
            return {...state, serverAction: [...state.serverAction, 'signIn']};
        case 'SIGN_UP':
            let {name, email, password} = payload;
            return {...state, userName: name, userEmail: email, userPassword: password, serverAction: [...state.serverAction, 'signUp']};
        case 'OPEN_WORKSPACE':
            return {...state, isLoggedIn: true};
        case 'UPDATE_TABS':
            return {...state, ...payload}; // includes mapIdList, mapNameList, mapSelected
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
                    data: getDefaultMap('New Map'),
                    density: mapState.density,
                    alignment: mapState.alignment,
                },
                mapNameList: [...state.mapNameList, 'creating...'],
                serverAction: [...state.serverAction, 'createMapInTab']
            };
        case 'REMOVE_MAP_IN_TAB': {
            let {mapNameList, mapSelected} = state;
            return {...state,
                mapNameList: mapNameList.filter((val, i) => i !== mapSelected),
                mapSelected: mapSelected === 0 ? mapSelected : mapSelected - 1,
                serverAction: [...state.serverAction, 'removeMapInTab']
            };
        }
        case 'MOVE_UP_MAP_IN_TAB': {
            let {mapSelected} = state;
            return {...state,
                mapSelected: mapSelected === 0 ? mapSelected : mapSelected - 1,
                serverAction: [...state.serverAction, 'moveUpMapInTab']
            };
        }
        case 'MOVE_DOWN_MAP_IN_TAB': {
            let {mapNameList, mapSelected} = state;
            return {...state,
                mapSelected: mapSelected ===  mapNameList.length - 1? mapSelected : mapSelected + 1,
                serverAction: [...state.serverAction, 'moveDownMapInTab']
            };
        }
        case 'SAVE_MAP':
            return {...state,
                mapStorageOut: {
                    data: saveMap(),
                    density: mapState.density,
                    alignment: mapState.alignment,
                },
                serverAction: [...state.serverAction, 'saveMap']
            };
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
        case 'SET_NODE_PROPS': {
            let lm = payload;
            return {...state,
                lineWidth:      mapValues(['w1', 'w2', 'w3'],            [1, 2, 3],            lm.lineWidth),
                lineType:       mapValues(['bezier', 'edge'],            [1, 3],               lm.lineType),
                borderWidth:    mapValues(['w1', 'w2', 'w3'],            [1, 2, 3],            lm.selection === 's' ? lm.ellipseNodeBorderWidth : lm.ellipseBranchBorderWidth),
                fontSize:       mapValues(['h1', 'h2', 'h3', 'h4', 't'], [36, 24, 18, 16, 14], lm.sTextFontSize),
                colorLine:      lm.lineColor,
                colorBorder:    lm.selection === 's' ? lm.ellipseNodeBorderColor : lm.ellipseBranchBorderColor,
                colorFill:      lm.selection === 's'? lm.ellipseNodeFillColor : lm.ellipseBranchFillColor,
                colorText:      lm.sTextColor,
            };
        }
        case 'SET_MAP_ACTION':                  return {...state,                                           mapAction: [...state.mapAction, payload]};
        case 'SET_DENSITY':                     return {...state, density: payload,                         mapAction: [...state.mapAction, 'setDensity']};
        case 'SET_ALIGNMENT':                   return {...state, alignment: payload,                       mapAction: [...state.mapAction, 'setAlignment']};
        case 'CMD_RESET_ALL':                   return {...state,                                           mapAction: [...state.mapAction, 'resetAll']};
        case 'CMD_RESET':                       return {...state,                                           mapAction: [...state.mapAction, 'reset']};
        case 'CMD_TASK_TOGGLE':                 return {...state,                                           mapAction: [...state.mapAction, 'taskToggle']};
        case 'SET_LINE_WIDTH':                  return {...state, lineWidth: payload,                       mapAction: [...state.mapAction, 'setLineWidth']};
        case 'SET_LINE_TYPE':                   return {...state, lineType: payload,                        mapAction: [...state.mapAction, 'setLineType']};
        case 'SET_BORDER_WIDTH':                return {...state, borderWidth: payload,                     mapAction: [...state.mapAction, 'setBorderWidth']};
        case 'SET_FONT_SIZE':                   return {...state, fontSize: payload,                        mapAction: [...state.mapAction, 'setFontSize']};
        case 'SET_COLOR':                       return {...state, color: payload,                           mapAction: [...state.mapAction, 'setColor']};
        case 'OPEN_PALETTE':                    return {...state, formatMode: payload, paletteVisible: 1};
        case 'CLOSE_PALETTE':                   return {...state, paletteVisible: 0, formatMode: ''};
        default: return state;
    }
};

export default EditorReducer;

const mapValues = (stringArray, valueArray, conditionValue) => {
    return stringArray[valueArray.findIndex(v=>v===conditionValue)]
}
