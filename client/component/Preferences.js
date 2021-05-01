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
                {                        <StyledButtonGroup name='Map Density'   value={density}   action={setDensity}   valueList={['small', 'large']}/>}
                {                        <StyledButtonGroup name='Map Alignment' value={alignment} action={setAlignment} valueList={['adaptive', 'centered']}/>}
                {                        <StyledButtonGroup name='Color Mode'    value={colorMode} action={setColorMode} valueList={['line', 'text', 'fill']}/>}
                {colorMode === 'line' && <StyledButtonGroup name='Line Type'     value={lineType}  action={setLineType}  valueList={['bezier', 'edge']}/>}
                {colorMode === 'line' && <StyledButtonGroup name='Line Width'    value={lineWidth} action={setLineWidth} valueList={['p1', 'p2', 'p3']}/>}
                {colorMode === 'text' && <StyledButtonGroup name='Font Size'     value={fontSize}  action={setFontSize}  valueList={['h1', 'h2', 'h3', 'h4', 't']}/>}
            </div>
        </div>
    );
}
