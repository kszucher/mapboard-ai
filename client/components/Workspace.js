import '../css/Layout.css'
import React, { useEffect,} from 'react'
import ReactMaterialToolBar from "../components/ReactMaterialToolBar";
import ReactMaterialVerticalTabs from "../components/ReactMaterialVerticalTabs";
import {windowHandler} from "../core/WindowHandler";
import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

import {MuiThemeProvider} from "@material-ui/core";

export function Workspace() {
    useEffect(() => {
        windowHandler.addListeners();
    });

    const theme = createMuiTheme({
        overrides: {
            MuiIconButton: {
                root: { // Name of the rule
                    color: 'white', // Some CSS
                },
            },
            MuiTypography: { // Name of the component ⚛️ / style sheet
                root: { // Name of the rule
                    color: 'white', // Some CSS
                },
            },
        },
    });

    return (
        <div id="page">
            <div id="left">
                <div id = 'left-top'>
                    <MuiThemeProvider theme={theme}>
                        <ReactMaterialToolBar/>
                    </MuiThemeProvider>
                </div>
                <div id='left-bottom'>
                    <ReactMaterialVerticalTabs/>
                </div>
            </div>
            <div id="right">
                <div id = "right-top"/>
                <div id = "right-bottom">
                    <div id='mapDiv'>
                        <svg id="mapSvg"/>
                    </div>
                </div>
            </div>
        </div>
    )
}
