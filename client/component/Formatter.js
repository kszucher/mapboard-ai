import React, {useContext} from 'react';
import {Context} from "../core/Store";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";
import {checkPop, mapDispatch, mapref, push, redraw} from "../core/MapFlow";
import {nodeDispatch} from "../core/NodeFlow";
import {selectionState} from "../core/SelectionFlow";

export function Formatter () {
    const [state, dispatch] = useContext(Context);
    const {density, alignment, formatMode, lineWidth, lineType, borderWidth, fontSize} = state;

    const setDensity = e => {
        mapDispatch('setDensity', e);
        mapDispatch('setShouldCenter');
        nodeDispatch('resetDim');
        redraw();
        dispatch({type: 'SET_DENSITY', payload: e})
    }
    const setAlignment = e => {
        mapDispatch('setAlignment', e);
        mapDispatch('setShouldCenter');
        redraw();
        dispatch({type: 'SET_ALIGNMENT', payload: e})
    }
    const setformatMode =     e => {                                                                                          dispatch({type: 'OPEN_PALETTE',      payload: e})}
    const setLineWidth =      e => {push(); nodeDispatch('applyLineWidth', e);                          redraw(); checkPop(); dispatch({type: 'SET_LINE_WIDTH',    payload: e})}
    const setLineType =       e => {push(); nodeDispatch('applyLineType', e);                           redraw(); checkPop(); dispatch({type: 'SET_LINE_TYPE',     payload: e})}
    const setBorderWidth =    e => {push(); nodeDispatch('applyBorderWidth', e);                        redraw(); checkPop(); dispatch({type: 'SET_BORDER_WIDTH',  payload: e})}
    const setFontSize =       e => {push(); nodeDispatch('applyFontSize', e);                           redraw(); checkPop(); dispatch({type: 'SET_FONT_SIZE',     payload: e})}
    const cmdResetAll =       e => {push(); nodeDispatch('resetAll');                                   redraw(); checkPop()}
    const cmdReset =          e => {push(); nodeDispatch('reset', {formatMode});                        redraw(); checkPop()}
    const cmdTaskToggle =     e => {push(); nodeDispatch('taskCheckReset'); nodeDispatch('taskSwitch'); redraw(); checkPop()}
    const cmdSubmapToggle =   e => {
        // TODO check if it is not a submap already
        let {lastPath} = selectionState;
        dispatch({type: 'CREATE_MAP_IN_MAP', payload: {lastPath, newMapName: mapref(lastPath).content}});
    }

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
                {                            <StyledButtonGroup size="small" action={setDensity}      value={density}     valueList={['small', 'large']}/>}
                {                            <StyledButtonGroup size="small" action={setAlignment}    value={alignment}   valueList={['adaptive', 'centered']}/>}
                {                            <StyledButtonGroup size="small" action={setformatMode}   value={formatMode}  valueList={['line', 'border', 'fill', 'text']}/>}
                {formatMode === '' &&        <StyledButtonGroup size="small" action={cmdResetAll}     value={''}          valueList={['reset format']}/>}
                {formatMode === '' &&        <StyledButtonGroup size="small" action={cmdTaskToggle}   value={''}          valueList={['convert to task']}/>}
                {formatMode === '' &&        <StyledButtonGroup size="small" action={cmdSubmapToggle} value={''}          valueList={['convert to submap']}/>}
                {formatMode !== '' &&        <StyledButtonGroup size="small" action={cmdReset}        value={''}          valueList={['reset ' + formatMode]}/>}
                {formatMode === 'line' &&    <StyledButtonGroup size="small" action={setLineWidth}    value={lineWidth}   valueList={['w1', 'w2', 'w3']}/>}
                {formatMode === 'line' &&    <StyledButtonGroup size="small" action={setLineType}     value={lineType}    valueList={['bezier', 'edge']}/>}
                {formatMode === 'border' &&  <StyledButtonGroup size="small" action={setBorderWidth}  value={borderWidth} valueList={['w1', 'w2', 'w3']}/>}
                {formatMode === 'text' &&    <StyledButtonGroup size="small" action={setFontSize}     value={fontSize}    valueList={['h1', 'h2', 'h3', 'h4', 't']}/>}
            </div>
        </div>
    );
}
