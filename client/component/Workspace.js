import '../component-css/Layout.css'
import React, { useEffect,} from 'react'
import Logo from "./Logo";
import Tabs from "./MapSelector";
import {createMuiTheme, makeStyles} from '@material-ui/core/styles';
import {MuiThemeProvider} from "@material-ui/core";
import Breadcrumbs from "./Breadcrumbs";
import {MapComponent} from "./MapComponent";
import {Formatter} from "./Formatter";
import {Palette} from "./Palette";
import {Commands} from "./Commands";
import {Recorder} from "./Recorder";
import {muiTheme} from "../component-styled/Theme";

export function Workspace() {


    return (
        <div id="page">
            <MapComponent/>
            <MuiThemeProvider theme={muiTheme}>
                <Logo/>
                <Tabs/>
                <Commands/>
                <Breadcrumbs/>
                <Formatter/>
                <Palette/>
                <Recorder/>

            </MuiThemeProvider>
        </div>
    )
}
