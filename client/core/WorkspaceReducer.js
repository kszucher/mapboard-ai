import {InitState} from "./State";
import {getDefaultMap, mapMem, saveMap} from "../map/Map";
import {mapPrint} from "../map/MapPrint";

const WorkspaceReducer = (state, action) => {
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
            };
        // CREATE ------------------------------------------------------------------------------------------------------
        case 'CREATE_MAP_IN_MAP':
            return {...state,
                mapStorageOut: {
                    data: getDefaultMap(payload),
                    density: mapMem.density,
                },
                serverAction: [...state.serverAction, 'createMapInMap']
            };
        case 'CREATE_MAP_IN_TAB':
            return {...state,
                mapStorageOut: {
                    data: getDefaultMap(payload.mapName),
                    density: mapMem.density,
                },
                serverAction: [...state.serverAction, 'createMapInTab']
            };
        // SAVE --------------------------------------------------------------------------------------------------------
        case 'SAVE_MAP':
            return {...state,
                mapStorageOut: {
                    data: saveMap(),
                    density: mapMem.density,
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
        // FORMAT ------------------------------------------------------------------------------------------------------
        case 'SET_DENSITY': {
            return {...state, density: payload};
        }
        // UNDO/REDO ---------------------------------------------------------------------------------------------------
        case 'UNDO': {
            return state;
        }
        case 'REDO': {
            return state;
        }
        // IMPORT/EXPORT -----------------------------------------------------------------------------------------------
        case 'PRINT': {
            mapPrint.start(payload.lm);
            return state;
        }
        // PREFERENCES
        case 'SET_IS_PALETTE_VISIBLE': {
            return {...state, isPaletteVisible: payload}
        }



        default: return state;
    }
};

export default WorkspaceReducer;
