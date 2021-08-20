import React, {useContext, useState} from 'react';
import {Context} from "../core/Store";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";
import {checkPop, mapref, push, redraw} from "../core/MapFlow";
import {nodeDispatch} from "../core/NodeFlow";
import {selectionState} from "../core/SelectionFlow";

export function Controls () {
    const [state, dispatch] = useContext(Context)
    const {formatMode, playbackEditorVisible} = state

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
    const cmdSubmapToggle =      e => dispatch({type: 'CREATE_MAP_IN_MAP', payload: {lastPath: selectionState.lastPath, newMapName: mapref(selectionState.lastPath).content}})
    const cmdPlaybackEditor = e => {
        playbackEditorVisible
            ? dispatch({type: 'CLOSE_PLAYBACK_EDITOR'})
            : dispatch({type: 'OPEN_PLAYBACK_EDITOR'})
    }
    const cmdFrameOp = e => {
        switch (e) {
            // case 'import': dispatch ({type: 'IMPORT_FRAME'}); break;
            // case 'delete': dispatch ({type: 'DELETE_FRAME'}); break;
            // case 'duplicate': dispatch ({type: 'DUPLICATE_FRAME'}); break;
        }
    }

    return (
        <div style={{position: 'fixed', right: 0, top: 96, width: 216, backgroundColor: 'rgba(251,250,252,1)', paddingTop: 6, paddingBottom: 6,
            borderTopLeftRadius: 16, borderBottomLeftRadius: 16, borderWidth: '1px', borderStyle: 'solid', borderColor: '#dddddd', borderRight: 0 }}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingLeft: 12, paddingRight: 12 }}>
                {                            <StyledButtonGroup action={updateDensity}     value={density}     valueList={['small', 'large']}/>}
                {                            <StyledButtonGroup action={updateAlignment}   value={alignment}   valueList={['adaptive', 'centered']}/>}
                {                            <StyledButtonGroup action={updateFormatMode}  value={formatMode}  valueList={['line', 'border', 'fill', 'text']}/>}
                {formatMode === '' &&        <StyledButtonGroup action={cmdResetAll}       value={''}          valueList={['reset format']}/>}
                {formatMode !== '' &&        <StyledButtonGroup action={cmdReset}          value={''}          valueList={['reset ' + formatMode]}/>}
                {formatMode === 'line' &&    <StyledButtonGroup action={updateLineWidth}   value={lineWidth}   valueList={['w1', 'w2', 'w3']}/>}
                {formatMode === 'line' &&    <StyledButtonGroup action={updateLineType}    value={lineType}    valueList={['bezier', 'edge']}/>}
                {formatMode === 'border' &&  <StyledButtonGroup action={updateBorderWidth} value={borderWidth} valueList={['w1', 'w2', 'w3']}/>}
                {formatMode === 'text' &&    <StyledButtonGroup action={updateFontSize}    value={fontSize}    valueList={['h1', 'h2', 'h3', 'h4', 't']}/>}
                {formatMode === '' &&        <StyledButtonGroup action={cmdTaskToggle}     value={''}          valueList={['convert to task']}/>}
                {formatMode === '' &&        <StyledButtonGroup action={cmdSubmapToggle}   value={''}          valueList={['convert to submap']}/>}
                {formatMode === '' &&        <StyledButtonGroup action={cmdPlaybackEditor} value={''}          valueList={[`${playbackEditorVisible? 'close': 'open'} frame editor`]}/>}

                {playbackEditorVisible=== true &&    <StyledButtonGroup action={cmdFrameOp}        value={''}          valueList={['import', 'delete', 'duplicate']}/>}

                {/*    <StyledButtonGroup action={importFrame} value={''} valueList={['import']}/>*/}
                {/*    <StyledButtonGroup disabled={!frameSelection.length || !frameLen} action={deleteFrame} value={''} valueList={['delete']}/>*/}
                {/*    <StyledButtonGroup disabled={!frameSelection.length || !frameLen} action={duplicateFrame} value={''} valueList={['duplicate']}/>*/}

            </div>
        </div>
    );
}
