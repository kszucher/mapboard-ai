import React, {useContext, useEffect} from 'react'
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
import {Sharing} from "./Sharing";
import {Shares} from "./Shares";

export function Page() {
    const [state, dispatch] = useContext(Context);
    const {pageState, paletteVisible, frameEditorVisible} = state;
    const {AUTH, DEMO, WS_EDIT, WS_VIEW, WS_SHARES, WS_SHARING} = PAGE_STATES;

    return(
        <div id="page">
            <MuiThemeProvider theme={muiTheme}>
                {[DEMO, WS_EDIT, WS_VIEW, WS_SHARES, WS_SHARING].includes(pageState) && <>
                    <MapComponent/>
                    <Logo/>
                    {[WS_EDIT, WS_VIEW, WS_SHARES, WS_SHARING].includes(pageState) && <>
                        <Tabs/>
                        <CommandButtons/>
                        <Breadcrumbs/>
                        <CommandTexts/>
                    </>}
                    {paletteVisible===1 && <Palette/>}
                    {frameEditorVisible===1 && <FrameEditor/>}
                </>}
                {pageState === AUTH && <Auth/>}
                {pageState === WS_SHARES && <Shares/>}
                {pageState === WS_SHARING && <Sharing/>}
            </MuiThemeProvider>
        </div>
    )
}
