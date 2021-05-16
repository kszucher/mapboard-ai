import React, {useContext} from 'react';
import {Context} from "../core/Store";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";

export function Formatter () {
    const [state, dispatch] = useContext(Context);
    const {density, alignment, formatMode, lineWidth, lineType, borderWidth, fontSize} = state;

    const setDensity =        e => dispatch({type: 'SET_DENSITY',       payload: e});
    const setAlignment =      e => dispatch({type: 'SET_ALIGNMENT',     payload: e});
    const setformatMode =     e => dispatch({type: 'OPEN_PALETTE',      payload: e});
    const setLineWidth =      e => dispatch({type: 'SET_LINE_WIDTH',    payload: e});
    const setLineType =       e => dispatch({type: 'SET_LINE_TYPE',     payload: e});
    const setBorderWidth =    e => dispatch({type: 'SET_BORDER_WIDTH',  payload: e});
    const setFontSize =       e => dispatch({type: 'SET_FONT_SIZE',     payload: e});
    const cmdResetAll =       e => dispatch({type: 'CMD_RESET_ALL',     payload: e});
    const cmdReset =          e => dispatch({type: 'CMD_RESET',         payload: e});
    const cmdTaskToggle =     e => dispatch({type: 'CMD_TASK_TOGGLE',   payload: e});

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
            paddingTop: 6,
            paddingBottom: 6,
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 12,
                paddingRight: 12,
            }}>
                {                            <StyledButtonGroup action={setDensity}     value={density}     valueList={['small', 'large']}/>}
                {                            <StyledButtonGroup action={setAlignment}   value={alignment}   valueList={['adaptive', 'centered']}/>}
                {                            <StyledButtonGroup action={setformatMode}  value={formatMode}  valueList={['line', 'border', 'fill', 'text']}/>}
                {formatMode === '' &&        <StyledButtonGroup action={cmdResetAll}    value={''}          valueList={['reset format']}/>}
                {formatMode === '' &&        <StyledButtonGroup action={cmdTaskToggle}  value={''}          valueList={['convert to task']}/>}
                {formatMode !== '' &&        <StyledButtonGroup action={cmdReset}       value={''}          valueList={['reset ' + formatMode]}/>}
                {formatMode === 'line' &&    <StyledButtonGroup action={setLineWidth}   value={lineWidth}   valueList={['w1', 'w2', 'w3']}/>}
                {formatMode === 'line' &&    <StyledButtonGroup action={setLineType}    value={lineType}    valueList={['bezier', 'edge']}/>}
                {formatMode === 'border' &&  <StyledButtonGroup action={setBorderWidth} value={borderWidth} valueList={['w1', 'w2', 'w3']}/>}
                {formatMode === 'text' &&    <StyledButtonGroup action={setFontSize}    value={fontSize}    valueList={['h1', 'h2', 'h3', 'h4', 't']}/>}
            </div>
        </div>
    );
}
