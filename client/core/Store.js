import React, {createContext, useEffect, useReducer, useRef, useCallback} from 'react'
import MapReducer from "./MapReducer";
import {State} from "./State";

export let remoteDispatch;
export let remoteGetState;

const useEnhancedReducer = (reducer, initState, initializer) => {
    const lastState = useRef(initState);
    const getState = useCallback(() => lastState.current, []);
    return [
        ...useReducer(
            (state, action) => lastState.current = reducer(state, action),
            initState,
            initializer
        ),
        getState
    ]
};

const Store = ({children}) => {
    const [state, dispatch, getState] = useEnhancedReducer(MapReducer, State);

    useEffect(() => {
        remoteDispatch = dispatch;
        remoteGetState = getState;
    }, []);

    return(
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(State);

export default Store;
