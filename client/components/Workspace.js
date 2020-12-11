import '../css/Layout.css'
import React, { useEffect,} from 'react'
import Toolbar from "./Toolbar";
import Tabs from "./Tabs";
import {createMuiTheme, makeStyles} from '@material-ui/core/styles';
import {MuiThemeProvider} from "@material-ui/core";
import Breadcrumbs from "./Breadcrumbs";
import {MapComponent} from "./MapComponent";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        // marginRight: theme.spacing(2),
        margin:'auto',

    },
    title: {
        flexGrow: 1,
    },
}));


export function Workspace() {

    const classes = useStyles();

    const theme = createMuiTheme({
        props: {
            // Name of the component
            MuiButtonBase: {
                // The properties to apply
                disableRipple: true // No more ripple, on the whole application!
            }
        },

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
            <MuiThemeProvider theme={theme}>
                <div id="top">
                    <div id = "top-left">
                        <Toolbar/>
                    </div>
                    <div id = "top-right">
                        <Breadcrumbs/>
                    </div>
                </div>
                <div id="bottom">
                    <div id='bottom-left'>
                        <div id = 'bottom-left-up'>
                            <Tabs/>
                        </div>
                        <div id = 'bottom-left-down'>
                        </div>

                    </div>
                    <div id = "bottom-right">
                        <MapComponent/>
                    </div>
                </div>
            </MuiThemeProvider>
        </div>
    )
}
