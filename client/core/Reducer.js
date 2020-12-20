import {InitState} from "./State";
import {mapMem, saveMap} from "../map/Map";
import {mapPrint} from "../map/MapPrint";

const Reducer = (state, action) => {

    const {payload} = action;

    // console.log('ACTION: ' + action.type);

    switch (action.type) { // action = what do I want to do, not what happened (event)
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
            const {mapNameList, mapIdList, mapSelected} = payload;
            return {...state, mapNameList, mapIdList, mapSelected};
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
                    breadcrumbsHistory.length = parseInt(payload.index) + 1; // még mindig kell a parseInt vajon?
                    break;
                case 'MOUSE':
                    mapId = payload.lm.link;
                    mapName = payload.lm.content;
                    breadcrumbsHistory.push({mapId, mapName});
                    break;
                case 'KEY':
                    switch (payload.key) { // will automatically have this prop for keyboard based command, so no need for additional columns
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
        case 'CREATE_MAP_IN_MAP': return {...state, serverAction: [...state.serverAction, 'createMapInMap']};
        case 'CREATE_MAP_IN_TAB': return {...state, serverAction: [...state.serverAction, 'createMapInTab']};

        // SAVE --------------------------------------------------------------------------------------------------------
        case 'SAVE_MAP':
            //         data: saveMap(),
            //         density: mapMem.density,
            //         task: mapMem.task,
            return {...state, serverAction: [...state.serverAction, 'saveMap']};
        // DELETE ------------------------------------------------------------------------------------------------------
        case 'DELETE_MAP_FROM_TAB': {
            break;
        }
        // MOVE --------------------------------------------------------------------------------------------------------
        case 'MOVE_MAP_TO_SUBMAP': {
            break;
        }
        case 'MOVE_SUBMAP_TO_MAP': {
            break;
        }
        case 'MOVE_TAB_TO_SUBMAP': {
            break;
        }
        case 'MOVE_SUBMAP_TO_TAB': {
            break;
        }
        // FORMAT ------------------------------------------------------------------------------------------------------
        case 'CHANGE_MAP_DENSITY': {
            mapMem.density = 'small'; // or 'large'
            break;
        }
        // UNDO/REDO ---------------------------------------------------------------------------------------------------
        case 'undo': {
            if (mapMem.dataIndex > 0) {
                mapMem.dataIndex--;
            }
            break;
        }
        case 'redo': {
            if (mapMem.dataIndex < mapMem.data.length - 1) {
                mapMem.dataIndex++;
            }
            break;
        }
        // IMPORT/EXPORT -----------------------------------------------------------------------------------------------
        case 'prettyPrint': {
            mapPrint.start(sc.lm);
            break;
        }
        // SHARE

        default: return state;
    }
};

export default Reducer;
