const Reducer = (state, action) => {

    const {payload} = action;

    switch (action.type) {
        case 'SIGN_IN': return {...state, email: payload.email, password: payload.password};
        case 'SERVER_RESPONSE': return {...state, serverResponse: payload};
        case 'IS_LOGGED_IN_TRUE': return {...state, isLoggedIn: true};
        case 'SET_HEADER_DATA': return {...state, headerData: payload};
        default: return state;
    }

};

export default Reducer;
