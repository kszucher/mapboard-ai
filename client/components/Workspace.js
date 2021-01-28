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

let pos = { top: 0, left: 0, x: 0, y: 0 };
let isActive = false;

const mouseDown = (e) => {
    let el = document.getElementById('bottom-right');
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';

    pos = {
        // The current scroll
        left: el.scrollLeft,
        top: el.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    };

    isActive = true;
};

const mouseMove = (e) => {
    if (isActive) {
        let el = document.getElementById('bottom-right');

        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;


        let speed = 0.1;

        // Scroll the element
        if (el.scrollTop !== e.clientY - pos.y) {
            el.scrollTop -= dy * speed;
        }
        // el.scrollLeft = pos.left - dx*speed;

        // annyi kell, hogy közelítünk oda, ahova kell, de speed értékenként, ez. nem kell ehhez tutorialok
    }
};

const mouseUp = () => {
    let el = document.getElementById('bottom-right');
    el.style.cursor = 'default' ;
    el.style.removeProperty('user-select');

    isActive = false;
};

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
                    <div
                        id = "bottom-right"
                        onMouseDown={mouseDown}
                        onMouseMove={mouseMove}
                        onMouseUp={mouseUp}
                        onMouseLeave={mouseUp}>
                        <MapComponent/>
                    </div>
                </div>
            </MuiThemeProvider>
        </div>
    )
}
