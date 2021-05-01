import React, {useContext} from 'react';
import {Context} from "../core/Store";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";

export function Preferences () {
    const [state, dispatch] = useContext(Context);
    const {density, alignment, fontSize, lineWidth, lineType, colorMode} = state;

    const setDensity =        e => dispatch({type: 'SET_DENSITY',                   payload: e});
    const setAlignment =      e => dispatch({type: 'SET_ALIGNMENT',                 payload: e});
    const setColorMode =      e => dispatch({type: 'SET_COLOR_MODE_OPEN_PALETTE',   payload: e});
    const setFontSize =       e => dispatch({type: 'SET_FONT_SIZE',                 payload: e});
    const setLineWidth =      e => dispatch({type: 'SET_LINE_WIDTH',                payload: e});
    const setLineType =       e => dispatch({type: 'SET_LINE_TYPE',                 payload: e});

    return (
        <div style={{
            position: 'fixed',
            right: 0,
            top: 96,
            width: 216,
            backgroundColor: 'rgba(251,250,252,1)',
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#dddddd',
            borderRight: 0,
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 12,
                paddingRight: 12,
            }}>
                <StyledButtonGroup input = {['Map Density',      density,    setDensity,     ['small', 'large']]}/>
                <StyledButtonGroup input = {['Map Alignment',    alignment,  setAlignment,   ['adaptive', 'centered']]}/>
                <StyledButtonGroup input = {['Color Mode',       colorMode,  setColorMode,   ['line', 'text', 'node', 'branch']]}/>
                <StyledButtonGroup input = {['Line Type',        lineType,   setLineType,    ['bezier', 'edge']]}/>
                <StyledButtonGroup input = {['Line Width',       lineWidth,  setLineWidth,   ['p1', 'p2', 'p3']]}/>
                <StyledButtonGroup input = {['Font Size',        fontSize,   setFontSize,    ['h1', 'h2', 'h3', 'h4', 't']]}/>
            </div>
        </div>
    );
}
