import React, {useContext} from 'react'
import {Context} from "../core/Store";
import Auth from "./Auth";
import {muiTheme} from "../component-styled/Theme";
import {MuiThemeProvider} from "@material-ui/core";
import {MapComponent} from "./MapComponent";
import Logo from "./Logo";
import Tabs from "./Tabs";
import {CommandButtons} from "./CommandButtons";
import Breadcrumbs from "./Breadcrumbs";
import {CommandTexts} from "./CommandTexts";
import {Palette} from "./Palette";
import {FrameEditor} from "./FrameEditor";
import {PAGE_STATES} from "../core/EditorFlow";
import {SharingEditor} from "./SharingEditor";

export function Page() {
    const [state, dispatch] = useContext(Context);
    const {pageState, paletteVisible, frameEditorVisible} = state;
    return(
        <div id="page">
            <MuiThemeProvider theme={muiTheme}>
                {[PAGE_STATES.DEMO, PAGE_STATES.WORKSPACE, PAGE_STATES.WORKSPACE_SHARING].includes(pageState) && <>
                    <MapComponent/>
                    <Logo/>
                    {[PAGE_STATES.WORKSPACE, PAGE_STATES.WORKSPACE_SHARING].includes(pageState) && <>
                        <Tabs/>
                        <CommandButtons/>
                        <Breadcrumbs/>
                        <CommandTexts/>
                    </>}
                    {paletteVisible===1 && <Palette/>}
                    {frameEditorVisible===1 && <FrameEditor/>}
                </>}
                {pageState === PAGE_STATES.AUTH && <Auth/>}
                <SharingEditor/>
            </MuiThemeProvider>
        </div>
    )
}
