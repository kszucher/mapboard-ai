import React, {useContext} from 'react';
import {Context} from "../core/Store";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";

export function Preferences () {
    const [state, dispatch] = useContext(Context);
    const {density, alignment, fontSize, lineWidth, lineType, colorMode} = state;

    const setDensity =        e => dispatch({type: 'SET_DENSITY',                   payload: e});
    const setAlignment =      e => dispatch({type: 'SET_ALIGNMENT',                 payload: e});
    const setFontSize =       e => dispatch({type: 'SET_FONT_SIZE',                 payload: e});
    const setLineWidth =      e => dispatch({type: 'SET_LINE_WIDTH',                payload: e});
    const setLineType =       e => dispatch({type: 'SET_LINE_TYPE',                 payload: e});
    const setColorMode =      e => dispatch({type: 'SET_COLOR_MODE_OPEN_PALETTE',   payload: e});
0
    return (
        <div style={{
            position: 'fixed',
            right: 0,
            top: 96,
            width: 250,
            backgroundColor: 'rgba(251,250,252,1)',
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <StyledButtonGroup input = {['Map Density',      density,    setDensity,     ['small', 'large']]}/>
                <StyledButtonGroup input = {['Map Alignment',    alignment,  setAlignment,   ['adaptive', 'symmetrical']]}/>
                <StyledButtonGroup input = {['Line Type',        lineType,   setLineType,    ['bezier', 'edge']]}/>
                <StyledButtonGroup input = {['Line Width',       lineWidth,  setLineWidth,   ['p1', 'p2', 'p3']]}/>
                <StyledButtonGroup input = {['Font Size',        fontSize,   setFontSize,    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']]}/>
                <StyledButtonGroup input = {['Color Mode',       colorMode,  setColorMode,   ['text', 'highlight', 'highlightBranch', 'line']]}/>
            </div>
        </div>
    );
}
