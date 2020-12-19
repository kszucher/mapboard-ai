import {InitState} from "./State";
import {remoteDispatch} from "./Store";
import {lastEvent} from "./EventRouter";
import {mapMem, saveMap} from "../map/Map";
import {mapPrint} from "../map/MapPrint";

const Reducer = (state, action) => {

    const {payload} = action;

    // console.log(action.type)

    switch (action.type) {
        case 'RESET_STATE':
            localStorage.setItem('cred', JSON.stringify({name: '', pass: ''}));
            return JSON.parse(InitState);
        case 'SERVER_RESPONSE': return {...state, serverResponse: payload};
        case 'SIGN_IN':
            localStorage.setItem('cred', JSON.stringify({
                email: payload.email,
                password: payload.password,
            }));
            return {...state, serverAction: 'signIn'};
        case 'SIGN_IN_SUCCESS':
            const {tabListNames, tabListIds, tabListSelected} = payload;
            return {...state, isLoggedIn: true, tabListNames, tabListIds, tabListSelected};
        case 'OPEN_MAP':
            const {breadcrumbsOp, mapId, mapName} = payload;
            let breadcrumbsHistory = state.breadcrumbsHistory;
            if (['reset', 'resetPush'].includes(breadcrumbsOp)) {
                breadcrumbsHistory = [];
            }
            if (['resetPush', 'push'].includes(breadcrumbsOp)) {
                breadcrumbsHistory.push({mapId, mapName})
            }
            if (['splice'].includes(breadcrumbsOp)) {
                let cutIndex = 0;
                for (const i in breadcrumbsHistory) {
                    if (breadcrumbsHistory[i].mapId === mapId) {
                        cutIndex = i;
                    }
                }
                breadcrumbsHistory.length = parseInt(cutIndex) + 1;
            }
            // TODO: az aktuális teljes breadhistorynak az aktuális értékét pusholjuk így jó lesz és tökéletes a history!!!
            if (payload.pushHistory) {
                history.pushState({mapId: payload.mapId}, payload.mapId, '');
            }
            return {...state, mapId, breadcrumbsHistory, serverAction: 'openMapRequest'};
        case 'CREATE_MAP_IN_MAP': return {...state, serverAction: 'createMapInMap'};
        case 'CREATE_MAP_IN_TAB': return {...state, serverAction: 'createMapInTab'};
        case 'SAVE_MAP':


            return {...state, serverAction: 'saveMap'};



        // TODO start here
        // EZEKET KELL MAJD MIND IDE BETENNI!!!! MERGE-elni, szimbionizáltatni!!!!!!
        // ez azt is hozza magával, hogy a teljes map state ide jön, de ez már elkerülhetetlen amúgyis. nincs ok ELLENE
            // amit még érdemes figyelembe venni, hogy push-pop mindenhol lehet


        // OPEN --------------------------------------------------------------------------------------------------------
        case 'openParentMap' : { // using backspace
            // KEYBOARD eventként keletkezik, de nem ide jön, hanem dispacth-el majd ez is
            break;
        }
        case 'openChildMap': { // using space

            break;
        }
        // CREATE ------------------------------------------------------------------------------------------------------
        case 'createMapInMap': {
            remoteDispatch({type: 'CREATE_MAP_IN_MAP'});
            break;
        }
        case 'createMapInTab': {
            remoteDispatch({type: 'CREATE_MAP_IN_TAB'});
            break;
        }
        // SAVE --------------------------------------------------------------------------------------------------------
        case 'saveMap': {
            // remoteDispatch({type: 'SAVE_MAP', payload: {
            //         data: saveMap(),
            //         density: mapMem.density,
            //         task: mapMem.task,
            //     }});


            // NEM!!! ehelyett a következő lesz majd a faszaság:
            // a data, density, task a state-ben fognak szépen lakni, és ezek itt kerülnek megerálásra
            // ez azé' gecire zseniális.

            break;
        }
        // DELETE ------------------------------------------------------------------------------------------------------
        case 'deleteMapFromTab': {
            break;
        }

        // MOVE --------------------------------------------------------------------------------------------------------
        case 'moveMapToSubMap': {
            break;
        }
        case 'moveSubMapToMap': {
            break;
        }
        case 'moveTabToSubMap': {
            break;
        }
        case 'moveSubMapToTab': {
            break;
        }
        // FORMAT ------------------------------------------------------------------------------------------------------
        case 'mapAttributeDensitySmall': {
            mapMem.density = 'small';
            break;
        }
        case 'mapAttributeDensityLarge': {
            mapMem.density = 'large';
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
