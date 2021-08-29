import React, {useContext, useState} from 'react';
import {Context} from "../core/Store";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";
import {checkPop, push, redraw} from "../core/MapFlow";
import {nodeDispatch} from "../core/NodeFlow";

export function CommandTexts () {
    const [state, dispatch] = useContext(Context)
    const {formatMode, frameEditorVisible, frameLen, frameSelection} = state

    const [density, setDensity] = useState('')
    const [alignment, setAlignment] = useState('')
    const [lineWidth, setLineWidth] = useState('')
    const [lineType, setLineType] = useState('')
    const [borderWidth, setBorderWidth] = useState('')
    const [fontSize, setFontSize] = useState('')

    const updateDensity =     e => {push(); nodeDispatch('updateDensity', e);                           redraw(); checkPop(); setDensity(e)}
    const updateAlignment =   e => {push(); nodeDispatch('updateAlignment', e);                         redraw(); checkPop(); setAlignment(e)}
    const updateFormatMode =  e => dispatch({type: 'OPEN_PALETTE', payload: e})
    const updateLineWidth =   e => {push(); nodeDispatch('applyLineWidth', e);                          redraw(); checkPop(); setLineWidth(e)}
    const updateLineType =    e => {push(); nodeDispatch('applyLineType', e);                           redraw(); checkPop(); setLineType(e)}
    const updateBorderWidth = e => {push(); nodeDispatch('applyBorderWidth', e);                        redraw(); checkPop(); setBorderWidth(e)}
    const updateFontSize =    e => {push(); nodeDispatch('applyFontSize', e);                           redraw(); checkPop(); setFontSize(e)}
    const cmdResetAll =       e => {push(); nodeDispatch('resetAll');                                   redraw(); checkPop()}
    const cmdReset =          e => {push(); nodeDispatch('reset', {formatMode});                        redraw(); checkPop()}
    const cmdTaskToggle =     e => {push(); nodeDispatch('taskCheckReset'); nodeDispatch('taskSwitch'); redraw(); checkPop()}
    const cmdSubmapToggle =   e => dispatch({type: 'CREATE_MAP_IN_MAP'})
    const cmdFrameOp = e => {
        switch (e) {
            case 'frame editor':   dispatch({type: 'OPEN_PLAYBACK_EDITOR'}); break;
            case 'import':         dispatch({type: 'IMPORT_FRAME'}); break;
            case 'duplicate':      dispatch({type: 'DUPLICATE_FRAME'}); break;
            case 'delete':         dispatch({type: 'DELETE_FRAME'}); break;
            case 'prev':           dispatch({type: 'PREV_FRAME'}); break;
            case 'next':           dispatch({type: 'NEXT_FRAME'}); break;
            case 'close':          dispatch({type: 'CLOSE_PLAYBACK_EDITOR'}); break;
        }
    }
    const openSharingEditor = e => dispatch({type: 'OPEN_SHARING_EDITOR'})

    return (
        <div style={{position: 'fixed', right: 0, top: 96, width: 216, backgroundColor: 'rgba(251,250,252,1)', paddingTop: 6, paddingBottom: 6,
            borderTopLeftRadius: 16, borderBottomLeftRadius: 16, borderWidth: '1px', borderStyle: 'solid', borderColor: '#dddddd', borderRight: 0 }}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingLeft: 12, paddingRight: 12 }}>
                <StyledButtonGroup open={true}                     action={updateDensity}     value={density}     valueList={['small', 'large']}/>
                <StyledButtonGroup open={true}                     action={updateAlignment}   value={alignment}   valueList={['adaptive', 'centered']}/>
                <StyledButtonGroup open={true}                     action={updateFormatMode}  value={formatMode}  valueList={['line', 'border', 'fill', 'text']}/>
                <StyledButtonGroup open={formatMode === '' }       action={cmdResetAll}       value={''}          valueList={['reset format']}/>
                <StyledButtonGroup open={formatMode !== '' }       action={cmdReset}          value={''}          valueList={['reset ' + formatMode]}/>
                <StyledButtonGroup open={formatMode === 'line'}    action={updateLineWidth}   value={lineWidth}   valueList={['w1', 'w2', 'w3']}/>
                <StyledButtonGroup open={formatMode === 'line'}    action={updateLineType}    value={lineType}    valueList={['bezier', 'edge']}/>
                <StyledButtonGroup open={formatMode === 'border'}  action={updateBorderWidth} value={borderWidth} valueList={['w1', 'w2', 'w3']}/>
                <StyledButtonGroup open={formatMode === 'text'}    action={updateFontSize}    value={fontSize}    valueList={['h1', 'h2', 'h3', 'h4', 't']}/>
                <StyledButtonGroup open={formatMode === ''}        action={cmdTaskToggle}     value={''}          valueList={['convert to task']}/>
                <StyledButtonGroup open={formatMode === ''}        action={cmdSubmapToggle}   value={''}          valueList={['convert to submap']}/>
                <StyledButtonGroup open={formatMode === ''}        action={cmdFrameOp}        value={''}          valueList={['frame editor']}/>
                <StyledButtonGroup open={frameEditorVisible === 1} action={cmdFrameOp}        value={''}          valueList={['import', 'duplicate', 'delete']}  valueListDisabled={[false, ...Array(2).fill(!frameSelection.length || !frameLen)]}/>
                <StyledButtonGroup open={frameEditorVisible === 1} action={cmdFrameOp}        value={''}          valueList={['prev', 'next']} valueListDisabled={[frameSelection[0] === 0, frameSelection[0] === frameLen - 1]}/>
                <StyledButtonGroup open={frameEditorVisible === 1} action={cmdFrameOp}        value={''}          valueList={['close']} />
                <StyledButtonGroup open={formatMode === ''}        action={openSharingEditor} value={''}          valueList={['sharing']}/>
            </div>
        </div>
    );
}
