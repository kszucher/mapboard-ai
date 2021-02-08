import '../component-css/Layout.css'
import React, { useEffect,} from 'react'
import Toolbar from "./Toolbar";
import Tabs from "./Tabs";
import {createMuiTheme, makeStyles} from '@material-ui/core/styles';
import {MuiThemeProvider} from "@material-ui/core";
import Breadcrumbs from "./Breadcrumbs";
import {MapComponent} from "./MapComponent";
import {Preferences} from "./Preferences";
import {Palette} from "./Palette";

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


// function beginMomentumTracking(){
//     cancelMomentumTracking();
//     momentumID = requestAnimationFrame(momentumLoop);
// }
//
// function cancelMomentumTracking(){
//     cancelAnimationFrame(momentumID);
// }
//
// function momentumLoop(){
//     let el = document.getElementById('mapHolderDiv');
//     el.scrollLeft += velX;
//     el.scrollTop += velY;
//
//     velX *= 1;
//     velY *= 1;
//     if (Math.abs(velX) > 0.5 || Math.abs(velY) > 0.5){
//         momentumID = requestAnimationFrame(momentumLoop);
//     }
// }
//


export function Workspace() {

    const classes = useStyles();


    let lastPos = {x:0, y:0};

    let isDown = false;
    let startX, startY;
    let scrollLeft, scrollTop;
    let velX = 0, velY = 0;
    let momentumID;

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



        // cancelMomentumTracking();
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
        // el.scrollLeft= scrollLeft - walkX;
        // el.scrollTop = scrollTop - walkY;
        velX = el.scrollLeft - prevScrollLeft;
        velY = el.scrollTop - prevScrollTop;

        // dispatch
        // natehát. nos.
        // elmentem, hogy hova mentem a default-hoz képest, right?
        // viszont ezt csak akkor teszem, ha locked = false
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
        // cancelMomentumTracking();
    };

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
                contrastText: '#fff',
            },
            secondary: {
                light: '#9040b8',
                main: '#5f0a87',
                dark: '#2e0059',
                contrastText: '#000000',
            },
        },
    });

    return (
        <div id="page">
            <div id = "mapHolderDiv" /*onMouseDown={mouseDown} onMouseMove={mouseMove} onMouseUp={mouseUp} onWheel={wheel} onMouseLeave={mouseLeave}*/>
                <MapComponent/>
            </div>
            <MuiThemeProvider theme={theme}>
                <Tabs/>
                <Breadcrumbs/>
                <Preferences/>
                <Toolbar/>
                <Palette/>
            </MuiThemeProvider>
        </div>
    )
}
