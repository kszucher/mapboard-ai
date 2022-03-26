import React from 'react';
import {useSelector, useDispatch} from "react-redux";
import {checkPop, push} from "../core/MapStackFlow";
import { mapDispatch, redraw } from '../core/MapFlow'
import {MAP_RIGHTS} from "../core/EditorFlow";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";
import { getColors } from '../core/Colors'

export function CommandTexts () {
    const {UNAUTHORIZED, VIEW} = MAP_RIGHTS

    const FORMAT_MODE_TYPES = ['line', 'border', 'fill', 'text']
    const DENSITY_TYPES = ['small', 'large']
    const ALIGNMENT_TYPES = ['adaptive', 'centered']
    const LINE_WIDTH_TYPES = ['w1', 'w2', 'w3']
    const LINE_TYPE_TYPES = ['bezier', 'edge']
    const BORDER_WIDTH_TYPES = ['w1', 'w2', 'w3']
    const FONT_SIZE_TYPES = ['h1', 'h2', 'h3', 'h4', 't']

    const colorMode = useSelector(state => state.colorMode)
    const formatMode = useSelector(state => state.formatMode)
    const mapRight = useSelector(state => state.mapRight)
    const density = {['small']: 'small', ['large']: 'large'}[useSelector(state => state.node.density)]
    const alignment = {['adaptive']: 'adaptive', ['centered']: 'centered'}[useSelector(state => state.node.alignment)]
    const lineWidth = {[1]: 'w1', [2]: 'w2', [3]: 'w3'}[useSelector(state => state.node.lineWidth)]
    const lineType = {['b']: 'bezier', ['e']: 'edge'}[useSelector(state => state.node.lineType)]
    const borderWidth = {[1]: 'w1', [2]: 'w2', [3]: 'w3'}[useSelector(state => state.node.borderWidth)]
    const textFontSize = {[36]: 'h1', [24]: 'h2', [18]: 'h3', [16]: 'h4', [14]: 't'}[useSelector(state => state.node.textFontSize)]

    const dispatch = useDispatch()
    const setNodeParam = obj => dispatch({type: 'SET_NODE_PARAMS', payload: obj })

    const setDensity = value => setNodeParam({density: {['small']: 'small', ['large']: 'large'}[value]})
    const setAlignment = value => setNodeParam({alignment: {['adaptive']: 'adaptive', ['centered']: 'centered'}[value]})
    const setLineWidth = value => setNodeParam({lineWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})
    const setLineType = value => setNodeParam({lineType: {['bezier']: 'b', ['edge']: 'e'}[value]})
    const setBorderWidth = value => setNodeParam({borderWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})
    const setTextFontSize = value => setNodeParam({textFontSize: {['h1']: 36, ['h2']: 24, ['h3']: 18, ['h4']: 16, ['t']: 14}[value]})

    const resetFormat = _ => setNodeParam({
        lineType: 'clear', lineWidth: 'clear', lineColor: 'clear',
        borderWidth: 'clear', borderColor: 'clear',
        fillColor: 'clear',
        textColor: 'clear', textFontSize: 'clear'
    })
    const resetLine = _ => setNodeParam({lineType: 'clear', lineWidth: 'clear', lineColor: 'clear'})
    const resetBorder = _ => setNodeParam({borderWidth: 'clear', borderColor: 'clear'})
    const resetFill = _ => setNodeParam({fillColor: 'clear'})
    const resetText = _ => setNodeParam({textColor: 'clear', textFontSize: 'clear'})

    const openPalette = e => dispatch({type: 'OPEN_PALETTE', payload: e})
    const createMapInMap = _ => dispatch({type: 'CREATE_MAP_IN_MAP'})

    // TODO remove this from here altogether
    // const mapToggleTask = _ =>  {push(); mapDispatch('toggFleTask'); recalc(); redraw(colorMode); checkPop(dispatch)}

    const disabled = [UNAUTHORIZED, VIEW].includes(mapRight)

    return (
        <div style={{
            position: 'fixed',
            right: 0, top: 96, width: 216,
            backgroundColor: getColors(colorMode).MAP_BACKGROUND,
            paddingTop: 6, paddingBottom: 6,
            borderTopLeftRadius: 16, borderBottomLeftRadius: 16,
            borderRight: 0,
            borderColor: getColors(colorMode).MAP_BACKGROUND,
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingLeft: 12, paddingRight: 12 }}>
                <StyledButtonGroup open={true} valueList={DENSITY_TYPES} value={density} action={setDensity} disabled={disabled}/>
                <StyledButtonGroup open={true} valueList={ALIGNMENT_TYPES} value={alignment} action={setAlignment} disabled={disabled}/>
                <StyledButtonGroup open={true} valueList={FORMAT_MODE_TYPES} value={formatMode} action={openPalette} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === '' } valueList={['reset format']} value={''} action={resetFormat} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'line'} valueList={['reset line']} value={''} action={resetLine} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'border'} valueList={['reset border']} value={''} action={resetBorder} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'fill'} valueList={['reset fill']} value={''} action={resetFill} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'text'} valueList={['reset text']} value={''} action={resetText} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'line'} valueList={LINE_WIDTH_TYPES} value={lineWidth} action={setLineWidth} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'line'} valueList={LINE_TYPE_TYPES} value={lineType} action={setLineType} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'border'} valueList={BORDER_WIDTH_TYPES} value={borderWidth} action={setBorderWidth} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'text'} valueList={FONT_SIZE_TYPES} value={textFontSize} action={setTextFontSize} disabled={disabled}/>
                {/*<StyledButtonGroup open={formatMode === ''} valueList={['convert to task']} value={''} action={mapToggleTask} disabled={disabled}/>*/}
                <StyledButtonGroup open={formatMode === ''} valueList={['convert to submap']} value={''} action={createMapInMap} disabled={disabled}/>
            </div>
        </div>
    )
}
