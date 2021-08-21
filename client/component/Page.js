import React, {useContext} from 'react'
import {Context} from "../core/Store";
import Auth from "./Auth";
import {muiTheme} from "../component-styled/Theme";
import {MuiThemeProvider} from "@material-ui/core";
import {MapComponent} from "./MapComponent";
import Logo from "./Logo";
import Tabs from "./Tabs";
import {Commands} from "./Commands";
import Breadcrumbs from "./Breadcrumbs";
import {Controls} from "./Controls";
import {Palette} from "./Palette";
import {FrameEditor} from "./FrameEditor";

export function Page() {
    const [state, dispatch] = useContext(Context);
    const {isLoggedIn, isDemo, paletteVisible, frameEditorVisible} = state;
    return(
        <div id="page">
            <>
                {(isLoggedIn || isDemo) ?
                    <>
                        <MapComponent/>
                        <MuiThemeProvider theme={muiTheme}>
                            <Logo/>
                            {isLoggedIn && <Tabs/>}
                            {isLoggedIn && <Commands/>}
                            {isLoggedIn && <Breadcrumbs/>}
                            {isLoggedIn && <Controls/>}
                            {paletteVisible===1 && <Palette/>}
                            {frameEditorVisible===1 && <FrameEditor/>}
                        </MuiThemeProvider>
                    </>
                    :
                    <MuiThemeProvider theme={muiTheme}>
                        <Auth/>
                    </MuiThemeProvider>
                }
            </>

        </div>
    )
}
