import {useSelector, useDispatch} from "react-redux"
import { IconButton } from '@mui/material'
import { colorList, getColors } from '../core/Colors'
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { setClear } from '../core/Utils'
import StyledButtonGroup from '../component-styled/StyledButtonGroup'
import { MAP_RIGHTS } from '../core/EditorFlow'

export function Formatter () {
    const LINE_WIDTH_TYPES = ['w1', 'w2', 'w3']
    const LINE_TYPE_TYPES = ['bezier', 'edge']
    const BORDER_WIDTH_TYPES = ['w1', 'w2', 'w3']
    const FONT_SIZE_TYPES = ['h1', 'h2', 'h3', 'h4', 't']

    const {UNAUTHORIZED, VIEW} = MAP_RIGHTS

    const colorMode = useSelector(state => state.colorMode)
    const mapRight = useSelector(state => state.mapRight)
    const formatMode = useSelector(state => state.formatMode)
    const lineColor = useSelector(state => state.node.lineColor)
    const borderColor = useSelector(state => state.node.borderColor)
    const fillColor = useSelector(state => state.node.fillColor)
    const textColor = useSelector(state => state.node.textColor)
    const lineWidth = {[1]: 'w1', [2]: 'w2', [3]: 'w3'}[useSelector(state => state.node.lineWidth)]
    const lineType = {['b']: 'bezier', ['e']: 'edge'}[useSelector(state => state.node.lineType)]
    const borderWidth = {[1]: 'w1', [2]: 'w2', [3]: 'w3'}[useSelector(state => state.node.borderWidth)]
    const textFontSize = {[36]: 'h1', [24]: 'h2', [18]: 'h3', [16]: 'h4', [14]: 't'}[useSelector(state => state.node.textFontSize)]
    const taskStatus = useSelector(state => state.node.taskStatus)

    const dispatch = useDispatch()
    const closePalette = _ => dispatch({type: 'CLOSE_PALETTE'})
    const createMapInMap = _ => dispatch({type: 'CREATE_MAP_IN_MAP'})
    const setNodeParam = (nodeParamObj) => dispatch({type: 'SET_NODE_PARAMS', payload: nodeParamObj })
    const setLineWidth = value => setNodeParam({lineWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})
    const setLineType = value => setNodeParam({lineType: {['bezier']: 'b', ['edge']: 'e'}[value]})
    const setBorderWidth = value => setNodeParam({borderWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})
    const setTextFontSize = value => setNodeParam({textFontSize: {['h1']: 36, ['h2']: 24, ['h3']: 18, ['h4']: 16, ['t']: 14}[value]})
    const toggleTask = _ => setNodeParam({taskStatus: taskStatus === -1 ? 'setTask' : 'clearTask'})
    const resetLine = _ => setNodeParam(setClear(['lineType', 'lineWidth', 'lineColor']))
    const resetBorder = _ => setNodeParam(setClear(['borderWidth', 'borderColor']))
    const resetFill = _ => setNodeParam(setClear(['fillColor']))
    const resetText = _ => setNodeParam(setClear(['textColor', 'textFontSize']))
    const resetFormat = _ => setNodeParam(setClear(['lineType', 'lineWidth', 'lineColor', 'borderWidth', 'borderColor', 'fillColor', 'textColor', 'textFontSize']))


    const { PAGE_BACKGROUND, MAP_BACKGROUND } = getColors(colorMode)
    const disabled = [UNAUTHORIZED, VIEW].includes(mapRight)

    const resolveColor = (formatMode) => {
        switch (formatMode) {
            case 'line':    return lineColor
            case 'border':  return borderColor
            case 'fill':    return fillColor
            case 'text':    return textColor
        }
    }

    // const resolveColorName = formatMode => formatMode + 'Color'

    const resolveReset = (formatMode) => {
        return {
            line: resetLine,
            text: resetText,
            fill: resetFill,
            border: resetBorder
        }[formatMode]
    }

    const o = 32
    const r = 12
    const width = o * colorList[0].length
    const height = o * colorList.length
    const offset = { line: 4, border: 5, fill: 6, text: 7 }[formatMode]

    return (
        <div style={{
            position: 'fixed',
            top: 48*2,
            right: 48*2,
            width: width + 40*2,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 16,
            background: MAP_BACKGROUND,
            border: `1px solid ${PAGE_BACKGROUND}`,
        }}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div>
                    <IconButton disableRipple={true} color='secondary' onClick={closePalette}>
                        <ArrowRightIcon/>
                    </IconButton>
                </div>
                <div style={{ top: 12 + 40*offset, width, height, padding: 4 }}>
                    <svg viewBox={`0 0 ${width} ${height}`}>
                        {colorList.map((iEl, i) => (iEl.map((jEl, j) => (
                            <circle
                                cx={o/2 + j*o}
                                cy={o/2 + i*o}
                                r={r}
                                key={'key' + i*10 + j}
                                fill={jEl}
                                stroke={colorList[i][j] === resolveColor(formatMode) ? '#9040b8' : 'none'}
                                strokeWidth={"2%"}
                                onClick={_ => setNodeParam({ [formatMode + 'Color'] : colorList[i][j] })}
                            />))))}
                    </svg>
                </div>
                <div>
                    <IconButton disableRipple={true} color='secondary' onClick={resolveReset(formatMode)}>
                        <DoDisturbIcon/>
                    </IconButton>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingBottom: 12}}>
                <StyledButtonGroup open={formatMode === '' } valueList={['reset format']} value={''} action={resetFormat} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'line'} valueList={LINE_WIDTH_TYPES} value={lineWidth} action={setLineWidth} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'line'} valueList={LINE_TYPE_TYPES} value={lineType} action={setLineType} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'border'} valueList={BORDER_WIDTH_TYPES} value={borderWidth} action={setBorderWidth} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'text'} valueList={FONT_SIZE_TYPES} value={textFontSize} action={setTextFontSize} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === ''} valueList={['convert to task']} value={''} action={toggleTask} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === ''} valueList={['convert to submap']} value={''} action={createMapInMap} disabled={disabled}/>
            </div>
        </div>
    )
}
