const Reducer = (state, action) => {

    const {payload} = action;

    switch (action.type) {
        case 'SIGN_IN': return {...state, email: payload.email, password: payload.password};
        case 'SERVER_RESPONSE': return {...state, serverResponse: payload};
        case 'IS_LOGGED_IN_TRUE': return {...state, isLoggedIn: true};
        case 'SET_TAB_LIST_NAMES': return {...state, tabListNames: payload};
        case 'SET_TAB_LIST_IDS': return {...state, tabListIds: payload};
        case 'SET_TAB_LIST_SELECTED': return {...state, tabListSelected: payload};
        case 'SET_LAST_USER_MAP': return {...state, lastUserMap: payload};
        case 'SET_MAP_STORAGE': return {...state, mapStorage: payload};
        default: return state;
    }

};

export default Reducer;
