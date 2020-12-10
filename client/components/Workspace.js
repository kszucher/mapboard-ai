import '../css/Layout.css'
import React, { useEffect,} from 'react'
import ReactMaterialToolBar from "./Toolbar";
import ReactMaterialVerticalTabs from "./Tabs";
import {createMuiTheme, makeStyles} from '@material-ui/core/styles';
import {MuiThemeProvider} from "@material-ui/core";
import WorkspaceBreadcrumbs from "./Breadcrumbs";


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
                        <ReactMaterialToolBar/>
                    </div>
                    <div id = "top-right">
                        <WorkspaceBreadcrumbs/>
                    </div>
                </div>
                <div id="bottom">
                    <div id='bottom-left'>
                        <div id = 'bottom-left-up'>
                            <ReactMaterialVerticalTabs/>
                        </div>
                        <div id = 'bottom-left-down'>
                            {/*<IconButton edge="start" className={classes.menuButton}  color='inherit' aria-label="menu" onClick={mapAdd}>*/}
                            {/*    <AddIcon />*/}
                            {/*</IconButton>*/}
                        </div>

                    </div>
                    <div id = "bottom-right">
                        <div id='mapDiv'>
                            <svg id="mapSvg"/>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        </div>
    )
}
