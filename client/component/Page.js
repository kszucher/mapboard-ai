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
import {PAGE_STATES} from "../core/EditorFlow";

export function Page() {
    const [state, dispatch] = useContext(Context);
    const {pageState, paletteVisible, frameEditorVisible} = state;
    return(
        <div id="page">
            <MuiThemeProvider theme={muiTheme}>
                {[PAGE_STATES.DEMO, PAGE_STATES.WORKSPACE].includes(pageState) &&
                    <>
                        <MapComponent/>
                        <Logo/>
                        {pageState === PAGE_STATES.WORKSPACE && <>
                            <Tabs/>
                            <Commands/>
                            <Breadcrumbs/>
                            <Controls/>
                        </>}
                        {paletteVisible===1 && <Palette/>}
                        {frameEditorVisible===1 && <FrameEditor/>}
                    </>}
                {pageState === PAGE_STATES.AUTH && <Auth/>}
            </MuiThemeProvider>
        </div>
    )
}
