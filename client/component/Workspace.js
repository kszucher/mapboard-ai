import '../component-css/Layout.css'
import React, {useContext, useEffect,} from 'react'
import Logo from "./Logo";
import Tabs from "./Tabs";
import {MuiThemeProvider} from "@material-ui/core";
import Breadcrumbs from "./Breadcrumbs";
import {MapComponent} from "./MapComponent";
import {Controls} from "./Controls";
import {Palette} from "./Palette";
import {Commands} from "./Commands";
import {muiTheme} from "../component-styled/Theme";
import {FrameEditor} from "./FrameEditor";
import {Context} from "../core/Store";

export function Workspace() {
    const [state, dispatch] = useContext(Context);
    const {paletteVisible, frameEditorVisible} = state;
    return (
        <div id="page">
            <MapComponent/>
            <MuiThemeProvider theme={muiTheme}>
                <Logo/>
                <Tabs/>
                <Commands/>
                <Breadcrumbs/>
                <Controls/>
                {paletteVisible && <Palette/>}
                {frameEditorVisible && <FrameEditor/>}
            </MuiThemeProvider>
        </div>
    )
}
