import React, {createContext, useEffect, useReducer, useRef, useCallback} from 'react'
import MainReducer, {MainState} from "./MainReducer";

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
    const [state, dispatch, getState] = useEnhancedReducer(MainReducer, MainState);

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

export const Context = createContext(MainState);

export default Store;
