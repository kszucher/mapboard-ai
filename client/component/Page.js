import React, {useContext} from 'react'
import {Context} from "../core/Store";
import SignIn from "./SignIn";
import {Workspace} from "./Workspace";
import {muiTheme} from "../component-styled/Theme";
import {MuiThemeProvider} from "@material-ui/core";

export function Page() {
    const [state, dispatch] = useContext(Context);
    const {isLoggedIn} = state;
    return(
        isLoggedIn
            ? <Workspace/>
            :
            <MuiThemeProvider theme={muiTheme}>
                <SignIn/>
            </MuiThemeProvider>
        // TODO use loaders as well while waiting for server
    )
}
