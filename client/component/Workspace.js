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

export function Workspace() {

    let isDown = false;
    let pageX, pageY, scrollLeft, scrollTop;

    const mouseDown = (e) => {
        let el = document.getElementById('mapHolderDiv');
        isDown = true;
        pageX = e.pageX ;
        pageY = e.pageY;
        scrollLeft = el.scrollLeft;
        scrollTop = el.scrollTop;

    };

    const mouseMove = (e) => {
        e.preventDefault();
        let el = document.getElementById('mapHolderDiv');
        if(!isDown) return;
        el.scrollLeft = scrollLeft - e.pageX  + pageX;
        el.scrollTop = scrollTop -  e.pageY  + pageY;
    };

    const mouseUp = (e) => {
        isDown = false;
    };

    const mouseLeave = () => {
        isDown = false;
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
                contrastText: '#fbfafc',
            },
            secondary: {
                light: '#9040b8',
                main: '#5f0a87',
                dark: '#2e0059',
                contrastText: '#222',
            },
        },

        spacing: 2
    });

    return (
        <div id="page">
            <div id = "mapHolderDiv" onMouseDown={mouseDown} onMouseMove={mouseMove} onMouseUp={mouseUp}  onMouseLeave={mouseLeave}>
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
