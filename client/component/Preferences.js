import React, {useContext} from 'react';
import {Context} from "../core/Store";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";
import '../component-css/Preferences.css'
import {Palette} from "./Palette";
import {MuiThemeProvider} from "@material-ui/core";

export function Preferences () {
    const [state, dispatch] = useContext(Context);
    const {density, alignment, fontSize, lineWidth, lineType, colorMode} = state;

    const setDensity =        e => dispatch({type: 'SET_DENSITY',     payload: e});
    const setAlignment =      e => dispatch({type: 'SET_ALIGNMENT',   payload: e});
    const setFontSize =       e => dispatch({type: 'SET_FONT_SIZE',   payload: e});
    const setLineWidth =      e => dispatch({type: 'SET_LINE_WIDTH',  payload: e});
    const setLineType =       e => dispatch({type: 'SET_LINE_TYPE',   payload: e});
    const setColorMode =      e => dispatch({type: 'SET_COLOR_MODE',  payload: e});

    return (
        <div id = 'preferences'>
            <StyledButtonGroup input = {['Map Density',      density,    setDensity,     ['small', 'large']]}/>
            <StyledButtonGroup input = {['Map Alignment',    alignment,  setAlignment,   ['adaptive', 'symmetrical']]}/>
            <StyledButtonGroup input = {['Font Size',        fontSize,   setFontSize,    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']]}/>
            <StyledButtonGroup input = {['Line Width',       lineWidth,  setLineWidth,   ['p1', 'p2', 'p3']]}/>
            <StyledButtonGroup input = {['Line Type',        lineType,   setLineType,    ['bezier', 'bezierCircle', 'edge']]}/>
            <StyledButtonGroup input = {['Color Mode',       colorMode,  setColorMode,   ['text', 'border', 'highlight', 'line', 'cellFrame']]}/>
        </div>


    );
}
