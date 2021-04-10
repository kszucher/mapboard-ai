import '../component-css/Layout.css'
import React, { useEffect,} from 'react'
import Logo from "./Logo";
import Tabs from "./Tabs";
import {createMuiTheme, makeStyles} from '@material-ui/core/styles';
import {MuiThemeProvider} from "@material-ui/core";
import Breadcrumbs from "./Breadcrumbs";
import {MapComponent} from "./MapComponent";
import {Preferences} from "./Preferences";
import {Palette} from "./Palette";
import {ToolBar} from "./ToolBar";

export function Workspace() {
    const theme = createMuiTheme({
        props: {
            // Name of the component
            MuiButtonBase: {
                // The properties to apply
                disableRipple: true // No more ripple, on the whole application!
            }
        },
        // https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=5f0a87&secondary.color=FAFAFA&primary.text.color=ffffff&secondary.text.color=000000
        palette: {
            primary: {
                light: '#9040b8',
                main: '#5f0a87',
                dark: '#2e0059',
                contrastText: '#fbfafc',
            },
            secondary: {
                light: '#dddddd',
                main: '#6f6e6f',
                dark: '#000000',
                contrastText: '#000000',
            },
        },

        spacing: 2
    });

    return (
        <div id="page">
            <MapComponent/>
            <MuiThemeProvider theme={theme}>
                <Logo/>
                <Tabs/>
                <ToolBar/>
                <Breadcrumbs/>
                <Preferences/>

            </MuiThemeProvider>
        </div>
    )
}
