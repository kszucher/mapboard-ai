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










let isDown = false;
let startX;
let scrollLeft;
let velX = 0;
let momentumID;

function beginMomentumTracking(){
    cancelMomentumTracking();
    momentumID = requestAnimationFrame(momentumLoop);
}

function cancelMomentumTracking(){
    cancelAnimationFrame(momentumID);
}

function momentumLoop(){
    let el = document.getElementById('bottom-right');
    el.scrollLeft += velX;
    velX *= 0.95;
    if (Math.abs(velX) > 0.5){
        momentumID = requestAnimationFrame(momentumLoop);
    }
}

const mouseDown = (e) => {
    let el = document.getElementById('bottom-right');
    isDown = true;
    // slider.classList.add('active');
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
    cancelMomentumTracking();
};

const mouseMove = (e) => {
    let el = document.getElementById('bottom-right');
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 3; //scroll-fast
    var prevScrollLeft = el.scrollLeft;
    el.scrollLeft = scrollLeft - walk;
    velX = el.scrollLeft - prevScrollLeft;
};

const mouseUp = () => {
    isDown = false;
    // slider.classList.remove('active');
    beginMomentumTracking();
};

const mouseLeave = () => {
    isDown = false;
};

const wheel = () => {
    cancelMomentumTracking();
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
                        onWheel={wheel}
                        onMouseLeave={mouseLeave}>
                        <MapComponent/>
                    </div>
                </div>
            </MuiThemeProvider>
        </div>
    )
}
