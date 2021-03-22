import React, {useContext} from 'react';
import {Context} from "../core/Store";
import {StyledSelect} from "../component-styled/StyledSelect";
import '../component-css/Preferences.css'

export function Preferences () {
    const [state, dispatch] = useContext(Context);
    const {density, alignment, fontSize, lineWidth, lineType, colorMode} = state;

    const setDensity =        e => dispatch({type: 'SET_DENSITY',     payload: e.target.value});
    const setAlignment =      e => dispatch({type: 'SET_ALIGNMENT',   payload: e.target.value});
    const setFontSize =       e => dispatch({type: 'SET_FONT_SIZE',   payload: e.target.value});
    const setLineWidth =      e => dispatch({type: 'SET_LINE_WIDTH',  payload: e.target.value});
    const setLineType =       e => dispatch({type: 'SET_LINE_TYPE',   payload: e.target.value});
    const setColorMode =      e => dispatch({type: 'SET_COLOR_MODE',  payload: e.target.value});

    return (
        <div id = 'preferences'>
            <StyledSelect input = {['Map Density',      density,    setDensity,     ['small', 'large']]}/>
            <StyledSelect input = {['Map Alignment',    alignment,  setAlignment,   ['adaptive', 'symmetrical']]}/>
            <StyledSelect input = {['Font Size',        fontSize,   setFontSize,    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']]}/>
            <StyledSelect input = {['Line Width',       lineWidth,  setLineWidth,   ['p1', 'p2', 'p3']]}/>
            <StyledSelect input = {['Line Type',        lineType,   setLineType,    ['bezier', 'edge']]}/>
            <StyledSelect input = {['Color Mode',       colorMode,  setColorMode,   ['text', 'border', 'highlight', 'line', 'cellFrame']]}/>
        </div>
    );
}
