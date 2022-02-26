import React, {useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {checkPop, push} from "../core/MapStackFlow";
import { mapDispatch, redraw } from '../core/MapFlow'
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
    // const [lineWidth, setLineWidth] = useState('')
    // const [lineType, setLineType] = useState('')
    // const [borderWidth, setBorderWidth] = useState('')
    // const [fontSize, setFontSize] = useState('')

    const updateDensity =     e => {push(); mapDispatch('updateDensity', e);                           redraw(); checkPop(dispatch); setDensity(e)}
    const updateAlignment =   e => {push(); mapDispatch('updateAlignment', e);                         redraw(); checkPop(dispatch); setAlignment(e)}
    const updateFormatMode =  e => dispatch({type: 'OPEN_PALETTE', payload: e})
    // const updateLineWidth =   e => {push(); mapDispatch('applyLineWidth', e);                          redraw(); checkPop(dispatch); setLineWidth(e)}
    // const updateLineType =    e => {push(); mapDispatch('applyLineType', e);                           redraw(); checkPop(dispatch); setLineType(e)}
    // const updateBorderWidth = e => {push(); mapDispatch('applyBorderWidth', e);                        redraw(); checkPop(dispatch); setBorderWidth(e)}
    // const updateFontSize =    e => {push(); mapDispatch('applyFontSize', e);                           redraw(); checkPop(dispatch); setFontSize(e)}
    const cmdResetAll =       e => {push(); mapDispatch('resetAll');                                   redraw(); checkPop(dispatch)}
    const cmdReset =          e => {push(); mapDispatch('reset', {formatMode});                        redraw(); checkPop(dispatch)}
    const cmdTaskToggle =     e => {push(); mapDispatch('taskCheckReset'); mapDispatch('taskSwitch'); redraw(); checkPop(dispatch)}
    const cmdSubmapToggle =   e => dispatch({type: 'CREATE_MAP_IN_MAP'})

    const lineWidth = useSelector(state => state.node.lineWidth)
    const lineType = useSelector(state => state.node.lineType)
    const borderWidth = useSelector(state => state.node.borderWidth)
    const fontSize = useSelector(state => state.node.fontSize)

    const setNodeParam = (nodeParamObj) => dispatch({type: 'SET_NODE_PARAM', payload: nodeParamObj })

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
                    value={{[1]: 'w1', [2]: 'w2', [3]: 'w3'}[lineWidth]}
                    action={value => setNodeParam({lineWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})}
                    disabled={[UNAUTHORIZED, VIEW].includes(mapRight)}
                />
                <StyledButtonGroup
                    open={formatMode === 'line'}
                    valueList={['bezier', 'edge']}
                    value={{['b']: 'bezier', ['e']: 'edge'}[lineType]}
                    action={value => setNodeParam({lineType: {['bezier']: 'b', ['edge']: 'e'}[value]})}
                    disabled={[UNAUTHORIZED, VIEW].includes(mapRight)}
                />
                <StyledButtonGroup
                    open={formatMode === 'border'}
                    valueList={['w1', 'w2', 'w3']}
                    value={{[1]: 'w1', [2]: 'w2', [3]: 'w3'}[borderWidth]}
                    action={value => setNodeParam({borderWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})}
                    disabled={[UNAUTHORIZED, VIEW].includes(mapRight)}
                />
                <StyledButtonGroup
                    open={formatMode === 'text'}
                    valueList={['h1', 'h2', 'h3', 'h4', 't']}
                    value={{[36]: 'h1', [24]: 'h2', [18]: 'h3', [16]: 'h4', [14]: 't'}[fontSize]}
                    action={value => setNodeParam({fontSize: {['h1']: 36, ['h2']: 24, ['h3']: 18, ['h4']: 16, ['t']: 14}[value]})}
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
    )
}
