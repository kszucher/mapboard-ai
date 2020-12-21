import {InitState} from "./State";
import {getDefaultMap, mapMem, saveMap} from "../map/Map";
import {mapPrint} from "../map/MapPrint";

const MapReducer = (state, action) => {
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
            let mapId;
            let mapName;
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
                    //             mapId: lastEvent.ref.state.mapId,
                    //             mapName: mapMem.getData().r[0].content,
                    //             breadcrumbsOp: 'x'}});
                    break;
            }

            if (payload.source !== 'HISTORY') {
                history.pushState({mapId: payload.mapId}, payload.mapId, '');
            }
            return {...state, mapId, mapName, breadcrumbsHistory, serverAction: [...state.serverAction, 'openMap']};
        // CREATE ------------------------------------------------------------------------------------------------------
        case 'CREATE_MAP_IN_MAP':
            return {...state,
                mapStorageOut: {
                    data: getDefaultMap(payload),
                    density: mapMem.density,
                    task: mapMem.task,
                    flow: mapMem.flow,
                },
                serverAction: [...state.serverAction, 'createMapInMap']
            };
        case 'CREATE_MAP_IN_TAB':
            return {...state,
                mapStorageOut: {
                    data: getDefaultMap(payload),
                    density: mapMem.density,
                    task: mapMem.task,
                    flow: mapMem.flow,
                },
                serverAction: [...state.serverAction, 'createMapInTab']
            };
        // SAVE --------------------------------------------------------------------------------------------------------
        case 'SAVE_MAP':
            return {...state,
                mapStorageOut: {
                    data: saveMap(),
                    density: mapMem.density,
                    task: mapMem.task,
                    flow: mapMem.flow,
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
        case 'CHANGE_MAP_DENSITY': {
            mapMem.density = payload; // small or large
            return state;
        }
        // UNDO/REDO ---------------------------------------------------------------------------------------------------
        case 'UNDO': {
            if (mapMem.dataIndex > 0) {
                mapMem.dataIndex--;
            }
            return state;
        }
        case 'REDO': {
            if (mapMem.dataIndex < mapMem.data.length - 1) {
                mapMem.dataIndex++;
            }
            return state;
        }
        // IMPORT/EXPORT -----------------------------------------------------------------------------------------------
        case 'PRINT': {
            mapPrint.start(payload.lm);
            return state;
        }
        // SHARE -------------------------------------------------------------------------------------------------------

        default: return state;
    }
};

export default MapReducer;
