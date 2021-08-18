import React, {useContext, useState} from 'react';
import {Context} from "../core/Store";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";
import {checkPop, mapref, push, redraw} from "../core/MapFlow";
import {nodeDispatch} from "../core/NodeFlow";
import {selectionState} from "../core/SelectionFlow";

export function Controls () {
    const [state, dispatch] = useContext(Context)
    const {formatMode} = state

    const [density, setDensity] = useState('')
    const [alignment, setAlignment] = useState('')
    const [lineWidth, setLineWidth] = useState('')
    const [lineType, setLineType] = useState('')
    const [borderWidth, setBorderWidth] = useState('')
    const [fontSize, setFontSize] = useState('')

    const updateDensity =        e => {push(); nodeDispatch('updateDensity', e);                           redraw(); checkPop(); setDensity(e)}
    const updateAlignment =      e => {push(); nodeDispatch('updateAlignment', e);                         redraw(); checkPop(); setAlignment(e)}
    const updateFormatMode =     e => dispatch({type: 'OPEN_PALETTE', payload: e})
    const updateLineWidth =      e => {push(); nodeDispatch('applyLineWidth', e);                          redraw(); checkPop(); setLineWidth(e)}
    const updateLineType =       e => {push(); nodeDispatch('applyLineType', e);                           redraw(); checkPop(); setLineType(e)}
    const updateBorderWidth =    e => {push(); nodeDispatch('applyBorderWidth', e);                        redraw(); checkPop(); setBorderWidth(e)}
    const updateFontSize =       e => {push(); nodeDispatch('applyFontSize', e);                           redraw(); checkPop(); setFontSize(e)}
    const cmdResetAll =          e => {push(); nodeDispatch('resetAll');                                   redraw(); checkPop()}
    const cmdReset =             e => {push(); nodeDispatch('reset', {formatMode});                        redraw(); checkPop()}
    const cmdTaskToggle =        e => {push(); nodeDispatch('taskCheckReset'); nodeDispatch('taskSwitch'); redraw(); checkPop()}
    const cmdSubmapToggle = e => {
        let {lastPath} = selectionState;
        dispatch({type: 'CREATE_MAP_IN_MAP', payload: {lastPath, newMapName: mapref(lastPath).content}})
    }
    const cmdPlaybackEditor = e => {
        dispatch({type: 'OPEN_PLAYBACK_EDITOR'});
        dispatch({type: 'OPEN_FRAME', payload: {frameSelected: 0}});
    }

    return (
        <div style={{position: 'fixed', right: 0, top: 96, width: 216, backgroundColor: 'rgba(251,250,252,1)', paddingTop: 6, paddingBottom: 6,
            borderTopLeftRadius: 16, borderBottomLeftRadius: 16, borderWidth: '1px', borderStyle: 'solid', borderColor: '#dddddd', borderRight: 0 }}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingLeft: 12, paddingRight: 12 }}>
                {                            <StyledButtonGroup size="small" action={updateDensity}     value={density}     valueList={['small', 'large']}/>}
                {                            <StyledButtonGroup size="small" action={updateAlignment}   value={alignment}   valueList={['adaptive', 'centered']}/>}
                {                            <StyledButtonGroup size="small" action={updateFormatMode}  value={formatMode}  valueList={['line', 'border', 'fill', 'text']}/>}
                {formatMode === '' &&        <StyledButtonGroup size="small" action={cmdResetAll}       value={''}          valueList={['reset format']}/>}
                {formatMode !== '' &&        <StyledButtonGroup size="small" action={cmdReset}          value={''}          valueList={['reset ' + formatMode]}/>}
                {formatMode === 'line' &&    <StyledButtonGroup size="small" action={updateLineWidth}   value={lineWidth}   valueList={['w1', 'w2', 'w3']}/>}
                {formatMode === 'line' &&    <StyledButtonGroup size="small" action={updateLineType}    value={lineType}    valueList={['bezier', 'edge']}/>}
                {formatMode === 'border' &&  <StyledButtonGroup size="small" action={updateBorderWidth} value={borderWidth} valueList={['w1', 'w2', 'w3']}/>}
                {formatMode === 'text' &&    <StyledButtonGroup size="small" action={updateFontSize}    value={fontSize}    valueList={['h1', 'h2', 'h3', 'h4', 't']}/>}
                {formatMode === '' &&        <StyledButtonGroup size="small" action={cmdTaskToggle}     value={''}          valueList={['convert to task']}/>}
                {formatMode === '' &&        <StyledButtonGroup size="small" action={cmdSubmapToggle}   value={''}          valueList={['convert to submap']}/>}
                {formatMode === '' &&        <StyledButtonGroup size="small" action={cmdPlaybackEditor} value={''}          valueList={['playback editor']}/>}

            </div>
        </div>
    );
}
