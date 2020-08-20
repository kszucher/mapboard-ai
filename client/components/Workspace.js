import '../css/Layout.css'
import React, { useEffect,} from 'react'
import ReactMaterialToolBar from "../components/ReactMaterialToolBar";
import ReactMaterialVerticalTabs from "../components/ReactMaterialVerticalTabs";
import {windowHandler} from "../core/WindowHandler";
import { createMuiTheme } from '@material-ui/core/styles';

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
            <div id="top">
                <MuiThemeProvider theme={theme}>
                    <ReactMaterialToolBar/>
                </MuiThemeProvider>
            </div>
            <div id="bottom">
                <div id='bottom-left'>
                    <ReactMaterialVerticalTabs/>
                </div>
                <div id = "bottom-right">
                    <div id='mapDiv'>
                        <svg id="mapSvg"/>
                    </div>
                </div>
            </div>
        </div>
    )
}
