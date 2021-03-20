import {getDefaultMap, mapState, saveMap} from "./MapReducer";

export const MainState = {
    isLoggedIn: false,
    serverAction: ['ping'],
    serverResponse: {},
    mapIdList: [],
    mapNameList: [],
    mapSelected: 0,
    mapId: '',
    mapName: '',
    mapStorage: [],
    mapStorageOut: [],
    breadcrumbsHistory: [],
    // preferences
    density: '',
    alignment: '',
    fontSize: '',
    colorMode: 'highlight',

    colorText: '',
    colorBorder: '',
    colorHighlight: '',
    colorLine: '',

    mapAction: ''
};

const InitState = JSON.stringify(MainState);

const MainReducer = (state, action) => {
    const {payload} = action;
    switch (action.type) {
        case 'RESET_STATE':
            localStorage.setItem('cred', JSON.stringify({name: '', pass: ''}));
            return JSON.parse(InitState);
        case 'SERVER_RESPONSE': return {...state, serverResponse: payload};
        case 'SIGN_IN':
            localStorage.setItem('cred', JSON.stringify(payload));
            return {...state, serverAction: [...state.serverAction, 'signIn']};
        case 'OPEN_WORKSPACE':
            return {...state, isLoggedIn: true};
        case 'UPDATE_TABS':
            return {...state, ...payload};
        // OPEN --------------------------------------------------------------------------------------------------------
        case 'OPEN_MAP':
            let mapId = state.mapId;
            let mapName = state.mapName;
            let mapSelected = state.mapSelected;
            let breadcrumbsHistory = state.breadcrumbsHistory;
            switch (payload.source) {
                case 'SERVER':
                    mapId = state.mapIdList[state.mapSelected];
                    mapName = state.mapNameList[state.mapSelected];
                    breadcrumbsHistory = [{mapId, mapName}];
                    break;
                case 'TAB':
                    mapId = state.mapIdList[payload.value];
                    mapName = state.mapNameList[payload.value];
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
            return {...state, mapId, mapName, mapSelected, breadcrumbsHistory, serverAction: [...state.serverAction, 'openMap']};
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
        case 'DELETE_MAP_FROM_TAB': {
            return state;
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
            let fontSize = 0;
            switch (payload.sTextFontSize) {
                case 54: fontSize = 'h1'; break;
                case 36: fontSize = 'h2'; break;
                case 24: fontSize = 'h3'; break;
                case 18: fontSize = 'h4'; break;
                case 16: fontSize = 'h5'; break;
                case 14: fontSize = 'h6'; break;
            }
            return {...state,
                colorText: payload.sTextColor,
                colorBorder: payload.ellipseBorderColor,
                colorHighlight: payload.ellipseFillColor,
                colorLine: payload.lineColor,
                fontSize,
            };
        }
        case 'SET_DENSITY':     return {...state, density: payload};
        case 'SET_ALIGNMENT':   return {...state, alignment: payload};
        case 'SET_FONT_SIZE':   return {...state, fontSize: payload};
        case 'SET_COLOR_MODE':  return {...state, colorMode: payload};
        case 'SET_MOUSE_MODE':  return {...state, mouseMode: payload};
        case 'SET_MAP_ACTION':  return {...state, mapAction: [...state.mapAction, payload]};
        default: return state;
    }
};

export default MainReducer;
