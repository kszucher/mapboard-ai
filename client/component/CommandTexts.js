import React, {useContext, useState} from 'react';
import {Context} from "../core/Store";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";
import {checkPop, push, redraw} from "../core/MapFlow";
import {nodeDispatch} from "../core/NodeFlow";
import {COLORS} from "../core/Utils";
import {MAP_RIGHTS} from "../core/EditorFlow";

export function CommandTexts () {
    const [state, dispatch] = useContext(Context)
    const {formatMode, frameEditorVisible, frameLen, frameSelected, mapRight} = state

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
    const openSharing = e => dispatch({type: 'SHOW_SHARING'})

    return (
        <div style={{
            position: 'fixed',
            right: 0,
            top: 96,
            width: 216,
            backgroundColor: COLORS.MAP_BACKGROUND,
            paddingTop: 6,
            paddingBottom: 6,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#dddddd',
            borderRight: 0
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 12,
                paddingRight: 12
            }}>
                <ControlledStyledButtonGroup open={true}                     valueList={['small', 'large']}                 value={density}     action={updateDensity}     />
                <ControlledStyledButtonGroup open={true}                     valueList={['adaptive', 'centered']}           value={alignment}   action={updateAlignment}   />
                <ControlledStyledButtonGroup open={true}                     valueList={['line', 'border', 'fill', 'text']} value={formatMode}  action={updateFormatMode}  />
                <ControlledStyledButtonGroup open={formatMode === '' }       valueList={['reset format']}                   value={''}          action={cmdResetAll}       />
                <ControlledStyledButtonGroup open={formatMode !== '' }       valueList={['reset ' + formatMode]}            value={''}          action={cmdReset}          />
                <ControlledStyledButtonGroup open={formatMode === 'line'}    valueList={['w1', 'w2', 'w3']}                 value={lineWidth}   action={updateLineWidth}   />
                <ControlledStyledButtonGroup open={formatMode === 'line'}    valueList={['bezier', 'edge']}                 value={lineType}    action={updateLineType}    />
                <ControlledStyledButtonGroup open={formatMode === 'border'}  valueList={['w1', 'w2', 'w3']}                 value={borderWidth} action={updateBorderWidth} />
                <ControlledStyledButtonGroup open={formatMode === 'text'}    valueList={['h1', 'h2', 'h3', 'h4', 't']}      value={fontSize}    action={updateFontSize}    />
                <ControlledStyledButtonGroup open={formatMode === ''}        valueList={['convert to task']}                value={''}          action={cmdTaskToggle}     />
                <ControlledStyledButtonGroup open={formatMode === ''}        valueList={['convert to submap']}              value={''}          action={cmdSubmapToggle}   />
                <ControlledStyledButtonGroup open={formatMode === ''}        valueList={['frame editor']}                   value={''}          action={cmdFrameOp}        />
                <ControlledStyledButtonGroup open={frameEditorVisible === 1} valueList={['import', 'duplicate', 'delete']}  value={''}          action={cmdFrameOp}        valueListDisabled={[false, ...Array(2).fill(!frameLen)]}/>
                <ControlledStyledButtonGroup open={frameEditorVisible === 1} valueList={['prev', 'next']}                   value={''}          action={cmdFrameOp}        valueListDisabled={[frameSelected === 0, frameSelected === frameLen - 1]}/>
                <ControlledStyledButtonGroup open={frameEditorVisible === 1} valueList={['close']}                          value={''}          action={cmdFrameOp}        />
                <ControlledStyledButtonGroup open={formatMode === ''}        valueList={['sharing']}                        value={''}          action={openSharing}       />
            </div>
        </div>
    );
}

const ControlledStyledButtonGroup = (arg) => {
    const {open, valueList, value, action, size, valueListDisabled} = arg;
    const [state, dispatch] = useContext(Context)
    const {mapRight} = state
    return (
        <StyledButtonGroup
            open={open}
            valueList={valueList}
            value={value}
            action={action}
            size={size}
            disabled={[MAP_RIGHTS.VIEW, MAP_RIGHTS.UNAUTHORIZED].includes(mapRight)}
            valueListDisabled={valueListDisabled}
        />
    )
}
