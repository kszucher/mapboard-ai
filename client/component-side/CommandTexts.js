import React, {useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {checkPop, push, redraw} from "../core/MapFlow";
import {nodeDispatch} from "../core/NodeFlow";
import {COLORS} from "../core/Utils";
import {MAP_RIGHTS} from "../core/EditorFlow";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";

export function CommandTexts () {
    const formatMode = useSelector(state => state.formatMode)
    const mapRight = useSelector(state => state.mapRight)
    const dispatch = useDispatch()

    const {UNAUTHORIZED, VIEW} = MAP_RIGHTS

    const [density, setDensity] = useState('')
    const [alignment, setAlignment] = useState('')
    const [lineWidth, setLineWidth] = useState('')
    const [lineType, setLineType] = useState('')
    const [borderWidth, setBorderWidth] = useState('')
    const [fontSize, setFontSize] = useState('')

    // TODO: put these all into the global state, and each one of them will trigger a useEffect in WindowListeners
    const updateDensity =     e => {push(); nodeDispatch('updateDensity', e);                           redraw(); checkPop(dispatch); setDensity(e)}
    const updateAlignment =   e => {push(); nodeDispatch('updateAlignment', e);                         redraw(); checkPop(dispatch); setAlignment(e)}
    const updateFormatMode =  e => dispatch({type: 'OPEN_PALETTE', payload: e})
    const updateLineWidth =   e => {push(); nodeDispatch('applyLineWidth', e);                          redraw(); checkPop(dispatch); setLineWidth(e)}
    const updateLineType =    e => {push(); nodeDispatch('applyLineType', e);                           redraw(); checkPop(dispatch); setLineType(e)}
    const updateBorderWidth = e => {push(); nodeDispatch('applyBorderWidth', e);                        redraw(); checkPop(dispatch); setBorderWidth(e)}
    const updateFontSize =    e => {push(); nodeDispatch('applyFontSize', e);                           redraw(); checkPop(dispatch); setFontSize(e)}
    const cmdResetAll =       e => {push(); nodeDispatch('resetAll');                                   redraw(); checkPop(dispatch)}
    const cmdReset =          e => {push(); nodeDispatch('reset', {formatMode});                        redraw(); checkPop(dispatch)}
    const cmdTaskToggle =     e => {push(); nodeDispatch('taskCheckReset'); nodeDispatch('taskSwitch'); redraw(); checkPop(dispatch)}
    const cmdSubmapToggle =   e => dispatch({type: 'CREATE_MAP_IN_MAP'})

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
                <StyledButtonGroup
                    open={true}
                    valueList={['small', 'large']}
                    value={density}
                    action={updateDensity}
                    disabled={[UNAUTHORIZED, VIEW].includes(mapRight)}
                />
                <StyledButtonGroup
                    open={true}
                    valueList={['adaptive', 'centered']}
                    value={alignment}
                    action={updateAlignment}
                    disabled={[UNAUTHORIZED, VIEW].includes(mapRight)}
                />
                <StyledButtonGroup
                    open={true}
                    valueList={['line', 'border', 'fill', 'text']}
                    value={formatMode}
                    action={updateFormatMode}
                    disabled={[UNAUTHORIZED, VIEW].includes(mapRight)}
                />
                <StyledButtonGroup
                    open={formatMode === '' }
                    valueList={['reset format']}
                    value={''}
                    action={cmdResetAll}
                    disabled={[UNAUTHORIZED, VIEW].includes(mapRight)}
                />
                <StyledButtonGroup
                    open={formatMode !== '' }
                    valueList={['reset ' + formatMode]}
                    value={''}
                    action={cmdReset}
                    disabled={[UNAUTHORIZED, VIEW].includes(mapRight)}
                />
                <StyledButtonGroup
                    open={formatMode === 'line'}
                    valueList={['w1', 'w2', 'w3']}
                    value={lineWidth}
                    action={updateLineWidth}
                    disabled={[UNAUTHORIZED, VIEW].includes(mapRight)}
                />
                <StyledButtonGroup
                    open={formatMode === 'line'}
                    valueList={['bezier', 'edge']}
                    value={lineType}
                    action={updateLineType}
                    disabled={[UNAUTHORIZED, VIEW].includes(mapRight)}
                />
                <StyledButtonGroup
                    open={formatMode === 'border'}
                    valueList={['w1', 'w2', 'w3']}
                    value={borderWidth}
                    action={updateBorderWidth}
                    disabled={[UNAUTHORIZED, VIEW].includes(mapRight)}
                />
                <StyledButtonGroup
                    open={formatMode === 'text'}
                    valueList={['h1', 'h2', 'h3', 'h4', 't']}
                    value={fontSize}
                    action={updateFontSize}
                    disabled={[UNAUTHORIZED, VIEW].includes(mapRight)}
                />
                <StyledButtonGroup
                    open={formatMode === ''}
                    valueList={['convert to task']}
                    value={''}
                    action={cmdTaskToggle}
                    disabled={[UNAUTHORIZED, VIEW].includes(mapRight)}
                />
                <StyledButtonGroup
                    open={formatMode === ''}
                    valueList={['convert to submap']}
                    value={''}
                    action={cmdSubmapToggle}
                    disabled={[UNAUTHORIZED, VIEW].includes(mapRight)}
                />
            </div>
        </div>
    );
}
