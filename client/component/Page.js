import React, {useContext} from 'react'
import {Context} from "../core/Store";
import SignIn from "./SignIn";
import {Workspace} from "./Workspace";

export function Page() {
    const [state, dispatch] = useContext(Context);
    const {isLoggedIn} = state;
    return(
        isLoggedIn
            ? <Workspace/>
            : <SignIn/>
        // TODO use loaders as well while waiting for server
    )
}
