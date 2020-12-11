import React, {createContext, useReducer} from 'react';
import Reducer from "./Reducer";
import {State} from "./State";

const Store = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, State);

    return(
        <Context.Provider value={[state,dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(State);

export default Store;
