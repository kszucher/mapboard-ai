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

let lastPos = {x:0, y:0};

let isDown = false;
let startX, startY;
let scrollLeft, scrollTop;
let velX = 0, velY = 0;
let momentumID;

function beginMomentumTracking(){
    cancelMomentumTracking();
    momentumID = requestAnimationFrame(momentumLoop);
}

function cancelMomentumTracking(){
    cancelAnimationFrame(momentumID);
}

function momentumLoop(){
    let el = document.getElementById('mapHolderDiv');
    el.scrollLeft += velX;
    el.scrollTop += velY;

    velX *= 1;
    velY *= 1;
    if (Math.abs(velX) > 0.5 || Math.abs(velY) > 0.5){
        momentumID = requestAnimationFrame(momentumLoop);
    }
}

const mouseDown = (e) => {
    let el = document.getElementById('mapHolderDiv');
    isDown = true;
    // slider.classList.add('active');
    startX = e.pageX - el.offsetLeft;
    startY = e.pageY - el.offsetTop;

    lastPos = {
        x: startX,
        y: startY,
    };


    scrollLeft = el.scrollLeft;
    scrollTop = el.scrollTop;
    cancelMomentumTracking();
};

const mouseMove = (e) => {
    let el = document.getElementById('mapHolderDiv');
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const y = e.pageY - el.offsetTop;
    const walkX = (x - startX) * 1; //scroll-fast
    const walkY = (y - startY) * 1; //scroll-fast

    var prevScrollLeft = el.scrollLeft;
    var prevScrollTop = el.scrollTop;
    el.scrollLeft= scrollLeft - walkX;
    el.scrollTop = scrollTop - walkY;
    velX = el.scrollLeft - prevScrollLeft;
    velY = el.scrollTop - prevScrollTop;
};

const mouseUp = (e) => {
    isDown = false;
    // slider.classList.remove('active');
    let el = document.getElementById('mapHolderDiv');

    let x = e.pageX - el.offsetLeft;
    let y = e.pageY - el.offsetTop;


    // console.log([x,y,lastPos.x, lastPos.y])

    if (Math.abs(lastPos.x - x) > 5 && Math.abs(lastPos.y - y) > 5) {

        // probably do this, if the amount of time spent holding the mouse is SMALL
        // or do nothing while move, but once done, do the transform maybe?

        // beginMomentumTracking()
    } else {
        console.log('prevented')
    }

    // beginMomentumTracking();
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
                <Toolbar/>
                <Breadcrumbs/>
                <Tabs/>
            </MuiThemeProvider>
            <div id = "mapHolderDiv" onMouseDown={mouseDown} onMouseMove={mouseMove} onMouseUp={mouseUp} onWheel={wheel} onMouseLeave={mouseLeave}>
                <div id = 'mapSpaceColumns' >
                    <div id = 'mapSpaceLeft'/>
                    <div>
                        <div id = 'mapSpaceTop'/>
                        <MapComponent/>
                        <div id = 'mapSpaceBottom'/>
                    </div>
                    <div id = 'mapSpaceRight'/>
                </div>
            </div>
        </div>
    )
}
