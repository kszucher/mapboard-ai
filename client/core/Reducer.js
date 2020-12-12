import {InitState} from "./State";

const Reducer = (state, action) => {

    const {payload} = action;

    // console.log(action.type)

    switch (action.type) {
        case 'RESET_STATE':
            localStorage.setItem('cred', JSON.stringify({name: '', pass: ''}));
            return JSON.parse(InitState);
        case 'UPDATE_CREDENTIALS':
            localStorage.setItem('cred', JSON.stringify({
                email: payload.email,
                password: payload.password,
            }));
            return {...state, credentialsChanged: state.credentialsChanged + 1};
        case 'SERVER_RESPONSE': return {...state, serverResponse: payload};
        case 'LOG_IN': return {...state, isLoggedIn: true};
        case 'SET_TAB_LIST_NAMES': return {...state, tabListNames: payload};
        case 'SET_TAB_LIST_IDS': return {...state, tabListIds: payload};
        case 'SET_TAB_LIST_SELECTED': return {...state, tabListSelected: payload};
        case 'SET_MAP_STORAGE': return {...state, mapStorage: payload};
        case 'SET_MAP_ID':
            if (payload.pushHistory) {
                history.pushState({mapId: payload.mapId}, payload.mapId, '');
            }
            return {...state, mapId: payload.mapId};
        case 'SET_MAP_STORAGE_OUT': return {...state, mapStorageOut: payload};
        case 'SAVE_MAP': return {...state, isSaved: state.isSaved + 1};

        default: return state;
    }
};

export default Reducer;
