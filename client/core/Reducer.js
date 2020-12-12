import {InitState} from "./State";

const Reducer = (state, action) => {

    const {payload} = action;

    // console.log(action.type)

    switch (action.type) {
        case 'RESET_STATE': return JSON.parse(InitState);
        case 'UPDATE_CREDENTIALS': return {...state, email: payload.email, password: payload.password};
        case 'SERVER_RESPONSE': return {...state, serverResponse: payload};
        case 'LOG_IN': return {...state, isLoggedIn: true};
        case 'SET_TAB_LIST_NAMES': return {...state, tabListNames: payload};
        case 'SET_TAB_LIST_IDS': return {...state, tabListIds: payload};
        case 'SET_TAB_LIST_SELECTED': return {...state, tabListSelected: payload};
        case 'SET_LAST_USER_MAP': return {...state, lastUserMap: payload};
        case 'SET_MAP_STORAGE': return {...state, mapStorage: payload};
        case 'SET_MAP': return {...state, mapSelected: payload};
        default: return state;
    }
};

export default Reducer;
